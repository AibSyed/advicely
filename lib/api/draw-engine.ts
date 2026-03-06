import { randomUUID } from "node:crypto";
import {
  drawResponseSchema,
  type DrawMode,
  type DrawRequestVM,
  type FallbackReason,
  type ProviderOutcome,
  type SourceCardVM,
} from "@/features/draw/contracts";
import { reserveDeck } from "@/features/draw/reserve-deck";
import { isFilteredText } from "@/features/draw/text";
import { env } from "@/lib/env";
import { sha256Hex } from "@/lib/utils/hash";
import { AdviceProviderError } from "@/lib/api/provider-error";
import { requestAdviceSlip } from "@/lib/api/providers/advice-slip";
import { requestZenQuote } from "@/lib/api/providers/zen-quotes";
import type { ProviderCandidate } from "@/lib/api/types";

interface DrawInput {
  request: DrawRequestVM;
}

interface ProviderAttempt {
  candidate?: ProviderCandidate;
  outcome: ProviderOutcome;
}

function sourceOrderForMode(mode: DrawMode): Array<"adviceSlip" | "zenQuotes"> {
  if (mode === "advice") {
    return ["adviceSlip"];
  }

  if (mode === "quote") {
    return ["zenQuotes"];
  }

  return Math.random() > 0.5 ? ["adviceSlip", "zenQuotes"] : ["zenQuotes", "adviceSlip"];
}

function evaluateCandidate(candidate: ProviderCandidate, recentHashes: Set<string>): ProviderAttempt {
  const textHash = sha256Hex(candidate.text);

  if (recentHashes.has(textHash)) {
    return { outcome: "duplicate" };
  }

  if (isFilteredText(candidate.text)) {
    return { outcome: "filtered" };
  }

  return {
    candidate,
    outcome: "accepted",
  };
}

function mapErrorToOutcome(error: unknown): ProviderOutcome {
  if (error instanceof AdviceProviderError) {
    return error.state === "invalid_payload" ? "invalid_payload" : "unavailable";
  }

  return "unavailable";
}

function fallbackReasonFromOutcomes(outcomes: ProviderOutcome[]): FallbackReason {
  if (outcomes.includes("invalid_payload")) {
    return "invalid_payload";
  }

  if (outcomes.includes("unavailable")) {
    return "provider_unavailable";
  }

  if (outcomes.includes("filtered")) {
    return "filtered";
  }

  return "duplicate";
}

function selectReserveCard(mode: DrawMode, recentHashes: Set<string>) {
  const eligible = reserveDeck.filter((entry) => entry.modes.includes(mode) || (mode === "mixed" && entry.modes.includes("mixed")));
  const pool = eligible.length > 0 ? eligible : reserveDeck;
  const startIndex = pool.length > 1 ? Math.floor(Math.random() * pool.length) : 0;

  for (let offset = 0; offset < pool.length; offset += 1) {
    const entry = pool[(startIndex + offset) % pool.length];
    const textHash = sha256Hex(entry.text);

    if (!recentHashes.has(textHash)) {
      return {
        card: entry,
        textHash,
      };
    }
  }

  const first = pool[0];
  return {
    card: first,
    textHash: sha256Hex(first.text),
  };
}

function toSourceCard(candidate: ProviderCandidate, drawnAt: string): SourceCardVM {
  return {
    id: randomUUID(),
    kind: candidate.kind,
    text: candidate.text,
    ...(candidate.author ? { author: candidate.author } : {}),
    source: candidate.source,
    sourceLabel: candidate.sourceLabel,
    provenance: "live",
    textHash: sha256Hex(candidate.text),
    drawnAt,
  };
}

function toFallbackCard(mode: DrawMode, recentHashes: Set<string>, reason: FallbackReason, drawnAt: string): SourceCardVM {
  const local = selectReserveCard(mode, recentHashes);

  return {
    id: randomUUID(),
    kind: local.card.kind,
    text: local.card.text,
    ...(local.card.author ? { author: local.card.author } : {}),
    source: "advicely_reserve",
    sourceLabel: "Advicely Reserve",
    provenance: "fallback",
    fallbackReason: reason,
    textHash: local.textHash,
    drawnAt,
  };
}

export async function drawCard({ request }: DrawInput) {
  const drawnAt = new Date().toISOString();
  const recentHashes = new Set(request.avoidRecentHashes.slice(0, 24));
  const outcomes: Record<"adviceSlip" | "zenQuotes", ProviderOutcome> = {
    adviceSlip: "skipped",
    zenQuotes: "skipped",
  };

  let selectedCard: SourceCardVM | undefined;

  for (const source of sourceOrderForMode(request.mode)) {
    try {
      const candidate = source === "adviceSlip"
        ? await requestAdviceSlip(env.ADVICE_SLIP_URL, env.DRAW_REQUEST_TIMEOUT_MS)
        : await requestZenQuote(env.ZEN_QUOTES_RANDOM_URL, env.DRAW_REQUEST_TIMEOUT_MS);

      const evaluated = evaluateCandidate(candidate, recentHashes);
      outcomes[source] = evaluated.outcome;

      if (evaluated.candidate) {
        selectedCard = toSourceCard(evaluated.candidate, drawnAt);
        break;
      }
    } catch (error) {
      outcomes[source] = mapErrorToOutcome(error);
    }
  }

  if (!selectedCard) {
    const attempted = Object.values(outcomes).filter((outcome) => outcome !== "skipped");
    const reason = fallbackReasonFromOutcomes(attempted.length > 0 ? attempted : ["unavailable"]);
    selectedCard = toFallbackCard(request.mode, recentHashes, reason, drawnAt);
  }

  return drawResponseSchema.parse({
    card: selectedCard,
    meta: {
      requestId: randomUUID(),
      drawnAt,
      outcomes,
    },
  });
}
