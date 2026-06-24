import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./client", () => ({ prisma: { property: { findUnique: vi.fn() } } }));
import { prisma } from "./client";
import { findPropertyByCode } from "./property.repository";

describe("findPropertyByCode", () => {
  beforeEach(() => vi.clearAllMocks());
  it("normalizes the code to uppercase + trim", async () => {
    (prisma.property.findUnique as any).mockResolvedValue({ id: "1", code: "FLN001" });
    await findPropertyByCode("  fln001 ");
    expect(prisma.property.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { code: "FLN001" } }),
    );
  });
  it("returns null when not found", async () => {
    (prisma.property.findUnique as any).mockResolvedValue(null);
    expect(await findPropertyByCode("XXX999")).toBeNull();
  });
});
