import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  NodeTypes,
  parse as parseTemplate,
  type ElementNode,
  type RootNode,
} from "@vue/compiler-dom";
import { parse as parseSfc } from "@vue/compiler-sfc";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { featuredProjects } from "../src/data/portfolio";

const root = new URL("../", import.meta.url);
const file = (path: string) => fileURLToPath(new URL(path, root));

const staticAttribute = (element: ElementNode, name: string) => {
  const attribute = element.props.find(
    (prop) => prop.type === NodeTypes.ATTRIBUTE && prop.name === name,
  );
  return attribute?.type === NodeTypes.ATTRIBUTE ? attribute.value?.content : undefined;
};

const classTokens = (element: ElementNode) =>
  (staticAttribute(element, "class") ?? "").split(/\s+/).filter(Boolean);

const expectHeroLcpAnimationContract = (home: string) => {
  const { descriptor, errors } = parseSfc(home);
  expect(errors).toEqual([]);
  expect(descriptor.template).not.toBeNull();

  const ast = parseTemplate(descriptor.template!.content);
  const elementPaths: ElementNode[][] = [];
  const visit = (
    children: RootNode["children"] | ElementNode["children"],
    ancestors: ElementNode[],
  ) => {
    for (const child of children) {
      if (child.type !== NodeTypes.ELEMENT) continue;
      const path = [...ancestors, child];
      elementPaths.push(path);
      visit(child.children, path);
    }
  };
  visit(ast.children, []);

  const imagePaths = elementPaths.filter((path) => {
    const element = path.at(-1)!;
    return element.tag === "img" && staticAttribute(element, "src") === "/my-photo-224.webp";
  });
  expect(imagePaths).toHaveLength(1);

  const imagePath = imagePaths[0];
  const heroIndex = imagePath.findIndex(
    (element) => element.tag === "section" && staticAttribute(element, "id") === "hero",
  );
  expect(heroIndex).toBeGreaterThan(-1);
  for (const element of imagePath.slice(heroIndex)) {
    expect(classTokens(element)).not.toContain("hero-enter");
  }

  const badges = elementPaths
    .map((path) => path.at(-1)!)
    .filter((element) =>
      element.children.some(
        (child) =>
          child.type === NodeTypes.TEXT && child.content.trim() === "Web Developer",
      ),
    );
  expect(badges).toHaveLength(1);
  expect(classTokens(badges[0])).toContain("hero-enter");
};

const expectedAssets = [
  { output: "public/my-photo-224.webp", width: 224, height: 224, maxBytes: 50_000 },
  { output: "public/projects/ssafast-preview.webp", width: 960, height: 540, maxBytes: 120_000 },
  { output: "public/projects/ddoing-preview.webp", width: 800, height: 459, maxBytes: 120_000 },
  { output: "public/projects/modac-preview.webp", width: 600, height: 338, maxBytes: 120_000 },
  { output: "public/projects/ticketrush-preview.webp", width: 960, height: 540, maxBytes: 120_000 },
] as const;

const expectedProjects = {
  ssafast: { src: "/projects/ssafast.png", width: 1200, height: 675, previewSrc: "/projects/ssafast-preview.webp", previewWidth: 960, previewHeight: 540 },
  ddoing: { src: "/projects/ddoing.png", width: 800, height: 459, previewSrc: "/projects/ddoing-preview.webp", previewWidth: 800, previewHeight: 459 },
  modac: { src: "/projects/modac.png", width: 600, height: 338, previewSrc: "/projects/modac-preview.webp", previewWidth: 600, previewHeight: 338 },
  ticketrush: { src: "/projects/ticketrush.png", width: 1200, height: 675, previewSrc: "/projects/ticketrush-preview.webp", previewWidth: 960, previewHeight: 540 },
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
    const modal = await readFile(file("src/components/ProjectDetailModal.vue"), "utf8");

    expect(projects).toContain(':src="item.project.image.previewSrc ?? item.project.image.src"');
    expect(projects).toContain(':width="item.project.image.previewWidth ?? item.project.image.width"');
    expect(projects).toContain(':height="item.project.image.previewHeight ?? item.project.image.height"');
    expect(projects).toContain('loading="lazy"');
    expect(modal).toContain(':src="project.project.image.src"');
    expect(modal).toContain(':width="project.project.image.width"');
    expect(modal).toContain(':height="project.project.image.height"');
    expect(modal).not.toContain("previewSrc");
  });

  it("uses a code-native visual instead of the stale quant chart for ReachRich", async () => {
    const projects = await readFile(file("src/views/ProjectsView.vue"), "utf8");
    const reachRich = featuredProjects.find((project) => project.id === "reachrich");

    expect(reachRich?.image).toBeUndefined();
    expect(JSON.stringify(reachRich)).not.toContain("/projects/quant-core");
    expect(projects).toContain("item.project.id === 'reachrich'");
    expect(projects).toContain('<ProjectCaseVisual :project-id="item.project.id" compact />');
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
    expectHeroLcpAnimationContract(home);
  });

  it("rejects hero-enter on any LCP image ancestor up to the hero section", async () => {
    const home = await readFile(file("src/views/HomeView.vue"), "utf8");
    const broken = home.replace(
      'class="max-w-3xl"',
      'class="hero-enter max-w-3xl"',
    );

    expect(broken).not.toBe(home);
    expect(() => expectHeroLcpAnimationContract(broken)).toThrow();
  });

  it.each([
    {
      defect: "the image itself entering late",
      mutate: (home: string) =>
        home.replace('class="hero-photo ', 'class="hero-enter hero-photo '),
    },
    {
      defect: "the hero section entering late",
      mutate: (home: string) =>
        home.replace('class="fresh-mesh ', 'class="hero-enter fresh-mesh '),
    },
    {
      defect: "the badge losing its entrance",
      mutate: (home: string) =>
        home.replace('class="hero-enter inline-flex ', 'class="inline-flex '),
    },
  ])("rejects $defect", async ({ mutate }) => {
    const home = await readFile(file("src/views/HomeView.vue"), "utf8");
    const broken = mutate(home);

    expect(broken).not.toBe(home);
    expect(() => expectHeroLcpAnimationContract(broken)).toThrow();
  });

  it.each([
    {
      lineEnding: "LF",
      normalize: (home: string) => home.replace(/\r?\n/g, "\n"),
    },
    {
      lineEnding: "CRLF",
      normalize: (home: string) =>
        home.replace(/\r?\n/g, "\n").replace(/\n/g, "\r\n"),
    },
  ])("accepts reordered, single-quoted LCP attributes with $lineEnding", async ({ normalize }) => {
    const home = await readFile(file("src/views/HomeView.vue"), "utf8");
    const normalizedHome = normalize(home);
    const badgeOpeningTag =
      /<div\s+class="([^"]*\bhero-enter\b[^"]*)">(?=\r?\n[ \t]*Web Developer)/;
    const reformattedBadge = normalizedHome.replace(
      badgeOpeningTag,
      "<div data-lcp='badge' class='$1'>",
    );
    const reformatted = reformattedBadge.replace(
      'src="/my-photo-224.webp"',
      "data-lcp='portrait' src='/my-photo-224.webp'",
    );

    expect(normalizedHome).toMatch(badgeOpeningTag);
    expect(reformattedBadge).not.toBe(normalizedHome);
    expect(reformatted).not.toBe(reformattedBadge);
    expect(() => expectHeroLcpAnimationContract(reformatted)).not.toThrow();
  });
});
