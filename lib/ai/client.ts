import OpenAI from "openai";

export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
// Provide a placeholder key so that the constructor does not throw in test
// environments where OPENAI_API_KEY is not set. Actual calls will fail with an
// auth error, but that path is always mocked in unit tests.
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "placeholder" });
