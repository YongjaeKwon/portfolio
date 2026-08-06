import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const file = (path: string) => fileURLToPath(new URL(path, root));

const assets = [
  ["public/my-photo-224.webp", 224, 224, 50_000],
  ["public/projects/ssafast-preview.webp", 960, 640, 120_000],
  ["public/projects/ddoing-preview.webp", 960, 640, 120_000],
  ["public/projects/modac-preview.webp", 960, 640, 120_000],
  ["public/projects/quant-core-preview.webp", 960, 640, 120_000],
] as const;

describe("optimized image assets", () => {
  it.each(assets)("keeps %s within dimensions and byte budget", async (path, width, height, maxBytes) => {
    const metadata = await sharp(file(path)).metadata();
    const size = await stat(file(path));
    expect(metadata.width).toBeLessThanOrEqual(width);
    expect(metadata.height).toBeLessThanOrEqual(height);
    expect(size.size).toBeLessThan(maxBytes);
  });

  it("prioritizes the hero and lazily loads project previews", async () => {
    const home = await (await import("node:fs/promises")).readFile(file("src/views/HomeView.vue"), "utf8");
    const projects = await (await import("node:fs/promises")).readFile(file("src/views/ProjectsView.vue"), "utf8");
    const html = await (await import("node:fs/promises")).readFile(file("index.html"), "utf8");
    expect(home).toContain('fetchpriority="high"');
    expect(home).toContain('loading="eager"');
    expect(projects).toContain('loading="lazy"');
    expect(html).toContain('href="/my-photo-224.webp"');
    expect(html).toContain('rel="preload"');
  });
});
