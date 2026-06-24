import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChatMessage } from "./ChatMessage";

describe("ChatMessage", () => {
  it("renders the message content", () => {
    render(<ChatMessage role="assistant" content="Olá" />);
    expect(screen.getByText("Olá")).toBeInTheDocument();
  });

  it("marks assistant messages with data-role=assistant", () => {
    const { container } = render(<ChatMessage role="assistant" content="Olá" />);
    const root = container.firstChild as HTMLElement;
    expect(root.dataset.role).toBe("assistant");
  });

  it("marks user messages with data-role=user", () => {
    const { container } = render(<ChatMessage role="user" content="Oi!" />);
    const root = container.firstChild as HTMLElement;
    expect(root.dataset.role).toBe("user");
  });

  it("renders user message with flex-row-reverse layout", () => {
    const { container } = render(<ChatMessage role="user" content="Oi!" />);
    expect(container.firstChild).toHaveClass("flex-row-reverse");
  });
});
