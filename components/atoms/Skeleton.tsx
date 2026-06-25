import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SkeletonProps = ComponentPropsWithoutRef<"div">;

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-[#E2EAF0] via-[#F0F5F8] to-[#E2EAF0] bg-[length:200%_100%]",
        className,
      )}
      style={{
        animation: "skeleton-shimmer 1.5s ease-in-out infinite",
      }}
      {...rest}
    />
  );
}
