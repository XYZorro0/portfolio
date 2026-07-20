import fs from "node:fs";

export function normalize(vec) {
  let sum = 0;
  for (const v of vec) sum += v * v;
  const norm = Math.sqrt(sum);
  if (norm === 0) return Float32Array.from(vec);
  const out = new Float32Array(vec.length);
  for (let i = 0; i < vec.length; i++) out[i] = vec[i] / norm;
  return out;
}

/**
 * Load the vector store produced by ingest/ingest.js. Embeddings are
 * normalized on load, so search is a plain dot product (= cosine similarity).
 */
export function loadStore(storePath) {
  if (!fs.existsSync(storePath)) {
    throw new Error(
      `Vector store not found at ${storePath}. Run \`npm run ingest\` first (with Ollama running).`
    );
  }
  const raw = JSON.parse(fs.readFileSync(storePath, "utf8"));
  if (!Array.isArray(raw.chunks) || raw.chunks.length === 0) {
    throw new Error(`Vector store at ${storePath} has no chunks`);
  }
  const chunks = raw.chunks.map((c) => ({
    id: c.id,
    source: c.source,
    title: c.title,
    text: c.text,
    embedding: normalize(c.embedding),
  }));
  const dim = chunks[0].embedding.length;
  for (const c of chunks) {
    if (c.embedding.length !== dim) {
      throw new Error(
        `Vector store chunk ${c.id} has dimension ${c.embedding.length}, expected ${dim}`
      );
    }
  }
  return { model: raw.model, createdAt: raw.createdAt, dim, chunks };
}

/**
 * Return the top-k chunks by cosine similarity, best first.
 */
export function search(store, queryEmbedding, k) {
  const q = normalize(queryEmbedding);
  if (q.length !== store.dim) {
    throw new Error(
      `Query embedding dimension ${q.length} does not match store dimension ${store.dim} — was the store ingested with a different EMBED_MODEL?`
    );
  }
  const scored = store.chunks.map((c) => {
    let dot = 0;
    for (let i = 0; i < q.length; i++) dot += q[i] * c.embedding[i];
    return { chunk: c, score: dot };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
