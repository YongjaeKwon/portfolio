import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

describe("scroll performance contracts", () => {
  it("does not scan section geometry from Navbar scroll handlers", async () => {
    const navbar = await source("src/components/Navbar.vue");
    expect(navbar).toContain("IntersectionObserver");
    expect(navbar).not.toContain("getBoundingClientRect");
    expect(navbar).not.toContain('addEventListener("scroll"');
  });

  it("shares scroll state across scroll UI components", async () => {
    const progress = await source("src/components/ScrollProgress.vue");
    const scrollTop = await source("src/components/ScrollToTop.vue");
    expect(progress).toContain("useScrollMetrics");
    expect(scrollTop).toContain("useScrollMetrics");
    expect(progress).not.toContain('addEventListener("scroll"');
    expect(scrollTop).not.toContain('addEventListener("scroll"');
  });

  it("defers below-the-fold section rendering", async () => {
    const css = await source("src/assets/index.css");
    expect(css).toContain("content-visibility: auto");
    expect(css).toContain("contain-intrinsic-size: auto 1000px");
  });

  it("batches pointer effects by animation frame", async () => {
    const app = await source("src/App.vue");
    const projects = await source("src/views/ProjectsView.vue");
    expect(app).toContain("createLatestFrameScheduler");
    expect(projects).toContain("createLatestFrameScheduler");
    expect(projects).toContain('addEventListener("pointerenter"');
  });
});
