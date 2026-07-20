import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const backendRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const envFile = path.join(backendRoot, ".env");
if (fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const num = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error(`Config: ${name}=${JSON.stringify(raw)} is not a number`);
  }
  return n;
};

export const config = {
  host: process.env.HOST || "127.0.0.1",
  port: num("PORT", 3001),
  apiKey: process.env.CHATBOT_API_KEY || "",

  allowedOrigins: (
    process.env.ALLOWED_ORIGINS ||
    "https://niketgupta.com,https://www.niketgupta.com"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  ollamaUrl: (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(
    /\/+$/,
    ""
  ),
  chatModel: process.env.CHAT_MODEL || "llama3.2:3b",
  embedModel: process.env.EMBED_MODEL || "nomic-embed-text",
  keepAlive: process.env.KEEP_ALIVE || "30m",
  ollamaTimeoutMs: num("OLLAMA_TIMEOUT_MS", 120_000),

  topK: num("TOP_K", 4),
  minSimilarity: num("MIN_SIMILARITY", 0.35),
  vectorStorePath: path.resolve(
    backendRoot,
    process.env.VECTOR_STORE || "data/vector-store.json"
  ),

  rateLimitWindowMs: num("RATE_LIMIT_WINDOW_MS", 60_000),
  rateLimitMax: num("RATE_LIMIT_MAX", 10),
  maxPending: num("MAX_PENDING", 8),
  maxQuestionLength: num("MAX_QUESTION_LENGTH", 500),
};

export function assertServerConfig() {
  if (!config.apiKey) {
    console.error(
      "CHATBOT_API_KEY is not set. Copy backend/.env.example to backend/.env " +
        "and set a key (node -e \"console.log(crypto.randomBytes(24).toString('base64url'))\")."
    );
    process.exit(1);
  }
}
