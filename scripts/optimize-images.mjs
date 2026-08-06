import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const file = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));

const jobs = [
  { input: "src/public/my-photo.png", output: "public/my-photo-224.webp", width: 224, height: 224, fit: "cover" },
  { input: "public/projects/ssafast.png", output: "public/projects/ssafast-preview.webp", width: 960, height: 640, fit: "inside" },
  { input: "public/projects/ddoing.png", output: "public/projects/ddoing-preview.webp", width: 960, height: 640, fit: "inside" },
  { input: "public/projects/modac.png", output: "public/projects/modac-preview.webp", width: 960, height: 640, fit: "inside" },
  { input: "public/projects/quant-core.png", output: "public/projects/quant-core-preview.webp", width: 960, height: 640, fit: "inside" },
];

for (const job of jobs) {
  await mkdir(file(job.output.substring(0, job.output.lastIndexOf("/"))), { recursive: true });
  await sharp(file(job.input))
    .resize({ width: job.width, height: job.height, fit: job.fit, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(file(job.output));
}
