// ---------------------------------------------------------------------------
// Shared SSE wire contract for the chat stream.
//
// The single source of truth for the frame format used by both the producer
// (lib/ai/chat.ts, server) and the consumer (lib/hooks/useChatStream.ts,
// browser). Only pure constants/helpers live here so it is safe to import from
// either side of the network boundary.
// ---------------------------------------------------------------------------

export const SSE_DATA_PREFIX = "data:";
export const SSE_FRAME_DELIMITER = "\n\n";
export const SSE_DONE = "[DONE]";

/** Encode a JSON payload as a single SSE `data:` frame. */
export function sseFrame(payload: unknown): string {
  return `${SSE_DATA_PREFIX} ${JSON.stringify(payload)}${SSE_FRAME_DELIMITER}`;
}

/** Encode the terminal `[DONE]` sentinel frame. */
export function sseDoneFrame(): string {
  return `${SSE_DATA_PREFIX} ${SSE_DONE}${SSE_FRAME_DELIMITER}`;
}
