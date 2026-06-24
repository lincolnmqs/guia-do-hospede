import { cn } from "@/lib/cn";
import { Phone, MapPin, User } from "lucide-react";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { formatPhoneHref } from "@/lib/format";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

interface ContactCardProps {
  host: PropertyWithRelations["host"];
  address: PropertyWithRelations["address"];
  className?: string;
}

export function ContactCard({ host, address, className }: ContactCardProps) {
  if (!host || !address) return null;

  const phoneHref = formatPhoneHref(host.phone);

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
            href={phoneHref}
            aria-label={`Ligar para ${host.name}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2.5",
              "bg-[#0E7DA6] text-white text-sm font-semibold font-[family-name:var(--font-heading)]",
              "hover:bg-[#0A5F80] transition-colors duration-150",
              "focus-visible:outline-2 focus-visible:outline-[#54B3D4] focus-visible:outline-offset-2",
            )}
          >
            <Phone size={14} aria-hidden="true" />
            <span>{host.phone}</span>
          </a>
        </div>

        {/* Address block */}
        <div className="px-5 py-4">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EBF6FA]"
            >
              <MapPin size={14} className="text-[#0E7DA6]" />
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
