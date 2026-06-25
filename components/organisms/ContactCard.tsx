import { cn } from "@/lib/cn";
import { MapPin, User } from "lucide-react";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { WhatsAppIcon } from "@/components/atoms/WhatsAppIcon";
import { formatPhoneDisplay, formatWhatsappHref } from "@/lib/format";
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

      <div className="rounded-[0.875rem] bg-white border border-[#E2EAF0] overflow-hidden shadow-[0_2px_12px_0_rgb(0_20_61_/_0.07)]">
        {/* Host block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-5 border-b border-[#E2EAF0]">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00143D] to-[#00143D] text-white"
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

        {/* Address block */}
        <div className="px-5 py-4">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F8]"
            >
              <MapPin size={14} className="text-[#00143D]" />
            </span>
            <address className="not-italic text-sm text-[#334155] font-[family-name:var(--font-body)] leading-relaxed">
              {fullAddress}
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
