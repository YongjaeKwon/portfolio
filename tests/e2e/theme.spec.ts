import { test, expect } from "@playwright/test";

const THEME_KEY = "portfolio-theme";

/**
 * 다크/라이트 테마는 (1) 화면에 즉시 반영되고 (2) localStorage에 저장되어
 * (3) 새로고침 이후에도 유지되어야 한다. 세 단계를 각각 회귀 가드로 잡는다.
 */
test.describe("테마 토글", () => {
  test("토글하면 data-theme가 반전되고 localStorage에 저장된다", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    const before = await html.getAttribute("data-theme");
    expect(before).toMatch(/^(dark|light)$/);

    await page.getByRole("button", { name: /모드로 전환/ }).click();

    const expected = before === "dark" ? "light" : "dark";
    await expect(html).toHaveAttribute("data-theme", expected);

    const stored = await page.evaluate((k) => localStorage.getItem(k), THEME_KEY);
    expect(stored).toBe(expected);
  });

  test("새로고침해도 선택한 테마가 유지된다 (지속성 회귀 가드)", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    const before = await html.getAttribute("data-theme");
    await page.getByRole("button", { name: /모드로 전환/ }).click();
    const expected = before === "dark" ? "light" : "dark";
    await expect(html).toHaveAttribute("data-theme", expected);

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", expected);
  });

  test("저장된 테마를 첫 페인트 전에 반영한다 (FOUC 방지 인라인 스크립트)", async ({ page }) => {
    await page.addInitScript((k) => localStorage.setItem(k, "light"), THEME_KEY);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});
