import { describe, expect, it, vi } from "vitest";
import * as sectionNavigation from "../src/utils/sectionNavigation";

type TestSection = {
  classList: {
    add: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  scrollIntoView: ReturnType<typeof vi.fn>;
  readyClasses: Set<string>;
};

type SectionNavigator = {
  navigate: (
    sections: readonly TestSection[],
    target: TestSection,
    behavior: ScrollBehavior,
  ) => boolean;
  cancel: () => void;
};

type CreateSectionNavigator = (
  requestFrame: (callback: FrameRequestCallback) => number,
  cancelFrame: (handle: number) => void,
) => SectionNavigator;

const createSection = (): TestSection => {
  const readyClasses = new Set<string>();
  return {
    classList: {
      add: vi.fn((token: string) => readyClasses.add(token)),
      remove: vi.fn((token: string) => readyClasses.delete(token)),
    },
    scrollIntoView: vi.fn(),
    readyClasses,
  };
};

const createFrameHarness = () => {
  let nextHandle = 0;
  const frames = new Map<number, FrameRequestCallback>();
  const requestFrame = vi.fn((callback: FrameRequestCallback) => {
    nextHandle += 1;
    frames.set(nextHandle, callback);
    return nextHandle;
  });
  const cancelFrame = vi.fn((handle: number) => frames.delete(handle));
  const runNextFrame = () => {
    const next = frames.entries().next().value as
      | [number, FrameRequestCallback]
      | undefined;
    expect(next).toBeDefined();
    if (!next) return;
    frames.delete(next[0]);
    next[1](16);
  };
  return { frames, requestFrame, cancelFrame, runNextFrame };
};

const createNavigator = (harness: ReturnType<typeof createFrameHarness>) => {
  const create = (
    sectionNavigation as { createSectionNavigator?: CreateSectionNavigator }
  ).createSectionNavigator;
  expect(create).toBeTypeOf("function");
  if (!create) throw new Error("createSectionNavigator is unavailable");
  return create(harness.requestFrame, harness.cancelFrame);
};

describe("createSectionNavigator", () => {
  it("lets only the latest rapid navigation scroll", () => {
    const harness = createFrameHarness();
    const navigator = createNavigator(harness);
    const sections = [createSection(), createSection(), createSection(), createSection()];

    expect(navigator.navigate(sections, sections[1], "smooth")).toBe(true);
    expect(navigator.navigate(sections, sections[3], "smooth")).toBe(true);
    expect(harness.frames).toHaveLength(1);

    harness.runNextFrame();
    expect(sections[1].scrollIntoView).not.toHaveBeenCalled();
    expect(sections[3].scrollIntoView).toHaveBeenCalledTimes(1);
    expect(sections[3].scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("cancels pending scroll and cleanup work safely", () => {
    const harness = createFrameHarness();
    const navigator = createNavigator(harness);
    const sections = [createSection(), createSection()];

    navigator.navigate(sections, sections[1], "smooth");
    navigator.cancel();
    expect(harness.frames).toHaveLength(0);
    expect(sections[1].scrollIntoView).not.toHaveBeenCalled();
    expect(sections.every((section) => section.readyClasses.size === 0)).toBe(true);

    navigator.navigate(sections, sections[1], "smooth");
    harness.runNextFrame();
    expect(harness.frames).toHaveLength(1);
    navigator.cancel();
    expect(harness.frames).toHaveLength(0);
    expect(sections.every((section) => section.readyClasses.size === 0)).toBe(true);
  });

  it("removes temporary layout classes on the frame after scrolling", () => {
    const harness = createFrameHarness();
    const navigator = createNavigator(harness);
    const sections = [createSection(), createSection(), createSection()];

    navigator.navigate(sections, sections[1], "smooth");
    expect(sections.slice(0, 2).every((section) => section.readyClasses.has("anchor-layout-ready"))).toBe(true);
    expect(sections[2].readyClasses.size).toBe(0);

    harness.runNextFrame();
    expect(sections.slice(0, 2).every((section) => section.readyClasses.has("anchor-layout-ready"))).toBe(true);
    harness.runNextFrame();
    expect(sections.every((section) => section.readyClasses.size === 0)).toBe(true);
  });

  it("does not schedule work when the target is outside the section list", () => {
    const harness = createFrameHarness();
    const navigator = createNavigator(harness);
    const sections = [createSection(), createSection()];
    const missingTarget = createSection();

    expect(navigator.navigate(sections, missingTarget, "smooth")).toBe(false);
    expect(harness.requestFrame).not.toHaveBeenCalled();
    expect(sections.every((section) => section.readyClasses.size === 0)).toBe(true);
    expect(missingTarget.scrollIntoView).not.toHaveBeenCalled();
  });
});
