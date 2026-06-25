import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/atoms/Skeleton";

export default function GuideLoading() {
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      {/* Header — static, renders immediately */}
      <header className="bg-white border-b border-[#E2EAF0] sticky top-0 z-20 shadow-[0_1px_4px_0_rgb(0_20_61_/_0.06)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Voltar para a página inicial"
            className="group flex items-center gap-2 rounded-md -ml-1 px-1 py-1 transition-colors hover:bg-[#F7F9FB]"
          >
            <ArrowLeft size={18} aria-hidden="true" className="text-[#64748B]" />
            <span className="font-[family-name:var(--font-heading)] font-bold text-[#00143D] text-lg tracking-tight">
              Seazone
            </span>
          </Link>
          <span className="text-xs text-[#64748B] font-[family-name:var(--font-body)] hidden sm:block">
            Guia do Hóspede
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-10">
        {/* Gallery skeleton */}
        <div className="overflow-hidden rounded-[0.875rem]">
          {/* Mobile */}
          <Skeleton className="sm:hidden w-full h-72 rounded-[0.875rem]" />
          {/* Desktop */}
          <div className="hidden sm:grid gap-2 h-[420px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
            <Skeleton className="rounded-l-[0.875rem] h-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="flex-1 rounded-tr-[0.875rem]" />
              <Skeleton className="flex-1 rounded-br-[0.875rem]" />
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Left column */}
          <div className="space-y-10 min-w-0">
            {/* Property title + details */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-64 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
              <div className="flex flex-wrap gap-2 pt-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-4/6 rounded-md" />
            </div>

            <div className="h-px bg-[#E2EAF0]" aria-hidden="true" />

            {/* Access info */}
            <SectionSkeleton rows={3} />

            <div className="h-px bg-[#E2EAF0]" aria-hidden="true" />

            {/* Stay rules */}
            <SectionSkeleton rows={4} />

            <div className="h-px bg-[#E2EAF0]" aria-hidden="true" />

            {/* Contact */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 rounded-md" />
              <div className="rounded-[0.875rem] border border-[#E2EAF0] bg-white p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:sticky lg:top-[4.5rem] rounded-[0.875rem] border border-[#E2EAF0] bg-white overflow-hidden">
            <div className="p-4 border-b border-[#E2EAF0]">
              <Skeleton className="h-5 w-40 rounded-md" />
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
            <div className="p-4 border-t border-[#E2EAF0]">
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40 rounded-md" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded-md shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
