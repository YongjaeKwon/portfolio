// PDF 생성 스크립트(이력서 · 포트폴리오)가 같이 쓰는 Chrome 탐색과 인쇄.
import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

function findOnPath(command) {
  const lookup = os.platform() === "win32" ? "where.exe" : "which";

  try {
    const result = execFileSync(lookup, [command], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    return result
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
  } catch {
    return undefined;
  }
}

export function findBrowser() {
  const configured = [process.env.PDF_BROWSER_PATH, process.env.CHROME_PATH].filter(Boolean);
  const platformCandidates =
    os.platform() === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
          "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        ]
      : os.platform() === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/usr/bin/microsoft-edge",
          ];

  const pathCandidates = ["chrome", "google-chrome", "chromium", "chromium-browser", "msedge", "microsoft-edge"]
    .map(findOnPath)
    .filter(Boolean);

  for (const candidate of [...configured, ...platformCandidates, ...pathCandidates]) {
    if (candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error("Chrome/Edge 실행 파일을 찾지 못했습니다. PDF_BROWSER_PATH 또는 CHROME_PATH를 지정해 주세요.");
}

function renderHtml(markdown, title) {
  const content = marked.parse(markdown, {
    gfm: true,
    breaks: false,
  });

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>${css}</style>
</head>
<body>
  <main class="resume">
    ${content}
  </main>
</body>
</html>`;
}

// tempDir: Chrome 임시 프로필을 만들 곳. budget: 웹폰트 등을 기다릴 가상 시간(ms). minSize: 이보다 작으면 실패로 본다.
export function printPdf(browser, htmlPath, outputPath, { tempDir = os.tmpdir(), budget = 8000, minSize = 10_000 } = {}) {
  const temporaryOutputPath = `${outputPath}.generating`;
  const userDataDir = mkdtempSync(path.join(tempDir, "chrome-pdf-"));
  rmSync(temporaryOutputPath, { force: true });

  let result;
  try {
    result = spawnSync(
      browser,
      [
        "--headless=new",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--no-first-run",
        "--no-default-browser-check",
        "--no-pdf-header-footer",
        "--allow-file-access-from-files",
        "--run-all-compositor-stages-before-draw",
        `--virtual-time-budget=${budget}`,
        `--user-data-dir=${userDataDir}`,
        `--print-to-pdf=${temporaryOutputPath}`,
        pathToFileURL(htmlPath).href,
      ],
      {
                stdio: "inherit",
        timeout: 60_000,
      },
    );
  } finally {
    try {
      rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // Chrome가 종료 직후 잠시 파일을 잡고 있어도 PDF 검증은 계속 진행한다.
    }
  }

  if (result.error || result.status !== 0) {
    rmSync(temporaryOutputPath, { force: true });
    throw new Error(`${path.basename(outputPath)} 생성 실패${result.error ? `: ${result.error.message}` : ""}`);
  }

  const size = statSync(temporaryOutputPath).size;
  if (size < minSize) {
    rmSync(temporaryOutputPath, { force: true });
    throw new Error(`${path.basename(outputPath)} 파일 크기가 비정상적으로 작습니다: ${size} bytes`);
  }

  const pdf = readFileSync(temporaryOutputPath);
  const header = pdf.subarray(0, 8).toString("ascii");
  const tail = pdf.subarray(Math.max(0, pdf.length - 2048)).toString("latin1");
  if (!header.startsWith("%PDF-") || !tail.includes("%%EOF")) {
    rmSync(temporaryOutputPath, { force: true });
    throw new Error(`${path.basename(outputPath)} PDF 구조 검증 실패`);
  }

  // 생성 도중 중단되더라도 기존 정상 PDF를 보존하고, 완성된 파일만 교체한다.
  copyFileSync(temporaryOutputPath, outputPath);
  rmSync(temporaryOutputPath, { force: true });
}
