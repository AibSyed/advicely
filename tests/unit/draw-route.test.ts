import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/draw-engine", () => ({
  drawCard: vi.fn(),
}));

import { GET, POST } from "@/app/api/draw/route";
import { drawCard } from "@/lib/api/draw-engine";

describe("POST /api/draw", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a validated draw payload", async () => {
    vi.mocked(drawCard).mockResolvedValue({
      card: {
        id: "card-1",
        kind: "quote",
        text: "Keep the thought that helps; leave the performance around it behind.",
        author: "Advicely Reserve",
        source: "advicely_reserve",
        sourceLabel: "Advicely Reserve",
        provenance: "fallback",
        fallbackReason: "provider_unavailable",
        textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        drawnAt: "2026-03-01T00:00:00.000Z",
      },
      meta: {
        requestId: "req-1",
        drawnAt: "2026-03-01T00:00:00.000Z",
        outcomes: {
          adviceSlip: "unavailable",
          zenQuotes: "skipped",
        },
      },
    });

    const response = await POST(
      new Request("http://localhost/api/draw", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mode: "advice",
          avoidRecentHashes: [],
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");
    await expect(response.json()).resolves.toMatchObject({
      card: {
        source: "advicely_reserve",
      },
      meta: {
        outcomes: {
          adviceSlip: "unavailable",
        },
      },
    });
  });

  it("rejects invalid json bodies", async () => {
    const response = await POST(
      new Request("http://localhost/api/draw", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: "{not-json",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Request body must be valid JSON",
    });
  });

  it("rejects invalid request payloads", async () => {
    const response = await POST(
      new Request("http://localhost/api/draw", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mode: "contextual",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Invalid request payload",
    });
  });
});

describe("GET /api/draw", () => {
  it("rejects non-post requests", async () => {
    const response = await GET();

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
    await expect(response.json()).resolves.toEqual({
      error: "Method Not Allowed",
    });
  });
});
