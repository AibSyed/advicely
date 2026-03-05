import type { AdviceErrorState } from "@/features/advice/contracts";

export class AdviceProviderError extends Error {
  constructor(
    message: string,
    public readonly state: AdviceErrorState,
  ) {
    super(message);
    this.name = "AdviceProviderError";
  }
}

export function mapStatusToErrorState(status: number): AdviceErrorState {
  if (status === 429) {
    return "rate_limited";
  }

  if (status >= 500) {
    return "unavailable";
  }

  if (status >= 400) {
    return "partial";
  }

  return "unavailable";
}
