import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const resolveImagePath = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));

export const imageJobs = [
  { input: "src/public/my-photo.png", output: "public/my-photo-224.webp", width: 224, height: 224, fit: "cover" },
  { input: "public/projects/ssafast.png", output: "public/projects/ssafast-preview.webp", width: 960, height: 640, fit: "inside" },
  { input: "public/projects/ddoing.png", output: "public/projects/ddoing-preview.webp", width: 960, height: 640, fit: "inside" },
  { input: "public/projects/modac.png", output: "public/projects/modac-preview.webp", width: 960, height: 640, fit: "inside" },
];

export const renderImageJob = (job) => sharp(resolveImagePath(job.input))
  .resize({ width: job.width, height: job.height, fit: job.fit, withoutEnlargement: true })
  .webp({ quality: 82, effort: 6 })
  .toBuffer();
