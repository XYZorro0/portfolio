/**
 * Stand-in for Ollama so the backend can be exercised without a GPU or any
 * models pulled. Implements just enough of /api/embed and /api/chat.
 *
 * Embeddings are a deterministic hashed bag-of-words: similar texts really
 * do land near each other in cosine space, so retrieval (and the off-topic
 * threshold) behave meaningfully in tests.
 *
 * Usage:  node test/mock-ollama.js [--port 11435]
 */
import http from "node:http";

const DIM = 1024;

const portArg = process.argv.indexOf("--port");
const PORT = portArg !== -1 ? Number(process.argv[portArg + 1]) : 11435;

function mockEmbed(text) {
  const cleaned = text
    .replace(/^search_(query|document):\s*/, "")
    .toLowerCase();
  const vec = new Array(DIM).fill(0);
  for (const word of cleaned.match(/[a-z0-9]+/g) ?? []) {
    let h = 2166136261;
    for (let i = 0; i < word.length; i++) {
      h ^= word.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    // Signed feature hashing: colliding words cancel instead of adding,
    // keeping unrelated texts near 0 cosine similarity.
    vec[Math.abs(h) % DIM] += h & 1 ? 1 : -1;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (d) => (body += d));
  req.on("end", () => {
    const json = (code, obj) => {
      res.writeHead(code, { "Content-Type": "application/json" });
      res.end(JSON.stringify(obj));
    };

    if (req.method === "POST" && req.url === "/api/embed") {
      const { input } = JSON.parse(body);
      const inputs = Array.isArray(input) ? input : [input];
      return json(200, { embeddings: inputs.map(mockEmbed) });
    }

    if (req.method === "POST" && req.url === "/api/chat") {
      const { messages } = JSON.parse(body);
      const question = messages.filter((m) => m.role === "user").at(-1)?.content;
      const system = messages.find((m) => m.role === "system")?.content ?? "";
      const contextChunks = (system.match(/^\[\d+\] /gm) ?? []).length;
      return json(200, {
        message: {
          role: "assistant",
          content: `MOCK ANSWER (${contextChunks} context chunks) for: ${question}`,
        },
      });
    }

    if (req.method === "GET" && req.url === "/api/tags") {
      return json(200, { models: [{ name: "mock" }] });
    }

    json(404, { error: `mock-ollama: no route for ${req.method} ${req.url}` });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock-ollama listening on http://127.0.0.1:${PORT}`);
});
