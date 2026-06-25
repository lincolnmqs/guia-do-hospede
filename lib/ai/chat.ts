import { openai } from "./client";
import { OPENAI_MODEL } from "./config";
import { buildChatSystemPrompt } from "./prompts";
import { sseFrame, sseDoneFrame } from "./sse";
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
// Stream builder — shapes OpenAI async-iterable into SSE ReadableStream.
// The OpenAI call is initiated INSIDE start() so any auth/connection error
// surfaces as a framed SSE error event instead of a JSON 500.
// ---------------------------------------------------------------------------

export function streamChatResponse(args: {
  property: PropertyWithRelations;
  guide: ExperienceGuideContent | null;
  messages: ChatMessage[];
}): ReadableStream<Uint8Array> {
  const { property, guide, messages } = args;

  const system = buildChatSystemPrompt(property, guide);
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: OPENAI_MODEL,
          stream: true,
          messages: [{ role: "system", content: system }, ...messages],
        });

        for await (const chunk of completion as AsyncIterable<{
          choices: { delta: { content?: string | null } }[];
        }>) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) {
            controller.enqueue(encoder.encode(sseFrame({ token })));
          }
        }
        controller.enqueue(encoder.encode(sseDoneFrame()));
      } catch (err) {
        // Log the real cause server-side for diagnosis, but never leak internal
        // error details (OpenAI/infra messages) to the guest's browser.
        console.error("[chat] stream failed:", err);
        controller.enqueue(
          encoder.encode(
            sseFrame({
              error:
                "Não consegui responder agora. Tente novamente em instantes.",
            }),
          ),
        );
        controller.enqueue(encoder.encode(sseDoneFrame()));
      } finally {
        controller.close();
      }
    },
  });
}
