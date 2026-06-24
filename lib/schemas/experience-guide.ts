import { z } from "zod";

const place = z.object({
  name: z.string().min(1),
  distance: z.string().min(1),
  description: z.string().min(1),
});

const essential = place.extend({ type: z.string().min(1) });

export const experienceGuideContentSchema = z.object({
  welcome_message: z.string().min(1),
  restaurants: z.array(place).min(4).max(5),
  attractions: z.array(place).min(3).max(4),
  essentials: z.array(essential).min(1),
  seasonal_tip: z.string().min(1),
});

export type ExperienceGuideContent = z.infer<typeof experienceGuideContentSchema>;
