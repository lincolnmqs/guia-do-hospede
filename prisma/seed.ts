import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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

// Multiple photos per property — the test asks for "Fotos do imóvel" (plural).
// The first item is the hero image (the one from the reference data).
const FLN001_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200",
];

const GRM001_IMAGES = [
  "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200",
  "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
];

async function main() {
  // FLN001 — Apartamento Beira-Mar Florianópolis
  await prisma.property.upsert({
    where: { code: "FLN001" },
    update: { images: FLN001_IMAGES },
    create: {
      code: "FLN001",
      name: "Apartamento Beira-Mar Florianópolis",
      propertyType: "Apartamento",
      bedroomQuantity: 2,
      bathroomQuantity: 1,
      guestCapacity: 4,
      amenities: {
        wifi: true,
        tv: true,
        air_conditioning: true,
        kitchen: true,
        washing_machine: true,
        elevator: true,
        balcony: true,
      },
      images: FLN001_IMAGES,
      address: {
        create: {
          street: "Rua Lauro Linhares",
          number: "589",
          complement: "Apto 301",
          neighborhood: "Trindade",
          city: "Florianópolis",
          state: "SC",
          postalCode: "88036-001",
        },
      },
      operational: {
        create: {
          wifiNetwork: "SeaHome_FLN001",
          wifiPassword: "floripa2024",
          isSelfCheckin: true,
          propertyAccessType: "smart_lock",
          propertyAccessInstructions:
            "Use o código 4521 na fechadura eletrônica",
          propertyPassword: "4521",
          hasParkingSpot: true,
          parkingSpotIdentifier: "Vaga 12 — subsolo B1",
          parkingSpotInstructions:
            "Portão lateral, código 7890 no interfone",
        },
      },
      rules: {
        create: {
          checkInTime: "15:00",
          checkOutTime: "11:00",
          allowPet: false,
          smokingPermitted: false,
          suitableForChildren: true,
          suitableForBabies: true,
          eventsPermitted: false,
        },
      },
      host: {
        create: {
          name: "Ana Paula",
          phone: "+5548991234567",
        },
      },
    },
  });

  // GRM001 — Chalé Serra Gramado
  await prisma.property.upsert({
    where: { code: "GRM001" },
    update: { images: GRM001_IMAGES },
    create: {
      code: "GRM001",
      name: "Chalé Serra Gramado",
      propertyType: "Casa",
      bedroomQuantity: 3,
      bathroomQuantity: 2,
      guestCapacity: 6,
      amenities: {
        wifi: true,
        tv: true,
        kitchen: true,
        bbq_grill: true,
        balcony: true,
        dishwasher: true,
      },
      images: GRM001_IMAGES,
      address: {
        create: {
          street: "Rua das Hortênsias",
          number: "220",
          complement: null,
          neighborhood: "Planalto",
          city: "Gramado",
          state: "RS",
          postalCode: "95670-000",
        },
      },
      operational: {
        create: {
          wifiNetwork: "ChaletSerra_GRM",
          wifiPassword: "gramado@2024",
          isSelfCheckin: false,
          propertyAccessType: "keybox",
          propertyAccessInstructions:
            "A chave está no cofre na entrada. Código: 1983",
          propertyPassword: "1983",
          hasParkingSpot: true,
          parkingSpotIdentifier: null,
          parkingSpotInstructions: "Garagem própria para 2 carros",
        },
      },
      rules: {
        create: {
          checkInTime: "14:00",
          checkOutTime: "12:00",
          allowPet: true,
          smokingPermitted: false,
          suitableForChildren: true,
          suitableForBabies: false,
          eventsPermitted: false,
        },
      },
      host: {
        create: {
          name: "Carlos Eduardo",
          phone: "+5554998765432",
        },
      },
    },
  });

  console.log("Seed completed: FLN001 and GRM001 upserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
