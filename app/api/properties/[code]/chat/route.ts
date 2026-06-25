import { NextResponse } from "next/server";
import { z } from "zod";
import { findPropertyByCode } from "@/lib/db/property.repository";
import { getOrCreateExperienceGuide } from "@/lib/ai/generate-experience-guide";
import { streamChatResponse } from "@/lib/ai/chat";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Protects the OpenAI-backed endpoint from abuse: max 20 messages/minute per IP.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

const messagesSchema = z
  .array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000),
    }),
  )
  .min(1)
  .max(50);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  const limit = rateLimit(`chat:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Muitas mensagens em sequência. Aguarde um momento e tente novamente." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

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
    const guide = await getOrCreateExperienceGuide(property).catch((err) => {
      console.error(`[chat] guide generation failed for ${code}:`, err);
      return null;
    });
    const stream = streamChatResponse({ property, guide, messages });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error(`[chat] request failed for ${code}:`, err);
    return NextResponse.json(
      { error: "Falha ao processar a solicitação. Tente novamente." },
      { status: 500 },
    );
  }
}
