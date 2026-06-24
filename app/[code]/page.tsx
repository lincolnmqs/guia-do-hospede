import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findPropertyByCode } from "@/lib/db/property.repository";
import { GuidePageTemplate } from "@/components/templates/GuidePageTemplate";
import { ExperienceGuide } from "@/components/organisms/ExperienceGuide";
import { ChatAssistant } from "@/components/organisms/ChatAssistant";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;

  // Metadata must never crash the request — if the database is unreachable,
  // fall back to a generic title and let the page render the error boundary.
  try {
    const property = await findPropertyByCode(code);

    if (!property) {
      return {
        title: "Imóvel não encontrado · Guia do Hóspede",
      };
    }

    return {
      title: `${property.name} · Guia do Hóspede`,
      description: `Seu guia digital completo para ${property.name}. Tudo que você precisa para uma estadia perfeita.`,
    };
  } catch {
    return { title: "Guia do Hóspede" };
  }
}

export default async function GuidePage({ params }: Props) {
  const { code } = await params;
  const property = await findPropertyByCode(code);

  if (!property) {
    notFound();
  }

  return (
    <GuidePageTemplate
      property={property}
      experienceSlot={<ExperienceGuide code={property.code} />}
      chatSlot={<ChatAssistant code={property.code} />}
    />
  );
}
