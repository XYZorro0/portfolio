/**
 * Chunks every markdown file in ingest/docs/, embeds the chunks with
 * Ollama's embedding model, and writes the vector store JSON the server
 * loads at startup.
 *
 * Usage:  node ingest/ingest.js [--docs <dir>] [--out <file>]
 * (defaults: ingest/docs -> data/vector-store.json; OLLAMA_URL/EMBED_MODEL
 * come from .env like the server)
 */
import fs from "node:fs";
import path from "node:path";

import { config, backendRoot } from "../lib/config.js";
import { embed } from "../lib/ollama.js";

const CHUNK_TARGET = 1200; // chars per chunk before we split a section
const BATCH_SIZE = 16;

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const docsDir = path.resolve(backendRoot, arg("--docs", "ingest/docs"));
const outFile = path.resolve(
  backendRoot,
  arg("--out", process.env.VECTOR_STORE || "data/vector-store.json")
);

/**
 * Split a markdown document into sections at #/##/### headings, then split
 * any oversized section at paragraph boundaries with a one-paragraph
 * overlap so no fact gets stranded on a chunk edge.
 */
function chunkMarkdown(markdown, docTitle) {
  const sections = [];
  let current = { title: docTitle, lines: [] };
  for (const line of markdown.split("\n")) {
    const heading = /^#{1,3}\s+(.*)/.exec(line);
    if (heading) {
      sections.push(current);
      current = { title: heading[1].trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  sections.push(current);

  const chunks = [];
  for (const section of sections) {
    const body = section.lines.join("\n").trim();
    if (!body) continue;
    const title =
      section.title === docTitle ? docTitle : `${docTitle} — ${section.title}`;

    if (body.length <= CHUNK_TARGET) {
      chunks.push({ title, text: body });
      continue;
    }
    const paragraphs = body.split(/\n\s*\n/);
    let buf = [];
    let bufLen = 0;
    for (const para of paragraphs) {
      if (bufLen > 0 && bufLen + para.length > CHUNK_TARGET) {
        chunks.push({ title, text: buf.join("\n\n") });
        buf = [buf[buf.length - 1]]; // overlap the last paragraph
        bufLen = buf[0].length;
      }
      buf.push(para);
      bufLen += para.length;
    }
    if (buf.length) chunks.push({ title, text: buf.join("\n\n") });
  }
  return chunks;
}

function docTitleOf(markdown, filename) {
  const h1 = /^#\s+(.*)/m.exec(markdown);
  if (h1) return h1[1].trim();
  return path
    .basename(filename, ".md")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  const files = fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  if (files.length === 0) {
    console.error(`No .md files found in ${docsDir}`);
    process.exit(1);
  }

  const chunks = [];
  for (const file of files) {
    const markdown = fs.readFileSync(path.join(docsDir, file), "utf8");
    const docTitle = docTitleOf(markdown, file);
    const fileChunks = chunkMarkdown(markdown, docTitle);
    console.log(`${file}: ${fileChunks.length} chunks`);
    for (const c of fileChunks) {
      chunks.push({
        id: `${path.basename(file, ".md")}-${chunks.length}`,
        source: file,
        ...c,
      });
    }
  }

  console.log(
    `Embedding ${chunks.length} chunks with ${config.embedModel} via ${config.ollamaUrl} ...`
  );
  const embeddings = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    // The title carries the doc/section name into the embedding so a chunk
    // of bullets still knows what it's about.
    const batchVectors = await embed(
      batch.map((c) => `${c.title}\n${c.text}`)
    );
    embeddings.push(...batchVectors);
    console.log(`  ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}`);
  }

  const storeDir = path.dirname(outFile);
  fs.mkdirSync(storeDir, { recursive: true });
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      {
        model: config.embedModel,
        createdAt: new Date().toISOString(),
        chunks: chunks.map((c, i) => ({ ...c, embedding: embeddings[i] })),
      },
      null,
      1
    )
  );
  console.log(
    `Wrote ${chunks.length} chunks (${embeddings[0].length}d) to ${outFile}`
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
