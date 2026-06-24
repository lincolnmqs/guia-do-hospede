"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Pergunte algo sobre a estadia...",
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-end gap-2 rounded-xl border border-[#E2EAF0] bg-white p-2 shadow-sm",
        "focus-within:border-[#54B3D4] focus-within:shadow-[0_0_0_3px_rgb(84_179_212_/_0.15)]",
        "transition-all duration-150",
        className,
      )}
    >
      <textarea
        aria-label="Mensagem"
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "min-h-[36px] max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5",
          "text-sm text-[#1F2933] placeholder:text-[#94A3B8]",
          "font-[family-name:var(--font-body)] leading-relaxed",
          "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        )}
        style={{ fieldSizing: "content" } as React.CSSProperties}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Enviar mensagem"
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          "bg-[#0E7DA6] text-white transition-all duration-150",
          "hover:bg-[#0A5F80] active:scale-95",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "focus-visible:outline-2 focus-visible:outline-[#54B3D4] focus-visible:outline-offset-2",
        )}
      >
        <Send size={15} aria-hidden="true" />
      </button>
    </form>
  );
}
