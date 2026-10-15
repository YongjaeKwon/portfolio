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
const resume = source("resume.html");
const career = source("career.html");
for (const document of [resume, career]) {
  assert.match(document, /<img class="photo" src="data:image\/jpeg;base64,/);
  assert.match(document, /SR30/);
  assert.match(document, /운영 반영 전/);
  assert.doesNotMatch(document, /63[~–]69|108,237|quant-lab|Mockito|Testcontainers|Google Forms/);
  assert.doesNotMatch(document, /지원동기|플레이스앤/);
}
assert.match(resume, /https:\/\/github.com\/YongjaeKwon\/oneul-sai/);
assert.doesNotMatch(career, /오늘사이|티켓러시|ReachRich/);

const vercel = JSON.parse(readFileSync(path.join(rootDir, "vercel.json"), "utf8"));
for (const from of ["/resume-backend.pdf", "/resume-backend-en.pdf", "/resume-en.pdf"]) {
  assert.ok(vercel.redirects.some((redirect) => redirect.source === from && redirect.destination === "/resume.pdf"));
}
assert.equal(existsSync(path.join(rootDir, "public", "resume-en.pdf")), false);
for (const [publicName, finalName] of [
  ["resume.pdf", "yongjae-kwon-web-developer-resume.pdf"],
  ["career.pdf", "yongjae-kwon-career.pdf"],
]) {
  assert.equal(digest(path.join(rootDir, "public", publicName)), digest(path.join(rootDir, "output", "pdf", finalName)));
}
console.log("Public application document generation verification passed.");
