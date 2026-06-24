import { openai, OPENAI_MODEL } from "./client";
import { buildExperienceGuidePrompt } from "./prompts";
import {
  experienceGuideContentSchema,
  type ExperienceGuideContent,
} from "../schemas/experience-guide";
import type { PropertyWithRelations } from "../db/property.repository";

// ---------------------------------------------------------------------------
// Typed error for invalid model output
// ---------------------------------------------------------------------------

export class GuideGenerationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    // Whether re-calling the model could plausibly succeed (e.g. the model
    // returned malformed/under-spec output). Auth/transport failures are not.
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = "GuideGenerationError";
  }
}

// ---------------------------------------------------------------------------
// JSON schema that mirrors ExperienceGuideContent (for structured output)
// ---------------------------------------------------------------------------

const EXPERIENCE_GUIDE_JSON_SCHEMA = {
  type: "object",
  properties: {
    welcome_message: { type: "string" },
    restaurants: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          distance: { type: "string" },
          description: { type: "string" },
        },
        required: ["name", "distance", "description"],
        additionalProperties: false,
      },
    },
    attractions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          distance: { type: "string" },
          description: { type: "string" },
        },
        required: ["name", "distance", "description"],
        additionalProperties: false,
      },
    },
    essentials: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          distance: { type: "string" },
          description: { type: "string" },
          type: { type: "string" },
        },
        required: ["name", "distance", "description", "type"],
        additionalProperties: false,
      },
    },
    seasonal_tip: { type: "string" },
  },
  required: ["welcome_message", "restaurants", "attractions", "essentials", "seasonal_tip"],
  additionalProperties: false,
};

// ---------------------------------------------------------------------------
// Main generation function
// ---------------------------------------------------------------------------

// `strict` structured output does not enforce array length (minItems/maxItems),
// so the model can occasionally return e.g. 3 restaurants when the schema needs
// 4–5. A single bounded retry self-heals these rare under-spec responses
// without exposing a failure to the guest.
const MAX_ATTEMPTS = 2;

async function generateOnce(
  property: PropertyWithRelations,
  now: Date,
): Promise<ExperienceGuideContent> {
  const { system, user } = buildExperienceGuidePrompt(property, now);

  let rawContent: string | null = null;

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "experience_guide",
          strict: true,
          schema: EXPERIENCE_GUIDE_JSON_SCHEMA,
        },
      },
    });

    rawContent = completion.choices[0]?.message?.content ?? null;
  } catch (err) {
    // Transport/auth failure — retrying the same call won't help.
    throw new GuideGenerationError("OpenAI API call failed", err, false);
  }

  if (!rawContent) {
    throw new GuideGenerationError("OpenAI returned an empty response", undefined, true);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch (err) {
    throw new GuideGenerationError(
      `OpenAI response is not valid JSON: ${rawContent.slice(0, 200)}`,
      err,
      true,
    );
  }

  try {
    return experienceGuideContentSchema.parse(parsed);
  } catch (err) {
    throw new GuideGenerationError(
      "OpenAI response does not match expected schema",
      err,
      true,
    );
  }
}

export async function generateExperienceGuideContent(
  property: PropertyWithRelations,
  now: Date = new Date(),
): Promise<ExperienceGuideContent> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await generateOnce(property, now);
    } catch (err) {
      lastError = err;
      const retryable = err instanceof GuideGenerationError && err.retryable;
      if (!retryable || attempt === MAX_ATTEMPTS) throw err;
    }
  }

  // Unreachable — the loop either returns or throws — but satisfies the type.
  throw lastError;
}
