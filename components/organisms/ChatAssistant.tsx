"use client";

import { useEffect, useRef } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { ChatMessage } from "@/components/molecules/ChatMessage";
import { ChatInput } from "@/components/molecules/ChatInput";
import { useChatStream } from "@/lib/hooks/useChatStream";
import { cn } from "@/lib/cn";

/* ─── Suggested starter questions ─────────────────────────────────────────── */
const SUGGESTED_QUESTIONS = [
  "Qual a senha do WiFi?",
  "Posso trazer meu cachorro?",
  "A que horas posso fazer check-in?",
  "Que restaurantes tem perto?",
] as const;

/* ─── Typing indicator ─────────────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="Assistente digitando..."
      className="flex items-center gap-3"
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00143D] to-[#00143D] text-white"
      >
        <Sparkles size={13} />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-[#E2EAF0] bg-white px-4 py-3 shadow-[0_2px_8px_0_rgb(0_20_61_/_0.06)]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#00143D]"
            style={{
              animation: "sz-bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes sz-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Empty / intro state ──────────────────────────────────────────────────── */
interface EmptyStateProps {
  onSuggestion: (q: string) => void;
}

function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 px-2 py-10 text-center">
      {/* Icon + heading */}
      <div className="flex flex-col items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            "bg-gradient-to-br from-[#FC5A54] to-[#00143D] shadow-[0_4px_16px_0_rgb(252_90_84_/_0.25)]",
          )}
        >
          <MessageCircle size={26} className="text-white" />
        </span>
        <div>
          <p className="font-[family-name:var(--font-heading)] text-base font-bold text-[#1F2933]">
            Olá! Sou seu assistente de estadia.
          </p>
          <p className="mt-1 text-sm font-[family-name:var(--font-body)] text-[#64748B] leading-relaxed">
            Tire dúvidas sobre o imóvel, regras, check-in e muito mais.
          </p>
        </div>
      </div>

      {/* Suggested question chips */}
      <div
        role="list"
        aria-label="Sugestões de perguntas"
        className="flex flex-wrap justify-center gap-2"
      >
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            role="listitem"
            type="button"
            onClick={() => onSuggestion(q)}
            className={cn(
              "rounded-full border border-[#D0D8ED] bg-[#EEF2F8] px-4 py-2",
              "text-sm font-[family-name:var(--font-body)] text-[#00143D]",
              "transition-all duration-150 hover:bg-[#00143D] hover:border-[#00143D] hover:text-white",
              "focus-visible:outline-2 focus-visible:outline-[#00143D] focus-visible:outline-offset-2",
              "cursor-pointer active:scale-95",
            )}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── ChatAssistant ────────────────────────────────────────────────────────── */
interface ChatAssistantProps {
  code: string;
}

export function ChatAssistant({ code }: ChatAssistantProps) {
  const { messages, isStreaming, sendMessage } = useChatStream({ code });
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message — but only once a conversation has
  // started, and only the chat's own scroll container (never the page, which
  // on mobile would yank the whole page down to the chat on load).
  useEffect(() => {
    if (messages.length === 0) return;
    const list = listRef.current;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  const isEmpty = messages.length === 0;

  return (
    <section
      aria-label="Assistente de estadia"
      className={cn(
        "flex flex-col rounded-[0.875rem] border border-[#E2EAF0] bg-white",
        "shadow-[0_2px_12px_0_rgb(0_20_61_/_0.07)]",
        "overflow-hidden",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-3 border-b border-[#E2EAF0] px-5 py-4",
          "bg-gradient-to-r from-[#EEF2F8] to-white",
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00143D] to-[#00143D]"
        >
          <MessageCircle size={15} className="text-white" />
        </span>
        <div>
          <p className="font-[family-name:var(--font-heading)] text-sm font-bold text-[#1F2933]">
            Assistente Seazone
          </p>
          <p className="text-xs font-[family-name:var(--font-body)] text-[#64748B]">
            Pergunte sobre sua estadia
          </p>
        </div>
        {isStreaming && (
          <span
            aria-hidden="true"
            className="ml-auto flex items-center gap-1.5 text-xs font-[family-name:var(--font-body)] text-[#00143D]"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00143D]" />
            Respondendo...
          </span>
        )}
      </div>

      {/* Message list */}
      <div
        ref={listRef}
        aria-live="polite"
        aria-label="Conversa com o assistente"
        className="flex min-h-[280px] flex-1 flex-col gap-4 overflow-y-auto px-5 py-5"
        style={{ maxHeight: "420px" }}
      >
        {isEmpty ? (
          <EmptyState onSuggestion={sendMessage} />
        ) : (
          messages.map((msg, i) =>
            // The empty trailing assistant message is the streaming placeholder —
            // it is represented by the TypingIndicator below, not an empty bubble.
            msg.role === "assistant" && msg.content === "" ? null : (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ),
          )
        )}

        {/* Typing indicator shown while streaming and the last assistant message is still empty */}
        {isStreaming &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "assistant" &&
          messages[messages.length - 1].content === "" && (
            <TypingIndicator />
          )}
      </div>

      {/* Input area */}
      <div className="border-t border-[#E2EAF0] bg-[#F7F9FB] px-4 py-4">
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </section>
  );
}
