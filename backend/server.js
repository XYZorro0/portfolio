import crypto from "node:crypto";
import express from "express";
import cors from "cors";

import { config, assertServerConfig } from "./lib/config.js";
import { embed, chat, OllamaError } from "./lib/ollama.js";
import { loadStore, search } from "./lib/vectorStore.js";
import { createRateLimiter } from "./lib/rateLimit.js";
import { createTaskQueue, QueueFullError } from "./lib/queue.js";
import { buildMessages, REDIRECT_MESSAGE } from "./lib/prompt.js";

assertServerConfig();

const store = loadStore(config.vectorStorePath);
console.log(
  `Vector store: ${store.chunks.length} chunks (${store.dim}d, model ${store.model})`
);

const app = express();
app.disable("x-powered-by");
// Only cloudflared (or curl on localhost) can reach this port, so forwarded
// headers are trustworthy — no one else can spoof them from outside.
app.set("trust proxy", true);
app.use(express.json({ limit: "16kb" }));

// CORS: browsers on unlisted origins get no CORS headers (request blocked
// client-side) AND an explicit 403. curl/no-Origin callers pass CORS but
// still need the API key.
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || config.allowedOrigins.includes(origin)),
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "X-API-Key"],
    maxAge: 86400,
  })
);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !config.allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  next();
});

const rateLimit = createRateLimiter({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
});
const queue = createTaskQueue({ concurrency: 1, maxPending: config.maxPending });

const keyHash = crypto.createHash("sha256").update(config.apiKey).digest();
function apiKeyValid(req) {
  const given = req.headers["x-api-key"];
  if (typeof given !== "string" || given.length === 0) return false;
  const givenHash = crypto.createHash("sha256").update(given).digest();
  return crypto.timingSafeEqual(keyHash, givenHash);
}

function clientIp(req) {
  // cloudflared forwards the visitor's real IP in CF-Connecting-IP.
  return req.headers["cf-connecting-ip"] || req.ip || "unknown";
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    chatModel: config.chatModel,
    embedModel: config.embedModel,
    chunks: store.chunks.length,
  });
});

app.post("/api/chat", async (req, res) => {
  if (!apiKeyValid(req)) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  const limit = rateLimit(clientIp(req));
  if (!limit.allowed) {
    res.set("Retry-After", String(limit.retryAfterSeconds));
    return res.status(429).json({
      error: "Too many requests — please wait a moment before asking again.",
    });
  }

  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    return res.status(400).json({ error: "Body must include a non-empty `message` string" });
  }
  if (message.length > config.maxQuestionLength) {
    return res.status(400).json({
      error: `Message too long (max ${config.maxQuestionLength} characters)`,
    });
  }

  // Optional prior turns from the widget, so follow-ups like "tell me more
  // about that project" work. Strictly validated and capped.
  let history = [];
  if (req.body.history !== undefined) {
    if (!Array.isArray(req.body.history)) {
      return res.status(400).json({ error: "`history` must be an array" });
    }
    history = req.body.history.slice(-8);
    for (const turn of history) {
      if (
        !turn ||
        (turn.role !== "user" && turn.role !== "assistant") ||
        typeof turn.content !== "string" ||
        turn.content.length > 2000
      ) {
        return res.status(400).json({
          error: "`history` entries must be {role: 'user'|'assistant', content: string}",
        });
      }
    }
    history = history.map((t) => ({ role: t.role, content: t.content }));
  }

  try {
    const result = await queue.run(async () => {
      const [queryEmbedding] = await embed(message, { isQuery: true });
      const matches = search(store, queryEmbedding, config.topK);

      if (matches.length === 0 || matches[0].score < config.minSimilarity) {
        return { answer: REDIRECT_MESSAGE, offTopic: true, sources: [] };
      }

      const contextChunks = matches
        .filter((m) => m.score >= config.minSimilarity)
        .map((m) => m.chunk);
      const answer = await chat(
        buildMessages({ question: message, contextChunks, history })
      );
      return {
        answer,
        offTopic: false,
        sources: [...new Set(contextChunks.map((c) => c.title))],
      };
    });
    res.json(result);
  } catch (err) {
    if (err instanceof QueueFullError) {
      res.set("Retry-After", "15");
      return res.status(429).json({
        error: "I'm answering a lot of questions right now — try again in a few seconds.",
      });
    }
    if (err instanceof OllamaError) {
      console.error(`[chat] ${err.message}`);
      return res.status(502).json({
        error: "The model backend is unavailable right now. Please try again later.",
      });
    }
    console.error("[chat] unexpected error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(config.port, config.host, () => {
  console.log(`Chatbot API listening on http://${config.host}:${config.port}`);
  console.log(`  chat model:  ${config.chatModel} (via ${config.ollamaUrl})`);
  console.log(`  origins:     ${config.allowedOrigins.join(", ")}`);
  console.log(
    `  rate limit:  ${config.rateLimitMax} req / ${config.rateLimitWindowMs / 1000}s per IP`
  );
});
