type ProviderFailureState = "unavailable" | "invalid_payload" | "rate_limited";

export class AdviceProviderError extends Error {
  constructor(
    message: string,
    public readonly state: ProviderFailureState,
  ) {
    super(message);
    this.name = "AdviceProviderError";
  }
}

export function mapStatusToErrorState(status: number): ProviderFailureState {
  if (status === 429) {
    return "rate_limited";
  }

  if (status >= 400) {
    return "unavailable";
  }

  return "unavailable";
}
