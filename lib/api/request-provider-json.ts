import type { ZodType } from "zod";
import { AdviceProviderError, mapStatusToErrorState } from "@/lib/api/provider-error";

interface RequestProviderJsonOptions<T> {
  invalidPayloadMessage: string;
  requestFailedMessage: string;
  schema: ZodType<T>;
  timeoutMessage: string;
  timeoutMs: number;
  url: string;
}

export async function requestProviderJson<T>({
  invalidPayloadMessage,
  requestFailedMessage,
  schema,
  timeoutMessage,
  timeoutMs,
  url,
}: RequestProviderJsonOptions<T>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new AdviceProviderError(
        `${requestFailedMessage} (${response.status})`,
        mapStatusToErrorState(response.status),
      );
    }

    const payload = schema.safeParse(await response.json());
    if (!payload.success) {
      throw new AdviceProviderError(invalidPayloadMessage, "invalid_payload");
    }

    return payload.data;
  } catch (error) {
    if (error instanceof AdviceProviderError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AdviceProviderError(timeoutMessage, "unavailable");
    }

    throw new AdviceProviderError(requestFailedMessage, "unavailable");
  } finally {
    clearTimeout(timeout);
  }
}
