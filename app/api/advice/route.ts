import { NextResponse } from "next/server";
import { adviceRequestSchema } from "@/features/advice/contracts";
import { generateAdvice } from "@/lib/api/advice-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Request body must be valid JSON",
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }

  const parsedRequest = adviceRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: "Invalid request payload",
        issues: parsedRequest.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }

  try {
    const payload = await generateAdvice({ request: parsedRequest.data });

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

export async function GET() {
  return NextResponse.json(
    {
      error: "Method Not Allowed",
    },
    {
      status: 405,
      headers: {
        Allow: "POST",
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
