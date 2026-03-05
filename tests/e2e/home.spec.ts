import { expect, test } from "@playwright/test";

test("primary advice reactor flow works", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /instant advice with enough intelligence to stay useful/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /generate advice/i })).toBeVisible();

  await page.getByRole("button", { name: /bold/i }).click();
  await page.getByRole("button", { name: /generate advice/i }).click();

  await expect(page.getByText(/micro action/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /momentum/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /library/i })).toBeVisible();

  await page.getByRole("link", { name: /momentum/i }).click();
  await expect(page.getByRole("heading", { name: /momentum board/i })).toBeVisible();
});
