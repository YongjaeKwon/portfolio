import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { projectCaseStudies } from "../src/data/caseStudies";
import { featuredProjects } from "../src/data/portfolio";
import * as ko from "../src/data/portfolio.ko";
import * as en from "../src/data/portfolio.en";
import { enProjectCaseStudies } from "../src/data/caseStudies.en";

const projectDetailModalPath = fileURLToPath(new URL("../src/components/ProjectDetailModal.vue", import.meta.url));

describe("project case studies", () => {
  it("keeps language versions aligned on projects, technology, scope and download files", () => {
    expect(en.featuredProjects.map((project) => project.id)).toEqual(ko.featuredProjects.map((project) => project.id));
    expect(en.profile.resume).toBe(ko.profile.resume);
    expect(en.profile.career).toBe(ko.profile.career);
    expect(en.techGroups.map((group) => group.items)).toEqual(ko.techGroups.map((group) => group.items));
    for (const project of ko.featuredProjects) {
      const translated = en.featuredProjects.find((item) => item.id === project.id)!;
      expect(translated.stack).toEqual(project.stack);
      expect(translated.focuses).toEqual(project.focuses);
      expect(translated.detail.resources.map((item) => item.href)).toEqual(project.detail.resources.map((item) => item.href));
    }
    for (const id of Object.keys(projectCaseStudies) as Array<keyof typeof projectCaseStudies>) {
      expect(enProjectCaseStudies[id].map((study) => study.id)).toEqual(projectCaseStudies[id].map((study) => study.id));
    }
  });

  it("retains the limits of performance claims and keeps ReachRich private", () => {
    expect(JSON.stringify(projectCaseStudies.tsms.find((item) => item.id === "cc"))).toContain("운영 반영 전");
    expect(JSON.stringify(enProjectCaseStudies.tsms.find((item) => item.id === "cc"))).toContain("not yet been deployed");
    expect(JSON.stringify(projectCaseStudies.oneulsai)).toMatch(/회원 조회를 대체한 로컬 테스트/);
    expect(JSON.stringify(projectCaseStudies.ticketrush)).toContain("로컬 통합 테스트");
    expect(ko.featuredProjects.find((item) => item.id === "reachrich")?.detail.resources).toEqual([]);
    const publicText = JSON.stringify([ko, en, projectCaseStudies, enProjectCaseStudies]);
    expect(publicText).not.toMatch(/63[~–]69|108,237|quant-lab|two servers|서버 두 대|Testcontainers|Mockito/);
  });
  it("keeps multiple detailed cases for operating and public projects", () => {
    expect(projectCaseStudies.pps.length).toBeGreaterThanOrEqual(5);
    expect(projectCaseStudies.tsms.length).toBeGreaterThanOrEqual(4);
    expect(projectCaseStudies.ssafast.length).toBeGreaterThanOrEqual(2);
    expect(projectCaseStudies.sr30.length).toBe(5);
    expect(projectCaseStudies.oneulsai.length).toBe(3);
    expect(projectCaseStudies.reachrich.length).toBeGreaterThanOrEqual(4);

    for (const studies of Object.values(projectCaseStudies)) {
      const ids = studies.map((study) => study.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const study of studies) {
        expect(study.title.length).toBeGreaterThan(5);
        expect(study.implementation.length).toBeGreaterThanOrEqual(1);
        expect(study.implementation.every((text) => text.length > 20)).toBe(true);
      }
    }
  });

  it("includes frontend evidence without presenting React as work experience", () => {
    const vueStateCase = projectCaseStudies.pps.find((study) => study.id === "attachment");
    expect(vueStateCase?.area).toBe("Full Stack");
    expect(vueStateCase?.implementation.join(" ")).toMatch(/Vue.*인스턴스/);

    const serialized = JSON.stringify(projectCaseStudies);
    expect(serialized).not.toMatch(/React.*실무|Next\.js.*실무/);
  });

  it("keeps code examples short and safe to publish", () => {
    const blocks = Object.values(projectCaseStudies)
      .flat()
      .flatMap((study) => (study.code ? [study.code] : []));

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
