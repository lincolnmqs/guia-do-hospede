import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // FLN001 — Apartamento Beira-Mar Florianópolis
  await prisma.property.upsert({
    where: { code: "FLN001" },
    update: {},
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
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      ],
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
    update: {},
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
      images: [
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800",
      ],
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
