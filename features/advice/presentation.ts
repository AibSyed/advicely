import type { AdviceErrorState, ToneProfile } from "@/features/advice/contracts";

const toneProfileLabels: Record<ToneProfile, string> = {
  grounded: "Practical",
  bold: "Direct",
  calm: "Calm",
  playful: "Light",
};

const adviceErrorLabels: Record<AdviceErrorState, string> = {
  unavailable: "Live sources unavailable",
  stale: "Using older source data",
  partial: "Using backup guidance",
  rate_limited: "Sources are busy right now",
  invalid_payload: "Source data had an issue",
};

export function getToneProfileLabel(toneProfile: ToneProfile): string {
  return toneProfileLabels[toneProfile];
}

export function getAdviceFitLabel(confidence: number): string {
  if (confidence >= 0.85) {
    return "Strong fit";
  }

  if (confidence >= 0.7) {
    return "Good fit";
  }

  if (confidence >= 0.55) {
    return "Worth trying";
  }

  return "Try and adapt";
}

export function getAdviceSignalLabel(errorState: AdviceErrorState | null, fallbackUsed: boolean): string | null {
  if (errorState) {
    return adviceErrorLabels[errorState];
  }

  if (fallbackUsed) {
    return "Using backup guidance";
  }

  return null;
}
