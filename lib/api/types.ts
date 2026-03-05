import type {
  AdviceErrorState,
  AdviceProvider,
  ProviderHealthState,
} from "@/features/advice/contracts";

export interface ProviderCandidate {
  text: string;
  source: AdviceProvider;
  sourceAttribution: string;
  confidence: number;
  fallbackUsed: boolean;
  errorState: AdviceErrorState | null;
}

export interface ProviderResult {
  candidate?: ProviderCandidate;
  health: ProviderHealthState;
  diagnostic?: string;
  errorState?: AdviceErrorState;
}
