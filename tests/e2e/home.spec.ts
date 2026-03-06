import { expect, test } from "@playwright/test";

const mockDrawResponse = {
  card: {
    id: "card-1",
    kind: "quote",
    text: "Life is like playing the violin in public and learning the instrument as one goes on.",
    author: "Samuel Butler",
    source: "zen_quotes",
    sourceLabel: "ZenQuotes",
    provenance: "live",
    textHash: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    drawnAt: "2026-03-01T00:00:00.000Z",
  },
  meta: {
    requestId: "req-1",
    drawnAt: "2026-03-01T00:00:00.000Z",
    outcomes: {
      adviceSlip: "skipped",
      zenQuotes: "accepted",
    },
  },
};

test("honesty-first draw flow works without console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.route("**/api/draw", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockDrawResponse),
    });
  });

  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => undefined,
      },
    });
  });

  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /skip to main content/i })).toBeFocused();

  await expect(page.getByRole("heading", { name: /find a line worth keeping/i })).toBeVisible();
  await page.getByRole("button", { name: /quote deck/i }).click();
  await page.getByRole("button", { name: /draw a card/i }).click();

  await expect(page.getByRole("heading", { name: /life is like playing the violin/i })).toBeVisible();
  await expect(page.getByText(/live zenquotes quote/i)).toBeVisible();
  await expect(page.getByText(/samuel butler/i)).toBeVisible();

  await page.getByLabel(/optional personal note/i).fill("Keep this around for bad meetings.");
  await page.getByRole("button", { name: /open copy view/i }).click();
  await expect(page).toHaveURL(/\/copy\//);
  await expect(page.getByRole("heading", { name: /copy card/i })).toBeVisible();
  await page.getByText(/include private note when copying/i).click();
  await page.getByRole("button", { name: /copy card text/i }).click();
  await expect(page.getByRole("status")).toHaveText(/copied to clipboard/i);
  await expect(page.getByText(/keep this around for bad meetings/i)).toBeVisible();

  await page.goto("/");
  await page.getByRole("button", { name: /draw a card/i }).click();
  await page.getByLabel(/optional personal note/i).fill("Keep this around for bad meetings.");
  await page.getByRole("button", { name: /save to library/i }).click();
  await page.getByRole("link", { name: /library/i }).click();

  await expect(page.getByRole("heading", { name: /your library/i })).toBeVisible();
  await expect(page.getByRole("textbox", { name: /edit note for life is like playing the violin/i })).toHaveValue(
    /keep this around for bad meetings/i,
  );

  await page.getByRole("button", { name: /open copy view/i }).first().click();
  await expect(page).toHaveURL(/\/copy\//);
  await expect(page.getByRole("heading", { name: /copy card/i })).toBeVisible();
  await expect(page.getByText(/source: zenquotes/i)).toBeVisible();
  await expect(page.getByText(/keep this around for bad meetings/i)).toHaveCount(0);

  await page.getByRole("link", { name: /recent/i }).click();
  await expect(page.getByRole("heading", { name: /recent draws/i })).toBeVisible();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("missing local copy renders recovery state", async ({ page }) => {
  await page.goto("/copy/not-found");

  await expect(page.getByRole("heading", { name: /we could not find that local copy/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /draw a new card/i })).toBeVisible();
});
