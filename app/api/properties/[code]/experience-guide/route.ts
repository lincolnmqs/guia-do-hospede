import { NextResponse } from "next/server";
import { findPropertyByCode } from "@/lib/db/property.repository";
import { getOrCreateExperienceGuide } from "@/lib/ai/generate-experience-guide";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const property = await findPropertyByCode(code);

  if (!property) {
    return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
  }

  try {
    const guide = await getOrCreateExperienceGuide(property);
    return NextResponse.json(guide);
  } catch {
    return NextResponse.json(
      { error: "Falha ao gerar o guia. Tente novamente." },
      { status: 502 },
    );
  }
}
