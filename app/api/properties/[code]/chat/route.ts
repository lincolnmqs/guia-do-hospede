import { NextResponse } from "next/server";
import { z } from "zod";
import { findPropertyByCode } from "@/lib/db/property.repository";
import { getOrCreateExperienceGuide } from "@/lib/ai/generate-experience-guide";
import { streamChatResponse } from "@/lib/ai/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messagesSchema = z
  .array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1),
    }),
  )
  .max(50);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    const body = await req.json();
    const parsed = messagesSchema.safeParse(body.messages);
    if (!parsed.success) {
      return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
    }
    messages = parsed.data;
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 },
    );
  }

  const property = await findPropertyByCode(code);
  if (!property) {
    return NextResponse.json(
      { error: "Imóvel não encontrado." },
      { status: 404 },
    );
  }

  try {
    const guide = await getOrCreateExperienceGuide(property).catch(() => null);
    const stream = streamChatResponse({ property, guide, messages });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Falha ao processar a solicitação. Tente novamente." },
      { status: 500 },
    );
  }
}
