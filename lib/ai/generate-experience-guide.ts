import { findGuideByPropertyId, saveGuide } from "@/lib/db/experience-guide.repository";
import { generateExperienceGuideContent } from "./generate-content";
import type { PropertyWithRelations } from "@/lib/db/property.repository";
import type { ExperienceGuideContent } from "@/lib/schemas/experience-guide";

// Read model name here so we don't import the OpenAI singleton (which requires a
// real environment) into this orchestration module.
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

// ---------------------------------------------------------------------------
// DB-row → ExperienceGuideContent (camelCase → snake_case)
// ---------------------------------------------------------------------------

function rowToContent(row: {
  welcomeMessage: string;
  restaurants: unknown;
  attractions: unknown;
  essentials: unknown;
  seasonalTip: string;
}): ExperienceGuideContent {
  return {
    welcome_message: row.welcomeMessage,
    restaurants: row.restaurants as ExperienceGuideContent["restaurants"],
    attractions: row.attractions as ExperienceGuideContent["attractions"],
    essentials: row.essentials as ExperienceGuideContent["essentials"],
    seasonal_tip: row.seasonalTip,
  };
}

// ---------------------------------------------------------------------------
// Idempotent get-or-create with P2002 race handling
// ---------------------------------------------------------------------------

export async function getOrCreateExperienceGuide(
  property: PropertyWithRelations,
): Promise<ExperienceGuideContent> {
  const existing = await findGuideByPropertyId(property.id);

  if (existing) {
    return rowToContent(existing);
  }

  const content = await generateExperienceGuideContent(property);

  try {
    await saveGuide(property.id, content, OPENAI_MODEL);
  } catch (err: unknown) {
    // Another concurrent request won the race and already inserted the row.
    // Re-read the winner's row and return it instead of throwing.
    if (
      typeof err === "object" &&
      err !== null &&
      (err as { code?: string }).code === "P2002"
    ) {
      const winner = await findGuideByPropertyId(property.id);
      if (winner) {
        return rowToContent(winner);
      }
    }
    throw err;
  }

  return content;
}
