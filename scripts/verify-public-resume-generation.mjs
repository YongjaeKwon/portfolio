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

  return {
    exists: true,
    files: readdirSync(directory)
      .sort()
      .map((name) => {
        const filePath = path.join(directory, name);
        const stat = statSync(filePath);
        return { name, hash: digest(filePath), modified: stat.mtimeMs, size: stat.size };
      }),
  };
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

const frontendResumeSource = readFileSync(path.join(rootDir, "docs", "resume-frontend.html"), "utf8");
const backendResumeSource = readFileSync(path.join(rootDir, "docs", "resume-backend.html"), "utf8");
const frontendEnResumeSource = readFileSync(path.join(rootDir, "docs", "resume-frontend-en.html"), "utf8");
const backendEnResumeSource = readFileSync(path.join(rootDir, "docs", "resume-backend-en.html"), "utf8");

for (const [label, source] of [
  ["frontend", frontendResumeSource],
  ["backend", backendResumeSource],
  ["frontend-en", frontendEnResumeSource],
  ["backend-en", backendEnResumeSource],
]) {
  assert.match(
    source,
    /--accent:\s*#15b373;/,
    `The ${label} resume must use the approved green accent`,
  );
  assert.doesNotMatch(
    source,
    /Google Forms|자동화 테스트 221개|자동화 테스트 84개/,
    `The ${label} resume must not foreground unfinished work or stale test counts`,
  );
  assert.doesNotMatch(
    source,
    /기타 경험|디저트39/,
    `The ${label} resume must omit unrelated experience`,
  );
  assert.doesNotMatch(
    source,
    /지원동기|class="motivation"|플레이스앤/,
    `The ${label} resume must not include company-specific motivation content`,
  );
}

// 프론트엔드 기준본 — 단일 타이틀과 프론트엔드 근거 문구를 잠근다.
assert.match(
  frontendResumeSource,
  />Frontend Developer</,
  "The frontend resume must use the single Frontend Developer title",
);
assert.doesNotMatch(
  frontendResumeSource,
  /Full-stack/,
  "The frontend resume must not dilute the title with Full-stack",
);
assert.match(
  frontendResumeSource,
  /사용자가 복잡한 업무를 놓치지 않도록 입력 · 진행 · 오류 상태를 화면에 분명히 보여주고/,
  "The frontend resume must include the approved introduction",
);
assert.match(
  frontendResumeSource,
  /Vue 공통 상태 누수로 생긴 첨부파일 오연결 방지/,
  "The frontend resume must include the verified frontend state-management case",
);
assert.match(
  frontendResumeSource,
  /React Hook Form의 FormProvider · useFieldArray로 반복 · 중첩 입력을 관리하고/,
  "The frontend resume must include the React and TypeScript project evidence",
);
assert.match(
  frontendResumeSource,
  /React Router로 대시보드 · 매매일지 · 종목 등급 · 주간 보고서를 경로별로 나눴습니다/,
  "The frontend resume must explain how React Router was used",
);
assert.match(
  frontendResumeSource,
  /작은 화면에서도 읽는 순서가 유지되도록 카드 · 상세 · 입력을 한 열로 두고, 넓은 화면에서만 2열 · 좌우 구조로 확장했습니다/,
  "The frontend resume must explain the responsive UI approach",
);
assert.match(
  frontendResumeSource,
  /숨긴 탭의 조회 중단 · 복귀와 연속 클릭의 중복 제출 방지/,
  "The frontend resume must describe behavior-focused frontend testing",
);
assert.match(
  frontendResumeSource,
  /학부모 대상 공개 접수 화면/,
  "The frontend resume must include the public enrollment screens case",
);

// 백엔드 기준본 — 단일 타이틀과 서버·운영 근거 문구를 잠근다.
assert.match(
  backendResumeSource,
  />Backend Developer</,
  "The backend resume must use the single Backend Developer title",
);
assert.match(
  backendResumeSource,
  /현장의 복잡한 업무를 사용자가 끊김 없이 처리할 수 있는 시스템으로 만드는/,
  "The backend resume must include the approved introduction",
);
assert.match(
  backendResumeSource,
  /대량 첨부파일 다운로드 비동기 전환/,
  "The backend resume must include the async download case",
);
assert.match(
  backendResumeSource,
  /외부 API 키 노출 제거 및 호출 경로 공통화/,
  "The backend resume must include the API-key consolidation case",
);
assert.match(
  backendResumeSource,
  /비밀번호 초기화 인증번호 요청 제한/,
  "The backend resume must include the distributed rate-limiting case",
);
assert.match(
  backendResumeSource,
  /시리얼 기준 재정립과 중복 정리/,
  "The backend resume must include the production data-cleanup case",
);
assert.match(
  backendResumeSource,
  /Hazelcast 분산 맵에 저장해 서버 2대 어디로 조회해도/,
  "The backend resume must state the distributed zip-job state",
);

// 영문판 — 단일 타이틀, 영문 사이트로 돌아오는 포트폴리오 링크, 핵심 근거 문구를 잠근다.
assert.match(
  frontendEnResumeSource,
  />Frontend Developer</,
  "The English frontend resume must use the single Frontend Developer title",
);
assert.doesNotMatch(
  frontendEnResumeSource,
  /Full-stack/,
  "The English frontend resume must not dilute the title with Full-stack",
);
assert.match(
  frontendEnResumeSource,
  /www\.yongjaekwon\.com\/\?lang=en/,
  "The English frontend resume must link to the English portfolio",
);
assert.match(
  frontendEnResumeSource,
  /FormProvider and useFieldArray/,
  "The English frontend resume must include the React project evidence",
);
assert.match(
  backendEnResumeSource,
  />Backend Developer</,
  "The English backend resume must use the single Backend Developer title",
);
assert.match(
  backendEnResumeSource,
  /www\.yongjaekwon\.com\/\?lang=en/,
  "The English backend resume must link to the English portfolio",
);
assert.match(
  backendEnResumeSource,
  /Rate-limiting password-reset codes across two servers/,
  "The English backend resume must include the distributed rate-limiting case",
);
assert.match(
  backendEnResumeSource,
  /Re-keying live inspection data/,
  "The English backend resume must include the production data-cleanup case",
);
assert.match(
  frontendEnResumeSource,
  /Public enrollment screens for parents/,
  "The English frontend resume must include the public enrollment screens case",
);

for (const [publicName, finalName] of [
  ["resume.pdf", "yongjae-kwon-frontend-developer-resume.pdf"],
  ["resume-backend.pdf", "yongjae-kwon-backend-developer-resume.pdf"],
  ["resume-en.pdf", "yongjae-kwon-frontend-developer-resume-en.pdf"],
  ["resume-backend-en.pdf", "yongjae-kwon-backend-developer-resume-en.pdf"],
]) {
  assert.equal(
    digest(path.join(rootDir, "public", publicName)),
    digest(path.join(rootDir, "output", "pdf", finalName)),
    `Public and local PDFs must be identical for ${publicName}`,
  );
}

console.log("Public resume generation verification passed.");
