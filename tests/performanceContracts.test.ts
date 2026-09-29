import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const scrollListener = /addEventListener\s*\(\s*["']scroll["']/;
const fontStylesheetOnload = "this.onload=null;this.rel='stylesheet'";
const fontStylesheetUrls = [
  "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@900&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap",
];
const fontPreconnectOrigins = [
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
  ).toHaveLength(1);
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
  it("uses system Korean fonts and loads only display fonts without blocking rendering", async () => {
    const html = await source("index.html");
    const css = await source("src/assets/index.css");
    const defaultRoot = css.slice(0, css.indexOf(':root[data-theme="light"]'));
    expectNonBlockingFontStylesheets(html);
    expect(html).not.toContain("pretendardvariable-dynamic-subset.css");
    expect(html).not.toContain("cdn.jsdelivr.net");
    expect(defaultRoot).not.toMatch(/--font-body\s*:[^;]*Pretendard/s);
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
      /<link\s+rel="preload"\s+as="style"[\s\S]*?fonts\.googleapis\.com\/css2\?family=Noto\+Sans\+KR[\s\S]*?\/>/,
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
    const navbar = await source("src/components/Navbar.vue");
    const scrollTop = await source("src/components/ScrollToTop.vue");
    expectImportedAndCalled(navbar, "useScrollMetrics");
    expectImportedAndCalled(scrollTop, "useScrollMetrics");
    expect(navbar).not.toMatch(scrollListener);
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
    const mobileIntrinsicSizes = {
      techstack: 1047,
      experience: 3646,
      projects: 4210,
      education: 699,
      contact: 664,
    };
    for (const [id, height] of Object.entries(mobileIntrinsicSizes)) {
      expect(css).toMatch(
        new RegExp(`\\.portfolio-flow\\s*>\\s*section#${id}\\s*\\{\\s*contain-intrinsic-size:\\s*auto\\s+${height}px;\\s*\\}`),
      );
    }
  });

  it("settles deferred section layout before anchor navigation", async () => {
    const app = await source("src/App.vue");
    const css = await source("src/assets/index.css");

    expectImportedAndCalled(app, "createSectionNavigator");
    expect(app).toMatch(/const\s+sectionNavigator\s*=\s*createSectionNavigator\s*\(\s*\)/);
    expect(app).toMatch(/sectionNavigator\.navigate\s*\(/);
    expect(app).toMatch(/scrollSectionIntoView\s*\(\s*target\s*,\s*["']instant["']\s*\)/);
    expect(app).toMatch(/scrollSectionIntoView\s*\(\s*section\s*,\s*["']smooth["']\s*\)/);
    expect(app).toMatch(/initialHashTimer\s*=\s*window\.setTimeout\s*\(/);
    expect(app).toMatch(/clearTimeout\s*\(\s*initialHashTimer\s*\)/);
    expect(app).toMatch(
      /const\s+scrollToSection[\s\S]*?cancelInitialHashNavigation\s*\(\s*\)[\s\S]*?scrollSectionIntoView/,
    );
    expect(app).toMatch(
      /cleanup\s*=\s*\(\)\s*=>\s*\{[\s\S]*?cancelInitialHashNavigation\s*\(\s*\)[\s\S]*?sectionNavigator\.cancel\s*\(\s*\)/,
    );
    expect(css).toMatch(
      /\.portfolio-flow\s*>\s*section:not\(\s*#hero\s*\)\.anchor-layout-ready\s*\{[^}]*content-visibility\s*:\s*visible\s*;/s,
    );
  });
});
