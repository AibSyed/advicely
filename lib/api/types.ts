import type { DrawSource, SourceCardKind } from "@/features/draw/contracts";

export interface ProviderCandidate {
  kind: SourceCardKind;
  text: string;
  author?: string;
  source: DrawSource;
  sourceLabel: string;
}
