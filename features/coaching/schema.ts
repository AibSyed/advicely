import { z } from "zod";

export const themeSchema = z.enum(["focus", "confidence", "resilience", "clarity"]);

export const coachingCardSchema = z.object({
  id: z.string(),
  theme: themeSchema,
  headline: z.string().min(1),
  prompt: z.string().min(1),
  reflection: z.string().min(1),
  microAction: z.string().min(1),
  xpReward: z.number().int().positive(),
  confidenceScore: z.number().min(0).max(1),
  source: z.enum(["adviceslip", "quotable", "fallback"]),
  fallbackUsed: z.boolean(),
  generatedAt: z.string(),
});

export const coachingResponseSchema = z.object({
  card: coachingCardSchema,
  providerHealth: z.array(
    z.object({
      name: z.string(),
      healthy: z.boolean(),
      message: z.string(),
    })
  ),
  partialData: z.boolean(),
});

export type CoachingResponse = z.infer<typeof coachingResponseSchema>;
export type CoachingCard = z.infer<typeof coachingCardSchema>;
export type Theme = z.infer<typeof themeSchema>;
