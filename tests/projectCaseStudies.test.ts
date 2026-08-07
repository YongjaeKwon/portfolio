import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { projectCaseStudies } from "../src/data/caseStudies";

const projectViewPath = fileURLToPath(new URL("../src/views/ProjectsView.vue", import.meta.url));

describe("project case studies", () => {
  it("keeps multiple detailed cases for both operating systems", () => {
    expect(projectCaseStudies.pps.length).toBeGreaterThanOrEqual(5);
    expect(projectCaseStudies.tsms.length).toBeGreaterThanOrEqual(4);

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

  it("keeps code examples short and anonymized", () => {
    const blocks = Object.values(projectCaseStudies)
      .flat()
      .flatMap((study) => (study.code ? [study.code] : []));

    expect(blocks.length).toBeGreaterThanOrEqual(3);

    for (const block of blocks) {
      expect(block.content.split("\n").length).toBeLessThanOrEqual(15);
      expect(block.note).toMatch(/축약|바꿔/);
      expect(block.content).not.toMatch(/KakaoAK|172\.15\.|TB_[A-Z0-9_]+|https?:\/\//i);
    }
  });

  it("loads the detailed case UI only when a project detail is opened", () => {
    const source = readFileSync(projectViewPath, "utf8");
    expect(source).toContain('defineAsyncComponent(() => import("@/components/ProjectCaseStudyList.vue"))');
    expect(source).not.toMatch(/^import ProjectCaseStudyList/m);
  });
});
