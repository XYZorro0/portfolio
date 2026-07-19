import { config } from "./config.js";

// nomic-embed-text is trained with task prefixes: documents and queries are
// embedded into the same space only when tagged with their role.
const DOC_PREFIX = "search_document: ";
const QUERY_PREFIX = "search_query: ";

class OllamaError extends Error {
  constructor(message, { cause, unreachable = false } = {}) {
    super(message, { cause });
    this.name = "OllamaError";
    this.unreachable = unreachable;
  }
}

async function post(apiPath, body, { timeoutMs = config.ollamaTimeoutMs } = {}) {
  let res;
  try {
    res = await fetch(`${config.ollamaUrl}${apiPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (cause) {
    throw new OllamaError(
      `Cannot reach Ollama at ${config.ollamaUrl} — is \`ollama serve\` running?`,
      { cause, unreachable: true }
    );
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new OllamaError(
      `Ollama ${apiPath} returned ${res.status}: ${detail.slice(0, 300)}`
    );
  }
  return res.json();
}

/**
 * Embed one or more texts. Returns an array of raw (unnormalized) vectors
 * in the same order as the input.
 */
export async function embed(texts, { isQuery = false } = {}) {
  const prefix = isQuery ? QUERY_PREFIX : DOC_PREFIX;
  const input = (Array.isArray(texts) ? texts : [texts]).map(
    (t) => prefix + t
  );
  const data = await post("/api/embed", { model: config.embedModel, input });
  if (!Array.isArray(data.embeddings) || data.embeddings.length !== input.length) {
    throw new OllamaError(
      `Ollama /api/embed returned ${data.embeddings?.length ?? 0} embeddings for ${input.length} inputs`
    );
  }
  return data.embeddings;
}

/**
 * Run a chat completion. `messages` is the full [{role, content}] array
 * including the system prompt. Returns the assistant's text.
 */
export async function chat(messages) {
  const data = await post("/api/chat", {
    model: config.chatModel,
    messages,
    stream: false,
    keep_alive: config.keepAlive,
    options: {
      temperature: 0.3,
      num_ctx: 4096,
      num_predict: 400,
    },
  });
  const answer = data.message?.content;
  if (typeof answer !== "string" || !answer.trim()) {
    throw new OllamaError("Ollama /api/chat returned an empty response");
  }
  return answer.trim();
}

export { OllamaError };
