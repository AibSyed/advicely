import { NextResponse } from "next/server";
import { drawRequestSchema } from "@/features/draw/contracts";
import { drawCard } from "@/lib/api/draw-engine";

export const runtime = "nodejs";

function noStoreHeaders(extra?: Record<string, string>) {
  return {
    "Cache-Control": "no-store, max-age=0",
    ...extra,
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400, headers: noStoreHeaders() });
  }

  const parsed = drawRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request payload",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400, headers: noStoreHeaders() },
    );
  }

  try {
    const payload = await drawCard({ request: parsed.data });
    return NextResponse.json(payload, { headers: noStoreHeaders() });
  } catch {
    return NextResponse.json({ error: "Draw request failed" }, { status: 500, headers: noStoreHeaders() });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405, headers: noStoreHeaders({ Allow: "POST" }) });
}
