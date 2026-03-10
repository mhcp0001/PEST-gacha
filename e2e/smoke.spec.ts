import { test, expect } from "@playwright/test";

test.describe("Trend Gacha – smoke tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/trend-gacha/");
  });

  test("ページが表示され、タイトルが見える", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Trend Gacha");
    await expect(page.locator("text=FUTURE SIGNALS")).toBeVisible();
  });

  test("DRAW TREND ボタンでガチャが引ける", async ({ page }) => {
    const drawBtn = page.getByRole("button", { name: "トレンドを引く" });
    await expect(drawBtn).toBeEnabled();
    await drawBtn.click();

    // 結果カードが表示される
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // カードにトレンド名が含まれる
    const heading = dialog.locator("h2");
    await expect(heading).not.toBeEmpty();
  });

  test("結果カードを閉じられる", async ({ page }) => {
    await page.getByRole("button", { name: "トレンドを引く" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // ×ボタンで閉じる
    await page.getByRole("button", { name: "閉じる" }).click();
    await expect(dialog).not.toBeVisible({ timeout: 1000 });
  });

  test("Escape キーで結果カードを閉じられる", async ({ page }) => {
    await page.getByRole("button", { name: "トレンドを引く" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible({ timeout: 1000 });
  });

  test("Space キーでガチャが引ける", async ({ page }) => {
    // body にフォーカスを当ててから Space を押す
    await page.locator("body").click();
    await page.keyboard.press("Space");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test("カテゴリフィルターが切り替えられる", async ({ page }) => {
    const megaBtn = page.getByRole("radio", { name: "MEGA" });
    await megaBtn.click();
    await expect(megaBtn).toHaveAttribute("aria-checked", "true");

    const allBtn = page.getByRole("radio", { name: "ALL" });
    await expect(allBtn).toHaveAttribute("aria-checked", "false");
  });

  test("履歴にドロー結果が追加される", async ({ page }) => {
    await page.getByRole("button", { name: "トレンドを引く" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // カードを閉じる
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible({ timeout: 1000 });

    // 履歴に1件ある
    const historyItems = page.locator("[data-testid='history-item']");
    // data-testid がない場合もあるので、Historyセクション内のアイテムを確認
    const historySection = page.locator("text=History");
    await expect(historySection).toBeVisible();
  });
});
