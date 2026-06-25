import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface InfoRowProps {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function InfoRow({ icon: Icon, label, value, className }: InfoRowProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 py-3 border-b border-[#E2EAF0] last:border-0",
        className,
      )}
    >
      {Icon && (
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF2F8]"
        >
          <Icon size={14} className="text-[#00143D]" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <dt className="text-xs font-semibold uppercase tracking-wider text-[#64748B] font-[family-name:var(--font-heading)]">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm text-[#1F2933] font-[family-name:var(--font-body)] break-words">
          {value}
        </dd>
      </div>
    </div>
  );
}
