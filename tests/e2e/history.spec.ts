import { test, expect } from "@playwright/test";

test.describe("F3 — Session history", () => {
  test("shows empty state when no history", async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByText(/no translations yet/i)).toBeVisible();
  });

  test("shows export and clear buttons when history exists", async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() => {
      localStorage.setItem(
        "spectalk_session",
        JSON.stringify([
          {
            id: "test-1",
            input: "Add a search",
            output: {
              spec: "Implement search",
              terms: [],
              scope: "small",
              copyReady: "Add full-text search",
            },
            context: {},
            language: "en",
            timestamp: Date.now(),
          },
        ])
      );
    });
    await page.reload();
    await expect(page.getByRole("button", { name: /export/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /clear/i })).toBeVisible();
  });
});
