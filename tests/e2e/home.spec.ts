import { expect, test } from "@playwright/test";

const mockAdviceResponse = {
  card: {
    id: "advice-card-1",
    headline: "Handle the conversation directly",
    summary: "Be clear about your limit, then offer one realistic alternative.",
    blocks: [
      {
        type: "core_advice",
        text: "Start with your boundary in one sentence and keep your tone calm.",
      },
      {
        type: "script",
        text: 'Try this: "I can\'t take this on this week. I can help next Tuesday instead."',
      },
    ],
    intent: "communication",
    style: "direct",
    detail: "standard",
    context: "I need to decline extra work without upsetting my manager",
    source: "advice_slip",
    sourceAttribution: "AdviceSlip API",
    confidence: 0.82,
    fallbackUsed: false,
    errorState: null,
    textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    generatedAt: "2026-03-01T00:00:00.000Z",
  },
  meta: {
    requestId: "req-1",
    generatedAt: "2026-03-01T00:00:00.000Z",
    providerHealth: {
      primary: "healthy",
      secondary: "healthy",
    },
    diagnostics: ["primary: accepted"],
  },
};

test("primary utility flow works", async ({ page }) => {
  await page.route("**/api/advice", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockAdviceResponse),
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: /practical advice you can use right now/i })).toBeVisible();
  await page.getByRole("button", { name: /communication/i }).click();
  await page.getByRole("button", { name: /direct/i }).click();
  await page.getByLabel(/advice context/i).fill("I need to decline extra work without upsetting my manager");
  await page.getByRole("button", { name: /generate advice/i }).click();

  await expect(page.getByRole("heading", { name: /handle the conversation directly/i })).toBeVisible();
  await expect(page.getByText(/try this:/i)).toBeVisible();

  await page.getByRole("button", { name: /save advice/i }).click();
  await page.getByRole("link", { name: /saved/i }).click();

  await expect(page.getByRole("heading", { name: /saved advice/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /handle the conversation directly/i })).toBeVisible();

  await page.getByRole("button", { name: /share/i }).first().click();
  await expect(page).toHaveURL(/\/share\//);
  await expect(page.getByRole("heading", { name: /handle the conversation directly/i })).toBeVisible();
});

test("missing share card renders recovery state", async ({ page }) => {
  await page.goto("/share/not-found");

  await expect(page.getByRole("heading", { name: /we could not find that share card/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /generate new advice/i })).toBeVisible();
});
