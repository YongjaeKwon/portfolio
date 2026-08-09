import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");

const projectView = readSource("../src/views/ProjectsView.vue");
const demoPanel = readSource("../src/components/demos/ProjectDemoPanel.vue");

const demoSources = {
  ssafast: readSource("../src/components/demos/SsafastDemo.vue"),
  ddoing: readSource("../src/components/demos/DdoingDemo.vue"),
  modac: readSource("../src/components/demos/ModacDemo.vue"),
};

describe("interactive project demos", () => {
  it("loads the demo panel and each project demo lazily", () => {
    expect(projectView).toContain('defineAsyncComponent(() => import("@/components/demos/ProjectDemoPanel.vue"))');
    expect(projectView).toContain('new Set(["ssafast", "ddoing", "modac"])');
    expect(projectView).toContain("직접 체험하기");
    expect(projectView).toContain("openInlineDemo(item)");
    expect(projectView).toContain("start-expanded");
    expect(projectView).toContain("embedded");
    expect(demoPanel).toContain("startExpanded?: boolean");

    for (const projectId of Object.keys(demoSources)) {
      expect(demoPanel).toContain(`import("@/components/demos/${projectId === "ssafast" ? "Ssafast" : projectId === "ddoing" ? "Ddoing" : "Modac"}Demo.vue")`);
    }
  });

  it("keeps all demos explicit about sample data and blocks external requests", () => {
    for (const source of Object.values(demoSources)) {
      expect(source).toContain("샘플 데이터 데모");
      expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|new\s+WebSocket|https?:\/\//i);
    }
  });

  it("keeps timers and interactive state bounded to the component lifecycle", () => {
    expect(demoPanel).toContain('v-if="expanded"');
    expect(demoPanel).not.toContain("v-show");
    expect(demoSources.ssafast).toContain("onBeforeUnmount");
    expect(demoSources.ssafast).toContain("localStorage");
    expect(demoSources.ssafast).toContain("const runTarget: ActiveRun");
    expect(demoSources.ddoing).toContain("<canvas");
    expect(demoSources.ddoing).toContain("샘플 그림 그리기");
    expect(demoSources.ddoing).toContain("onBeforeUnmount");
    expect(demoSources.modac).toContain("onBeforeUnmount");
    expect(demoSources.modac).toContain('<Teleport to="body">');
    expect(demoSources.modac).toContain("trapInviteFocus");
    expect(projectView).not.toContain("nestedDemoDialogOpen");
    expect(projectView).toContain('@dialog-state-change="handleInlineDialogStateChange"');
    expect(projectView).toContain("appRoot.inert = true");
    expect(projectView).toContain('appRoot.setAttribute("aria-hidden", "true")');
    expect(projectView).toContain('document.body.style.overflow = "hidden"');
    expect(projectView).toContain("root.inert = false");
    expect(projectView).toContain("handleInlineDialogStateChange(false)");
    expect(demoSources.modac).toContain("MODAC");
  });
});
