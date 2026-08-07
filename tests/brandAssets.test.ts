import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const file = (path: string) => fileURLToPath(new URL(path, root));

describe("YK Flow brand assets", () => {
  it.each([
    ["public/brand/yongjae-mark.svg", "svg", 64, 64],
    ["public/brand/yongjae-mark-512.png", "png", 512, 512],
    ["public/favicon-32x32.png", "png", 32, 32],
    ["public/apple-touch-icon.png", "png", 180, 180],
    ["public/og-image-v3.png", "png", 1200, 630],
  ] as const)("renders %s with the expected metadata", async (path, format, width, height) => {
    const metadata = await sharp(file(path)).metadata();
    expect(metadata).toMatchObject({ format, width, height });
  });

  it("ships a real multi-size ICO instead of a renamed raster file", async () => {
    const ico = await readFile(file("public/favicon.ico"));
    expect(ico.subarray(0, 4)).toEqual(Buffer.from([0, 0, 1, 0]));
    expect(ico.readUInt16LE(4)).toBe(4);
  });

  it("keeps social media artwork within a practical transfer budget", async () => {
    const og = await stat(file("public/og-image-v3.png"));
    expect(og.size).toBeLessThan(1_000_000);
  });

  it("wires the refreshed assets into the document and shared layout", async () => {
    const [html, navbar, footer, readme] = await Promise.all([
      readFile(file("index.html"), "utf8"),
      readFile(file("src/components/Navbar.vue"), "utf8"),
      readFile(file("src/components/Footer.vue"), "utf8"),
      readFile(file("README.md"), "utf8"),
    ]);

    expect(html).toContain('/favicon-32x32.png');
    expect(html).toContain('/apple-touch-icon.png');
    expect(html).toContain('/og-image-v3.png');
    expect(navbar).toContain('/brand/yongjae-mark.svg');
    expect(footer).toContain('/brand/yongjae-mark.svg');
    expect(readme).toContain('public/og-image-v3.png');
  });
});
