import { defineConfig, devices } from "@playwright/test";

/**
 * E2E 설정 — 실제 사용자 흐름(테마/스킨 전환, 섹션 네비, 접근성)을
 * 빌드된 화면이 아니라 dev 서버에 직접 띄워 검증한다.
 *
 * 결정론 확보:
 * - colorScheme "dark"  → 저장값이 없을 때 초기 테마를 고정
 * - reducedMotion "reduce" → View Transition 애니메이션을 건너뛰어 토글을 즉시 반영
 */
const PORT = 4321;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL,
    colorScheme: "dark",
    reducedMotion: "reduce",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
