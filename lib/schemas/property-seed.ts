import { z } from "zod";
import { amenitiesSchema } from "./property";

// ---------------------------------------------------------------------------
// Schema for the seed data file (`prisma/data/properties.json`).
//
// Keeping property data in a JSON model and validating it here means the seed
// script carries no literal business data — it only loads, validates and
// persists. A malformed data file fails fast with a precise Zod error instead
// of producing a half-populated database.
// ---------------------------------------------------------------------------

const time = z.string().regex(/^\d{2}:\d{2}$/, "horário deve ser HH:MM");

export const propertySeedSchema = z.object({
  code: z.string().min(1).regex(/^[A-Z0-9]+$/, "código deve ser maiúsculo/alfanumérico"),
  name: z.string().min(1),
  propertyType: z.string().min(1),
  bedroomQuantity: z.number().int().nonnegative(),
  bathroomQuantity: z.number().int().nonnegative(),
  guestCapacity: z.number().int().positive(),
  amenities: amenitiesSchema,
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    complement: z.string().nullable(),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    postalCode: z.string().min(1),
  }),
  operational: z.object({
    wifiNetwork: z.string().min(1),
    wifiPassword: z.string().min(1),
    isSelfCheckin: z.boolean(),
    propertyAccessType: z.string().min(1),
    propertyAccessInstructions: z.string().min(1),
    propertyPassword: z.string().nullable(),
    hasParkingSpot: z.boolean(),
    parkingSpotIdentifier: z.string().nullable(),
    parkingSpotInstructions: z.string().nullable(),
  }),
  rules: z.object({
    checkInTime: time,
    checkOutTime: time,
    allowPet: z.boolean(),
    smokingPermitted: z.boolean(),
    suitableForChildren: z.boolean(),
    suitableForBabies: z.boolean(),
    eventsPermitted: z.boolean(),
  }),
  host: z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^\+\d{10,15}$/, "telefone deve ser E.164 (ex: +5548...)"),
  }),
});

export const propertySeedListSchema = z
  .array(propertySeedSchema)
  .min(1)
  .superRefine((items, ctx) => {
    const seen = new Set<string>();
    for (const [i, item] of items.entries()) {
      if (seen.has(item.code)) {
        ctx.addIssue({
          code: "custom",
          message: `código duplicado: ${item.code}`,
          path: [i, "code"],
        });
      }
      seen.add(item.code);
    }
  });

export type PropertySeed = z.infer<typeof propertySeedSchema>;
