import type { DrawMode, FallbackReason, SourceCardVM } from "@/features/draw/contracts";

const modeLabels: Record<DrawMode, string> = {
  advice: "Advice deck",
  quote: "Quote deck",
  mixed: "Mixed deck",
};

export function getModeLabel(mode: DrawMode): string {
  return modeLabels[mode];
}

export function getModeDescription(mode: DrawMode): string {
  if (mode === "advice") {
    return "Random advice from AdviceSlip.";
  }

  if (mode === "quote") {
    return "Random quotes from ZenQuotes.";
  }

  return "Let the deck alternate between both live sources.";
}

export function getCardEyebrow(card: SourceCardVM): string {
  if (card.source === "advice_slip") {
    return "Live AdviceSlip advice";
  }

  if (card.source === "zen_quotes") {
    return "Live ZenQuotes quote";
  }

  return "From the Advicely Reserve";
}

export function getFallbackMessage(reason?: FallbackReason): string | null {
  if (!reason) {
    return null;
  }

  if (reason === "provider_unavailable") {
    return "Live sources were quiet, so this draw came from the Advicely Reserve.";
  }

  if (reason === "invalid_payload") {
    return "A live source returned unusable text, so this draw came from the Advicely Reserve.";
  }

  if (reason === "filtered") {
    return "The live result was too thin to keep, so this draw came from the Advicely Reserve.";
  }

  return "A recent draw repeated, so this draw came from the Advicely Reserve.";
}

export function getCardKindLabel(card: SourceCardVM): string {
  return card.kind === "advice" ? "Advice" : "Quote";
}
