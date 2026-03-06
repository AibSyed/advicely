import { z } from "zod";

export const drawModeSchema = z.enum(["advice", "quote", "mixed"]);
export const sourceCardKindSchema = z.enum(["advice", "quote"]);
export const drawSourceSchema = z.enum(["advice_slip", "zen_quotes", "advicely_reserve"]);
const drawProvenanceSchema = z.enum(["live", "fallback"]);
export const fallbackReasonSchema = z.enum(["provider_unavailable", "invalid_payload", "filtered", "duplicate"]);
export const providerOutcomeSchema = z.enum(["accepted", "duplicate", "filtered", "unavailable", "invalid_payload", "skipped"]);

export const drawRequestSchema = z
  .object({
    mode: drawModeSchema.default("mixed"),
    avoidRecentHashes: z
      .array(z.string().regex(/^[a-f0-9]{64}$/))
      .max(24)
      .default([]),
  })
  .strict();

export const sourceCardVMSchema = z.object({
  id: z.string().min(1),
  kind: sourceCardKindSchema,
  text: z.string().min(4).max(420),
  author: z.string().min(1).max(120).optional(),
  source: drawSourceSchema,
  sourceLabel: z.string().min(1).max(120),
  provenance: drawProvenanceSchema,
  fallbackReason: fallbackReasonSchema.optional(),
  textHash: z.string().length(64),
  drawnAt: z.string().datetime(),
});

const drawMetaVMSchema = z.object({
  requestId: z.string().min(1),
  drawnAt: z.string().datetime(),
  outcomes: z.object({
    adviceSlip: providerOutcomeSchema,
    zenQuotes: providerOutcomeSchema,
  }),
});

export const drawResponseSchema = z.object({
  card: sourceCardVMSchema,
  meta: drawMetaVMSchema,
});

export type DrawMode = z.infer<typeof drawModeSchema>;
export type SourceCardKind = z.infer<typeof sourceCardKindSchema>;
export type DrawSource = z.infer<typeof drawSourceSchema>;
export type FallbackReason = z.infer<typeof fallbackReasonSchema>;
export type ProviderOutcome = z.infer<typeof providerOutcomeSchema>;
export type DrawRequestVM = z.infer<typeof drawRequestSchema>;
export type SourceCardVM = z.infer<typeof sourceCardVMSchema>;
export type DrawResponseVM = z.infer<typeof drawResponseSchema>;
