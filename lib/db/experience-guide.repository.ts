import { prisma } from "./client";
import type { ExperienceGuideContent } from "../schemas/experience-guide";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExperienceGuideRow {
  id: string;
  propertyId: string;
  welcomeMessage: string;
  restaurants: unknown;
  attractions: unknown;
  essentials: unknown;
  seasonalTip: string;
  model: string;
  generatedAt: Date;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function findGuideByPropertyId(propertyId: string): Promise<ExperienceGuideRow | null> {
  return prisma.experienceGuide.findUnique({ where: { propertyId } }) as Promise<ExperienceGuideRow | null>;
}

export function saveGuide(
  propertyId: string,
  content: ExperienceGuideContent,
  model: string,
): Promise<ExperienceGuideRow> {
  return prisma.experienceGuide.create({
    data: {
      propertyId,
      welcomeMessage: content.welcome_message,
      restaurants: content.restaurants,
      attractions: content.attractions,
      essentials: content.essentials,
      seasonalTip: content.seasonal_tip,
      model,
      generatedAt: new Date(),
    },
  }) as Promise<ExperienceGuideRow>;
}
