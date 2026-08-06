import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const scrollListener = /addEventListener\s*\(\s*["']scroll["']/;
const fontStylesheetOnload = "this.onload=null;this.rel='stylesheet'";
const fontStylesheetUrls = [
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css",
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap",
];
const fontPreconnectOrigins = [
  "https://cdn.jsdelivr.net",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];

type LinkAttributes = Record<string, string>;

const parseLinks = (html: string): LinkAttributes[] =>
  Array.from(html.matchAll(/<link\b([^>]*)>/gi), ([, attributeSource]) => {
    const attributes: LinkAttributes = {};
    for (const [, name, , rawValue] of attributeSource.matchAll(
      /([^\s=/>]+)(?:\s*=\s*(["'])(.*?)\2)?/gs,
    )) {
      const normalizedName = name.toLowerCase();
      const value = rawValue ?? "";
      attributes[normalizedName] =
        normalizedName === "href" ? value.replace(/&amp;/g, "&") : value;
    }
    return attributes;
  });

const relTokens = (link: LinkAttributes) =>
  (link.rel ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());

const expectNonBlockingFontStylesheets = (html: string) => {
  const noscriptBlocks = Array.from(
    html.matchAll(/<noscript\b[^>]*>([\s\S]*?)<\/noscript>/gi),
    ([, content]) => content,
  );
  const outsideLinks = parseLinks(
    html.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ""),
  );
  const insideLinkGroups = noscriptBlocks.map(parseLinks);
  const insideLinks = insideLinkGroups.flat();

  expect(insideLinkGroups).toHaveLength(fontStylesheetUrls.length);
  expect(insideLinkGroups.every((links) => links.length === 1)).toBe(true);

  for (const url of fontStylesheetUrls) {
    const outsideFontLinks = outsideLinks.filter((link) => link.href === url);
    expect(outsideFontLinks).toHaveLength(1);
    expect(outsideFontLinks[0]).toMatchObject({
      rel: "preload",
      as: "style",
      href: url,
      onload: fontStylesheetOnload,
    });

    const fallbackLinks = insideLinks.filter((link) => link.href === url);
    expect(fallbackLinks).toHaveLength(1);
    expect(fallbackLinks[0]).toMatchObject({ rel: "stylesheet", href: url });
  }

  expect(
    outsideLinks.filter(
      (link) =>
        /^https?:\/\//i.test(link.href ?? "") && relTokens(link).includes("stylesheet"),
    ),
  ).toHaveLength(0);
  expect(
    [...outsideLinks, ...insideLinks].filter(
      (link) => link.onload === fontStylesheetOnload,
    ),
  ).toHaveLength(2);
  const preconnectLinks = outsideLinks.filter((link) => relTokens(link).includes("preconnect"));
  expect(preconnectLinks.map((link) => link.href).sort()).toEqual(
    [...fontPreconnectOrigins].sort(),
  );
  expect(
    preconnectLinks.find((link) => link.href === "https://fonts.gstatic.com"),
  ).toHaveProperty("crossorigin");
};

const expectImportedAndCalled = (code: string, symbol: string) => {
  expect(code).toMatch(
    new RegExp(`import\\s*\\{[^}]*\\b${symbol}\\b[^}]*\\}\\s*from\\s*["'][^"']+["']`),
  );
  expect(code).toMatch(new RegExp(`\\b${symbol}\\s*\\(`));
};

describe("scroll performance contracts", () => {
  it("loads external font stylesheets without blocking rendering", async () => {
    const html = await source("index.html");
    expectNonBlockingFontStylesheets(html);
  });

  it.each([
    {
      defect: "a missing onload swap",
      mutate: (html: string) =>
        html.replace(/\s+onload="this\.onload=null;this\.rel='stylesheet'"/, ""),
    },
    {
      defect: "a fallback pointing at the wrong URL",
      mutate: (html: string) =>
        html.replace(
          /(<noscript>[\s\S]*?<link[\s\S]*?href=")[^"]+/,
          "$1https://example.com/wrong-font.css",
        ),
    },
    {
      defect: "a remaining blocking external stylesheet",
      mutate: (html: string) =>
        html.replace(
          "</head>",
          '<link rel="author STYLESHEET" href="https://example.com/blocking.css" />\n  </head>',
        ),
    },
  ])("rejects $defect", async ({ mutate }) => {
    const html = await source("index.html");
    const mutated = mutate(html);
    expect(mutated).not.toBe(html);
    expect(() => expectNonBlockingFontStylesheets(mutated)).toThrow();
  });

  it("accepts font link attributes in a different order and quote style", async () => {
    const html = await source("index.html");
    const reordered = html.replace(
      /<link\s+rel="preload"\s+as="style"[\s\S]*?pretendardvariable-dynamic-subset\.css[\s\S]*?\/>/,
      `<link href='${fontStylesheetUrls[0]}' as='style' onload="${fontStylesheetOnload}" rel='preload' />`,
    );
    expect(reordered).not.toBe(html);
    expect(() => expectNonBlockingFontStylesheets(reordered)).not.toThrow();
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
