import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = path.join(rootDir, ".cache", "resumes");

// 회사 맞춤 이력서는 docs/applications/*.md 에 두고 .cache 로만 출력한다.
// public/ 으로 나가지 않으므로 공개 URL이 생기지 않고, docs/applications/ 는 gitignore 된다.
const applicationsDir = path.join(rootDir, "docs", "applications");
const applicationsOutDir = path.join(rootDir, ".cache", "applications");

const resumes = [
  {
    // 새 디자인(스타일드 HTML) 공통 이력서 — 사이트의 기본 다운로드(public/resume.pdf)
    source: "docs/resume-general.html",
    html: "resume.html",
    output: "public/resume.pdf",
    title: "권용재 - 프론트엔드 엔지니어",
  },
];

const css = `
  @page {
    size: A4;
    margin: 13mm 14mm;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    color: #172033;
    background: #ffffff;
    font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif;
    font-size: 10.2px;
    line-height: 1.48;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .resume {
    max-width: 180mm;
    margin: 0 auto;
  }

  h1 {
    margin: 0;
    color: #0f172a;
    font-size: 25px;
    line-height: 1.12;
    letter-spacing: 0;
  }

  h1 + p {
    margin: 3px 0 8px;
    color: #2563eb;
    font-size: 13.5px;
    font-weight: 800;
  }

  h1 + p + ul {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    margin: 0 0 12px;
    padding: 0 0 10px;
    border-bottom: 1px solid #cbd5e1;
    color: #475569;
    list-style: none;
  }

  h1 + p + ul li {
    margin: 0;
    padding: 0;
  }

  h2 {
    margin: 13px 0 6px;
    padding-bottom: 3px;
    border-bottom: 1px solid #dbe4f0;
    color: #0f172a;
    font-size: 12.8px;
    line-height: 1.2;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  h3 {
    margin: 9px 0 2px;
    color: #1e3a8a;
    font-size: 11.3px;
    line-height: 1.28;
    break-after: avoid;
  }

  p {
    margin: 3px 0 5px;
  }

  ul {
    margin: 4px 0 7px 0;
    padding-left: 14px;
  }

  li {
    margin: 1px 0;
  }

  strong {
    color: #0f172a;
  }

  a {
    color: #2563eb;
    text-decoration: none;
  }

  h2 + h3,
  h2 + p {
    margin-top: 5px;
  }

  h3 + p {
    color: #475569;
    font-weight: 700;
  }

  p:has(+ ul) {
    break-after: avoid;
  }

  h3,
  h3 + p,
  h3 + p + p,
  h3 + p + p + ul {
    break-inside: avoid;
  }
`;

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

function findBrowser() {
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

function printPdf(browser, htmlPath, outputPath) {
  const result = spawnSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-pdf-header-footer",
      "--allow-file-access-from-files",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=8000",
      `--print-to-pdf=${outputPath}`,
      pathToFileURL(htmlPath).href,
    ],
    {
      cwd: rootDir,
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    throw new Error(`${path.basename(outputPath)} 생성 실패`);
  }

  const size = statSync(outputPath).size;
  if (size < 10_000) {
    throw new Error(`${path.basename(outputPath)} 파일 크기가 비정상적으로 작습니다: ${size} bytes`);
  }
}

function collectApplicationResumes() {
  if (!existsSync(applicationsDir)) {
    return [];
  }

  return readdirSync(applicationsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = path.basename(file, ".md");
      return {
        source: path.join("docs", "applications", file),
        html: `application-${slug}.html`,
        output: path.join(".cache", "applications", `${slug}.pdf`),
        title: `권용재 - 프론트엔드 엔지니어 (${slug})`,
      };
    });
}

mkdirSync(cacheDir, { recursive: true });
mkdirSync(applicationsOutDir, { recursive: true });

const browser = findBrowser();
console.log(`Using browser: ${browser}`);

const allResumes = [...resumes, ...collectApplicationResumes()];

for (const resume of allResumes) {
  const sourcePath = path.join(rootDir, resume.source);
  const htmlPath = path.join(cacheDir, resume.html);
  const outputPath = path.join(rootDir, resume.output);
  const raw = readFileSync(sourcePath, "utf8");
  // .html 소스는 완성된 문서이므로 그대로, .md 소스는 마크다운→HTML로 변환
  const html = resume.source.endsWith(".html") ? raw : renderHtml(raw, resume.title);

  writeFileSync(htmlPath, html, "utf8");
  printPdf(browser, htmlPath, outputPath);
  console.log(`Generated ${resume.output}`);
}
