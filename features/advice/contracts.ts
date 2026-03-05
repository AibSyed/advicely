import { z } from "zod";

export const toneProfileSchema = z.enum(["grounded", "bold", "calm", "playful"]);

export const adviceErrorStateSchema = z.enum([
  "unavailable",
  "stale",
  "partial",
  "rate_limited",
  "invalid_payload",
]);

export const adviceProviderSchema = z.enum(["advice_slip", "zen_quotes", "local_fallback"]);

export const providerHealthStateSchema = z.enum(["healthy", "degraded", "down"]);

export const adviceCardVMSchema = z.object({
  id: z.string().min(1),
  headline: z.string().min(1).max(120),
  advice: z.string().min(10).max(360),
  microAction: z.string().min(8).max(180),
  reflectionPrompt: z.string().min(8).max(220),
  toneProfile: toneProfileSchema,
  source: adviceProviderSchema,
  sourceAttribution: z.string().min(1).max(120),
  freshnessMinutes: z.number().int().min(0).max(1440),
  confidence: z.number().min(0).max(1),
  fallbackUsed: z.boolean(),
  errorState: adviceErrorStateSchema.nullable(),
  textHash: z.string().length(64),
  generatedAt: z.string().datetime(),
});

export const adviceMetaVMSchema = z.object({
  requestId: z.string().min(1),
  generatedAt: z.string().datetime(),
  providerHealth: z.object({
    primary: providerHealthStateSchema,
    secondary: providerHealthStateSchema,
  }),
  diagnostics: z.array(z.string().min(1)).max(8),
});

export const adviceResponseSchema = z.object({
  card: adviceCardVMSchema,
  meta: adviceMetaVMSchema,
});

export type ToneProfile = z.infer<typeof toneProfileSchema>;
export type AdviceErrorState = z.infer<typeof adviceErrorStateSchema>;
export type AdviceProvider = z.infer<typeof adviceProviderSchema>;
export type ProviderHealthState = z.infer<typeof providerHealthStateSchema>;
export type AdviceCardVM = z.infer<typeof adviceCardVMSchema>;
export type AdviceMetaVM = z.infer<typeof adviceMetaVMSchema>;
export type AdviceResponse = z.infer<typeof adviceResponseSchema>;
