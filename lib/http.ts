// Shared HTTP helpers for route handlers.

/**
 * Best-effort client IP extraction from proxy headers. Prefers the first hop in
 * `x-forwarded-for`, falling back to `x-real-ip`, then a sentinel. Used as a
 * rate-limit key, so an `"unknown"` bucket degrades gracefully (shared limit)
 * rather than failing open.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
