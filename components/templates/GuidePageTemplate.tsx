import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import type { PropertyWithRelations } from "@/lib/db/property.repository";
import { PropertyGallery } from "@/components/organisms/PropertyGallery";
import { PropertyDetails } from "@/components/organisms/PropertyDetails";
import { AccessInfo } from "@/components/organisms/AccessInfo";
import { StayRules } from "@/components/organisms/StayRules";
import { ContactCard } from "@/components/organisms/ContactCard";
import { parseImages } from "@/lib/schemas/property";

interface GuidePageTemplateProps {
  property: PropertyWithRelations;
  /** Experience guide island (client component, server-injected) */
  experienceSlot?: ReactNode;
  /** Chat assistant island (client component, server-injected) */
  chatSlot?: ReactNode;
  className?: string;
}

export function GuidePageTemplate({
  property,
  experienceSlot,
  chatSlot,
  className,
}: GuidePageTemplateProps) {
  const images = parseImages(property.images);

  return (
    <div className={cn("min-h-screen bg-[#F7F9FB]", className)}>
      {/* Top bar */}
      <header className="bg-white border-b border-[#E2EAF0] sticky top-0 z-20 shadow-[0_1px_4px_0_rgb(14_125_166_/_0.06)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Voltar para a página inicial"
            className="group flex items-center gap-2 rounded-md -ml-1 px-1 py-1 transition-colors hover:bg-[#F7F9FB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#54B3D4]"
          >
            <ArrowLeft
              size={18}
              aria-hidden="true"
              className="text-[#64748B] transition-colors group-hover:text-[#0E7DA6]"
            />
            <span className="font-[family-name:var(--font-heading)] font-bold text-[#0E7DA6] text-lg tracking-tight">
              Seazone
            </span>
          </Link>
          <span className="text-xs text-[#64748B] font-[family-name:var(--font-body)] hidden sm:block">
            Guia do Hóspede
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-10">
        {/* Gallery — full width */}
        <PropertyGallery images={images} name={property.name} />

        {/* Main grid: content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Left column — primary content */}
          <div className="space-y-10 min-w-0">
            <PropertyDetails property={property} />

            <div
              className="h-px bg-gradient-to-r from-transparent via-[#E2EAF0] to-transparent"
              aria-hidden="true"
            />

            <AccessInfo operational={property.operational} />

            <div
              className="h-px bg-gradient-to-r from-transparent via-[#E2EAF0] to-transparent"
              aria-hidden="true"
            />

            <StayRules rules={property.rules} />

            <div
              className="h-px bg-gradient-to-r from-transparent via-[#E2EAF0] to-transparent"
              aria-hidden="true"
            />

            <ContactCard
              host={property.host}
              address={property.address}
              propertyName={property.name}
            />

            {/* Experience guide island */}
            {experienceSlot && (
              <>
                <div
                  className="h-px bg-gradient-to-r from-transparent via-[#E2EAF0] to-transparent"
                  aria-hidden="true"
                />
                <section aria-label="Guia de experiências">
                  {experienceSlot}
                </section>
              </>
            )}
          </div>

          {/* Right sidebar — chat island (sticky on desktop) */}
          {chatSlot && (
            <aside
              aria-label="Assistente virtual"
              className="lg:sticky lg:top-[4.5rem] rounded-[0.875rem] border border-[#E2EAF0] bg-white shadow-[0_4px_16px_0_rgb(14_125_166_/_0.08)] overflow-hidden"
            >
              {chatSlot}
            </aside>
          )}
        </div>
      </main>

      <footer className="mt-16 border-t border-[#E2EAF0] bg-white py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-center text-xs text-[#94A3B8] font-[family-name:var(--font-body)]">
            © {new Date().getFullYear()} Seazone — Guia Digital do Hóspede
          </p>
        </div>
      </footer>
    </div>
  );
}
