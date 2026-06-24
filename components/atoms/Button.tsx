import { cn } from "@/lib/cn";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   "bg-[#0E7DA6] hover:bg-[#0A5F80] active:bg-[#0A5F80] text-white shadow-sm hover:shadow-md",
  secondary: "bg-white hover:bg-[#F7F9FB] border border-[#E2EAF0] text-[#0E7DA6] hover:border-[#54B3D4]",
  ghost:     "bg-transparent hover:bg-[#EBF6FA] text-[#0E7DA6]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", children, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-[family-name:var(--font-heading)]",
        "transition-all duration-150 cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-[#54B3D4] focus-visible:outline-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
