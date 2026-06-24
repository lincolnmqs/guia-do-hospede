import { cn } from "@/lib/cn";
import { Wifi, Lock, Car, KeyRound } from "lucide-react";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { InfoRow } from "@/components/molecules/InfoRow";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

interface AccessInfoProps {
  operational: PropertyWithRelations["operational"];
  className?: string;
}

const ACCESS_TYPE_LABELS: Record<string, string> = {
  key:           "Chave física",
  smart_lock:    "Fechadura inteligente",
  key_box:       "Cofre de chave",
  host_handover: "Entrega pelo anfitrião",
};

export function AccessInfo({ operational, className }: AccessInfoProps) {
  if (!operational) return null;

  const {
    wifiNetwork,
    wifiPassword,
    isSelfCheckin,
    propertyAccessType,
    propertyAccessInstructions,
    propertyPassword,
    hasParkingSpot,
    parkingSpotIdentifier,
    parkingSpotInstructions,
  } = operational;

  const accessTypeLabel = ACCESS_TYPE_LABELS[propertyAccessType] ?? propertyAccessType;

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="access-info-title">
      <SectionTitle id="access-info-title" subtitle="Tudo o que você precisa para entrar e se instalar">
        Acesso ao imóvel
      </SectionTitle>

      {/* WiFi block */}
      <div className="rounded-[0.875rem] bg-white border border-[#E2EAF0] overflow-hidden shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]">
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#EBF6FA] to-[#F0F9FF] px-5 py-3 border-b border-[#E2EAF0]">
          <Wifi size={16} aria-hidden="true" className="text-[#0E7DA6]" />
          <h3 className="font-semibold font-[family-name:var(--font-heading)] text-[#0A5F80] text-sm">
            Wi-Fi
          </h3>
        </div>
        <dl className="px-5 divide-y divide-[#E2EAF0]">
          <InfoRow label="Rede" value={wifiNetwork} />
          <InfoRow label="Senha" value={
            <span className="font-mono font-medium tracking-wider text-[#0E7DA6]">
              {wifiPassword}
            </span>
          } />
        </dl>
      </div>

      {/* Access block */}
      <div className="rounded-[0.875rem] bg-white border border-[#E2EAF0] overflow-hidden shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]">
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#EBF6FA] to-[#F0F9FF] px-5 py-3 border-b border-[#E2EAF0]">
          <Lock size={16} aria-hidden="true" className="text-[#0E7DA6]" />
          <h3 className="font-semibold font-[family-name:var(--font-heading)] text-[#0A5F80] text-sm">
            Entrada
          </h3>
          {isSelfCheckin && (
            <span className="ml-auto rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-semibold text-[#16A34A] font-[family-name:var(--font-heading)]">
              Self check-in
            </span>
          )}
        </div>
        <dl className="px-5 divide-y divide-[#E2EAF0]">
          <InfoRow icon={KeyRound} label="Tipo de acesso" value={accessTypeLabel} />
          {propertyPassword && (
            <InfoRow label="Código" value={
              <span className="font-mono font-medium tracking-widest text-[#0E7DA6] text-base">
                {propertyPassword}
              </span>
            } />
          )}
          <InfoRow label="Instruções" value={propertyAccessInstructions} />
        </dl>
      </div>

      {/* Parking block — only when hasParkingSpot */}
      {hasParkingSpot && (
        <div
          aria-label="Estacionamento"
          className="rounded-[0.875rem] bg-white border border-[#E2EAF0] overflow-hidden shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]"
        >
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#EBF6FA] to-[#F0F9FF] px-5 py-3 border-b border-[#E2EAF0]">
            <Car size={16} aria-hidden="true" className="text-[#0E7DA6]" />
            <h3 className="font-semibold font-[family-name:var(--font-heading)] text-[#0A5F80] text-sm">
              Estacionamento
            </h3>
          </div>
          <dl className="px-5 divide-y divide-[#E2EAF0]">
            {parkingSpotIdentifier && (
              <InfoRow label="Vaga" value={parkingSpotIdentifier} />
            )}
            {parkingSpotInstructions && (
              <InfoRow label="Instruções" value={parkingSpotInstructions} />
            )}
          </dl>
        </div>
      )}
    </section>
  );
}
