// docs/portfolio-deck.html(가로 16:9 슬라이드)을 Chrome으로 인쇄해 public/portfolio.pdf를 만든다.
// 지원서에 URL 대신 PDF만 첨부할 수 있을 때 쓰는 포트폴리오 요약본.
import { existsSync, mkdtempSync, renameSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const input = path.join(rootDir, "docs", "portfolio-deck.html");
const output = path.join(rootDir, "public", "portfolio.pdf");

const candidates = [
  process.env.PDF_BROWSER_PATH,
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = candidates.find((candidate) => existsSync(candidate));
if (!browser) throw new Error("Chrome/Edge를 찾지 못했습니다. PDF_BROWSER_PATH를 지정해 주세요.");

const temporary = `${output}.generating`;
const userDataDir = mkdtempSync(path.join(os.tmpdir(), "portfolio-pdf-"));
const result = spawnSync(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    "--run-all-compositor-stages-before-draw",
    // 웹폰트(Noto Sans KR 조각)를 다 받을 시간을 준다
    "--virtual-time-budget=15000",
    `--user-data-dir=${userDataDir}`,
    `--print-to-pdf=${temporary}`,
    pathToFileURL(input).href,
  ],
  { stdio: "inherit", timeout: 90_000 },
);
try {
  rmSync(userDataDir, { recursive: true, force: true });
} catch {
  // Chrome가 종료 직후 잠시 프로필을 잡고 있어도 PDF 검사는 계속한다.
}

if (result.error || result.status !== 0 || !existsSync(temporary) || statSync(temporary).size < 50_000) {
  rmSync(temporary, { force: true });
  throw new Error(`portfolio.pdf 생성 실패${result.error ? `: ${result.error.message}` : ""}`);
}
renameSync(temporary, output);
console.log(`portfolio.pdf ${Math.round(statSync(output).size / 1024)} KB`);
