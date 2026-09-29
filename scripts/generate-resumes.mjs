import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";
import { findBrowser, printPdf } from "./chrome-pdf.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = path.join(rootDir, ".cache", "resumes");

// 회사 맞춤 이력서는 docs/applications/*.md 에 두고 .cache 로만 출력한다.
// public/ 으로 나가지 않으므로 공개 URL이 생기지 않고, docs/applications/ 는 gitignore 된다.
const applicationsDir = path.join(rootDir, "docs", "applications");
const applicationsOutDir = path.join(rootDir, ".cache", "applications");
const finalPdfDir = path.join(rootDir, "output", "pdf");

const resumes = [
  {
    // 한국어 통합본 — 사이트 기본 다운로드(public/resume.pdf). 프론트엔드 · 백엔드판을 하나로 합쳤다.
    source: "docs/resume.html",
    html: "resume.html",
    output: "public/resume.pdf",
    title: "권용재 - 웹 개발자 이력서",
    finalCopy: "yongjae-kwon-web-developer-resume.pdf",
  },
  {
    // 영문 통합본 — 영어 모드(?lang=en) 다운로드
    source: "docs/resume-en.html",
    html: "resume-en.html",
    output: "public/resume-en.pdf",
    title: "Yongjae Kwon - Web Developer Resume",
    finalCopy: "yongjae-kwon-web-developer-resume-en.pdf",
  },
];

const css = `
  @page {
    size: A4;
    margin: 14mm 15mm;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    color: #172033;
    background: #ffffff;
    font-family: "Pretendard", "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif;
    font-size: 10.6px;
    line-height: 1.52;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .resume {
    max-width: 180mm;
    margin: 0 auto;
  }

  .page-break {
    height: 0;
    break-before: page;
    page-break-before: always;
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

function collectApplicationResumes() {
  if (!existsSync(applicationsDir)) {
    return [];
  }

  return readdirSync(applicationsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = path.basename(file, ".md");
      const title =
        slug === "resume-submission"
          ? "권용재 - 웹 개발자 이력서 (제출용)"
          : `권용재 - 웹 개발자 이력서 (${slug})`;
      return {
        source: path.join("docs", "applications", file),
        html: `application-${slug}.html`,
        output: path.join(".cache", "applications", `${slug}.pdf`),
        title,
      };
    });
}

const applicationMode = process.argv.includes("--applications");

mkdirSync(cacheDir, { recursive: true });
if (applicationMode) {
  mkdirSync(applicationsOutDir, { recursive: true });
}
mkdirSync(finalPdfDir, { recursive: true });

const browser = findBrowser();
console.log(`Using browser: ${browser}`);

const allResumes = applicationMode ? collectApplicationResumes() : resumes;

for (const resume of allResumes) {
  const sourcePath = path.join(rootDir, resume.source);
  const htmlPath = path.join(cacheDir, resume.html);
  const outputPath = path.join(rootDir, resume.output);
  const raw = readFileSync(sourcePath, "utf8");
  // .html 소스는 완성된 문서이므로 그대로, .md 소스는 마크다운→HTML로 변환
  const html = resume.source.endsWith(".html") ? raw : renderHtml(raw, resume.title);

  writeFileSync(htmlPath, html, "utf8");
  // 웹폰트(Noto Sans KR 조각)를 다 받을 시간을 준다.
  printPdf(browser, htmlPath, outputPath, { tempDir: cacheDir, budget: 15000 });
  console.log(`Generated ${resume.output}`);

  if (resume.finalCopy) {
    const finalCopy = path.join(finalPdfDir, resume.finalCopy);
    copyFileSync(outputPath, finalCopy);
    console.log(`Copied ${path.relative(rootDir, finalCopy)}`);
  }
}
