// ---------------------------------------------------------------------------
// In-memory fixed-window rate limiter.
//
// Scoped to a single app instance — sufficient for the VPS/Docker deployment
// this project targets. A horizontally-scaled deployment would swap this for a
// shared store (e.g. Redis) behind the same interface.
// ---------------------------------------------------------------------------

interface Window {
  count: number;
  resetAt: number;
}

const store = new Map<string, Window>();

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets (only meaningful when `ok` is false). */
  retryAfter: number;
  remaining: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  const current = store.get(key);

  if (!current || now >= current.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    pruneExpired(now);
    return { ok: true, retryAfter: 0, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
      remaining: 0,
    };
  }

  current.count += 1;
  return { ok: true, retryAfter: 0, remaining: limit - current.count };
}

// Opportunistic cleanup so the map doesn't grow unbounded with one-off keys.
function pruneExpired(now: number): void {
  if (store.size < 1000) return;
  for (const [key, win] of store) {
    if (now >= win.resetAt) store.delete(key);
  }
}

/** Test-only helper to reset state between cases. */
export function __resetRateLimit(): void {
  store.clear();
}
