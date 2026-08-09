import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { projectCaseStudies } from "../src/data/caseStudies";
import { featuredProjects } from "../src/data/portfolio";

const projectDetailModalPath = fileURLToPath(new URL("../src/components/ProjectDetailModal.vue", import.meta.url));

describe("project case studies", () => {
  it("keeps multiple detailed cases for operating and public projects", () => {
    expect(projectCaseStudies.pps.length).toBeGreaterThanOrEqual(5);
    expect(projectCaseStudies.tsms.length).toBeGreaterThanOrEqual(4);
    expect(projectCaseStudies.ssafast.length).toBeGreaterThanOrEqual(2);
    expect(projectCaseStudies.ddoing.length).toBeGreaterThanOrEqual(2);
    expect(projectCaseStudies.modac.length).toBeGreaterThanOrEqual(2);
    expect(projectCaseStudies.reachrich.length).toBeGreaterThanOrEqual(4);

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
    const source = readFileSync(projectDetailModalPath, "utf8");
    expect(source).toContain('defineAsyncComponent(() => import("@/components/ProjectCaseStudyList.vue"))');
    for (const projectId of Object.keys(projectCaseStudies)) {
      expect(source).toContain(`"${projectId}"`);
    }
    expect(source).not.toMatch(/^import ProjectCaseStudyList/m);
  });

  it("describes ReachRich as a private full-stack redesign with its verified stack", () => {
    const reachRich = featuredProjects.find((project) => project.id === "reachrich");
    expect(reachRich?.stack).toEqual(expect.arrayContaining([
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "SQLAlchemy",
      "SQLite",
      "Parquet",
      "GitHub Actions",
      "pytest",
      "Vitest",
    ]));
    expect(reachRich?.stack).not.toEqual(expect.arrayContaining(["WebSocket", "Docker"]));
    expect(reachRich?.focuses).toEqual(expect.arrayContaining(["frontend", "backend"]));
    expect(reachRich?.card.visibility).toBe("비공개 개인 프로젝트");
  });
});
