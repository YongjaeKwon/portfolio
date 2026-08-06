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

  it("clamps negative scroll and maximum values to the lower bound", () => {
    expect(calculateScrollState(-100, -500, 400)).toEqual({
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
