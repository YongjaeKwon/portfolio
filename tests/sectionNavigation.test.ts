import { describe, expect, it, vi } from "vitest";
import * as sectionNavigation from "../src/utils/sectionNavigation";

type TestSection = {
  classList: { add: ReturnType<typeof vi.fn> };
  scrollIntoView: ReturnType<typeof vi.fn>;
};

type ScrollToLaidOutSection = (
  sections: readonly TestSection[],
  target: TestSection,
  behavior: ScrollBehavior,
  requestFrame: (callback: FrameRequestCallback) => number,
) => boolean;

const createSection = (): TestSection => ({
  classList: { add: vi.fn() },
  scrollIntoView: vi.fn(),
});

describe("scrollToLaidOutSection", () => {
  it("lays out every preceding section before scrolling once on the next frame", () => {
    const navigate = (
      sectionNavigation as { scrollToLaidOutSection?: ScrollToLaidOutSection }
    ).scrollToLaidOutSection;
    expect(navigate).toBeTypeOf("function");
    if (!navigate) return;

    const sections = [createSection(), createSection(), createSection(), createSection()];
    const frames: FrameRequestCallback[] = [];

    expect(
      navigate(sections, sections[2], "smooth", (callback) => {
        frames.push(callback);
        return frames.length;
      }),
    ).toBe(true);

    expect(sections.slice(0, 3).map((section) => section.classList.add.mock.calls)).toEqual([
      [["anchor-layout-ready"]],
      [["anchor-layout-ready"]],
      [["anchor-layout-ready"]],
    ]);
    expect(sections[3].classList.add).not.toHaveBeenCalled();
    expect(sections[2].scrollIntoView).not.toHaveBeenCalled();
    expect(frames).toHaveLength(1);

    frames[0](16);
    expect(sections[2].scrollIntoView).toHaveBeenCalledTimes(1);
    expect(sections[2].scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });
});
