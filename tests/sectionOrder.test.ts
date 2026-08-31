import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

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
  it("renders the detailed tech stack immediately after About", () => {
    const app = readSource("../src/App.vue");

    expectInOrder(app, [
      "<HomeView",
      "<TechStackView",
      "<ExperienceView",
      "<ProjectsView",
      "<EducationView",
      "<ContactView",
    ]);
    expect(app).not.toContain("ProfileCard");
  });

  it("keeps desktop, mobile, and observed navigation in the same order", () => {
    const navbar = readSource("../src/components/Navbar.vue");

    expectInOrder(navbar, [
      '{ id: "hero", label: "About" }',
      '{ id: "techstack", label: "Tech" }',
      '{ id: "experience", label: "Experience" }',
      '{ id: "projects", label: "Projects" }',
      '{ id: "education", label: "Education" }',
      '{ id: "contact", label: "Contact" }',
    ]);
    expect(navbar).toContain("const sectionIds = navItems.map((item) => item.id)");
  });

  it("numbers visible sections according to their rendered order", () => {
    const numberedViews = [
      ["../src/views/TechStackView.vue", "01"],
      ["../src/views/ExperienceView.vue", "02"],
      ["../src/views/ProjectsView.vue", "03"],
      ["../src/views/EducationView.vue", "04"],
      ["../src/views/ContactView.vue", "05"],
    ] as const;

    for (const [path, index] of numberedViews) {
      expect(readSource(path)).toContain(`<span class="section-index">${index}</span>`);
    }

    const home = readSource("../src/views/HomeView.vue");
    expect(home).toContain('<section id="hero"');
    expect(home).toContain('<span class="section-index" aria-hidden="true">00</span>');
    expect(home).toContain('<p class="section-kicker">About Me</p>');
  });

  it("keeps the existing tech stack presentation while moving its section", () => {
    const home = readSource("../src/views/HomeView.vue");
    const techStack = readSource("../src/views/TechStackView.vue");
    const portfolio = readSource("../src/data/portfolio.ko.ts");
    const portfolioEn = readSource("../src/data/portfolio.en.ts");

    expect(home).not.toContain("hero-tech-summary");
    expect(home).not.toContain("activeTechSummary");
    expect(home).not.toContain("techByTrack");
    expect(home).toContain("activeScope.tech");
    expect(techStack).not.toContain("group.description");
    expect(techStack).not.toContain("iconMap[group.icon]");

    expect(portfolio).toContain('{ title: "프론트엔드", items: ["JavaScript", "TypeScript", "Vue", "React", "Next.js", "WebSquare", "JSP"] }');
    expect(portfolio).toContain('{ title: "백엔드", items: ["Java", "Spring MVC", "Spring Boot", "MyBatis", "Python", "FastAPI"] }');
    expect(portfolio).toContain('{ title: "데이터베이스", items: ["MariaDB", "MySQL", "Oracle", "PostgreSQL", "SQLite"] }');
    expect(portfolio).toContain('{ title: "도구 및 배포", items: ["Git", "GitHub", "GitHub Actions", "SVN", "Jenkins", "Linux", "Tomcat", "Docker"] }');

    expect(portfolioEn).toContain('{ title: "Frontend", items: ["JavaScript", "TypeScript", "Vue", "React", "Next.js", "WebSquare", "JSP"] }');
    expect(portfolioEn).toContain('{ title: "Backend", items: ["Java", "Spring MVC", "Spring Boot", "MyBatis", "Python", "FastAPI"] }');
    expect(portfolioEn).toContain('{ title: "Database", items: ["MariaDB", "MySQL", "Oracle", "PostgreSQL", "SQLite"] }');
    expect(portfolioEn).toContain('{ title: "Tools & Deployment", items: ["Git", "GitHub", "GitHub Actions", "SVN", "Jenkins", "Linux", "Tomcat", "Docker"] }');
  });
});
