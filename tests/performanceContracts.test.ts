import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const scrollListener = /addEventListener\s*\(\s*["']scroll["']/;

const expectImportedAndCalled = (code: string, symbol: string) => {
  expect(code).toMatch(
    new RegExp(`import\\s*\\{[^}]*\\b${symbol}\\b[^}]*\\}\\s*from\\s*["'][^"']+["']`),
  );
  expect(code).toMatch(new RegExp(`\\b${symbol}\\s*\\(`));
};

describe("scroll performance contracts", () => {
  it("loads external font stylesheets without blocking rendering", async () => {
    const html = await source("index.html");
    expect(html.match(/rel="preload"\s+as="style"/g)).toHaveLength(2);
    expect(html).toContain("this.rel='stylesheet'");
    expect(html.match(/<noscript>/g)).toHaveLength(2);
  });

  it("does not scan section geometry from Navbar scroll handlers", async () => {
    const navbar = await source("src/components/Navbar.vue");
    expect(navbar).toMatch(/new\s+IntersectionObserver\s*\(/);
    expect(navbar).not.toMatch(/\.getBoundingClientRect\s*\(/);
    expect(navbar).not.toMatch(scrollListener);
    expect(navbar).toMatch(/observerActiveSection\.value/);
    expect(navbar).toMatch(
      /activeSection\.value\s*=\s*atBottom\s*\?[\s\S]*?:\s*observerActiveSection\.value/,
    );
  });

  it("shares scroll state across scroll UI components", async () => {
    const progress = await source("src/components/ScrollProgress.vue");
    const scrollTop = await source("src/components/ScrollToTop.vue");
    expectImportedAndCalled(progress, "useScrollMetrics");
    expectImportedAndCalled(scrollTop, "useScrollMetrics");
    expect(progress).not.toMatch(scrollListener);
    expect(scrollTop).not.toMatch(scrollListener);
  });

  it("defers below-the-fold section rendering", async () => {
    const css = await source("src/assets/index.css");
    const hasDeferredSection = Array.from(
      css.matchAll(
        /\.portfolio-flow\s*>\s*section:not\(\s*#hero\s*\)\s*\{(?<rules>[^}]*)\}/gs,
      ),
    ).some(
      (deferredSection) =>
        /content-visibility\s*:\s*auto\s*;/.test(deferredSection.groups?.rules ?? "") &&
        /contain-intrinsic-size\s*:\s*auto\s+1000px\s*;/.test(
          deferredSection.groups?.rules ?? "",
        ),
    );
    expect(hasDeferredSection).toBe(true);
  });

  it("batches pointer effects by animation frame", async () => {
    const app = await source("src/App.vue");
    const projects = await source("src/views/ProjectsView.vue");
    const css = await source("src/assets/index.css");
    expectImportedAndCalled(app, "createLatestFrameScheduler");
    expectImportedAndCalled(projects, "createLatestFrameScheduler");

    expect(app.match(/\.addEventListener\s*\(\s*["']change["']/g) ?? []).toHaveLength(2);
    expect(app.match(/\.removeEventListener\s*\(\s*["']change["']/g) ?? []).toHaveLength(2);
    expect(projects.match(/\.addEventListener\s*\(\s*["']change["']/g) ?? []).toHaveLength(2);
    expect(projects.match(/\.removeEventListener\s*\(\s*["']change["']/g) ?? []).toHaveLength(2);

    expect(projects).toMatch(/addEventListener\s*\(\s*["']pointerenter["']/);
    expect(projects).toMatch(
      /const\s+activeScrollOptions\s*=\s*\{\s*passive\s*:\s*true\s*,\s*capture\s*:\s*true\s*\}/,
    );
    expect(projects).toMatch(
      /addEventListener\s*\(\s*["']scroll["']\s*,\s*invalidateGeometry\s*,\s*activeScrollOptions\s*\)/,
    );
    expect(projects).toMatch(
      /removeEventListener\s*\(\s*["']scroll["']\s*,\s*invalidateGeometry\s*,\s*activeScrollOptions\s*\)/,
    );
    expect(projects).toMatch(/addEventListener\s*\(\s*["']resize["']/);
    expect(projects).toMatch(/removeEventListener\s*\(\s*["']resize["']/);
    expect(projects).toMatch(/new\s+ResizeObserver\s*\(/);
    expect(projects).toMatch(/\.observe\s*\(\s*el\s*\)/);
    expect(projects).toMatch(/\.disconnect\s*\(\s*\)/);
    expect(projects).toMatch(/\.matches\s*\(\s*["']:hover["']\s*\)/);
    expect(projects).toMatch(
      /const\s+point\s*=\s*\{\s*x\s*:\s*event\.clientX\s*,\s*y\s*:\s*event\.clientY\s*\}[\s\S]*?scheduler\.schedule\s*\(\s*point\s*\)/,
    );
    expect(projects).not.toMatch(
      /createLatestFrameScheduler(?:\s*<\s*PointerEvent\s*>)?\s*\(\s*\(\s*event\s*:\s*PointerEvent/,
    );

    const moveStart = projects.indexOf("const onMove");
    const moveEnd = projects.indexOf("const onLeave", moveStart);
    const enterStart = projects.indexOf("const onEnter");
    const activateStart = projects.indexOf("const activateHover");
    const activateEnd = projects.indexOf("const onEnter", activateStart);
    const schedulerStart = projects.indexOf("const scheduler");
    const schedulerEnd = projects.indexOf("const invalidateGeometry", schedulerStart);
    const enterHandler = projects.slice(enterStart, moveStart);
    const activateHandler = projects.slice(activateStart, activateEnd);
    const schedulerCallback = projects.slice(schedulerStart, schedulerEnd);
    const moveHandler = projects.slice(moveStart, moveEnd);
    expect(enterStart).toBeGreaterThan(-1);
    expect(activateStart).toBeGreaterThan(-1);
    expect(schedulerStart).toBeGreaterThan(-1);
    expect(moveStart).toBeGreaterThan(-1);
    expect(moveEnd).toBeGreaterThan(moveStart);
    expect(enterHandler).toMatch(/activateHover\s*\(\s*point\s*\)/);
    expect(enterHandler).not.toMatch(/getBoundingClientRect|\.style\./);
    expect(moveHandler).toMatch(
      /^const onMove\s*=\s*\(event:\s*PointerEvent\)\s*=>\s*\{\s*const point\s*=\s*\{\s*x:\s*event\.clientX,\s*y:\s*event\.clientY\s*\};\s*latestPoint\s*=\s*point;\s*scheduler\.schedule\(point\);\s*\};\s*$/,
    );
    expect(moveHandler).not.toMatch(/activateHover|getBoundingClientRect|\.style\./);
    expect(activateHandler).not.toMatch(/getBoundingClientRect|\.style\./);
    expect(schedulerCallback).toMatch(
      /!hoverActive[\s\S]*?el\.matches\s*\(\s*["']:hover["']\s*\)[\s\S]*?activateHover\s*\(\s*point\s*\)/,
    );
    expect(schedulerCallback).toMatch(
      /getBoundingClientRect\s*\([\s\S]*?\.style\.transition[\s\S]*?\.style\.transform/,
    );
    expect(projects).toMatch(
      /rect\s*=\s*null\s*;[\s\S]{0,200}scheduler\.schedule\s*\(\s*latestPoint\s*\)/,
    );

    const geometryReads = projects.match(/getBoundingClientRect\s*\(/g) ?? [];
    expect(geometryReads).toHaveLength(1);
    expect(projects).toMatch(
      /createLatestFrameScheduler[\s\S]*?\.matches\s*\(\s*["']:hover["']\s*\)[\s\S]*?getBoundingClientRect\s*\(/,
    );

    expect(css).toMatch(
      /\.cursor-spotlight\s*\{[\s\S]*?background\s*:\s*radial-gradient\s*\(\s*600px\s+circle\s+at\s+center\s*,/,
    );
  });
});
