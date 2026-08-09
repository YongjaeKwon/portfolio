import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import SsafastDemo from "../src/components/demos/SsafastDemo.vue";
import { attachClientRender, hostDocument, mountVue } from "./utils/vueHostMount";

const source = readFileSync(
  fileURLToPath(new URL("../src/components/demos/SsafastDemo.vue", import.meta.url)),
  "utf8"
);
attachClientRender(SsafastDemo, source);

describe("SSAFAST guided demo", () => {
  it("loads sample Figma frames, selects one, enters the specification stage, and resets", async () => {
    const wrapper = await mountVue(SsafastDemo);

    expect(wrapper.findByText("Figma 화면 선택", "H4")).toBeTruthy();
    const next = wrapper.findButton("선택한 화면으로 명세 작성");
    expect(next).toBeTruthy();
    expect(next?.disabled).toBe(true);
    await wrapper.trigger(next!, "click");
    expect(wrapper.findByText("Figma 화면 선택", "H4")).toBeTruthy();

    const load = wrapper.findButton("샘플 화면 불러오기");
    expect(load).toBeTruthy();
    await wrapper.trigger(load!, "click");
    expect(wrapper.findByText("샘플 화면 불러오는 중")).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 450));
    await nextTick();

    expect(wrapper.findByText("샘플 파일 · 3개 프레임")).toBeTruthy();
    const frame = wrapper.all().find((element) =>
      element.tagName === "BUTTON"
      && element.textContent.replace(/\s+/g, " ").includes("API 명세 작성")
      && element.hasAttribute("aria-pressed"),
    );
    expect(frame).toBeTruthy();
    expect(frame?.getAttribute("aria-pressed")).toBe("false");
    await wrapper.trigger(frame!, "click");
    expect(frame?.getAttribute("aria-pressed")).toBe("true");
    expect(next?.disabled).toBe(false);
    await wrapper.trigger(next!, "click");

    expect(wrapper.findByText("명세 작성", "H4")).toBeTruthy();
    expect(wrapper.findByText("연결 화면")).toBeTruthy();
    expect(hostDocument.activeElement?.className).toContain("guide-card");
    expect(hostDocument.activeElement?.focusCount).toBeGreaterThan(0);
    expect(hostDocument.activeElement?.scrollIntoViewCount).toBeGreaterThan(0);

    const reset = wrapper.findButton("데모 초기화");
    expect(reset).toBeTruthy();
    const guideCard = wrapper.all().find((element) => element.className.includes("guide-card"));
    expect(guideCard).toBeTruthy();
    const scrollCountBeforeReset = guideCard!.scrollIntoViewCount;
    reset!.focus();
    await wrapper.trigger(reset!, "click");
    expect(wrapper.findByText("Figma 화면 선택", "H4")).toBeTruthy();
    expect(wrapper.findByText("아직 불러온 화면이 없습니다.")).toBeTruthy();
    expect(wrapper.findButton("선택한 화면으로 명세 작성")?.disabled).toBe(true);
    expect(wrapper.findByText("샘플 데이터를 초기화했습니다.")).toBeTruthy();
    expect(hostDocument.activeElement).toBe(reset);
    expect(guideCard!.scrollIntoViewCount).toBe(scrollCountBeforeReset);

    wrapper.unmount();
  });

  it("presents the Figma-to-test workflow as six ordered steps", () => {
    const labels = ["Figma 화면 선택", "명세 작성", "중첩 입력", "요청 확인", "테스트 실행", "응답·성능 확인"];
    let previousIndex = -1;

    for (const label of labels) {
      const currentIndex = source.indexOf(`label: "${label}"`);
      expect(currentIndex).toBeGreaterThan(previousIndex);
      previousIndex = currentIndex;
    }

    expect(source).toContain("const guidedSteps: GuidedStep[]");
    expect(source).toContain("const moveToPreviousStep");
    expect(source).toContain("const moveToNextStep");
    expect(source).toContain("setGuidedStepView(5)");
    expect(source).toContain("setGuidedStepView(0, options)");
    expect(source).toContain("resetDemo({ moveFocus: false })");
    expect(source).toContain("resetDemo({ moveFocus: true })");
  });

  it("separates the team-owned Figma integration from the contributor's frontend work", () => {
    expect(source).toContain("사용자 행동");
    expect(source).toContain("화면 변화");
    expect(source).toContain("원 프로젝트 구현");
    expect(source).toContain("공개 데모 재현");
    expect(source).toContain("원 프로젝트 · 팀 연동 기능");
    expect(source).toContain("원 프로젝트 · Frontend 담당");
    expect(source).toContain("Figma OAuth·API 연동은 팀원이 담당했습니다");
    expect(source).toContain("API 명세 동적 폼과 요청·성능 테스트 화면을 주로 개발");
    expect(source).toContain("화면별 API 연결 목록 리팩터링에 참여");
    expect(source.match(/ownership:/g)).toHaveLength(7);
    expect(source.match(/^\s+demo:/gm)).toHaveLength(7);
  });

  it("keeps the Figma import local and discloses simulation limits before any execution CTA", () => {
    const disclosureIndex = source.indexOf("실제 API를 호출하거나 성능을 측정하지 않습니다");
    const ctaIndex = source.indexOf("'시뮬레이션 실행'");

    expect(disclosureIndex).toBeGreaterThanOrEqual(0);
    expect(ctaIndex).toBeGreaterThan(disclosureIndex);
    expect(source).toContain("외부 요청 없이 같은 선택 흐름만 재현합니다");
    expect(source).toContain("외부 OAuth·API·서버 저장은 연결하지 않습니다");
    expect(source).toContain('const FIGMA_SAMPLE_PATH = "sample.figma.local/file/ssafast-team-ui"');
    expect(source).toContain("실제 측정값이 아닌 공개 데모용 시뮬레이션");
    expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|new\s+WebSocket|https?:\/\//i);
    expect(source).not.toMatch(/api\.figma\.com|client[_-]?secret|access[_-]?token|\/v1\/(files|images)/i);
  });

  it("keeps the guided experience accessible and responsive", () => {
    expect(source).toContain('aria-label="SSAFAST 전체 기능 흐름"');
    expect(source).toContain(":aria-current=\"guidedStep === index ? 'step' : undefined\"");
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('@media (max-width: 820px)');
    expect(source).toContain("overflow-x: auto");
    expect(source).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
