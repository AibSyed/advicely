import { expect, test } from "@playwright/test";

test("primary advice reactor flow works", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /get clear advice in one click/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /get advice/i })).toBeVisible();

  await page.getByRole("button", { name: /direct/i }).click();
  await page.getByRole("button", { name: /get advice/i }).click();

  await expect(page.getByText(/try this next/i)).toBeVisible();
  await expect(page.getByText(/source:/i)).toHaveCount(0);
  await expect(page.getByText(/confidence:/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /progress/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /saved advice/i })).toBeVisible();

  await page.getByRole("link", { name: /progress/i }).click();
  await expect(page.getByRole("heading", { name: /your progress/i })).toBeVisible();
});
