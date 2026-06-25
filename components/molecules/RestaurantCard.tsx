import { cn } from "@/lib/cn";
import { MapPin, Utensils } from "lucide-react";

interface RestaurantCardProps {
  name: string;
  distance: string;
  description: string;
  className?: string;
}

export function RestaurantCard({ name, distance, description, className }: RestaurantCardProps) {
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
          <Utensils size={16} className="text-[#00143D]" />
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
