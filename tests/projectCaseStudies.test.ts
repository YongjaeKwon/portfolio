import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { projectCaseStudies } from "../src/data/caseStudies";
import { featuredProjects } from "../src/data/portfolio";

const projectViewPath = fileURLToPath(new URL("../src/views/ProjectsView.vue", import.meta.url));

describe("project case studies", () => {
  it("keeps multiple detailed cases for operating and public projects", () => {
    expect(projectCaseStudies.pps.length).toBeGreaterThanOrEqual(5);
    expect(projectCaseStudies.tsms.length).toBeGreaterThanOrEqual(4);
    expect(projectCaseStudies.ssafast.length).toBeGreaterThanOrEqual(2);
    expect(projectCaseStudies.ddoing.length).toBeGreaterThanOrEqual(2);
    expect(projectCaseStudies.modac.length).toBeGreaterThanOrEqual(2);
    expect(projectCaseStudies["quant-lab"].length).toBeGreaterThanOrEqual(2);

    for (const studies of Object.values(projectCaseStudies)) {
      const ids = studies.map((study) => study.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const study of studies) {
        expect(study.problem.length).toBeGreaterThan(20);
        expect(study.constraint.length).toBeGreaterThan(20);
        expect(study.decision.length).toBeGreaterThan(20);
        expect(study.implementation.length).toBeGreaterThanOrEqual(3);
        expect(study.outcome.length).toBeGreaterThan(20);
      }
    }
  });

  it("includes frontend evidence without presenting React as work experience", () => {
    const vueStateCase = projectCaseStudies.pps.find((study) => study.id === "vue-state-isolation");
    expect(vueStateCase?.area).toBe("Frontend");
    expect(vueStateCase?.problem).toMatch(/화면|상태/);

    const serialized = JSON.stringify(projectCaseStudies);
    expect(serialized).not.toMatch(/React.*실무|Next\.js.*실무/);
  });

  it("keeps code examples short and safe to publish", () => {
    const blocks = Object.values(projectCaseStudies)
      .flat()
      .flatMap((study) => (study.code ? [study.code] : []));

    expect(blocks.length).toBeGreaterThanOrEqual(5);

    for (const block of blocks) {
      expect(block.content.split("\n").length).toBeLessThanOrEqual(15);
      expect(block.note.length).toBeGreaterThan(20);
      expect(block.content).not.toMatch(/KakaoAK|172\.15\.|TB_[A-Z0-9_]+|https?:\/\//i);
    }
  });

  it("loads the detailed case UI only when a project detail is opened", () => {
    const source = readFileSync(projectViewPath, "utf8");
    expect(source).toContain('defineAsyncComponent(() => import("@/components/ProjectCaseStudyList.vue"))');
    for (const projectId of Object.keys(projectCaseStudies)) {
      expect(source).toContain(`"${projectId}"`);
    }
    expect(source).not.toMatch(/^import ProjectCaseStudyList/m);
  });

  it("describes the public quant-lab repository with its actual runtime stack", () => {
    const quantLab = featuredProjects.find((project) => project.id === "quant-lab");
    expect(quantLab?.stack).toEqual(expect.arrayContaining(["Python", "FastAPI", "WebSocket", "Docker", "pytest"]));
    expect(quantLab?.stack).not.toEqual(expect.arrayContaining(["PostgreSQL", "Redis"]));
  });
});
