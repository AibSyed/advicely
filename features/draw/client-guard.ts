import type { DrawResponseVM, FallbackReason, ProviderOutcome, SourceCardKind, DrawSource } from "@/features/draw/contracts";

const cardKinds = new Set<SourceCardKind>(["advice", "quote"]);
const sources = new Set<DrawSource>(["advice_slip", "zen_quotes", "advicely_reserve"]);
const provenances = new Set(["live", "fallback"] as const);
const fallbackReasons = new Set<FallbackReason>(["provider_unavailable", "invalid_payload", "filtered", "duplicate"]);
const providerOutcomes = new Set<ProviderOutcome>(["accepted", "duplicate", "filtered", "unavailable", "invalid_payload", "skipped"]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isIsoString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function parseClientDrawResponse(payload: unknown): DrawResponseVM {
  assert(isObject(payload), "Draw payload must be an object");
  assert(isObject(payload.card), "Draw card must be an object");
  assert(isObject(payload.meta), "Draw metadata must be an object");

  const { card, meta } = payload;
  const outcomes = meta.outcomes;
  assert(isObject(outcomes), "Draw outcomes must be an object");

  assert(typeof card.id === "string" && card.id.length > 0, "Draw card id is invalid");
  assert(cardKinds.has(card.kind as SourceCardKind), "Draw card kind is invalid");
  assert(typeof card.text === "string" && card.text.length >= 4, "Draw card text is invalid");
  assert(card.author === undefined || typeof card.author === "string", "Draw card author is invalid");
  assert(sources.has(card.source as DrawSource), "Draw card source is invalid");
  assert(typeof card.sourceLabel === "string" && card.sourceLabel.length > 0, "Draw card source label is invalid");
  assert(provenances.has(card.provenance as "live" | "fallback"), "Draw card provenance is invalid");
  assert(card.fallbackReason === undefined || fallbackReasons.has(card.fallbackReason as FallbackReason), "Draw fallback reason is invalid");
  assert(typeof card.textHash === "string" && /^[a-f0-9]{64}$/.test(card.textHash), "Draw card hash is invalid");
  assert(isIsoString(card.drawnAt), "Draw timestamp is invalid");

  assert(typeof meta.requestId === "string" && meta.requestId.length > 0, "Draw request id is invalid");
  assert(isIsoString(meta.drawnAt), "Draw metadata timestamp is invalid");
  assert(providerOutcomes.has(outcomes.adviceSlip as ProviderOutcome), "AdviceSlip outcome is invalid");
  assert(providerOutcomes.has(outcomes.zenQuotes as ProviderOutcome), "ZenQuotes outcome is invalid");

  return payload as DrawResponseVM;
}
