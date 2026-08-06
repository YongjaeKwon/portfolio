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
  it("does not scan section geometry from Navbar scroll handlers", async () => {
    const navbar = await source("src/components/Navbar.vue");
    expect(navbar).toMatch(/new\s+IntersectionObserver\s*\(/);
    expect(navbar).not.toMatch(/\.getBoundingClientRect\s*\(/);
    expect(navbar).not.toMatch(scrollListener);
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
    const deferredSection = css.match(
      /\.portfolio-flow\s*>\s*section:not\(\s*#hero\s*\)\s*\{(?<rules>[^}]*)\}/s,
    );
    expect(deferredSection?.groups?.rules).toMatch(/content-visibility\s*:\s*auto\s*;/);
    expect(deferredSection?.groups?.rules).toMatch(
      /contain-intrinsic-size\s*:\s*auto\s+1000px\s*;/,
    );
  });

  it("batches pointer effects by animation frame", async () => {
    const app = await source("src/App.vue");
    const projects = await source("src/views/ProjectsView.vue");
    expectImportedAndCalled(app, "createLatestFrameScheduler");
    expectImportedAndCalled(projects, "createLatestFrameScheduler");
    expect(projects).toMatch(/addEventListener\s*\(\s*["']pointerenter["']/);
  });
});
