import { NextResponse } from "next/server";
import { toneProfileSchema } from "@/features/advice/contracts";
import { generateAdvice } from "@/lib/api/advice-engine";

export const runtime = "nodejs";

function parseRecentHashes(rawRecent: string | null): Set<string> {
  if (!rawRecent) {
    return new Set();
  }

  return new Set(
    rawRecent
      .split(",")
      .map((value) => value.trim())
      .filter((value) => /^[a-f0-9]{64}$/.test(value))
      .slice(0, 12),
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedTone = toneProfileSchema.safeParse(searchParams.get("tone") ?? "grounded");
  const toneProfile = parsedTone.success ? parsedTone.data : "grounded";
  const recentHashes = parseRecentHashes(searchParams.get("recent"));

  try {
    const payload = await generateAdvice({ toneProfile, recentHashes });
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Advice generation failed",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}
