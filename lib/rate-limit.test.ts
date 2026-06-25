import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, __resetRateLimit } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => __resetRateLimit());

  it("allows requests up to the limit within the window", () => {
    const t0 = 1_000;
    expect(rateLimit("ip", 3, 60_000, t0)).toMatchObject({ ok: true, remaining: 2 });
    expect(rateLimit("ip", 3, 60_000, t0)).toMatchObject({ ok: true, remaining: 1 });
    expect(rateLimit("ip", 3, 60_000, t0)).toMatchObject({ ok: true, remaining: 0 });
  });

  it("blocks once the limit is exceeded and reports retryAfter", () => {
    const t0 = 1_000;
    for (let i = 0; i < 3; i++) rateLimit("ip", 3, 60_000, t0);
    const blocked = rateLimit("ip", 3, 60_000, t0 + 10_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBe(50); // 60s window, 10s elapsed
  });

  it("resets after the window elapses", () => {
    const t0 = 1_000;
    for (let i = 0; i < 3; i++) rateLimit("ip", 3, 60_000, t0);
    expect(rateLimit("ip", 3, 60_000, t0 + 60_000)).toMatchObject({ ok: true });
  });

  it("tracks keys independently", () => {
    const t0 = 1_000;
    rateLimit("a", 1, 60_000, t0);
    expect(rateLimit("a", 1, 60_000, t0).ok).toBe(false);
    expect(rateLimit("b", 1, 60_000, t0).ok).toBe(true);
  });
});
