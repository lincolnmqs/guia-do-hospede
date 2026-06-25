import { Skeleton } from "@/components/atoms/Skeleton";

export default function LandingLoading() {
  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E2EAF0] sticky top-0 z-20 shadow-[0_1px_4px_0_rgb(14_125_166_/_0.06)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-[family-name:var(--font-heading)] font-bold text-[#0E7DA6] text-lg tracking-tight">
            Seazone
          </span>
          <span className="text-xs text-[#64748B] font-[family-name:var(--font-body)] hidden sm:block">
            Guia Digital do Hóspede
          </span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0A5F80] via-[#0E7DA6] to-[#54B3D4] py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center gap-6">
            <Skeleton className="h-6 w-48 rounded-full bg-white/20" />
            <Skeleton className="h-12 w-80 sm:w-[28rem] rounded-lg bg-white/20" />
            <Skeleton className="h-5 w-64 rounded-md bg-white/20" />
            <Skeleton className="h-12 w-36 rounded-lg bg-white/20" />
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-[0.875rem] bg-white border border-[#E2EAF0] p-6 shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]"
              >
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
              </div>
            ))}
          </div>
        </section>

        {/* Property cards */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-20">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 rounded-md mb-2" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-5 rounded-[0.875rem] bg-white border border-[#E2EAF0] p-6 shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]"
              >
                <div className="flex items-start justify-between">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24 rounded-md" />
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-4/5 rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#E2EAF0]">
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
