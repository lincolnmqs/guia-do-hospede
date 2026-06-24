import { cn } from "@/lib/cn";
import { amenityLabel } from "@/lib/format";
import { Check, X } from "lucide-react";

interface AmenityItemProps {
  amenityKey: string;
  available: boolean;
  className?: string;
}

export function AmenityItem({ amenityKey, available, className }: AmenityItemProps) {
  const label = amenityLabel(amenityKey);

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 py-1.5",
        !available && "opacity-40",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white",
          available ? "bg-[#16A34A]" : "bg-[#94A3B8]",
        )}
      >
        {available ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
      </span>
      <span className="text-sm text-[#334155] font-[family-name:var(--font-body)]">
        {label}
      </span>
    </div>
  );
}
