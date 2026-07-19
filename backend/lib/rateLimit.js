/**
 * Fixed-window in-memory rate limiter, keyed by client IP. Good enough for a
 * single-process personal API; state resets on restart by design.
 */
export function createRateLimiter({ windowMs, max }) {
  const windows = new Map(); // key -> { count, resetAt }

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, w] of windows) {
      if (w.resetAt <= now) windows.delete(key);
    }
  }, windowMs);
  cleanup.unref();

  return function check(key) {
    const now = Date.now();
    let w = windows.get(key);
    if (!w || w.resetAt <= now) {
      w = { count: 0, resetAt: now + windowMs };
      windows.set(key, w);
    }
    w.count += 1;
    return {
      allowed: w.count <= max,
      retryAfterSeconds: Math.max(1, Math.ceil((w.resetAt - now) / 1000)),
    };
  };
}
