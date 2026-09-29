// docs/portfolio-deck.html(가로 16:9 슬라이드)을 Chrome으로 인쇄해 public/portfolio.pdf를 만든다.
// 지원서에 URL 대신 PDF만 첨부할 수 있을 때 쓰는 포트폴리오 요약본.
import path from "node:path";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { findBrowser, printPdf } from "./chrome-pdf.mjs";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const output = path.join(rootDir, "public", "portfolio.pdf");

// 웹폰트(Noto Sans KR 조각)를 다 받을 시간을 더 준다.
printPdf(findBrowser(), path.join(rootDir, "docs", "portfolio-deck.html"), output, { budget: 15000, minSize: 50_000 });
console.log(`portfolio.pdf ${Math.round(statSync(output).size / 1024)} KB`);
