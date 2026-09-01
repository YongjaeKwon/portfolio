import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { experience, featuredProjects } from "../src/data/portfolio";

const readSource = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

const idsFromSet = (source: string, variable: string) => {
  const match = source.match(new RegExp(`const\\s+${variable}\\s*=\\s*new Set\\(\\[([^\\]]+)]\\)`));
  expect(match, `${variable} must remain an explicit project boundary`).not.toBeNull();
  return [...(match?.[1].matchAll(/["']([^"']+)["']/g) ?? [])].map((item) => item[1]);
};

describe("experience and project ownership", () => {
  const experienceView = readSource("../src/views/ExperienceView.vue");
  const projectsView = readSource("../src/views/ProjectsView.vue");

  it("keeps PPS and TSMS in Experience and personal or team work in Projects", () => {
    const workIds = idsFromSet(experienceView, "workProjectIds");
    const personalIds = idsFromSet(projectsView, "personalProjectIds");

    expect(workIds).toEqual(["pps", "tsms"]);
    expect(personalIds).toEqual(["ticketrush", "reachrich", "ssafast", "ddoing", "modac"]);
    expect(workIds.filter((id) => personalIds.includes(id))).toEqual([]);
    expect(new Set([...workIds, ...personalIds])).toEqual(
      new Set(featuredProjects.map((project) => project.id)),
    );

    expect(experienceView).toContain("workProjectIds.has(project.id)");
    expect(projectsView).toContain("personalProjectIds.has(project.id)");
    expect(projectsView).toContain('new Set(["ticketrush", "ssafast", "ddoing", "modac"])');
    expect(projectsView).toContain('import("@/components/demos/ProjectDemoPanel.vue")');
    expect(experienceView).not.toContain("ProjectDemoPanel");
  });

  it("opens both kinds of project through the shared detail modal", () => {
    for (const source of [experienceView, projectsView]) {
      expect(source).toContain('import ProjectDetailModal from "@/components/ProjectDetailModal.vue"');
      expect(source).toContain('<ProjectDetailModal :project="activeProject" @close="closeDetail" />');
      expect(source).toContain("const openDetail = (project: PresentedProject)");
      expect(source).toContain("activeProject.value = project");
      expect(source).toContain("activeProject.value = null");
    }
  });

  it("replaces the duplicated six-item career list with a compact responsibility summary", () => {
    expect("bullets" in experience).toBe(false);
    expect(experience.responsibilities).toHaveLength(3);
    expect(experienceView).toContain("experience.responsibilities");
    expect(experienceView).not.toContain("experience.bullets");
    expect(experienceView).not.toMatch(/v-for=["']bullet\s+in/);
  });

  it("keeps the same role focus available in Experience and Projects", async () => {
    const replaceState = vi.fn();
    const addEventListener = vi.fn();
    vi.stubGlobal("window", {
      location: {
        href: "https://portfolio.test/?focus=frontend#experience",
        search: "?focus=frontend",
      },
      history: { replaceState },
      addEventListener,
    });
    vi.resetModules();

    const { useFocusTrack } = await import("../src/composables/useFocusTrack");
    const experienceFocus = useFocusTrack();
    const projectFocus = useFocusTrack();

    expect(experienceView).toContain("<FocusTabs />");
    expect(projectsView).toContain("<FocusTabs />");
    expect(experienceFocus.activeTrack).toBe(projectFocus.activeTrack);
    expect(experienceFocus.activeTrack.value).toBe("frontend");
    expect(addEventListener).toHaveBeenCalledTimes(1);

    experienceFocus.setActiveTrack("backend");
    expect(projectFocus.activeTrack.value).toBe("backend");
    expect(replaceState).toHaveBeenLastCalledWith(
      null,
      "",
      "/?focus=backend#experience",
    );

    projectFocus.setActiveTrack("all");
    expect(experienceFocus.activeTrack.value).toBe("all");
    expect(replaceState).toHaveBeenLastCalledWith(null, "", "/#experience");
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});
