import { cn } from "@/lib/cn";
import { Clock, LogIn, LogOut } from "lucide-react";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { PolicyItem } from "@/components/molecules/PolicyItem";
import { InfoRow } from "@/components/molecules/InfoRow";
import type { PropertyWithRelations } from "@/lib/db/property.repository";

interface StayRulesProps {
  rules: PropertyWithRelations["rules"];
  className?: string;
}

export function StayRules({ rules, className }: StayRulesProps) {
  if (!rules) return null;

  const {
    checkInTime,
    checkOutTime,
    allowPet,
    smokingPermitted,
    suitableForChildren,
    suitableForBabies,
    eventsPermitted,
  } = rules;

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="stay-rules-title">
      <SectionTitle id="stay-rules-title" subtitle="Fique atento às regras para uma boa convivência">
        Regras da estadia
      </SectionTitle>

      {/* Check-in / Check-out times */}
      <div className="rounded-[0.875rem] bg-white border border-[#E2EAF0] overflow-hidden shadow-[0_2px_12px_0_rgb(0_20_61_/_0.07)]">
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#EEF2F8] to-[#F0F2F8] px-5 py-3 border-b border-[#E2EAF0]">
          <Clock size={16} aria-hidden="true" className="text-[#00143D]" />
          <h3 className="font-semibold font-[family-name:var(--font-heading)] text-[#00143D] text-sm">
            Horários
          </h3>
        </div>
        <dl className="px-5 divide-y divide-[#E2EAF0]">
          <InfoRow icon={LogIn} label="Check-in" value={checkInTime} />
          <InfoRow icon={LogOut} label="Check-out" value={checkOutTime} />
        </dl>
      </div>

      {/* Policies */}
      <div className="rounded-[0.875rem] bg-white border border-[#E2EAF0] overflow-hidden shadow-[0_2px_12px_0_rgb(0_20_61_/_0.07)]">
        <div className="px-5 py-3 border-b border-[#E2EAF0] bg-gradient-to-r from-[#EEF2F8] to-[#F0F2F8]">
          <h3 className="font-semibold font-[family-name:var(--font-heading)] text-[#00143D] text-sm">
            Políticas
          </h3>
        </div>
        <ul className="px-5">
          <li>
            <PolicyItem label="Animais de estimação" allowed={allowPet} />
          </li>
          <li>
            <PolicyItem label="Fumar" allowed={smokingPermitted} />
          </li>
          <li>
            <PolicyItem label="Crianças" allowed={suitableForChildren} />
          </li>
          <li>
            <PolicyItem label="Bebês" allowed={suitableForBabies} />
          </li>
          <li>
            <PolicyItem label="Festas e eventos" allowed={eventsPermitted} />
          </li>
        </ul>
      </div>
    </section>
  );
}
