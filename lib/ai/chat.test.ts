import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock the OpenAI client — must be hoisted before importing the module under test
// ---------------------------------------------------------------------------

const createMock = vi.fn();

vi.mock("./client", () => ({
  openai: { chat: { completions: { create: (...a: any[]) => createMock(...a) } } },
  OPENAI_MODEL: "gpt-4o-mini",
}));

// Also mock prompts so we don't need a full PropertyWithRelations stub
vi.mock("./prompts", () => ({
  buildChatSystemPrompt: () => "SYSTEM_PROMPT",
}));

import { streamChatResponse } from "./chat";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeAsyncIterable(
  chunks: { choices: { delta: { content?: string } }[] }[],
) {
  return {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        async next() {
          if (i < chunks.length) {
            return { value: chunks[i++], done: false };
          }
          return { value: undefined, done: true };
        },
      };
    },
  };
}

async function readStream(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
}

// Minimal property stub
const property: any = { id: "p1", code: "FLN001", name: "Test Property" };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("streamChatResponse", () => {
  beforeEach(() => vi.clearAllMocks());

  it("emits SSE token frames for each delta and terminates with [DONE]", async () => {
    createMock.mockResolvedValue(
      makeAsyncIterable([
        { choices: [{ delta: { content: "Olá" } }] },
        { choices: [{ delta: { content: " mundo" } }] },
      ]),
    );

    const stream = streamChatResponse({
      property,
      guide: null,
      messages: [{ role: "user", content: "oi" }],
    });

    const output = await readStream(stream);

    expect(output).toContain(`data: ${JSON.stringify({ token: "Olá" })}`);
    expect(output).toContain(`data: ${JSON.stringify({ token: " mundo" })}`);
    expect(output).toContain("data: [DONE]");
  });

  it("skips chunks with no delta content", async () => {
    createMock.mockResolvedValue(
      makeAsyncIterable([
        { choices: [{ delta: {} }] },
        { choices: [{ delta: { content: "Oi" } }] },
        { choices: [] },
      ]),
    );

    const stream = streamChatResponse({
      property,
      guide: null,
      messages: [{ role: "user", content: "oi" }],
    });

    const output = await readStream(stream);

    // Only one token frame, no empty ones
    expect(output).toContain(`data: ${JSON.stringify({ token: "Oi" })}`);
    expect(output).not.toContain('"token":""');
    expect(output).toContain("data: [DONE]");
  });

  it("calls openai.chat.completions.create with system message prepended", async () => {
    createMock.mockResolvedValue(makeAsyncIterable([]));

    const stream = streamChatResponse({
      property,
      guide: null,
      messages: [{ role: "user", content: "oi" }],
    });

    // Must consume the stream to trigger start()
    await readStream(stream);

    expect(createMock).toHaveBeenCalledTimes(1);
    const call = createMock.mock.calls[0][0];
    expect(call.stream).toBe(true);
    expect(call.messages[0]).toEqual({ role: "system", content: "SYSTEM_PROMPT" });
    expect(call.messages[1]).toEqual({ role: "user", content: "oi" });
  });

  it("emits error SSE event and [DONE] when the stream throws mid-way", async () => {
    async function* errorIterable() {
      yield { choices: [{ delta: { content: "Olá" } }] };
      throw new Error("network failure");
    }

    createMock.mockResolvedValue(errorIterable());

    const stream = streamChatResponse({
      property,
      guide: null,
      messages: [{ role: "user", content: "oi" }],
    });

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const output = await readStream(stream);
    errorSpy.mockRestore();

    // The guest gets a generic message — the raw cause must NOT leak.
    expect(output).toContain("Não consegui responder agora");
    expect(output).not.toContain("network failure");
    expect(output).toContain("data: [DONE]");
  });

  it("emits error SSE event and [DONE] when openai.create rejects (pre-stream auth error)", async () => {
    createMock.mockRejectedValue(new Error("401 Unauthorized"));

    const stream = streamChatResponse({
      property,
      guide: null,
      messages: [{ role: "user", content: "oi" }],
    });

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const output = await readStream(stream);
    errorSpy.mockRestore();

    // Internal auth/infra details must never reach the client.
    expect(output).toContain("Não consegui responder agora");
    expect(output).not.toContain("401 Unauthorized");
    expect(output).toContain("data: [DONE]");
  });
});
