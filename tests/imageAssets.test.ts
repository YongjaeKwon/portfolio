import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { featuredProjects } from "../src/data/portfolio";

const root = new URL("../", import.meta.url);
const file = (path: string) => fileURLToPath(new URL(path, root));

const expectedAssets = [
  { output: "public/my-photo-224.webp", width: 224, height: 224, maxBytes: 50_000 },
  { output: "public/projects/ssafast-preview.webp", width: 960, height: 540, maxBytes: 120_000 },
  { output: "public/projects/ddoing-preview.webp", width: 800, height: 459, maxBytes: 120_000 },
  { output: "public/projects/modac-preview.webp", width: 600, height: 338, maxBytes: 120_000 },
  { output: "public/projects/quant-core-preview.webp", width: 960, height: 436, maxBytes: 120_000 },
] as const;

const expectedProjects = {
  ssafast: { src: "/projects/ssafast.png", width: 1200, height: 675, previewSrc: "/projects/ssafast-preview.webp", previewWidth: 960, previewHeight: 540 },
  ddoing: { src: "/projects/ddoing.png", width: 800, height: 459, previewSrc: "/projects/ddoing-preview.webp", previewWidth: 800, previewHeight: 459 },
  modac: { src: "/projects/modac.png", width: 600, height: 338, previewSrc: "/projects/modac-preview.webp", previewWidth: 600, previewHeight: 338 },
  "quant-lab": { src: "/projects/quant-core.png", width: 1200, height: 545, previewSrc: "/projects/quant-core-preview.webp", previewWidth: 960, previewHeight: 436 },
} as const;

describe("optimized image assets", () => {
  it("matches every committed WebP to the canonical deterministic render", async () => {
    const { imageJobs, renderImageJob, resolveImagePath } = await import("../scripts/image-jobs.mjs");

    expect(imageJobs.map(({ output }) => output)).toEqual(expectedAssets.map(({ output }) => output));

    for (const expected of expectedAssets) {
      const job = imageJobs.find(({ output }) => output === expected.output);
      expect(job).toBeDefined();

      const committed = await readFile(file(expected.output));
      const metadata = await sharp(committed).metadata();
      const size = await stat(file(expected.output));
      const rendered = await renderImageJob(job!);

      expect(resolveImagePath(job!.output)).toBe(file(expected.output));
      expect(metadata.format).toBe("webp");
      expect(metadata.width).toBe(expected.width);
      expect(metadata.height).toBe(expected.height);
      expect(size.size).toBeLessThan(expected.maxBytes);
      expect(Buffer.compare(rendered, committed)).toBe(0);
    }
  });

  it("maps project sources and dimensions to their actual image metadata", async () => {
    for (const [id, expected] of Object.entries(expectedProjects)) {
      const project = featuredProjects.find((item) => item.id === id);
      expect(project?.image).toMatchObject(expected);

      const fullMetadata = await sharp(file(`public${expected.src}`)).metadata();
      const previewMetadata = await sharp(file(`public${expected.previewSrc}`)).metadata();
      expect([project?.image?.width, project?.image?.height]).toEqual([fullMetadata.width, fullMetadata.height]);
      expect([project?.image?.previewWidth, project?.image?.previewHeight]).toEqual([previewMetadata.width, previewMetadata.height]);
    }
  });

  it("uses preview dimensions in cards and full dimensions in the modal", async () => {
    const projects = await readFile(file("src/views/ProjectsView.vue"), "utf8");
    const modal = projects.slice(projects.indexOf("<Teleport"));

    expect(projects).toContain(':src="item.project.image.previewSrc ?? item.project.image.src"');
    expect(projects).toContain(':width="item.project.image.previewWidth ?? item.project.image.width"');
    expect(projects).toContain(':height="item.project.image.previewHeight ?? item.project.image.height"');
    expect(projects).toContain('loading="lazy"');
    expect(modal).toContain(':src="activeProject.project.image.src"');
    expect(modal).toContain(':width="activeProject.project.image.width"');
    expect(modal).toContain(':height="activeProject.project.image.height"');
    expect(modal).not.toContain("previewSrc");
  });

  it("prioritizes the hero image", async () => {
    const home = await readFile(file("src/views/HomeView.vue"), "utf8");
    const html = await readFile(file("index.html"), "utf8");
    expect(home).toContain('fetchpriority="high"');
    expect(home).toContain('loading="eager"');
    expect(html).toContain('href="/my-photo-224.webp"');
    expect(html).toContain('rel="preload"');
  });

  it("paints the hero LCP image immediately while keeping the badge entrance", async () => {
    const home = await readFile(file("src/views/HomeView.vue"), "utf8");
    const imageSource = home.indexOf('src="/my-photo-224.webp"');
    const imageStart = home.lastIndexOf("<img", imageSource);
    const wrapperStart = home.lastIndexOf("<div", imageStart);
    const wrapperEnd = home.indexOf(">", wrapperStart);
    const imageEnd = home.indexOf("/>", imageStart) + 2;
    const badgeStart = home.indexOf("<div", imageEnd);
    const badgeEnd = home.indexOf(">", badgeStart);

    expect(imageSource).toBeGreaterThan(-1);
    expect(imageStart).toBeGreaterThan(-1);
    expect(wrapperStart).toBeGreaterThan(-1);
    expect(home.slice(wrapperEnd + 1, imageStart).trim()).toBe("");

    const wrapperClasses = home
      .slice(wrapperStart, wrapperEnd + 1)
      .match(/class="([^"]*)"/)?.[1]
      .split(/\s+/);
    const badgeOpeningTag = home.slice(badgeStart, badgeEnd + 1);
    const badgeClasses = badgeOpeningTag.match(/class="([^"]*)"/)?.[1].split(/\s+/);

    expect(wrapperClasses).not.toContain("hero-enter");
    expect(badgeClasses).toContain("hero-enter");
    expect(home.slice(badgeEnd + 1, home.indexOf("</div>", badgeEnd)).trim()).toBe(
      "Web Developer",
    );
  });
});
