import { cn } from "@/lib/cn";

type BadgeVariant = "primary" | "permitted" | "forbidden" | "warning" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary:   "bg-[#EEF2F8] text-[#00143D] border border-[#B3DCEC]",
  permitted: "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]",
  forbidden: "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]",
  warning:   "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]",
  neutral:   "bg-[#F1F5F9] text-[#64748B] border border-[#E2EAF0]",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold font-[family-name:var(--font-heading)] tracking-wide",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
