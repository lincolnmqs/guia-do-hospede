import { cn } from "@/lib/cn";

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  id?: string;
}

export function SectionTitle({ children, subtitle, className, id }: SectionTitleProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2
        id={id}
        className={cn(
          "font-[family-name:var(--font-heading)] font-700 text-xl sm:text-2xl text-[#0A5F80]",
          "tracking-tight leading-tight",
        )}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-[#64748B] font-[family-name:var(--font-body)]">
          {subtitle}
        </p>
      )}
      <div
        aria-hidden="true"
        className="mt-3 h-0.5 w-10 rounded-full bg-[#54B3D4]"
      />
    </div>
  );
}
