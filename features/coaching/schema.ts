import { z } from "zod";

export const coachingCardSchema = z.object({
  id: z.string(),
  theme: z.enum(["focus", "confidence", "resilience", "clarity"]),
  headline: z.string(),
  prompt: z.string(),
  reflection: z.string(),
  microAction: z.string(),
});

export const coachingPayloadSchema = z.object({
  card: coachingCardSchema,
  source: z.string(),
  generatedAt: z.string(),
});

export type CoachingPayload = z.infer<typeof coachingPayloadSchema>;
