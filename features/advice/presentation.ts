import type {
  AdviceBlockVM,
  AdviceDetail,
  AdviceErrorState,
  AdviceIntent,
  AdviceProvider,
  AdviceStyle,
} from "@/features/advice/contracts";

const intentLabels: Record<AdviceIntent, string> = {
  quick: "Quick",
  decision: "Decision",
  communication: "Communication",
  planning: "Planning",
  stress: "Stress",
  general: "General",
};

const styleLabels: Record<AdviceStyle, string> = {
  balanced: "Balanced",
  direct: "Direct",
  supportive: "Supportive",
  creative: "Creative",
};

const detailLabels: Record<AdviceDetail, string> = {
  short: "Short",
  standard: "Standard",
  deep: "Deep",
};

const sourceLabels: Record<AdviceProvider, string> = {
  advice_slip: "AdviceSlip",
  zen_quotes: "ZenQuotes",
  local_fallback: "Advicely Backup",
};

const errorLabels: Record<AdviceErrorState, string> = {
  unavailable: "Live sources unavailable",
  stale: "Using older source data",
  partial: "Using backup guidance",
  rate_limited: "Sources are busy right now",
  invalid_payload: "Source data had an issue",
};

const blockTitles: Record<AdviceBlockVM["type"], string> = {
  core_advice: "Advice",
  steps: "Next Steps",
  script: "Suggested Script",
  reframe: "Perspective",
  caution: "Use Caution",
  checklist: "Checklist",
};

export function getIntentLabel(intent: AdviceIntent): string {
  return intentLabels[intent];
}

export function getStyleLabel(style: AdviceStyle): string {
  return styleLabels[style];
}

export function getDetailLabel(detail: AdviceDetail): string {
  return detailLabels[detail];
}

export function getSourceLabel(source: AdviceProvider): string {
  return sourceLabels[source];
}

export function getAdviceSignalLabel(
  errorState: AdviceErrorState | null,
  fallbackUsed: boolean,
): string | null {
  if (errorState) {
    return errorLabels[errorState];
  }

  if (fallbackUsed) {
    return "Using backup guidance";
  }

  return null;
}

export function getAdviceBlockTitle(type: AdviceBlockVM["type"]): string {
  return blockTitles[type];
}
