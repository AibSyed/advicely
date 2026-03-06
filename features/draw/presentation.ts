import type { DrawMode, FallbackReason, SourceCardVM } from "@/features/draw/contracts";

const modeLabels: Record<DrawMode, string> = {
  advice: "Advice",
  quote: "Quote",
  mixed: "Mixed",
};

export function getModeLabel(mode: DrawMode): string {
  return modeLabels[mode];
}

export function getModeDescription(mode: DrawMode): string {
  if (mode === "advice") {
    return "Short random advice from AdviceSlip, with local fallback if needed.";
  }

  if (mode === "quote") {
    return "Random quotes from ZenQuotes, with local fallback if needed.";
  }

  return "A shuffled mix of live advice and quotes.";
}

export function getCardEyebrow(card: SourceCardVM): string {
  if (card.source === "advice_slip") {
    return "Random advice from AdviceSlip";
  }

  if (card.source === "zen_quotes") {
    return "Random quote from ZenQuotes";
  }

  return "From the Advicely collection";
}

export function getFallbackMessage(reason?: FallbackReason): string | null {
  if (!reason) {
    return null;
  }

  if (reason === "provider_unavailable") {
    return "Live sources did not respond, so this card came from the Advicely collection.";
  }

  if (reason === "invalid_payload") {
    return "A live source returned unusable data, so this card came from the Advicely collection.";
  }

  if (reason === "filtered") {
    return "A live result was too weak to keep, so this card came from the Advicely collection.";
  }

  return "Recent draws were duplicates, so this card came from the Advicely collection.";
}

export function getCardKindLabel(card: SourceCardVM): string {
  return card.kind === "advice" ? "Advice" : "Quote";
}
