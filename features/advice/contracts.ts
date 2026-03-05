import { z } from "zod";

export const adviceIntentSchema = z.enum([
  "quick",
  "decision",
  "communication",
  "planning",
  "stress",
  "general",
]);

export const adviceStyleSchema = z.enum([
  "balanced",
  "direct",
  "supportive",
  "creative",
]);

export const adviceDetailSchema = z.enum(["short", "standard", "deep"]);

export const adviceErrorStateSchema = z.enum([
  "unavailable",
  "stale",
  "partial",
  "rate_limited",
  "invalid_payload",
]);

export const adviceProviderSchema = z.enum([
  "advice_slip",
  "zen_quotes",
  "local_fallback",
]);

export const providerHealthStateSchema = z.enum([
  "healthy",
  "degraded",
  "down",
]);

export const adviceRequestSchema = z
  .object({
    context: z
      .string()
      .trim()
      .max(600)
      .optional()
      .transform((value) => (value && value.length > 0 ? value : undefined)),
    intent: adviceIntentSchema.default("general"),
    style: adviceStyleSchema.default("balanced"),
    detail: adviceDetailSchema.default("standard"),
    avoidRecentHashes: z
      .array(z.string().regex(/^[a-f0-9]{64}$/))
      .max(20)
      .default([]),
  })
  .strict();

const coreAdviceBlockSchema = z.object({
  type: z.literal("core_advice"),
  text: z.string().min(8).max(420),
});

const stepsBlockSchema = z.object({
  type: z.literal("steps"),
  items: z.array(z.string().min(4).max(160)).min(2).max(6),
});

const scriptBlockSchema = z.object({
  type: z.literal("script"),
  text: z.string().min(8).max(420),
});

const reframeBlockSchema = z.object({
  type: z.literal("reframe"),
  text: z.string().min(8).max(420),
});

const cautionBlockSchema = z.object({
  type: z.literal("caution"),
  text: z.string().min(8).max(420),
});

const checklistBlockSchema = z.object({
  type: z.literal("checklist"),
  items: z.array(z.string().min(4).max(160)).min(2).max(7),
});

export const adviceBlockVMSchema = z.discriminatedUnion("type", [
  coreAdviceBlockSchema,
  stepsBlockSchema,
  scriptBlockSchema,
  reframeBlockSchema,
  cautionBlockSchema,
  checklistBlockSchema,
]);

export const adviceCardVMSchema = z.object({
  id: z.string().min(1),
  headline: z.string().min(4).max(120),
  summary: z.string().min(10).max(220),
  blocks: z.array(adviceBlockVMSchema).min(1).max(6),
  intent: adviceIntentSchema,
  style: adviceStyleSchema,
  detail: adviceDetailSchema,
  context: z.string().max(600).optional(),
  source: adviceProviderSchema,
  sourceAttribution: z.string().min(1).max(120),
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

export type AdviceIntent = z.infer<typeof adviceIntentSchema>;
export type AdviceStyle = z.infer<typeof adviceStyleSchema>;
export type AdviceDetail = z.infer<typeof adviceDetailSchema>;
export type AdviceErrorState = z.infer<typeof adviceErrorStateSchema>;
export type AdviceProvider = z.infer<typeof adviceProviderSchema>;
export type ProviderHealthState = z.infer<typeof providerHealthStateSchema>;
export type AdviceRequestVM = z.infer<typeof adviceRequestSchema>;
export type AdviceBlockVM = z.infer<typeof adviceBlockVMSchema>;
export type AdviceCardVM = z.infer<typeof adviceCardVMSchema>;
export type AdviceMetaVM = z.infer<typeof adviceMetaVMSchema>;
export type AdviceResponseVM = z.infer<typeof adviceResponseSchema>;
