import { test, expect } from "@playwright/test";

test.describe("F1 — Translate flow", () => {
  test("input is focused on load", async ({ page }) => {
    await page.goto("/en");
    const textarea = page.locator("textarea");
    await expect(textarea).toBeFocused();
  });

  test("translate button is disabled when input is empty", async ({ page }) => {
    await page.goto("/en");
    const button = page.getByRole("button", { name: /translate/i });
    await expect(button).toBeDisabled();
  });

  test("translate button enables when text is entered", async ({ page }) => {
    await page.goto("/en");
    await page.locator("textarea").fill("Add a search feature");
    const button = page.getByRole("button", { name: /translate/i });
    await expect(button).toBeEnabled();
  });
});
