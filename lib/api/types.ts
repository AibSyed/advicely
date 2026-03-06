import type { DrawSource, ProviderOutcome, SourceCardKind } from "@/features/draw/contracts";

export interface ProviderCandidate {
  kind: SourceCardKind;
  text: string;
  author?: string;
  source: DrawSource;
  sourceLabel: string;
}

export interface ProviderResult {
  candidate?: ProviderCandidate;
  outcome: ProviderOutcome;
}
