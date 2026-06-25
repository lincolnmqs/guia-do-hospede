import { cn } from "@/lib/cn";
import { MapPin, ShoppingCart, Stethoscope, Pill, Landmark, Store } from "lucide-react";

interface EssentialCardProps {
  name: string;
  distance: string;
  description: string;
  type?: string;
  className?: string;
}

const typeIconMap: Record<string, React.ElementType> = {
  farmácia: Pill,
  farmacia: Pill,
  supermercado: ShoppingCart,
  mercado: ShoppingCart,
  hospital: Stethoscope,
  clínica: Stethoscope,
  clinica: Stethoscope,
  banco: Landmark,
  default: Store,
};

function resolveIcon(type?: string): React.ElementType {
  if (!type) return Store;
  const lower = type.toLowerCase();
  for (const [key, icon] of Object.entries(typeIconMap)) {
    if (lower.includes(key)) return icon;
  }
  return Store;
}

export function EssentialCard({ name, distance, description, type, className }: EssentialCardProps) {
  const Icon = resolveIcon(type);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[0.875rem] bg-white border border-[#E2EAF0]",
        "p-5 transition-all duration-200",
        "hover:shadow-[0_8px_24px_0_rgb(0_20_61_/_0.13),_0_2px_6px_0_rgb(0_0_0_/_0.06)]",
        "hover:-translate-y-0.5",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FC5A54] to-[#00143D] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF2F8]"
        >
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon size={16} className="text-[#00143D]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold font-[family-name:var(--font-heading)] text-[#1F2933] text-sm leading-snug">
              {name}
            </h3>
            {type && (
              <span className="shrink-0 rounded-full bg-[#EEF2F8] px-2 py-0.5 text-[10px] font-semibold text-[#00143D] font-[family-name:var(--font-heading)]">
                {type}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-[#64748B]">
            <MapPin size={11} aria-hidden="true" />
            <span>{distance}</span>
          </div>
          <p className="mt-2 text-xs text-[#64748B] leading-relaxed font-[family-name:var(--font-body)]">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
