import { test, expect } from "@playwright/test";

/**
 * 단일 페이지 앵커 네비게이션: 내비 클릭 → 해당 섹션으로 스크롤 + URL 해시 동기화,
 * 로고 클릭 → 최상단 복귀 + 해시 제거, 해시 딥링크 진입 → 해당 섹션 노출.
 */
test.describe("섹션 네비게이션", () => {
  test("내비 항목을 누르면 해당 섹션이 보이고 URL 해시가 갱신된다", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Projects", exact: true }).click();

    await expect(page.locator("#projects")).toBeInViewport();
    await expect(page).toHaveURL(/#projects$/);
  });

  test("로고(첫 화면)를 누르면 최상단으로 돌아가고 해시가 제거된다", async ({ page }) => {
    await page.goto("/#projects");

    await page.getByRole("button", { name: "첫 화면으로 이동" }).click();

    await expect(page.locator("#hero")).toBeInViewport();
    await expect.poll(() => new URL(page.url()).hash).toBe("");
  });

  test("해시 딥링크로 진입하면 해당 섹션이 노출된다", async ({ page }) => {
    await page.goto("/#experience");

    await expect(page.locator("#experience")).toBeInViewport();
  });
});
