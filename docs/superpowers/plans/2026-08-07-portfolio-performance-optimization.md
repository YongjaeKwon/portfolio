# Portfolio Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the portfolio's measured scroll and pointer jank while preserving its current visual design, then improve mobile first-view delivery and deploy the verified result from `master`.

**Architecture:** One shared Vue composable owns scroll measurement and distributes reactive state to the progress bar, scroll-to-top control, and navigation. IntersectionObserver replaces per-frame section scans, while a tested latest-value frame scheduler batches cursor and tilt writes. Below-the-fold containment and optimized image/font delivery reduce layout, paint, and LCP cost without adding SSR.

**Tech Stack:** Vue 3, TypeScript, Vite 6, Vitest, Sharp, CSS containment, IntersectionObserver, ResizeObserver, requestAnimationFrame, Vercel

---

## File Structure

- Create `src/utils/scrollMetrics.ts`: pure scroll and active-section calculations.
- Create `src/utils/frameScheduler.ts`: latest-value requestAnimationFrame scheduler.
- Create `src/composables/useScrollMetrics.ts`: singleton browser listener and ResizeObserver lifecycle.
- Create `tests/scrollMetrics.test.ts`: pure metric and section-selection tests.
- Create `tests/frameScheduler.test.ts`: frame coalescing and cancellation tests.
- Create `tests/performanceContracts.test.ts`: source-level regression contracts for event-handler structure, containment, and asset markup.
- Create `tests/imageAssets.test.ts`: generated image existence, dimensions, and size-budget checks.
- Create `scripts/optimize-images.mjs`: deterministic WebP generation with Sharp.
- Modify `src/components/Navbar.vue`: observer-driven active section state.
- Modify `src/components/ScrollProgress.vue`: consume shared progress.
- Modify `src/components/ScrollToTop.vue`: consume shared threshold state.
- Modify `src/App.vue`: compositor-friendly cursor spotlight updates.
- Modify `src/views/ProjectsView.vue`: cached card geometry and frame-batched tilt transforms.
- Modify `src/views/HomeView.vue`: prioritized optimized hero portrait.
- Modify `src/data/portfolio.ts`: separate preview and full-resolution project images.
- Modify `src/assets/index.css`: movable spotlight layer and below-the-fold containment.
- Modify `index.html`: image preload and non-blocking font stylesheets.
- Modify `package.json` and `package-lock.json`: test and image optimization tooling.

### Task 1: Establish the baseline and test harness

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `tests/performanceContracts.test.ts`

- [ ] **Step 1: Install the current project exactly and verify the baseline build**

Run:

```powershell
npm ci
npm run build
```

Expected: both commands exit 0 on commit `6eb2d19`. Record any pre-existing warning before changing source code.

- [ ] **Step 2: Add Vitest and Sharp as development dependencies**

Run:

```powershell
npm install --save-dev vitest sharp
```

Then add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "assets:optimize": "node scripts/optimize-images.mjs"
  }
}
```

Keep the existing `dev`, `build`, `preview`, and `resumes:pdf` scripts unchanged.

- [ ] **Step 3: Write the failing structural regression test**

Create `tests/performanceContracts.test.ts`:

```ts
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
```

- [ ] **Step 4: Run the test and verify RED**

Run:

```powershell
npm test -- tests/performanceContracts.test.ts
```

Expected: FAIL because Navbar still contains `getBoundingClientRect`, the scroll components own listeners, containment is absent, and no frame scheduler exists.

- [ ] **Step 5: Commit the test harness**

```powershell
git add package.json package-lock.json tests/performanceContracts.test.ts
git commit -m "test: add portfolio performance contracts"
```

### Task 2: Implement tested scroll and frame primitives

**Files:**
- Create: `src/utils/scrollMetrics.ts`
- Create: `src/utils/frameScheduler.ts`
- Create: `tests/scrollMetrics.test.ts`
- Create: `tests/frameScheduler.test.ts`

- [ ] **Step 1: Write failing scroll metric tests**

Create `tests/scrollMetrics.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { calculateScrollState, pickActiveSection } from "../src/utils/scrollMetrics";

describe("calculateScrollState", () => {
  it("clamps progress and exposes threshold and bottom state", () => {
    expect(calculateScrollState(500, 1000, 400)).toEqual({
      scrollY: 500,
      progress: 0.5,
      isPastThreshold: true,
      isAtBottom: false,
    });
    expect(calculateScrollState(1200, 1000, 400)).toEqual({
      scrollY: 1000,
      progress: 1,
      isPastThreshold: true,
      isAtBottom: true,
    });
  });

  it("keeps a document without overflow at zero progress", () => {
    expect(calculateScrollState(0, 0, 400)).toEqual({
      scrollY: 0,
      progress: 0,
      isPastThreshold: false,
      isAtBottom: false,
    });
  });
});

describe("pickActiveSection", () => {
  it("selects the intersecting section nearest the header line", () => {
    expect(
      pickActiveSection(
        [
          { id: "profile", top: 90, isIntersecting: true },
          { id: "projects", top: 230, isIntersecting: true },
        ],
        "hero",
        110,
      ),
    ).toBe("profile");
  });

  it("keeps the current section when no observed section intersects", () => {
    expect(pickActiveSection([], "projects", 110)).toBe("projects");
  });
});
```

- [ ] **Step 2: Run the scroll tests and verify RED**

Run:

```powershell
npm test -- tests/scrollMetrics.test.ts
```

Expected: FAIL because `src/utils/scrollMetrics.ts` does not exist.

- [ ] **Step 3: Implement the minimal scroll calculations**

Create `src/utils/scrollMetrics.ts`:

```ts
export type ScrollState = {
  scrollY: number;
  progress: number;
  isPastThreshold: boolean;
  isAtBottom: boolean;
};

export type ObservedSection = {
  id: string;
  top: number;
  isIntersecting: boolean;
};

export const calculateScrollState = (
  scrollTop: number,
  maxScroll: number,
  threshold: number,
): ScrollState => {
  const safeMax = Math.max(0, maxScroll);
  const scrollY = Math.min(Math.max(0, scrollTop), safeMax);

  return {
    scrollY,
    progress: safeMax > 0 ? scrollY / safeMax : 0,
    isPastThreshold: scrollY > threshold,
    isAtBottom: safeMax > 0 && scrollY >= safeMax - 4,
  };
};

export const pickActiveSection = (
  sections: ObservedSection[],
  current: string,
  headerLine: number,
): string => {
  const visible = sections.filter((section) => section.isIntersecting);
  if (!visible.length) return current;

  return visible.reduce((closest, section) =>
    Math.abs(section.top - headerLine) < Math.abs(closest.top - headerLine) ? section : closest,
  ).id;
};
```

- [ ] **Step 4: Run the scroll tests and verify GREEN**

Run:

```powershell
npm test -- tests/scrollMetrics.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Write failing frame scheduler tests**

Create `tests/frameScheduler.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createLatestFrameScheduler } from "../src/utils/frameScheduler";

describe("createLatestFrameScheduler", () => {
  it("writes only the latest value once per frame", () => {
    const queue: FrameRequestCallback[] = [];
    const write = vi.fn();
    const scheduler = createLatestFrameScheduler(write, (callback) => {
      queue.push(callback);
      return queue.length;
    }, vi.fn());

    scheduler.schedule(1);
    scheduler.schedule(2);
    expect(queue).toHaveLength(1);
    queue[0](16);
    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith(2);
  });

  it("cancels a pending write", () => {
    const cancelFrame = vi.fn();
    const scheduler = createLatestFrameScheduler(vi.fn(), () => 7, cancelFrame);
    scheduler.schedule("value");
    scheduler.cancel();
    expect(cancelFrame).toHaveBeenCalledWith(7);
  });
});
```

- [ ] **Step 6: Run the scheduler tests and verify RED**

Run:

```powershell
npm test -- tests/frameScheduler.test.ts
```

Expected: FAIL because `src/utils/frameScheduler.ts` does not exist.

- [ ] **Step 7: Implement the latest-value frame scheduler**

Create `src/utils/frameScheduler.ts`:

```ts
export const createLatestFrameScheduler = <T>(
  write: (value: T) => void,
  requestFrame: (callback: FrameRequestCallback) => number = requestAnimationFrame,
  cancelFrame: (handle: number) => void = cancelAnimationFrame,
) => {
  let frameId: number | null = null;
  let latestValue: T;

  const schedule = (value: T) => {
    latestValue = value;
    if (frameId !== null) return;

    frameId = requestFrame(() => {
      frameId = null;
      write(latestValue);
    });
  };

  const cancel = () => {
    if (frameId === null) return;
    cancelFrame(frameId);
    frameId = null;
  };

  return { schedule, cancel };
};
```

- [ ] **Step 8: Run the primitive tests and commit**

Run:

```powershell
npm test -- tests/scrollMetrics.test.ts tests/frameScheduler.test.ts
```

Expected: 6 tests pass.

```powershell
git add src/utils/scrollMetrics.ts src/utils/frameScheduler.ts tests/scrollMetrics.test.ts tests/frameScheduler.test.ts
git commit -m "feat: add frame-safe performance primitives"
```

### Task 3: Consolidate scroll state and navigation observation

**Files:**
- Create: `src/composables/useScrollMetrics.ts`
- Modify: `src/components/ScrollProgress.vue`
- Modify: `src/components/ScrollToTop.vue`
- Modify: `src/components/Navbar.vue`

- [ ] **Step 1: Implement the shared scroll composable**

Create `src/composables/useScrollMetrics.ts` with module-level refs, subscriber counting, one passive scroll listener, and one ResizeObserver:

```ts
import { onBeforeUnmount, onMounted, readonly, ref } from "vue";
import { calculateScrollState } from "@/utils/scrollMetrics";

const scrollY = ref(0);
const progress = ref(0);
const isPastThreshold = ref(false);
const isAtBottom = ref(false);

let subscribers = 0;
let frameId: number | null = null;
let maxScroll = 0;
let resizeObserver: ResizeObserver | null = null;

const update = () => {
  frameId = null;
  const state = calculateScrollState(document.documentElement.scrollTop || window.scrollY, maxScroll, 400);
  scrollY.value = state.scrollY;
  progress.value = state.progress;
  isPastThreshold.value = state.isPastThreshold;
  isAtBottom.value = state.isAtBottom;
};

const schedule = () => {
  if (frameId === null) frameId = requestAnimationFrame(update);
};

const refreshDocumentHeight = () => {
  const documentElement = document.documentElement;
  maxScroll = Math.max(0, documentElement.scrollHeight - documentElement.clientHeight);
  schedule();
};

const start = () => {
  refreshDocumentHeight();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", refreshDocumentHeight, { passive: true });
  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(refreshDocumentHeight);
    resizeObserver.observe(document.documentElement);
  }
};

const stop = () => {
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", refreshDocumentHeight);
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (frameId !== null) cancelAnimationFrame(frameId);
  frameId = null;
};

export const useScrollMetrics = () => {
  onMounted(() => {
    subscribers += 1;
    if (subscribers === 1) start();
  });

  onBeforeUnmount(() => {
    subscribers = Math.max(0, subscribers - 1);
    if (subscribers === 0) stop();
  });

  return {
    scrollY: readonly(scrollY),
    progress: readonly(progress),
    isPastThreshold: readonly(isPastThreshold),
    isAtBottom: readonly(isAtBottom),
  };
};
```

- [ ] **Step 2: Replace component-owned scroll listeners**

In `src/components/ScrollProgress.vue`, replace the script with:

```ts
<script setup lang="ts">
import { useScrollMetrics } from "@/composables/useScrollMetrics";

const { progress } = useScrollMetrics();
</script>
```

In `src/components/ScrollToTop.vue`, replace listener state with:

```ts
<script setup lang="ts">
import { ChevronUp } from "@lucide/vue";
import { useScrollMetrics } from "@/composables/useScrollMetrics";

const { isPastThreshold: visible } = useScrollMetrics();

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", location.pathname);
};
</script>
```

- [ ] **Step 3: Replace Navbar's section scan with IntersectionObserver**

In `src/components/Navbar.vue`:

```ts
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useScrollMetrics } from "@/composables/useScrollMetrics";
import { pickActiveSection, type ObservedSection } from "@/utils/scrollMetrics";

const { isAtBottom } = useScrollMetrics();
const observedSections = new Map<string, ObservedSection>();
let sectionObserver: IntersectionObserver | null = null;

const updateActiveSection = () => {
  activeSection.value = pickActiveSection([...observedSections.values()], activeSection.value, 110);
};

onMounted(() => {
  if (!("IntersectionObserver" in window)) return;

  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        observedSections.set(entry.target.id, {
          id: entry.target.id,
          top: entry.boundingClientRect.top,
          isIntersecting: entry.isIntersecting,
        });
      }
      updateActiveSection();
    },
    { rootMargin: "-110px 0px -70% 0px", threshold: 0 },
  );

  for (const id of sectionIds) {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  }
});

watch(isAtBottom, (atBottom) => {
  if (atBottom) activeSection.value = sectionIds[sectionIds.length - 1];
});

onBeforeUnmount(() => sectionObserver?.disconnect());
```

Remove `ticking`, `updateActive`, `onScroll`, and the Navbar scroll/resize listeners. Keep click, mobile-menu, and emitted navigation behavior unchanged.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```powershell
npm test -- tests/scrollMetrics.test.ts
npm test -- tests/performanceContracts.test.ts -t "does not scan section geometry|shares scroll state"
npm run build
```

Expected: the scroll calculation tests and the two scroll architecture contracts pass. The production build exits 0.

- [ ] **Step 5: Commit the scroll architecture**

```powershell
git add src/composables/useScrollMetrics.ts src/components/Navbar.vue src/components/ScrollProgress.vue src/components/ScrollToTop.vue
git commit -m "perf: consolidate scroll measurements"
```

### Task 4: Batch cursor and project tilt updates

**Files:**
- Modify: `src/App.vue`
- Modify: `src/views/ProjectsView.vue`
- Modify: `src/assets/index.css`

- [ ] **Step 1: Convert the cursor spotlight to a composited movable layer**

In `src/App.vue`, add `ref="cursorSpotlight"` to `.cursor-spotlight`, import `ref` and `createLatestFrameScheduler`, and replace the direct mousemove writes with:

```ts
const cursorSpotlight = ref<HTMLElement | null>(null);

const cursorScheduler = createLatestFrameScheduler<{ x: number; y: number }>(({ x, y }) => {
  cursorSpotlight.value?.style.setProperty(
    "transform",
    `translate3d(${x - 600}px, ${y - 600}px, 0)`,
  );
});

onMounted(() => {
  const pointerEffectsEnabled =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handlePointerMove = (event: PointerEvent) => {
    cursorScheduler.schedule({ x: event.clientX, y: event.clientY });
  };

  if (pointerEffectsEnabled) {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
  }

  cleanup = () => {
    window.removeEventListener("pointermove", handlePointerMove);
    cursorScheduler.cancel();
    observer.disconnect();
  };
});
```

Only replace the existing mousemove definition, listener registration, and cleanup removal. Leave the reveal observer and initial hash restoration statements in their current order between the new pointer listener registration and the shown cleanup assignment.

Replace `.cursor-spotlight` in `src/assets/index.css` with:

```css
.cursor-spotlight {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 1200px;
  height: 1200px;
  z-index: 0;
  border-radius: 50%;
  contain: strict;
  will-change: transform;
  transform: translate3d(-1200px, -1200px, 0);
  background: radial-gradient(
    circle at center,
    rgb(var(--accent-rgb) / 0.04),
    transparent 40%
  );
}

@media (hover: none), (pointer: coarse) {
  .cursor-spotlight { display: none; }
}
```

- [ ] **Step 2: Cache tilt geometry and write transforms once per frame**

Replace the tilt handler portion of `src/views/ProjectsView.vue` with pointer handlers that measure only on entry:

```ts
type TiltHandlers = {
  onEnter: () => void;
  onMove: (event: PointerEvent) => void;
  onLeave: () => void;
  onResize: () => void;
  cancel: () => void;
};

const tiltHandlers = new WeakMap<HTMLElement, TiltHandlers>();
const vTilt = {
  mounted(el: HTMLElement) {
    const pointerEffectsEnabled =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!pointerEffectsEnabled) return;

    let rect: DOMRect | null = null;
    const scheduler = createLatestFrameScheduler<PointerEvent>((event) => {
      if (!rect) return;
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1100px) rotateY(${px * 2}deg) rotateX(${-py * 2}deg)`;
    });
    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.style.transition = "transform 0s";
    };
    const onMove = (event: PointerEvent) => scheduler.schedule(event);
    const onLeave = () => {
      scheduler.cancel();
      rect = null;
      el.style.transition = "transform 0.35s ease";
      el.style.transform = "";
    };
    const onResize = () => {
      if (rect) rect = el.getBoundingClientRect();
    };

    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    tiltHandlers.set(el, { onEnter, onMove, onLeave, onResize, cancel: scheduler.cancel });
  },
  unmounted(el: HTMLElement) {
    const handlers = tiltHandlers.get(el);
    if (!handlers) return;
    handlers.cancel();
    el.removeEventListener("pointerenter", handlers.onEnter);
    el.removeEventListener("pointermove", handlers.onMove);
    el.removeEventListener("pointerleave", handlers.onLeave);
    window.removeEventListener("resize", handlers.onResize);
    tiltHandlers.delete(el);
  },
};
```

Add `createLatestFrameScheduler` to the existing imports. Do not change modal or project filtering behavior.

- [ ] **Step 3: Run pointer contracts and build**

Run:

```powershell
npm test -- tests/frameScheduler.test.ts
npm test -- tests/performanceContracts.test.ts -t "batches pointer effects"
npm run build
```

Expected: frame scheduler tests and the pointer architecture contract pass. Build exits 0.

- [ ] **Step 4: Commit pointer performance changes**

```powershell
git add src/App.vue src/views/ProjectsView.vue src/assets/index.css
git commit -m "perf: batch pointer visual updates"
```

### Task 5: Defer below-the-fold rendering

**Files:**
- Modify: `src/assets/index.css`

- [ ] **Step 1: Add supported section containment**

Add after the `.portfolio-flow > section:not(#hero)` rule:

```css
@supports (content-visibility: auto) {
  .portfolio-flow > section:not(#hero) {
    content-visibility: auto;
    contain-intrinsic-size: auto 1000px;
  }
}
```

- [ ] **Step 2: Run the full performance contract test and build**

Run:

```powershell
npm test -- tests/performanceContracts.test.ts
npm run build
```

Expected: all four performance contract tests pass and the build exits 0.

- [ ] **Step 3: Commit containment**

```powershell
git add src/assets/index.css
git commit -m "perf: defer offscreen section rendering"
```

### Task 6: Optimize hero and project image delivery

**Files:**
- Create: `scripts/optimize-images.mjs`
- Create: `tests/imageAssets.test.ts`
- Create: `public/my-photo-224.webp`
- Create: `public/projects/ssafast-preview.webp`
- Create: `public/projects/ddoing-preview.webp`
- Create: `public/projects/modac-preview.webp`
- Create: `public/projects/quant-core-preview.webp`
- Modify: `src/views/HomeView.vue`
- Modify: `src/views/ProjectsView.vue`
- Modify: `src/data/portfolio.ts`
- Modify: `index.html`

- [ ] **Step 1: Write failing image asset and markup tests**

Create `tests/imageAssets.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the image tests and verify RED**

Run:

```powershell
npm test -- tests/imageAssets.test.ts
```

Expected: FAIL because the WebP files and priority markup do not exist.

- [ ] **Step 3: Create the deterministic image optimizer**

Create `scripts/optimize-images.mjs`:

```js
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const file = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));

const jobs = [
  { input: "src/public/my-photo.png", output: "public/my-photo-224.webp", width: 224, height: 224, fit: "cover" },
  { input: "public/projects/ssafast.png", output: "public/projects/ssafast-preview.webp", width: 960, height: 640, fit: "inside" },
  { input: "public/projects/ddoing.png", output: "public/projects/ddoing-preview.webp", width: 960, height: 640, fit: "inside" },
  { input: "public/projects/modac.png", output: "public/projects/modac-preview.webp", width: 960, height: 640, fit: "inside" },
  { input: "public/projects/quant-core.png", output: "public/projects/quant-core-preview.webp", width: 960, height: 640, fit: "inside" },
];

for (const job of jobs) {
  await mkdir(file(job.output.substring(0, job.output.lastIndexOf("/"))), { recursive: true });
  await sharp(file(job.input))
    .resize({ width: job.width, height: job.height, fit: job.fit, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(file(job.output));
}
```

Run:

```powershell
npm run assets:optimize
```

Expected: five WebP files are generated.

- [ ] **Step 4: Wire preview and full-resolution sources**

Change the image type in `src/data/portfolio.ts` to:

```ts
image?: { src: string; previewSrc?: string; alt: string };
```

Add these exact preview values to the four existing image objects:

```ts
previewSrc: "/projects/ssafast-preview.webp"
previewSrc: "/projects/ddoing-preview.webp"
previewSrc: "/projects/modac-preview.webp"
previewSrc: "/projects/quant-core-preview.webp"
```

In the compact project image in `src/views/ProjectsView.vue`, use:

```vue
<img
  :src="item.project.image.previewSrc ?? item.project.image.src"
  :alt="item.project.image.alt"
  width="960"
  height="640"
  loading="lazy"
  decoding="async"
  class="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
/>
```

Keep modal images on `item.project.image.src` so they retain full resolution.

- [ ] **Step 5: Prioritize hero image discovery**

In `src/views/HomeView.vue`, remove the imported PNG and use:

```vue
<img
  src="/my-photo-224.webp"
  alt="권용재 프로필 사진"
  width="112"
  height="112"
  loading="eager"
  fetchpriority="high"
  decoding="async"
  class="hero-photo h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-white/50 shadow-lg md:h-28 md:w-28"
/>
```

Add to `index.html` immediately after the favicon:

```html
<link rel="preload" as="image" href="/my-photo-224.webp" type="image/webp" fetchpriority="high" />
```

- [ ] **Step 6: Run image tests and commit**

Run:

```powershell
npm test -- tests/imageAssets.test.ts
npm run build
```

Expected: 6 image tests pass and the build exits 0.

```powershell
git add package.json package-lock.json scripts/optimize-images.mjs tests/imageAssets.test.ts public/my-photo-224.webp public/projects/*-preview.webp src/views/HomeView.vue src/views/ProjectsView.vue src/data/portfolio.ts index.html
git commit -m "perf: optimize portfolio image delivery"
```

### Task 7: Make external font stylesheets non-blocking

**Files:**
- Modify: `index.html`
- Modify: `tests/performanceContracts.test.ts`

- [ ] **Step 1: Add a failing font delivery contract**

Add to `tests/performanceContracts.test.ts`:

```ts
it("loads external font stylesheets without blocking rendering", async () => {
  const html = await source("index.html");
  expect(html.match(/rel="preload"\s+as="style"/g)).toHaveLength(2);
  expect(html).toContain("this.rel='stylesheet'");
  expect(html.match(/<noscript>/g)).toHaveLength(2);
});
```

- [ ] **Step 2: Run the contract and verify RED**

Run:

```powershell
npm test -- tests/performanceContracts.test.ts
```

Expected: FAIL because the two font stylesheets still use render-blocking `rel="stylesheet"` links.

- [ ] **Step 3: Replace both external font stylesheet links**

Replace the Pretendard stylesheet with:

```html
<link
  rel="preload"
  as="style"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
  />
</noscript>
```

Replace the Google Fonts stylesheet with:

```html
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&amp;family=JetBrains+Mono:wght@500;700&amp;display=swap"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&amp;family=JetBrains+Mono:wght@500;700&amp;display=swap"
  />
</noscript>
```

Keep all three existing preconnect links.

- [ ] **Step 4: Run contracts, full tests, and build**

Run:

```powershell
npm test
npm run build
```

Expected: every Vitest test passes and the production build exits 0.

- [ ] **Step 5: Commit font delivery changes**

```powershell
git add index.html tests/performanceContracts.test.ts
git commit -m "perf: unblock portfolio font rendering"
```

### Task 8: Browser verification and production delivery

**Files:**
- Modify only files required by evidence from verification.

- [ ] **Step 1: Run the complete local verification suite**

Run:

```powershell
npm test
npm run build
git diff --check master...HEAD
```

Expected: zero failing tests, build exit 0, and no whitespace errors.

- [ ] **Step 2: Verify the page in a production preview**

Run:

```powershell
npm run preview -- --host 127.0.0.1
```

Check desktop and mobile viewports for:

- Active navigation changes through Hero, About, Projects, Experience, Education, Tech, and Contact.
- Scroll progress remains smooth and ScrollToTop appears after 400 px.
- Cursor spotlight follows the mouse without changing layout.
- Project tilt activates on fine pointers and resets on leave.
- Pointer effects are absent under touch emulation and reduced-motion mode.
- Anchor links, project modal focus, project filters, resume download, and Contact remain functional.
- No visible section jump occurs when offscreen content becomes visible.

- [ ] **Step 3: Capture a local performance trace**

Record a mobile-emulated scroll and pointer trace. Confirm:

- Navbar performs no per-frame section geometry scan.
- Pointermove performs no `getBoundingClientRect()` call.
- ScrollProgress and ScrollToTop share one scroll listener source.
- No long frame attributable to the removed handlers exceeds the 16.7 ms frame budget.

If a regression is found, add a failing test first, apply the smallest fix, then rerun Steps 1–3.

- [ ] **Step 4: Merge the verified branch into master and push**

Run from the clean integration clone:

```powershell
git switch master
git pull --ff-only origin master
git merge --no-ff codex/performance-optimization -m "Merge portfolio performance optimization"
npm test
npm run build
git push origin master
```

Expected: merge succeeds, tests and build pass again on `master`, and the push updates `origin/master`.

- [ ] **Step 5: Deploy production and validate the live site**

Run:

```powershell
npx vercel --prod --yes
```

Expected: Vercel returns a successful production deployment for `www.yongjaekwon.com`.

Check the deployed site and run three mobile PageSpeed measurements. Accept the median when:

- Performance is at least 90.
- LCP is at or below 2.5 s when network variance permits.
- CLS remains 0.
- TBT remains at or below 150 ms.
- No visual, interaction, or accessibility regression is present.

Do not reduce blur or glass effects unless the new trace identifies paint/compositing as the remaining dominant bottleneck.
