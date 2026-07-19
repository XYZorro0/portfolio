export class QueueFullError extends Error {
  constructor() {
    super("Queue is full");
    this.name = "QueueFullError";
  }
}

/**
 * Serializes work so only `concurrency` jobs hit Ollama at once — the GPU
 * can only generate one answer at a time, and piling requests onto it just
 * thrashes VRAM. Beyond `maxPending` waiting jobs, run() rejects immediately
 * with QueueFullError so callers can return 429 instead of hanging.
 */
export function createTaskQueue({ concurrency = 1, maxPending = 8 } = {}) {
  let active = 0;
  const waiting = [];

  const next = () => {
    if (active >= concurrency || waiting.length === 0) return;
    active += 1;
    const { fn, resolve, reject } = waiting.shift();
    Promise.resolve()
      .then(fn)
      .then(resolve, reject)
      .finally(() => {
        active -= 1;
        next();
      });
  };

  return {
    run(fn) {
      if (waiting.length >= maxPending) {
        return Promise.reject(new QueueFullError());
      }
      return new Promise((resolve, reject) => {
        waiting.push({ fn, resolve, reject });
        next();
      });
    },
    get pending() {
      return waiting.length;
    },
  };
}
