import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const applicationsSourceDir = path.join(rootDir, "docs", "applications");
const applicationsOutDir = path.join(rootDir, ".cache", "applications");
const digest = (filePath) => createHash("sha256").update(readFileSync(filePath)).digest("hex");
const directoryState = (directory) => {
  if (!existsSync(directory)) return { exists: false, files: [] };

  const collect = (dir, prefix) =>
    readdirSync(dir)
      .sort()
      .flatMap((name) => {
        const filePath = path.join(dir, name);
        const relative = prefix ? `${prefix}/${name}` : name;
        const stat = statSync(filePath);
        if (stat.isDirectory()) return collect(filePath, relative);
        return [{ name: relative, hash: digest(filePath), modified: stat.mtimeMs, size: stat.size }];
      });

  return { exists: true, files: collect(directory, "") };
};

const applicationSourcesBefore = directoryState(applicationsSourceDir);
const applicationOutputsBefore = directoryState(applicationsOutDir);
const result = spawnSync(process.execPath, ["scripts/generate-resumes.mjs"], {
  cwd: rootDir,
  encoding: "utf8",
});
const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;

assert.equal(result.status, 0, output);
assert.doesNotMatch(output, /Generated \.cache[\\/]applications/, "Public generation must not rebuild private application PDFs");
assert.deepEqual(directoryState(applicationsSourceDir), applicationSourcesBefore, "Public generation must not change private application sources");
assert.deepEqual(directoryState(applicationsOutDir), applicationOutputsBefore, "Public generation must not change private application outputs");

const source = (name) => readFileSync(path.join(rootDir, "docs", name), "utf8");
const ko = source("resume.html");
const en = source("resume-en.html");

// 프론트엔드 · 백엔드판은 하나로 합쳤다. 옛 원본 · PDF가 되살아나지 않게 막고, 옛 주소는 통합본으로 넘긴다.
for (const retired of [
  "docs/resume-frontend.html",
  "docs/resume-backend.html",
  "docs/resume-frontend-en.html",
  "docs/resume-backend-en.html",
  "public/resume-backend.pdf",
  "public/resume-backend-en.pdf",
]) {
  assert.equal(existsSync(path.join(rootDir, retired)), false, `${retired} must stay retired after the resume merge`);
}
const vercel = JSON.parse(readFileSync(path.join(rootDir, "vercel.json"), "utf8"));
for (const [from, to] of [
  ["/resume-backend.pdf", "/resume.pdf"],
  ["/resume-backend-en.pdf", "/resume-en.pdf"],
]) {
  assert.ok(
    vercel.redirects.some((redirect) => redirect.source === from && redirect.destination === to),
    `${from} must redirect to ${to} so links already sent keep working`,
  );
}

for (const [label, text] of [
  ["ko", ko],
  ["en", en],
]) {
  assert.doesNotMatch(text, /Google Forms|자동화 테스트 221개|자동화 테스트 84개|주간 보고서|weekly report/i, `The ${label} resume must not foreground unfinished work or stale test counts`);
  assert.doesNotMatch(text, /기타 경험|디저트39/, `The ${label} resume must omit unrelated experience`);
  assert.doesNotMatch(text, /지원동기|class="motivation"|플레이스앤/, `The ${label} resume must not include company-specific motivation content`);
  // 옵티마이저 추정 행 수는 실측처럼 읽혀서 싣지 않는다.
  assert.doesNotMatch(text, /2\.1조|2\.1 trillion/, `The ${label} resume must not cite the optimizer's estimated row count`);
  // 머리 성과 숫자는 사이트 · 포트폴리오 PDF와 같다.
  assert.match(text, /63[~–]69/, `The ${label} resume must lead with the measured query result`);
  assert.match(text, /300[~–]400/, `The ${label} resume must lead with the bulk-download result`);
  assert.match(text, /108<span class="c">,<\/span>237/, `The ${label} resume must lead with the QR issuance figure`);
  // 사이트와 같은 글꼴.
  assert.match(text, /family=Noto\+Sans\+KR/, `The ${label} resume must use Noto Sans KR`);
}

// 한국어판은 흰 바탕에 장식 색 없이 둔다(2026-09-29 결정). 영문판은 사이트와 같은 주홍 강조를 쓴다.
assert.doesNotMatch(ko, /#e5482b|--accent/, "The Korean resume must stay free of accent colour");
assert.match(en, /--accent:\s*#e5482b;/, "The English resume must use the site's vermilion accent");

// 한국어판은 사진을 싣고, 영문판(해외 지원용)은 싣지 않는다.
assert.match(ko, /<img class="photo" src="data:image\/jpeg;base64,/, "The Korean resume must include the photo");
assert.doesNotMatch(en, /<img class="photo"/, "The English resume must not include a photo");
assert.match(en, /www\.yongjaekwon\.com\/\?lang=en/, "The English resume must link to the English portfolio");

// 통합본은 실무 두 프로젝트의 화면 · 서버 근거와 개인 · 팀 프로젝트를 모두 담는다.
for (const pattern of [
  /첨부파일 오연결 원인 제거/,
  /서버 2대에서 똑같이 걸리는 인증번호 요청 제한/,
  /학교 방문 점검 전산화/,
  /개교육청 학부모 공개 접수 화면|개 교육청 학부모 공개 접수 화면/,
  /운영 중인 점검 데이터 정리/,
  /티켓러시/,
  /오늘사이/,
  /ReachRich/,
  /SSAFAST/,
]) {
  assert.match(ko, pattern, `The Korean resume must include ${pattern}`);
}

for (const [publicName, finalName] of [
  ["resume.pdf", "yongjae-kwon-web-developer-resume.pdf"],
  ["resume-en.pdf", "yongjae-kwon-web-developer-resume-en.pdf"],
]) {
  assert.equal(
    digest(path.join(rootDir, "public", publicName)),
    digest(path.join(rootDir, "output", "pdf", finalName)),
    `Public and local PDFs must be identical for ${publicName}`,
  );
}

console.log("Public resume generation verification passed.");
