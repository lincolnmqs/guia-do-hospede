import { cn } from "@/lib/cn";
import { CheckCircle2, XCircle } from "lucide-react";

interface PolicyItemProps {
  label: string;
  allowed: boolean;
  className?: string;
}

export function PolicyItem({ label, allowed, className }: PolicyItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-3 border-b border-[#E2EAF0] last:border-0",
        className,
      )}
    >
      <span className="text-sm text-[#334155] font-[family-name:var(--font-body)]">
        {label}
      </span>
      <span
        aria-label={allowed ? "Permitido" : "Não permitido"}
        className={cn(
          "flex items-center gap-1.5 text-xs font-semibold font-[family-name:var(--font-heading)]",
          allowed ? "text-[#16A34A]" : "text-[#DC2626]",
        )}
      >
        {allowed ? (
          <>
            <CheckCircle2 size={16} aria-hidden="true" />
            Permitido
          </>
        ) : (
          <>
            <XCircle size={16} aria-hidden="true" />
            Não permitido
          </>
        )}
      </span>
    </div>
  );
}
