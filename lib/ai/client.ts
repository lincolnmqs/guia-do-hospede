import OpenAI from "openai";

// Provide a placeholder key so the constructor never throws when the key is
// missing OR empty (docker-compose passes OPENAI_API_KEY as "" when the host
// var is unset). `||` (not `??`) treats an empty string as absent, so the
// client constructs cleanly and a real request fails later with a caught auth
// error (502 / SSE error frame) instead of a hard 500 at module load.
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "placeholder" });
