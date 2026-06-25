import { cn } from "@/lib/cn";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  className?: string;
}

export function ChatMessage({ role, content, className }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      data-role={role}
      className={cn(
        "flex gap-3",
        isAssistant ? "flex-row" : "flex-row-reverse",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-xs",
          isAssistant
            ? "bg-gradient-to-br from-[#00143D] to-[#00143D]"
            : "bg-[#E2EAF0]",
        )}
      >
        {isAssistant ? (
          <Bot size={14} className="text-white" />
        ) : (
          <User size={14} className="text-[#64748B]" />
        )}
      </span>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed font-[family-name:var(--font-body)]",
          isAssistant
            ? "rounded-tl-sm bg-white border border-[#E2EAF0] text-[#1F2933] shadow-[0_2px_8px_0_rgb(0_20_61_/_0.06)]"
            : "rounded-tr-sm bg-[#00143D] text-white",
        )}
      >
        {content}
      </div>
    </div>
  );
}
