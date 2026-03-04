import { getCoachingCard } from "@/lib/api/coaching-provider";
import { z } from "zod";

const querySchema = z.object({
  theme: z.enum(["focus", "confidence", "resilience", "clarity"]).default("focus"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ theme: searchParams.get("theme") ?? undefined });

  if (!parsed.success) {
    return Response.json({ error: "invalid theme", issues: parsed.error.issues }, { status: 400 });
  }

  const payload = await getCoachingCard(parsed.data.theme);
  return Response.json(payload, { status: 200 });
}
