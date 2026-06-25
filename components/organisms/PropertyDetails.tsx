import { cn } from "@/lib/cn";
import { BedDouble, Bath, Users, MapPin } from "lucide-react";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { IconText } from "@/components/atoms/IconText";
import { AmenityItem } from "@/components/molecules/AmenityItem";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

interface PropertyDetailsProps {
  property: PropertyWithRelations;
  className?: string;
}

export function PropertyDetails({ property, className }: PropertyDetailsProps) {
  const { name, propertyType, guestCapacity, bedroomQuantity, bathroomQuantity, address, amenities } = property;
  const location  = address ? `${address.city}, ${address.state}` : "";

  const amenityEntries = amenities
    ? Object.entries(amenities as Record<string, boolean>)
    : [];

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="property-details-title">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1
              id="property-details-title"
              className="font-[family-name:var(--font-heading)] font-bold text-2xl sm:text-3xl text-[#00143D] leading-tight tracking-tight"
            >
              {name}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-[#64748B]">
              <span className="font-medium text-[#00143D] font-[family-name:var(--font-heading)]">
                {propertyType}
              </span>
              <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} aria-hidden="true" />
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Capacity row */}
        <dl className="mt-5 flex flex-wrap gap-4 sm:gap-6">
          <IconText
            icon={BedDouble}
            label={`${bedroomQuantity} ${bedroomQuantity === 1 ? "quarto" : "quartos"}`}
          />
          <IconText
            icon={Bath}
            label={`${bathroomQuantity} ${bathroomQuantity === 1 ? "banheiro" : "banheiros"}`}
          />
          <IconText
            icon={Users}
            label={`${guestCapacity} ${guestCapacity === 1 ? "hóspede" : "hóspedes"}`}
          />
        </dl>
      </div>

      {amenityEntries.length > 0 && (
        <div>
          <SectionTitle>Comodidades</SectionTitle>
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-4"
            aria-label="Lista de comodidades"
          >
            {amenityEntries.map(([key, available]) => (
              <li key={key}>
                <AmenityItem amenityKey={key} available={Boolean(available)} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
