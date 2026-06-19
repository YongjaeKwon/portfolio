import { test, expect } from "@playwright/test";

const SECTION_IDS = [
  "hero",
  "profile",
  "projects",
  "experience",
  "education",
  "techstack",
  "contact",
] as const;

/**
 * 페이지가 정상 로드되고 핵심 섹션이 모두 존재하는지, 그리고
 * 키보드 사용자를 위한 '본문으로 건너뛰기' 스킵 링크가 첫 Tab에 잡히는지 확인한다.
 */
test.describe("스모크 & 접근성", () => {
  test("문서 타이틀과 핵심 섹션이 모두 렌더된다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/권용재/);

    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("첫 Tab으로 스킵 링크에 포커스된다 (키보드 접근성)", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "본문으로 건너뛰기" })).toBeFocused();
  });
});
