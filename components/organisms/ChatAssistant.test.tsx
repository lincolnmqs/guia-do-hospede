import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ChatAssistant } from "./ChatAssistant";

const mockUseChatStream = vi.fn();
vi.mock("@/lib/hooks/useChatStream", () => ({
  useChatStream: () => mockUseChatStream(),
}));

beforeAll(() => {
  // jsdom implements neither scrollIntoView nor Element.scrollTo (used by the
  // chat auto-scroll effect) — stub them so rendering doesn't throw.
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.scrollTo = vi.fn();
});

afterEach(cleanup);

describe("ChatAssistant", () => {
  it("does not render an empty assistant bubble while streaming — only the typing indicator", () => {
    mockUseChatStream.mockReturnValue({
      messages: [
        { role: "user", content: "oi" },
        { role: "assistant", content: "" }, // streaming placeholder
      ],
      isStreaming: true,
      sendMessage: vi.fn(),
    });

    const { container } = render(<ChatAssistant code="FLN001" />);

    // the user's message renders
    expect(container.querySelectorAll('[data-role="user"]')).toHaveLength(1);
    // the empty assistant placeholder must NOT render as a (blank) bubble
    expect(container.querySelectorAll('[data-role="assistant"]')).toHaveLength(0);
    // the in-progress answer is represented by the typing indicator instead
    expect(
      screen.getByRole("status", { name: /digitando/i }),
    ).toBeInTheDocument();
  });

  it("renders a single assistant bubble once it has content, with no typing indicator", () => {
    mockUseChatStream.mockReturnValue({
      messages: [
        { role: "user", content: "oi" },
        { role: "assistant", content: "Olá! Tudo bem?" },
      ],
      isStreaming: false,
      sendMessage: vi.fn(),
    });

    const { container } = render(<ChatAssistant code="FLN001" />);

    expect(container.querySelectorAll('[data-role="assistant"]')).toHaveLength(1);
    expect(screen.getByText("Olá! Tudo bem?")).toBeInTheDocument();
    expect(
      screen.queryByRole("status", { name: /digitando/i }),
    ).not.toBeInTheDocument();
  });
});
