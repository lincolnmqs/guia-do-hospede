"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real cause in server/browser logs for diagnosis (e.g. a DB
    // connection failure) without exposing internals to the guest.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      <header className="bg-white border-b border-[#E2EAF0]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center">
          <span className="font-[family-name:var(--font-heading)] font-bold text-[#0E7DA6] text-lg tracking-tight">
            Seazone
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto mb-8 w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-100 opacity-60" />
            <div className="absolute inset-4 rounded-full bg-amber-200 opacity-70" />
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-amber-500 shadow-[0_4px_16px_0_rgb(217_119_6_/_0.35)]">
              <AlertTriangle className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl text-[#1F2933] mb-3 tracking-tight">
            Algo deu errado
          </h1>

          <p className="font-[family-name:var(--font-body)] text-[#64748B] text-base leading-relaxed mb-2">
            Não conseguimos carregar o seu guia neste momento. Isso costuma ser
            temporário.
          </p>
          <p className="font-[family-name:var(--font-body)] text-[#64748B] text-sm leading-relaxed mb-10">
            Tente novamente em instantes. Se o problema continuar, fale com o seu
            anfitrião.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-[0.5rem] bg-[#0E7DA6] px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_8px_0_rgb(14_125_166_/_0.25)] transition-all hover:bg-[#0A5F80] hover:shadow-[0_4px_16px_0_rgb(14_125_166_/_0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#54B3D4]"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Tentar novamente
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-[0.5rem] border border-[#E2EAF0] bg-white px-6 py-3 text-sm font-semibold text-[#0E7DA6] transition-all hover:bg-[#F7F9FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#54B3D4]"
              aria-label="Voltar para a página inicial"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#E2EAF0] bg-white py-6">
        <p className="text-center text-xs text-[#94A3B8] font-[family-name:var(--font-body)]">
          © {new Date().getFullYear()} Seazone — Guia Digital do Hóspede
        </p>
      </footer>
    </div>
  );
}
