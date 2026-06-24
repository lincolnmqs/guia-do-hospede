import { cn } from "@/lib/cn";
import { MapPin, Landmark } from "lucide-react";

interface AttractionCardProps {
  name: string;
  distance: string;
  description: string;
  className?: string;
}

export function AttractionCard({ name, distance, description, className }: AttractionCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[0.875rem] bg-white border border-[#E2EAF0]",
        "p-5 transition-all duration-200",
        "hover:shadow-[0_8px_24px_0_rgb(14_125_166_/_0.13),_0_2px_6px_0_rgb(0_0_0_/_0.06)]",
        "hover:-translate-y-0.5",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#54B3D4] to-[#0E7DA6] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED]"
        >
          <Landmark size={16} className="text-[#D97706]" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold font-[family-name:var(--font-heading)] text-[#1F2933] text-sm leading-snug">
            {name}
          </h3>
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
