import { test, expect } from "@playwright/test";

test.describe("i18n — language routing", () => {
  test("root path redirects to /en", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en/);
  });

  test("/ja loads Japanese UI", async ({ page }) => {
    await page.goto("/ja");
    await expect(page.locator("textarea")).toHaveAttribute(
      "placeholder",
      /作りたい/
    );
  });

  test("/es loads Spanish UI", async ({ page }) => {
    await page.goto("/es");
    await expect(page.locator("textarea")).toHaveAttribute(
      "placeholder",
      /Describe una función/i
    );
  });

  test("/fr loads French UI", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("textarea")).toHaveAttribute(
      "placeholder",
      /Décrivez/i
    );
  });
});
