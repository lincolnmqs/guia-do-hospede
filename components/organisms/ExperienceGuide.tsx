"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { RefreshCw, Sparkles, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Button } from "@/components/atoms/Button";
import { SectionTitle } from "@/components/atoms/SectionTitle";
import { RestaurantCard } from "@/components/molecules/RestaurantCard";
import { AttractionCard } from "@/components/molecules/AttractionCard";
import { EssentialCard } from "@/components/molecules/EssentialCard";
import { cn } from "@/lib/cn";
import type { ExperienceGuideContent } from "@/lib/schemas/experience-guide";

interface ExperienceGuideProps {
  code: string;
}

type GuideState =
  | { status: "loading" }
  | { status: "success"; data: ExperienceGuideContent }
  | { status: "error"; message: string };

/* ─── Loading skeleton ─────────────────────────────────────────────────────── */
function GuideSkeleton() {
  return (
    <div
      data-testid="experience-guide-skeleton"
      role="status"
      aria-label="Carregando guia de experiências..."
      className="space-y-10"
    >
      {/* Welcome message skeleton */}
      <div className="rounded-[0.875rem] border border-[#E2EAF0] bg-white p-6 shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-6 w-48 rounded-md" />
        </div>
        <Skeleton className="h-4 w-full rounded-md mb-2" />
        <Skeleton className="h-4 w-5/6 rounded-md mb-2" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </div>

      {/* Cards skeleton — two sections */}
      {[
        { count: 4, label: "restaurantes" },
        { count: 3, label: "atrações" },
      ].map(({ count, label }) => (
        <section key={label} aria-label={`Carregando ${label}`}>
          <div className="mb-6 flex items-center gap-3">
            <Skeleton className="h-7 w-36 rounded-md" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className="rounded-[0.875rem] border border-[#E2EAF0] bg-white p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/3 rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-5/6 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Seasonal tip skeleton */}
      <div className="rounded-[0.875rem] border border-[#E2EAF0] bg-[#F7F9FB] p-5">
        <Skeleton className="h-4 w-32 rounded-md mb-3" />
        <Skeleton className="h-3 w-full rounded-md mb-2" />
        <Skeleton className="h-3 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

/* ─── Error state ──────────────────────────────────────────────────────────── */
interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

function ErrorCard({ message, onRetry }: ErrorCardProps) {
  const retryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    retryRef.current?.focus();
  }, []);

  return (
    <div
      role="alert"
      className={cn(
        "rounded-[0.875rem] border border-amber-200 bg-amber-50 p-6",
        "flex flex-col items-start gap-4 sm:flex-row sm:items-center",
      )}
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100"
      >
        <AlertTriangle size={20} className="text-amber-600" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold font-[family-name:var(--font-heading)] text-amber-800 text-sm">
          Não foi possível carregar o guia
        </p>
        <p className="mt-1 text-xs text-amber-700 font-[family-name:var(--font-body)] leading-relaxed">
          {message}
        </p>
      </div>
      <Button
        ref={retryRef}
        variant="secondary"
        size="sm"
        onClick={onRetry}
        className="shrink-0 border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
      >
        <RefreshCw size={14} aria-hidden="true" />
        Tentar novamente
      </Button>
    </div>
  );
}

/* ─── Seasonal tip banner ──────────────────────────────────────────────────── */
function SeasonalTip({ tip }: { tip: string }) {
  return (
    <aside
      aria-label="Dica da temporada"
      className={cn(
        "relative overflow-hidden rounded-[0.875rem] p-5",
        "bg-gradient-to-br from-[#EBF6FA] to-[#F7F9FB]",
        "border border-[#C7E8F4]",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#54B3D4] to-[#0E7DA6]"
      />
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"
        >
          <Sparkles size={15} className="text-[#0E7DA6]" />
        </span>
        <div>
          <p className="text-xs font-semibold font-[family-name:var(--font-heading)] text-[#0E7DA6] uppercase tracking-wide mb-1">
            Dica da temporada
          </p>
          <p className="text-sm text-[#334155] font-[family-name:var(--font-body)] leading-relaxed">
            {tip}
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export function ExperienceGuide({ code }: ExperienceGuideProps) {
  const [state, setState] = useState<GuideState>({ status: "loading" });

  const fetchGuide = useCallback(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(`/api/properties/${code}/experience-guide`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.error ??
              "O guia de experiências está sendo gerado. Aguarde um momento e tente novamente.",
          );
        }
        return res.json() as Promise<ExperienceGuideContent>;
      })
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const msg =
          err instanceof Error
            ? err.message
            : "Erro inesperado ao carregar o guia.";
        setState({ status: "error", message: msg });
      });

    return controller;
  }, [code]);

  useEffect(() => {
    const controller = fetchGuide();
    return () => controller.abort();
  }, [fetchGuide]);

  if (state.status === "loading") {
    return <GuideSkeleton />;
  }

  if (state.status === "error") {
    return <ErrorCard message={state.message} onRetry={fetchGuide} />;
  }

  const { data } = state;

  return (
    <div className="space-y-10">
      {/* Welcome message */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[0.875rem] bg-white p-6",
          "border border-[#E2EAF0] shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#54B3D4] to-[#0E7DA6]"
        />
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#0E7DA6]" aria-hidden="true" />
          <span className="text-xs font-semibold font-[family-name:var(--font-heading)] text-[#0E7DA6] uppercase tracking-wider">
            Guia personalizado
          </span>
        </div>
        <p className="text-sm text-[#334155] font-[family-name:var(--font-body)] leading-relaxed">
          {data.welcome_message}
        </p>
      </div>

      {/* Restaurants */}
      {data.restaurants.length > 0 && (
        <section aria-labelledby="guide-restaurants">
          <SectionTitle id="guide-restaurants">Restaurantes</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.restaurants.map((r, i) => (
              <RestaurantCard key={i} {...r} />
            ))}
          </div>
        </section>
      )}

      {/* Attractions */}
      {data.attractions.length > 0 && (
        <section aria-labelledby="guide-attractions">
          <SectionTitle id="guide-attractions">Atrações</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.attractions.map((a, i) => (
              <AttractionCard key={i} {...a} />
            ))}
          </div>
        </section>
      )}

      {/* Essentials */}
      {data.essentials.length > 0 && (
        <section aria-labelledby="guide-essentials">
          <SectionTitle id="guide-essentials">Serviços essenciais</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.essentials.map((e, i) => (
              <EssentialCard key={i} {...e} />
            ))}
          </div>
        </section>
      )}

      {/* Seasonal tip */}
      <SeasonalTip tip={data.seasonal_tip} />
    </div>
  );
}
