import { prisma } from "./client";
import type { Prisma } from "@prisma/client";

const include = { address: true, operational: true, rules: true, host: true } as const;
export type PropertyWithRelations = Prisma.PropertyGetPayload<{ include: typeof include }>;

export function findPropertyByCode(code: string): Promise<PropertyWithRelations | null> {
  return prisma.property.findUnique({ where: { code: code.trim().toUpperCase() }, include });
}

// Lightweight summary for listings (e.g. the landing page) — only the fields a
// card needs, so we never ship operational/host data to a public index.
export type PropertySummary = {
  code: string;
  name: string;
  propertyType: string;
  bedroomQuantity: number;
  guestCapacity: number;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
};

export async function findAllProperties(): Promise<PropertySummary[]> {
  const rows = await prisma.property.findMany({
    orderBy: { code: "asc" },
    select: {
      code: true,
      name: true,
      propertyType: true,
      bedroomQuantity: true,
      guestCapacity: true,
      address: { select: { city: true, state: true, neighborhood: true } },
    },
  });

  return rows.map((p) => ({
    code: p.code,
    name: p.name,
    propertyType: p.propertyType,
    bedroomQuantity: p.bedroomQuantity,
    guestCapacity: p.guestCapacity,
    city: p.address?.city ?? null,
    state: p.address?.state ?? null,
    neighborhood: p.address?.neighborhood ?? null,
  }));
}
