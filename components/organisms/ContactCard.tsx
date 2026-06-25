import { cn } from "@/lib/cn";
import { MapPin, User, ExternalLink } from "lucide-react";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { WhatsAppIcon } from "@/components/atoms/WhatsAppIcon";
import { formatPhoneDisplay, formatWhatsappHref, googleMapsHref } from "@/lib/format";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

interface ContactCardProps {
  host: PropertyWithRelations["host"];
  address: PropertyWithRelations["address"];
  propertyName?: string;
  className?: string;
}

export function ContactCard({ host, address, propertyName, className }: ContactCardProps) {
  if (!host || !address) return null;

  const phoneDisplay = formatPhoneDisplay(host.phone);
  const whatsappHref = formatWhatsappHref(
    host.phone,
    `Olá! Gostaria de mais informações sobre${propertyName ? ` o imóvel "${propertyName}"` : " este imóvel"}.`,
  );

  const fullAddress = [
    `${address.street}, ${address.number}${address.complement ? ` — ${address.complement}` : ""}`,
    address.neighborhood,
    `${address.city} — ${address.state}`,
    address.postalCode,
  ].join(", ");

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="contact-card-title">
      <SectionTitle id="contact-card-title" subtitle="Entre em contato ou encontre o imóvel facilmente">
        Contato &amp; Localização
      </SectionTitle>

      <div className="rounded-[0.875rem] bg-white border border-[#E2EAF0] overflow-hidden shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]">
        {/* Host block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-5 border-b border-[#E2EAF0]">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#54B3D4] to-[#0E7DA6] text-white"
            >
              <User size={18} />
            </span>
            <div>
              <p className="text-xs text-[#64748B] font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wide">
                Anfitrião
              </p>
              <p className="font-semibold font-[family-name:var(--font-heading)] text-[#1F2933] text-base">
                {host.name}
              </p>
            </div>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Conversar com ${host.name} no WhatsApp`}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2.5",
              "bg-[#25D366] text-white text-sm font-semibold font-[family-name:var(--font-heading)]",
              "hover:bg-[#1FB855] transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-[#25D366] focus-visible:outline-offset-2",
            )}
          >
            <WhatsAppIcon size={15} />
            <span>{phoneDisplay}</span>
          </a>
        </div>

        {/* Address block — opens the location in Google Maps */}
        <a
          href={googleMapsHref(fullAddress)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir endereço no Google Maps (abre em nova aba): ${fullAddress}`}
          className={cn(
            "group flex items-start gap-3 px-5 py-4",
            "transition-colors duration-150 hover:bg-[#F7F9FB]",
            "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#54B3D4]",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              "bg-[#EBF6FA] transition-colors duration-150 group-hover:bg-[#0E7DA6]",
            )}
          >
            <MapPin
              size={14}
              className="text-[#0E7DA6] transition-colors duration-150 group-hover:text-white"
            />
          </span>
          <address className="not-italic text-sm text-[#334155] font-[family-name:var(--font-body)] leading-relaxed">
            {fullAddress}
          </address>
          <span
            aria-hidden="true"
            className="ml-auto mt-0.5 flex items-center gap-1 shrink-0 text-xs font-[family-name:var(--font-heading)] font-semibold text-[#94A3B8] transition-colors duration-150 group-hover:text-[#0E7DA6]"
          >
            <span className="hidden sm:inline">Ver no mapa</span>
            <ExternalLink size={13} />
          </span>
        </a>
      </div>
    </section>
  );
}
