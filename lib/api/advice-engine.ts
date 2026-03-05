import { randomUUID } from "node:crypto";
import {
  adviceResponseSchema,
  type AdviceErrorState,
  type AdviceRequestVM,
  type AdviceResponseVM,
  type ProviderHealthState,
} from "@/features/advice/contracts";
import { fallbackAdviceCatalog } from "@/features/advice/catalog";
import { buildAdaptiveAdvice } from "@/features/advice/shaping";
import { computeQualityScore, isLowQualityAdvice, normalizeAdviceText } from "@/features/advice/quality";
import { env } from "@/lib/env";
import { sha256Hex } from "@/lib/utils/hash";
import { AdviceProviderError } from "@/lib/api/provider-error";
import { requestAdviceSlip } from "@/lib/api/providers/advice-slip";
import { requestZenQuote } from "@/lib/api/providers/zen-quotes";
import type { ProviderCandidate, ProviderResult } from "@/lib/api/types";

interface AdviceEngineInput {
  request: AdviceRequestVM;
}

function deriveHealthFromError(errorState: AdviceErrorState): ProviderHealthState {
  if (errorState === "partial" || errorState === "invalid_payload") {
    return "degraded";
  }
  return "down";
}

function evaluateCandidate(
  candidate: ProviderCandidate,
  recentHashes: Set<string>,
): { candidate?: ProviderCandidate; textHash?: string } {
  const normalized = normalizeAdviceText(candidate.text);
  const textHash = sha256Hex(normalized);

  if (recentHashes.has(textHash)) {
    return {};
  }

  if (isLowQualityAdvice(normalized)) {
    return {};
  }

  return {
    candidate: {
      ...candidate,
      text: normalized,
    },
    textHash,
  };
}

function selectFallback(request: AdviceRequestVM, recentHashes: Set<string>): { fallback: ProviderCandidate; textHash: string } {
  const intentPool = fallbackAdviceCatalog.filter((entry) => entry.intents.includes(request.intent));
  const fallbackPool = intentPool.length > 0 ? intentPool : fallbackAdviceCatalog;

  for (const entry of fallbackPool) {
    const textHash = sha256Hex(entry.advice);
    if (!recentHashes.has(textHash)) {
      return {
        fallback: {
          text: entry.advice,
          source: "local_fallback",
          sourceAttribution: "Advicely Curated Catalog",
          confidence: 0.7,
          fallbackUsed: true,
          errorState: "partial",
        },
        textHash,
      };
    }
  }

  const first = fallbackPool[0];

  return {
    fallback: {
      text: first.advice,
      source: "local_fallback",
      sourceAttribution: "Advicely Curated Catalog",
      confidence: 0.66,
      fallbackUsed: true,
      errorState: "partial",
    },
    textHash: sha256Hex(first.advice),
  };
}

function buildProviderResultError(providerName: string, error: unknown): ProviderResult {
  if (error instanceof AdviceProviderError) {
    return {
      health: deriveHealthFromError(error.state),
      errorState: error.state,
      diagnostic: `${providerName}: ${error.state}`,
    };
  }

  return {
    health: "down",
    errorState: "unavailable",
    diagnostic: `${providerName}: unavailable`,
  };
}

function toRecentHashSet(values: string[]): Set<string> {
  return new Set(values.slice(0, 20));
}

export async function generateAdvice({ request }: AdviceEngineInput): Promise<AdviceResponseVM> {
  const diagnostics: string[] = [];
  const startedAt = new Date().toISOString();
  const recentHashes = toRecentHashSet(request.avoidRecentHashes);

  let primaryResult: ProviderResult = { health: "down" };
  let secondaryResult: ProviderResult = { health: "down" };

  let selectedCandidate: ProviderCandidate | undefined;
  let selectedHash: string | undefined;

  try {
    const candidate = await requestAdviceSlip(env.ADVICE_PROVIDER_PRIMARY_URL, env.ADVICE_REQUEST_TIMEOUT_MS);
    const evaluated = evaluateCandidate(candidate, recentHashes);

    primaryResult = {
      candidate: evaluated.candidate,
      health: evaluated.candidate ? "healthy" : "degraded",
      diagnostic: evaluated.candidate ? "primary: accepted" : "primary: duplicate_or_low_quality",
      errorState: evaluated.candidate ? undefined : "partial",
    };

    if (evaluated.candidate) {
      selectedCandidate = evaluated.candidate;
      selectedHash = evaluated.textHash;
    }
  } catch (error) {
    primaryResult = buildProviderResultError("primary", error);
  }

  if (primaryResult.diagnostic) {
    diagnostics.push(primaryResult.diagnostic);
  }

  if (!selectedCandidate) {
    try {
      const candidate = await requestZenQuote(env.ADVICE_PROVIDER_SECONDARY_URL, env.ADVICE_REQUEST_TIMEOUT_MS);
      const evaluated = evaluateCandidate(candidate, recentHashes);

      secondaryResult = {
        candidate: evaluated.candidate,
        health: evaluated.candidate ? "healthy" : "degraded",
        diagnostic: evaluated.candidate ? "secondary: accepted" : "secondary: duplicate_or_low_quality",
        errorState: evaluated.candidate ? undefined : "partial",
      };

      if (evaluated.candidate) {
        selectedCandidate = evaluated.candidate;
        selectedHash = evaluated.textHash;
      }
    } catch (error) {
      secondaryResult = buildProviderResultError("secondary", error);
    }
  } else {
    secondaryResult = {
      health: "healthy",
      diagnostic: "secondary: skipped",
    };
  }

  if (secondaryResult.diagnostic) {
    diagnostics.push(secondaryResult.diagnostic);
  }

  if (!selectedCandidate || !selectedHash) {
    const fallback = selectFallback(request, recentHashes);
    selectedCandidate = fallback.fallback;
    selectedHash = fallback.textHash;
    diagnostics.push("fallback: catalog_selected");
  }

  const qualityScore = computeQualityScore(selectedCandidate.text);

  const effectiveConfidence = Number(
    Math.min(0.99, Math.max(0.45, selectedCandidate.confidence * 0.75 + qualityScore * 0.25)).toFixed(2),
  );

  const shaped = buildAdaptiveAdvice(selectedCandidate.text, request);

  const response: AdviceResponseVM = {
    card: {
      id: randomUUID(),
      headline: shaped.headline,
      summary: shaped.summary,
      blocks: shaped.blocks,
      intent: request.intent,
      style: request.style,
      detail: request.detail,
      context: request.context,
      source: selectedCandidate.source,
      sourceAttribution: selectedCandidate.sourceAttribution,
      confidence: effectiveConfidence,
      fallbackUsed: selectedCandidate.fallbackUsed,
      errorState: selectedCandidate.errorState,
      textHash: selectedHash,
      generatedAt: startedAt,
    },
    meta: {
      requestId: randomUUID(),
      generatedAt: startedAt,
      providerHealth: {
        primary: primaryResult.health,
        secondary: secondaryResult.health,
      },
      diagnostics: diagnostics.slice(0, 8),
    },
  };

  return adviceResponseSchema.parse(response);
}
