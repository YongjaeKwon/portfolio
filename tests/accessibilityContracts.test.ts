import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

const functionBody = (source: string, start: string, end: string) => {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);
  expect(startIndex, `Expected ${start}`).toBeGreaterThan(-1);
  expect(endIndex, `Expected ${end} after ${start}`).toBeGreaterThan(startIndex);
  return source.slice(startIndex, endIndex);
};

describe("accessibility contracts", () => {
  it("exposes role filters as a pressed-button group", () => {
    const focusTabs = readSource("../src/components/FocusTabs.vue");

    expect(focusTabs).toMatch(/role=["']group["']/);
    expect(focusTabs).toContain(':aria-pressed="activeTrack === track.id"');
    expect(focusTabs).toContain('@click="setActiveTrack(track.id)"');
    expect(focusTabs).not.toMatch(/role=["']tablist["']|role=["']tab["']|aria-selected/);
  });

  it("restores the mobile navigation trigger before moving to a section", () => {
    const navbar = readSource("../src/components/Navbar.vue");
    const selection = functionBody(navbar, "const mobileMoveToSection", "</script>");

    expect(navbar).toContain('ref="mobileMenuToggle"');
    expect(navbar).toContain(":aria-expanded=\"isMenuOpen\"");
    expect(navbar).toContain(":aria-label=\"isMenuOpen ? t('메뉴 닫기', 'Close menu') : t('메뉴 열기', 'Open menu')\"");
    expect(selection).toMatch(
      /isMenuOpen\.value\s*=\s*false;[\s\S]*?await nextTick\(\);[\s\S]*?mobileMenuToggle\.value\?\.focus\(\{ preventScroll: true \}\);[\s\S]*?moveToSection\(section\);/,
    );
  });

  it("isolates the application while the shared project dialog is open and restores prior state", () => {
    const modal = readSource("../src/components/ProjectDetailModal.vue");
    const isolate = functionBody(modal, "const isolateBackground", "const restoreBackground");
    const restore = functionBody(modal, "const restoreBackground", "const handleKeydown");
    const projectWatcher = functionBody(modal, "watch(", "onBeforeUnmount(");
    const unmount = functionBody(modal, "onBeforeUnmount(", "</script>");

    expect(modal).toContain('<Teleport to="body">');
    expect(modal).toContain('role="dialog"');
    expect(modal).toContain('aria-modal="true"');

    expect(isolate).toContain('document.querySelector<HTMLElement>("#app")');
    expect(isolate).toContain('appRoot.getAttribute("aria-hidden")');
    expect(isolate).toContain("previousAppInert = appRoot.inert");
    expect(isolate).toContain("previousBodyOverflow = document.body.style.overflow");
    expect(isolate).toContain("appRoot.inert = true");
    expect(isolate).toContain('appRoot.setAttribute("aria-hidden", "true")');
    expect(isolate).toContain('document.body.style.overflow = "hidden"');

    expect(restore).toContain("appRoot.inert = previousAppInert");
    expect(restore).toContain('appRoot.removeAttribute("aria-hidden")');
    expect(restore).toContain('appRoot.setAttribute("aria-hidden", previousAppAriaHidden)');
    expect(restore).toContain("document.body.style.overflow = previousBodyOverflow");
    expect(projectWatcher).toContain("isolateBackground()");
    expect(projectWatcher).toContain("restoreBackground()");
    expect(projectWatcher).toMatch(
      /if\s*\(!previousProject\)[\s\S]*?addEventListener\(["']keydown["'],\s*handleKeydown\)/,
    );
    expect(projectWatcher).toMatch(
      /if\s*\(previousProject\)[\s\S]*?removeEventListener\(["']keydown["'],\s*handleKeydown\)/,
    );
    expect(unmount).toContain("restoreBackground()");
  });

  it("keeps the condensed career section labelled as career details", () => {
    const experience = readSource("../src/views/ExperienceView.vue");
    expect(experience).toContain('class="section-title">{{ t("경력 사항", "Work Experience") }}</h3>');
  });
});
