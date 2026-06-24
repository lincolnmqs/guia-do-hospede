-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bedroomQuantity" INTEGER NOT NULL,
    "bathroomQuantity" INTEGER NOT NULL,
    "guestCapacity" INTEGER NOT NULL,
    "amenities" JSONB NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operational" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "wifiNetwork" TEXT NOT NULL,
    "wifiPassword" TEXT NOT NULL,
    "isSelfCheckin" BOOLEAN NOT NULL,
    "propertyAccessType" TEXT NOT NULL,
    "propertyAccessInstructions" TEXT NOT NULL,
    "propertyPassword" TEXT,
    "hasParkingSpot" BOOLEAN NOT NULL,
    "parkingSpotIdentifier" TEXT,
    "parkingSpotInstructions" TEXT,

    CONSTRAINT "Operational_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rules" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkInTime" TEXT NOT NULL,
    "checkOutTime" TEXT NOT NULL,
    "allowPet" BOOLEAN NOT NULL,
    "smokingPermitted" BOOLEAN NOT NULL,
    "suitableForChildren" BOOLEAN NOT NULL,
    "suitableForBabies" BOOLEAN NOT NULL,
    "eventsPermitted" BOOLEAN NOT NULL,

    CONSTRAINT "Rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceGuide" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL,
    "restaurants" JSONB NOT NULL,
    "attractions" JSONB NOT NULL,
    "essentials" JSONB NOT NULL,
    "seasonalTip" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceGuide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_code_key" ON "Property"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Address_propertyId_key" ON "Address"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Operational_propertyId_key" ON "Operational"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Rules_propertyId_key" ON "Rules"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Host_propertyId_key" ON "Host"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceGuide_propertyId_key" ON "ExperienceGuide"("propertyId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operational" ADD CONSTRAINT "Operational_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rules" ADD CONSTRAINT "Rules_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceGuide" ADD CONSTRAINT "ExperienceGuide_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
