import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { experience, featuredProjects } from "../src/data/portfolio";
import { presentProject } from "../src/utils/projectPresentation";

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

    expect(workIds).toEqual(["pps", "tsms", "sr30"]);
    expect(personalIds).toEqual(["oneulsai", "ticketrush", "reachrich", "ssafast", "ddoing", "modac"]);
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

  it("keeps the former hero achievements on their work cards, including role views", () => {
    const tsms = featuredProjects.find((project) => project.id === "tsms")!;
    const pps = featuredProjects.find((project) => project.id === "pps")!;
    const tsmsCard = JSON.stringify(presentProject(tsms, "all").card);
    const ppsCard = JSON.stringify(presentProject(pps, "all").card);
    expect(tsmsCard).toContain("53초 → 1.2초");
    expect(tsmsCard).toContain("점검 결과를 보존하며 중복 데이터 정리");
    expect(tsmsCard).toContain("종이 점검표와 재방문 업무 전산화");
    expect(ppsCard).toContain("새로고침 후에도");
    expect(ppsCard).toContain("다른 엔지니어의 첨부파일이 연결되는 오류 해결");
    expect(ppsCard).toContain("인증번호 중복 발송·재사용 방지");
    for (const focus of ["frontend", "backend"] as const) {
      expect(presentProject(pps, focus).card.highlights?.[0].detail).toContain("300~400건");
    }
    expect(presentProject(tsms, "backend").card.highlights?.[0].title).toContain("중복 데이터 정리");
    expect(presentProject(tsms, "frontend").card.result).toContain("동시 수정");
  });

  it("keeps the career introduction compact without repeating card responsibilities", () => {
    expect("bullets" in experience).toBe(false);
    expect(experience.responsibilities).toHaveLength(3);
    expect(experienceView).not.toContain("experience.responsibilities");
    expect(experienceView).toContain("experience.description");
    expect(experienceView).not.toContain("experience.bullets");
    expect(experienceView).not.toMatch(/v-for=["']bullet\s+in/);
  });

  it("keeps one role focus in Experience that both project sections follow", async () => {
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

    expect(readFileSync(fileURLToPath(new URL("../src/views/HomeView.vue", import.meta.url)), "utf8")).not.toContain("<FocusTabs />");
    expect(experienceView).toContain("<FocusTabs />");
    expect(projectsView).not.toContain("<FocusTabs />");
    expect(experienceView).toContain("activeTrack");
    expect(projectsView).toContain("activeTrack");
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
