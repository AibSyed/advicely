import { expect, test } from "@playwright/test";

test("renders coaching studio hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /daily coaching cards that convert insight into action/i })).toBeVisible();
  await expect(page.getByRole("tab", { name: /^focus$/i })).toBeVisible();
  await expect(page.getByRole("tab", { name: /^clarity$/i })).toBeVisible();
});
