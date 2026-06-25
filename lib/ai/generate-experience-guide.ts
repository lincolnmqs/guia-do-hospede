import { findGuideByPropertyId, saveGuide } from "@/lib/db/experience-guide.repository";
import { generateExperienceGuideContent } from "./generate-content";
import { OPENAI_MODEL } from "./config";
import type { PropertyWithRelations } from "@/lib/db/property.repository";
import {
  storedExperienceGuideSchema,
  type ExperienceGuideContent,
} from "@/lib/schemas/experience-guide";

// ---------------------------------------------------------------------------
// DB-row → ExperienceGuideContent (camelCase → snake_case)
//
// The JSONB columns (restaurants/attractions/essentials) come back as `unknown`,
// so we validate the assembled shape against the storage schema instead of
// casting — a structurally malformed row surfaces as a thrown error the caller
// can handle (regenerate or 502) rather than silently reaching the client. The
// storage schema omits generation quotas so a valid legacy row still renders.
// ---------------------------------------------------------------------------

function rowToContent(row: {
  welcomeMessage: string;
  restaurants: unknown;
  attractions: unknown;
  essentials: unknown;
  seasonalTip: string;
}): ExperienceGuideContent {
  return storedExperienceGuideSchema.parse({
    welcome_message: row.welcomeMessage,
    restaurants: row.restaurants,
    attractions: row.attractions,
    essentials: row.essentials,
    seasonal_tip: row.seasonalTip,
  });
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
