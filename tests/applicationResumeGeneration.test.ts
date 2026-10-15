import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { marked } from "marked";
import { expect, it, vi } from "vitest";

it("renders application Markdown before sending it to the PDF printer", () => {
  const sourceUrl = new URL("../scripts/generate-resumes.mjs", import.meta.url);
  const source = readFileSync(sourceUrl, "utf8")
    .replace(/^import .*;$/gm, "")
    .replaceAll("import.meta.url", JSON.stringify(sourceUrl.href));
  const writeFileSync = vi.fn();
  const printPdf = vi.fn();
  runInNewContext(source, {
    path, fileURLToPath, marked,
    existsSync: () => true, mkdirSync: () => {},
    readdirSync: () => ["example.md"],
    readFileSync: () => "# 지원서 검증\n\n**구현 경험**을 정리합니다.",
    writeFileSync, printPdf, copyFileSync: vi.fn(),
    findBrowser: () => "test-browser",
    process: { argv: ["node", "generate-resumes.mjs", "--applications"] },
    console: { log: () => {} },
  });
  const html = writeFileSync.mock.calls[0][1];
  expect(html).toContain('<html lang="ko">');
  expect(html).toContain("<h1>지원서 검증</h1>");
  expect(html).toContain("<strong>구현 경험</strong>");
  expect(html).toContain("@page");
  expect(printPdf).toHaveBeenCalledOnce();
  expect(printPdf.mock.calls[0][2]).toBe(path.resolve(".cache/applications/example.pdf"));
});
