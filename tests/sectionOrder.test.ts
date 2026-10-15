import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { techGroups } from "../src/data/portfolio.ko";
import { techGroups as enTechGroups } from "../src/data/portfolio.en";

const readSource = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

const expectInOrder = (source: string, tokens: string[]) => {
  let previousIndex = -1;
  for (const token of tokens) {
    const currentIndex = source.indexOf(token);
    expect(currentIndex, `Expected ${token} after the preceding section`).toBeGreaterThan(previousIndex);
    previousIndex = currentIndex;
  }
};

describe("portfolio section order", () => {
  it("shows work evidence (experience, projects) before the tech stack", () => {
    const app = readSource("../src/App.vue");

    expectInOrder(app, [
      "<HomeView",
      "<ExperienceView",
      "<ProjectsView",
      "<TechStackView",
      "<EducationView",
      "<ContactView",
    ]);
    expect(app).not.toContain("ProfileCard");
  });

  it("keeps desktop, mobile, and observed navigation in the same order", () => {
    const navbar = readSource("../src/components/Navbar.vue");

    expectInOrder(navbar, [
      '{ id: "hero", label: "About", labelKo: "소개" }',
      '{ id: "experience", label: "Experience", labelKo: "경력" }',
      '{ id: "projects", label: "Projects", labelKo: "프로젝트" }',
      '{ id: "techstack", label: "Tech", labelKo: "기술" }',
      '{ id: "education", label: "Education", labelKo: "교육" }',
      '{ id: "contact", label: "Contact", labelKo: "연락" }',
    ]);
    expect(navbar).toContain("const sectionIds = navItems.map((item) => item.id)");
  });

  it("uses plain headings without section numbers or eyebrow labels", () => {
    const views = ["HomeView", "ExperienceView", "ProjectsView", "TechStackView", "EducationView", "ContactView"];
    for (const view of views) {
      const source = readSource(`../src/views/${view}.vue`);
      expect(source).not.toContain("section-index");
      expect(source).not.toContain("section-kicker");
    }
    for (const view of views.slice(1)) {
      expect(readSource(`../src/views/${view}.vue`)).toMatch(/<h2 class="(reveal )?section-title">/);
    }
    expect(readSource("../src/views/HomeView.vue")).toContain('<section id="hero"');
  });

  it("keeps the existing tech stack presentation while moving its section", () => {
    const home = readSource("../src/views/HomeView.vue");
    const techStack = readSource("../src/views/TechStackView.vue");

    expect(home).not.toContain("hero-tech-summary");
    expect(home).not.toContain("activeTechSummary");
    expect(home).not.toContain("techByTrack");
    expect(home).not.toContain("hero-proof");
    expect(home).not.toContain("activeProof");
    expect(techStack).not.toContain("group.description");
    expect(techStack).not.toContain("iconMap[group.icon]");

    expect(techGroups.map((group) => group.title)).toEqual(["백엔드", "프론트엔드", "데이터베이스", "배포·형상관리"]);
    expect(techGroups[1].items).toContain("Nexacro 17");
    expect(techGroups.flatMap((group) => group.items)).not.toContain("React");
    expect(enTechGroups.map((group) => group.items)).toEqual(techGroups.map((group) => group.items));
  });
});
