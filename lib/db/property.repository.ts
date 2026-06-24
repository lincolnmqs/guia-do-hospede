import { prisma } from "./client";
import type { Prisma } from "@prisma/client";

const include = { address: true, operational: true, rules: true, host: true } as const;
export type PropertyWithRelations = Prisma.PropertyGetPayload<{ include: typeof include }>;

export function findPropertyByCode(code: string): Promise<PropertyWithRelations | null> {
  return prisma.property.findUnique({ where: { code: code.trim().toUpperCase() }, include });
}
