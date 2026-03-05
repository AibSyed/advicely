import { randomUUID } from "node:crypto";
import {
  adviceResponseSchema,
  type AdviceErrorState,
  type AdviceResponse,
  type ProviderHealthState,
  type ToneProfile,
} from "@/features/advice/contracts";
import { fallbackAdviceCatalog } from "@/features/advice/catalog";
import { applyToneProfile } from "@/features/advice/tone";
import { computeQualityScore, isLowQualityAdvice, normalizeAdviceText } from "@/features/advice/quality";
import { env } from "@/lib/env";
import { sha256Hex } from "@/lib/utils/hash";
import { AdviceProviderError } from "@/lib/api/provider-error";
import { requestAdviceSlip } from "@/lib/api/providers/advice-slip";
import { requestZenQuote } from "@/lib/api/providers/zen-quotes";
import type { ProviderCandidate, ProviderResult } from "@/lib/api/types";

interface AdviceEngineInput {
  toneProfile: ToneProfile;
  recentHashes: Set<string>;
}

function deriveHealthFromError(errorState: AdviceErrorState): ProviderHealthState {
  if (errorState === "partial" || errorState === "invalid_payload") {
    return "degraded";
  }
  return "down";
}

function evaluateCandidate(candidate: ProviderCandidate, recentHashes: Set<string>): { candidate?: ProviderCandidate; textHash?: string } {
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

function selectFallback(toneProfile: ToneProfile, recentHashes: Set<string>): { fallback: ProviderCandidate; textHash: string } {
  const tonePool = fallbackAdviceCatalog.filter((entry) => entry.toneProfile === toneProfile);
  const fallbackPool = tonePool.length > 0 ? tonePool : fallbackAdviceCatalog;

  for (const entry of fallbackPool) {
    const textHash = sha256Hex(entry.advice);
    if (!recentHashes.has(textHash)) {
      return {
        fallback: {
          text: entry.advice,
          source: "local_fallback",
          sourceAttribution: "Advicely Curated Catalog",
          confidence: 0.7,
          freshnessMinutes: 0,
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
      freshnessMinutes: 0,
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

export async function generateAdvice({ toneProfile, recentHashes }: AdviceEngineInput): Promise<AdviceResponse> {
  const diagnostics: string[] = [];
  const startedAt = new Date().toISOString();

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
    const fallback = selectFallback(toneProfile, recentHashes);
    selectedCandidate = fallback.fallback;
    selectedHash = fallback.textHash;
    diagnostics.push("fallback: catalog_selected");
  }

  const qualityScore = computeQualityScore(selectedCandidate.text);
  const toneOutput = applyToneProfile(selectedCandidate.text, toneProfile);

  const effectiveConfidence = Number(
    Math.min(0.99, Math.max(0.45, selectedCandidate.confidence * 0.75 + qualityScore * 0.25)).toFixed(2),
  );

  const response: AdviceResponse = {
    card: {
      id: randomUUID(),
      headline: toneOutput.headline,
      advice: toneOutput.advice,
      microAction: toneOutput.microAction,
      reflectionPrompt: toneOutput.reflectionPrompt,
      toneProfile,
      source: selectedCandidate.source,
      sourceAttribution: selectedCandidate.sourceAttribution,
      freshnessMinutes: selectedCandidate.freshnessMinutes,
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
