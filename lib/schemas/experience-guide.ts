import { z } from "zod";

const place = z.object({
  name: z.string().min(1),
  distance: z.string().min(1),
  description: z.string().min(1),
});

const essential = place.extend({ type: z.string().min(1) });

// Generation contract — enforces the editorial quotas we ask the model for
// (used to validate fresh model output before persisting).
export const experienceGuideContentSchema = z.object({
  welcome_message: z.string().min(1),
  restaurants: z.array(place).min(4).max(5),
  attractions: z.array(place).min(3).max(4),
  essentials: z.array(essential).min(1),
  seasonal_tip: z.string().min(1),
});

// Storage contract — same field shapes, but without the array-size quotas.
// Those quotas are a generation-quality target, not a data-integrity invariant,
// so a stored row that predates a quota change must still render. On read we
// validate structure only.
export const storedExperienceGuideSchema = z.object({
  welcome_message: z.string().min(1),
  restaurants: z.array(place),
  attractions: z.array(place),
  essentials: z.array(essential),
  seasonal_tip: z.string().min(1),
});

export type ExperienceGuideContent = z.infer<typeof experienceGuideContentSchema>;
