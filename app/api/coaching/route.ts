import { themeSchema } from "@/features/coaching/schema";
import { getCoaching } from "@/lib/domain/coaching";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedTheme = themeSchema.safeParse(searchParams.get("theme") ?? "focus");

  if (!parsedTheme.success) {
    return Response.json(
      {
        error: "invalid_payload",
        message: "Theme must be one of: focus, confidence, resilience, clarity.",
      },
      { status: 400 }
    );
  }

  const payload = await getCoaching(parsedTheme.data);
  return Response.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
