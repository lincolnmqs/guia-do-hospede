"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  SSE_DATA_PREFIX,
  SSE_FRAME_DELIMITER,
  SSE_DONE,
} from "@/lib/ai/sse";

export interface ChatStreamMessage {
  role: "user" | "assistant";
  content: string;
}

interface UseChatStreamOptions {
  code: string;
}

interface UseChatStreamReturn {
  messages: ChatStreamMessage[];
  isStreaming: boolean;
  sendMessage: (text: string) => Promise<void>;
}

export function useChatStream({ code }: UseChatStreamOptions): UseChatStreamReturn {
  const [messages, setMessages] = useState<ChatStreamMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Mirror the latest values into refs so `sendMessage` can read them without
  // listing them as dependencies — that keeps its identity stable across the
  // many `messages` updates streaming produces (otherwise it'd be recreated on
  // every token, defeating any future memoization of the consuming component).
  const messagesRef = useRef(messages);
  const isStreamingRef = useRef(isStreaming);
  useEffect(() => {
    messagesRef.current = messages;
    isStreamingRef.current = isStreaming;
  });

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreamingRef.current) return;

      const userMessage: ChatStreamMessage = { role: "user", content: text };
      const nextMessages: ChatStreamMessage[] = [...messagesRef.current, userMessage];

      setMessages(nextMessages);
      setIsStreaming(true);

      // Placeholder for the in-progress assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const response = await fetch(`/api/properties/${code}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
        });

        if (!response.ok || !response.body) {
          const errorText = await response.text().catch(() => "");
          let friendly = "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.";
          try {
            const parsed = JSON.parse(errorText);
            if (parsed?.error) friendly = parsed.error;
          } catch {
            // ignore parse error, use default message
          }
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: friendly };
            return updated;
          });
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process all complete SSE frames (terminated by the frame delimiter)
          let boundary: number;
          while ((boundary = buffer.indexOf(SSE_FRAME_DELIMITER)) !== -1) {
            const frame = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + SSE_FRAME_DELIMITER.length);

            for (const line of frame.split("\n")) {
              if (!line.startsWith(SSE_DATA_PREFIX)) continue;
              const payload = line.slice(SSE_DATA_PREFIX.length).trim();

              if (payload === SSE_DONE) {
                // Stream complete — finalize (no-op, content already accumulated)
                break;
              }

              try {
                const parsed = JSON.parse(payload);

                if (parsed.error) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: `⚠ ${parsed.error}`,
                    };
                    return updated;
                  });
                  break;
                }

                if (typeof parsed.token === "string") {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + parsed.token,
                    };
                    return updated;
                  });
                }
              } catch {
                // Malformed JSON frame — skip silently
              }
            }
          }
        }
      } catch (err) {
        const isAbort = err instanceof DOMException && err.name === "AbortError";
        if (!isAbort) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content:
                "Sem conexão no momento. Verifique sua internet e tente novamente.",
            };
            return updated;
          });
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [code],
  );

  return { messages, isStreaming, sendMessage };
}
