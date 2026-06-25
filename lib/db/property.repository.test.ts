import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./client", () => ({
  prisma: { property: { findUnique: vi.fn(), findMany: vi.fn() } },
}));
import { prisma } from "./client";
import { findPropertyByCode, findAllProperties } from "./property.repository";

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

describe("findAllProperties", () => {
  beforeEach(() => vi.clearAllMocks());

  it("flattens the address into a summary shape", async () => {
    (prisma.property.findMany as any).mockResolvedValue([
      {
        code: "FLN001",
        name: "Apartamento Beira-Mar",
        propertyType: "Apartamento",
        bedroomQuantity: 2,
        guestCapacity: 4,
        address: { city: "Florianópolis", state: "SC", neighborhood: "Trindade" },
      },
    ]);

    expect(await findAllProperties()).toEqual([
      {
        code: "FLN001",
        name: "Apartamento Beira-Mar",
        propertyType: "Apartamento",
        bedroomQuantity: 2,
        guestCapacity: 4,
        city: "Florianópolis",
        state: "SC",
        neighborhood: "Trindade",
      },
    ]);
  });

  it("tolerates a missing address", async () => {
    (prisma.property.findMany as any).mockResolvedValue([
      {
        code: "XXX999",
        name: "Sem endereço",
        propertyType: "Casa",
        bedroomQuantity: 1,
        guestCapacity: 2,
        address: null,
      },
    ]);

    const [p] = await findAllProperties();
    expect(p).toMatchObject({ city: null, state: null, neighborhood: null });
  });
});
