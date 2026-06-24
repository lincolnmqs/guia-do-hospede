import { readFileSync } from "node:fs";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  propertySeedListSchema,
  type PropertySeed,
} from "../lib/schemas/property-seed";

// When run standalone for local development (`npm run seed`), load `.env` so
// DATABASE_URL is available. In Docker the variable is already injected by
// compose, so this no-ops (the guard skips loading).
if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile(".env");
  } catch {
    // no .env file — fall through to the explicit error below
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Data loading + validation
//
// Property data lives in a JSON model (`data/properties.json`), never as
// literals in this script. We validate it against a Zod schema so a malformed
// file fails fast with a precise error instead of corrupting the database.
// ---------------------------------------------------------------------------

function loadProperties(): PropertySeed[] {
  const path = new URL("./data/properties.json", import.meta.url);
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const result = propertySeedListSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `data/properties.json inválido:\n${JSON.stringify(result.error.format(), null, 2)}`,
    );
  }
  return result.data;
}

// Images are self-hosted in the MinIO bucket. The bytes are uploaded once by
// `npm run images:upload`; the URLs derive from the property code, so there is
// nothing per-property to store in the data file.
const MINIO_BASE = `${
  (process.env.MINIO_ENDPOINT ?? "https://minio.qvr35i.easypanel.host").replace(/\/$/, "")
}/${process.env.MINIO_BUCKET ?? "guia-do-hospede"}/properties`;

const propertyImages = (code: string): string[] =>
  Array.from({ length: 5 }, (_, i) => `${MINIO_BASE}/${code}/${i + 1}.jpg`);

// ---------------------------------------------------------------------------
// Mapping: validated seed record → Prisma payloads
// ---------------------------------------------------------------------------

function toCreateInput(p: PropertySeed): Prisma.PropertyCreateInput {
  return {
    code: p.code,
    name: p.name,
    propertyType: p.propertyType,
    bedroomQuantity: p.bedroomQuantity,
    bathroomQuantity: p.bathroomQuantity,
    guestCapacity: p.guestCapacity,
    amenities: p.amenities,
    images: propertyImages(p.code),
    address: { create: p.address },
    operational: { create: p.operational },
    rules: { create: p.rules },
    host: { create: p.host },
  };
}

function toUpdateInput(p: PropertySeed): Prisma.PropertyUpdateInput {
  return {
    name: p.name,
    propertyType: p.propertyType,
    bedroomQuantity: p.bedroomQuantity,
    bathroomQuantity: p.bathroomQuantity,
    guestCapacity: p.guestCapacity,
    amenities: p.amenities,
    images: propertyImages(p.code),
    address: { update: p.address },
    operational: { update: p.operational },
    rules: { update: p.rules },
    host: { update: p.host },
  };
}

// ---------------------------------------------------------------------------
// Seed: idempotent upsert (create when new, edit when existing)
// ---------------------------------------------------------------------------

async function main() {
  const properties = loadProperties();

  const existing = new Set(
    (
      await prisma.property.findMany({
        where: { code: { in: properties.map((p) => p.code) } },
        select: { code: true },
      })
    ).map((p) => p.code),
  );

  for (const property of properties) {
    await prisma.property.upsert({
      where: { code: property.code },
      create: toCreateInput(property),
      update: toUpdateInput(property),
    });
  }

  const created = properties.filter((p) => !existing.has(p.code)).map((p) => p.code);
  const updated = properties.filter((p) => existing.has(p.code)).map((p) => p.code);
  console.log(
    `Seed completo — criados: [${created.join(", ") || "—"}], atualizados: [${updated.join(", ") || "—"}]`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
