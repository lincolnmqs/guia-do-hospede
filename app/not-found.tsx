import Link from "next/link";
import { MapPin, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E2EAF0]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center">
          <span className="font-[family-name:var(--font-heading)] font-bold text-[#00143D] text-lg tracking-tight">
            Seazone
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          {/* Icon cluster */}
          <div className="relative mx-auto mb-8 w-28 h-28 flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full bg-[#EEF2F8] opacity-60" />
            {/* Inner ring */}
            <div className="absolute inset-4 rounded-full bg-[#C0CBE6] opacity-70" />
            {/* Icon */}
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#00143D] shadow-[0_4px_16px_0_rgb(0_20_61_/_0.35)]">
              <MapPin className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            {/* Decorative compass */}
            <div className="absolute -top-1 -right-1 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#E2EAF0] shadow-sm">
              <Compass className="w-4 h-4 text-[#00143D]" aria-hidden="true" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-[family-name:var(--font-heading)] font-bold text-3xl text-[#1F2933] mb-3 tracking-tight">
            Imóvel não encontrado
          </h1>

          {/* Description */}
          <p className="font-[family-name:var(--font-body)] text-[#64748B] text-base leading-relaxed mb-2">
            O código do imóvel que você buscou pode estar incorreto ou o guia
            pode não estar mais disponível.
          </p>
          <p className="font-[family-name:var(--font-body)] text-[#64748B] text-sm leading-relaxed mb-10">
            Verifique o código com o seu anfitrião e tente novamente.
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[0.5rem] bg-[#00143D] px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_8px_0_rgb(0_20_61_/_0.25)] transition-all hover:bg-[#00143D] hover:shadow-[0_4px_16px_0_rgb(0_20_61_/_0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00143D]"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar ao início
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2EAF0] bg-white py-6">
        <p className="text-center text-xs text-[#94A3B8] font-[family-name:var(--font-body)]">
          © {new Date().getFullYear()} Seazone — Guia Digital do Hóspede
        </p>
      </footer>
    </div>
  );
}
