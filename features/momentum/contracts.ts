import { z } from "zod";
import { adviceProviderSchema, toneProfileSchema } from "@/features/advice/contracts";

export const generatedHistoryItemSchema = z.object({
  id: z.string().min(1),
  generatedAt: z.string().datetime(),
  headline: z.string().min(1),
  adviceSnippet: z.string().min(1),
  toneProfile: toneProfileSchema,
  source: adviceProviderSchema,
  confidence: z.number().min(0).max(1),
  textHash: z.string().length(64),
});

export const savedAdviceCardSchema = z.object({
  id: z.string().min(1),
  savedAt: z.string().datetime(),
  headline: z.string().min(1),
  advice: z.string().min(1),
  toneProfile: toneProfileSchema,
  source: adviceProviderSchema,
  confidence: z.number().min(0).max(1),
  textHash: z.string().length(64),
});

export const reflectionEntrySchema = z.object({
  id: z.string().min(1),
  adviceId: z.string().min(1),
  reflection: z.string().min(1).max(280),
  createdAt: z.string().datetime(),
});

export const shareCardVMSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  headline: z.string().min(1),
  advice: z.string().min(1),
  toneProfile: toneProfileSchema,
  source: adviceProviderSchema,
  confidence: z.number().min(0).max(1),
});

export const momentumStateVMSchema = z.object({
  version: z.literal(4),
  activeDays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(366),
  streakDays: z.number().int().min(0),
  totalGenerations: z.number().int().min(0),
  generatedHistory: z.array(generatedHistoryItemSchema).max(60),
  savedCards: z.array(savedAdviceCardSchema).max(120),
  reflections: z.array(reflectionEntrySchema).max(200),
  shareCards: z.array(shareCardVMSchema).max(120),
});

export const emptyMomentumState: z.infer<typeof momentumStateVMSchema> = {
  version: 4,
  activeDays: [],
  streakDays: 0,
  totalGenerations: 0,
  generatedHistory: [],
  savedCards: [],
  reflections: [],
  shareCards: [],
};

export type MomentumStateVM = z.infer<typeof momentumStateVMSchema>;
export type ShareCardVM = z.infer<typeof shareCardVMSchema>;
