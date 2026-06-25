import { z } from "zod";
import { Prisma } from "@prisma/client";

export const amenitiesSchema = z.record(z.string(), z.boolean());
export const imagesSchema = z.array(z.string());

// JSONB columns arrive as `unknown` from Prisma. These helpers validate the
// stored shape at the read boundary and degrade to an empty collection instead
// of casting blindly — so a malformed/legacy row can never crash a render or
// leak an unexpected shape downstream.
export function parseImages(value: unknown): string[] {
  const result = imagesSchema.safeParse(value);
  return result.success ? result.data : [];
}

export function parseAmenities(value: unknown): Record<string, boolean> {
  const result = amenitiesSchema.safeParse(value);
  return result.success ? result.data : {};
}

export type Property = Prisma.PropertyGetPayload<{
  include: {
    address: true;
    operational: true;
    rules: true;
    host: true;
  };
}>;
