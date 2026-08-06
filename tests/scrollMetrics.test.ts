import { describe, expect, it } from "vitest";
import {
  calculateScrollState,
  pickActiveSection,
  resolveActiveSectionFromEntries,
} from "../src/utils/scrollMetrics";

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

describe("resolveActiveSectionFromEntries", () => {
  const sectionIds = ["hero", "profile", "projects", "contact"];

  it("advances through sections as their bottom boundaries cross the header line", () => {
    const afterHero = resolveActiveSectionFromEntries(
      sectionIds,
      [{ id: "hero", top: -500, bottom: 100, isIntersecting: false }],
      "hero",
      110,
    );
    expect(afterHero).toBe("profile");

    expect(
      resolveActiveSectionFromEntries(
        sectionIds,
        [{ id: "profile", top: -600, bottom: 105, isIntersecting: false }],
        afterHero,
        110,
      ),
    ).toBe("projects");
  });

  it("moves back through sections as their top boundaries re-enter above the header line", () => {
    const afterProfileReenters = resolveActiveSectionFromEntries(
      sectionIds,
      [{ id: "profile", top: 90, bottom: 790, isIntersecting: true }],
      "projects",
      110,
    );
    expect(afterProfileReenters).toBe("profile");

    expect(
      resolveActiveSectionFromEntries(
        sectionIds,
        [{ id: "hero", top: 100, bottom: 800, isIntersecting: true }],
        afterProfileReenters,
        110,
      ),
    ).toBe("hero");
  });

  it("keeps the current section for entries unrelated to the header boundary", () => {
    expect(
      resolveActiveSectionFromEntries(
        sectionIds,
        [
          { id: "profile", top: 240, bottom: 940, isIntersecting: true },
          { id: "unknown", top: -500, bottom: 100, isIntersecting: false },
        ],
        "projects",
        110,
      ),
    ).toBe("projects");
  });
});
