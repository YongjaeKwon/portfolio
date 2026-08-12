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

const publicResumeSource = readFileSync(path.join(rootDir, "docs", "resume-general.html"), "utf8");

assert.match(
  publicResumeSource,
  /--accent:\s*#15b373;/,
  "The general resume must use the approved green accent",
);
assert.match(
  publicResumeSource,
  /현장의 복잡한 업무를 사용자가 끊김 없이 처리할 수 있는 시스템으로 만드는/,
  "The public resume must include the approved introduction",
);
assert.doesNotMatch(
  publicResumeSource,
  /지원동기|class="motivation"|플레이스앤/,
  "The public resume must not include company-specific motivation content",
);

assert.equal(
  digest(path.join(rootDir, "public", "resume.pdf")),
  digest(path.join(rootDir, "output", "pdf", "yongjae-kwon-web-developer-resume.pdf")),
  "Public and local general-resume PDFs must be identical",
);

console.log("Public resume generation verification passed.");
