import { test, expect } from "@playwright/test";

/**
 * 스킨은 기본 → 메이플 → 오버워치 → 기본 순으로 순환하며 저장된다.
 * 또한 다크/라이트 토글은 기본 스킨에서만 노출되므로, 스킨 전환 시
 * 토글이 사라지는 조건부 렌더를 함께 회귀 가드한다.
 */
test.describe("스킨 순환 토글", () => {
  test("클릭마다 기본 → 메이플 → 오버워치 → 기본으로 순환하고 저장된다", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-skin", "default");

    const toggle = page.getByRole("button", { name: /현재 스킨/ });

    await toggle.click();
    await expect(html).toHaveAttribute("data-skin", "maple");
    await toggle.click();
    await expect(html).toHaveAttribute("data-skin", "overwatch");
    await toggle.click();
    await expect(html).toHaveAttribute("data-skin", "default");

    const stored = await page.evaluate(() => localStorage.getItem("portfolio-skin"));
    expect(stored).toBe("default");
  });

  test("기본 스킨이 아니면 다크/라이트 토글이 사라진다 (조건부 렌더 회귀 가드)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /모드로 전환/ })).toBeVisible();

    await page.getByRole("button", { name: /현재 스킨/ }).click(); // → 메이플

    await expect(page.getByRole("button", { name: /모드로 전환/ })).toHaveCount(0);
  });
});
