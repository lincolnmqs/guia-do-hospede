import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface IconTextProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  iconClassName?: string;
  className?: string;
}

export function IconText({ icon: Icon, label, value, iconClassName, className }: IconTextProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm text-[#334155]", className)}>
      <Icon
        size={16}
        aria-hidden="true"
        className={cn("shrink-0 text-[#00143D]", iconClassName)}
      />
      {value !== undefined ? (
        <>
          <span className="text-[#64748B]">{label}:</span>
          <span className="font-medium">{value}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
}
