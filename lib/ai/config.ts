// Pure configuration constants for the AI layer. Kept separate from `client.ts`
// (the OpenAI singleton) so modules that only need the model name — e.g. the
// orchestration layer — don't transitively import a client that requires a real
// environment to construct.
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
