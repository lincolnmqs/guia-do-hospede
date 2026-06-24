import { openai, OPENAI_MODEL } from "./client";
import { buildChatSystemPrompt } from "./prompts";
import type { PropertyWithRelations } from "@/lib/db/property.repository";
import type { ExperienceGuideContent } from "@/lib/schemas/experience-guide";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Stream builder — shapes OpenAI async-iterable into SSE ReadableStream
// ---------------------------------------------------------------------------

export async function streamChatResponse(args: {
  property: PropertyWithRelations;
  guide: ExperienceGuideContent | null;
  messages: ChatMessage[];
}): Promise<ReadableStream<Uint8Array>> {
  const { property, guide, messages } = args;

  const system = buildChatSystemPrompt(property, guide);

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    stream: true,
    messages: [{ role: "system", content: system }, ...messages],
  });

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of completion as AsyncIterable<{
          choices: { delta: { content?: string | null } }[];
        }>) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ token })}\n\n`),
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido no stream";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`),
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });
}
