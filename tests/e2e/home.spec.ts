import { expect, test } from "@playwright/test";

test("renders momentum loop and route navigation", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Build Daily Coaching Velocity" })).toBeVisible();
  await expect(page.getByRole("tablist", { name: "Coaching themes" })).toBeVisible();

  await page.getByRole("link", { name: "View progression" }).click();
  await expect(page).toHaveURL(/\/progress$/);
  await expect(page.getByRole("heading", { name: "Momentum Performance Report" })).toBeVisible();

  await page.getByRole("link", { name: "Back to daily loop" }).click();
  await expect(page).toHaveURL(/\/$/);
});
