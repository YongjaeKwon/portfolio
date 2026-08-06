import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { imageJobs, renderImageJob, resolveImagePath } from "./image-jobs.mjs";

for (const job of imageJobs) {
  const output = resolveImagePath(job.output);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, await renderImageJob(job));
}
