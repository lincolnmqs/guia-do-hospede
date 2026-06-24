import Link from "next/link";
import { MapPin, Waves, Mountain, ArrowRight, Sparkles, MessageSquare, BookOpen } from "lucide-react";

const DEMO_PROPERTIES = [
  {
    code: "FLN001",
    name: "Apartamento Beira-Mar",
    location: "Florianópolis, SC",
    description:
      "Vista para o oceano Atlântico, a poucos passos da praia. Experiência completa de sol e mar em Santa Catarina.",
    icon: Waves,
    accent: "#0E7DA6",
    accentLight: "#E0F4FB",
    tag: "Praia",
  },
  {
    code: "GRM001",
    name: "Chalé Serra",
    location: "Gramado, RS",
    description:
      "Aconchego na Serra Gaúcha, entre pinheiros e charme europeu. Perfeito para relaxar e explorar a natureza.",
    icon: Mountain,
    accent: "#16A34A",
    accentLight: "#DCFCE7",
    tag: "Serra",
  },
] as const;

const FEATURES = [
  {
    icon: BookOpen,
    title: "Guia completo",
    description: "Check-in, wifi, regras e tudo que você precisa saber sobre o imóvel.",
  },
  {
    icon: Sparkles,
    title: "Dicas locais com IA",
    description: "Restaurantes, atrações e essenciais da região, curados especialmente para você.",
  },
  {
    icon: MessageSquare,
    title: "Assistente 24h",
    description: "Tire dúvidas a qualquer hora com nosso assistente virtual inteligente.",
  },
] as const;

export default function LandingPage() {
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
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-[#0A5F80] via-[#0E7DA6] to-[#54B3D4] text-white"
          aria-label="Apresentação"
        >
          {/* Decorative wave shapes */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            {/* Large subtle circle top-right */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
            {/* Small circle bottom-left */}
            <div className="absolute bottom-0 -left-12 w-64 h-64 rounded-full bg-white/5" />
            {/* Thin wave line */}
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1440 56"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 56 C360 10 1080 10 1440 56 L1440 56 L0 56Z"
                fill="#F7F9FB"
              />
            </svg>
          </div>

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/90 mb-6 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              Tudo sobre a sua estadia
            </div>

            <h1 className="font-[family-name:var(--font-heading)] font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-6">
              Seu Guia Digital
              <br />
              do Hóspede
            </h1>

            <p className="font-[family-name:var(--font-body)] text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Tudo que você precisa para uma estadia perfeita — informações do
              imóvel, dicas locais e assistente virtual disponíveis a qualquer
              hora.
            </p>

            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-[0.5rem] bg-white text-[#0E7DA6] px-7 py-3.5 text-sm font-bold shadow-[0_4px_16px_0_rgb(0_0_0_/_0.15)] transition-all hover:bg-[#F0FAFF] hover:shadow-[0_6px_24px_0_rgb(0_0_0_/_0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Ver exemplos
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* ── Features ── */}
        <section
          className="mx-auto max-w-5xl px-4 sm:px-6 py-16"
          aria-label="Recursos"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-[0.875rem] bg-white border border-[#E2EAF0] p-6 shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E0F4FB]">
                  <Icon className="w-5 h-5 text-[#0E7DA6]" aria-hidden="true" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-[#1F2933] text-base">
                  {title}
                </h2>
                <p className="font-[family-name:var(--font-body)] text-[#64748B] text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Demo Properties ── */}
        <section
          id="demo"
          className="mx-auto max-w-5xl px-4 sm:px-6 pb-20"
          aria-label="Imóveis de demonstração"
        >
          {/* Section heading */}
          <div className="mb-8 text-center sm:text-left">
            <h2 className="font-[family-name:var(--font-heading)] font-bold text-[#1F2933] text-2xl sm:text-3xl tracking-tight mb-2">
              Experimente agora
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[#64748B] text-base">
              Acesse um guia de demonstração e veja como funciona na prática.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {DEMO_PROPERTIES.map(
              ({ code, name, location, description, icon: Icon, accent, accentLight, tag }) => (
                <Link
                  key={code}
                  href={`/${code}`}
                  className="group relative flex flex-col gap-5 rounded-[0.875rem] bg-white border border-[#E2EAF0] p-6 shadow-[0_2px_12px_0_rgb(14_125_166_/_0.07)] transition-all hover:shadow-[0_8px_24px_0_rgb(14_125_166_/_0.13)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#54B3D4]"
                  aria-label={`Abrir guia: ${name}, ${location}`}
                >
                  {/* Icon + Tag row */}
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: accentLight }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: accent }}
                        aria-hidden="true"
                      />
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ backgroundColor: accentLight, color: accent }}
                    >
                      {tag}
                    </span>
                  </div>

                  {/* Property info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
                      <span className="text-xs text-[#64748B] font-[family-name:var(--font-body)]">
                        {location}
                      </span>
                    </div>
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#1F2933] text-xl mb-2">
                      {name}
                    </h3>
                    <p className="font-[family-name:var(--font-body)] text-[#64748B] text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Code + Arrow */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E2EAF0]">
                    <span className="font-mono text-xs text-[#94A3B8] tracking-wider">
                      {code}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold transition-colors group-hover:gap-2"
                      style={{ color: accent }}
                      aria-hidden="true"
                    >
                      Abrir guia
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2EAF0] bg-white py-8">
        <p className="text-center text-xs text-[#94A3B8] font-[family-name:var(--font-body)]">
          © {new Date().getFullYear()} Seazone — Guia Digital do Hóspede
        </p>
      </footer>
    </div>
  );
}
