import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import DdoingDemo from "../src/components/demos/DdoingDemo.vue";
import { attachClientRender, hostDocument, mountVue } from "./utils/vueHostMount";

const source = readFileSync(
  fileURLToPath(new URL("../src/components/demos/DdoingDemo.vue", import.meta.url)),
  "utf8",
);
attachClientRender(DdoingDemo, source);

describe("ddoing guided demo", () => {
  it("advances to the drawing stage and returns to the first stage on reset", async () => {
    const wrapper = await mountVue(DdoingDemo);

    expect(wrapper.findByText("학습할 단어 제시", "H4")).toBeTruthy();
    const next = wrapper.findButton("그림 입력으로");
    expect(next).toBeTruthy();
    await wrapper.trigger(next!, "click");

    expect(wrapper.findByText("Canvas에 그림 입력", "H4")).toBeTruthy();
    expect(wrapper.findByText("첫 입력 시 시작")).toBeTruthy();

    const reset = wrapper.findButton("전체 초기화");
    expect(reset).toBeTruthy();
    reset?.focus();
    await wrapper.trigger(reset!, "click");
    expect(wrapper.findByText("학습할 단어 제시", "H4")).toBeTruthy();
    expect(wrapper.findByText("사과", "STRONG")).toBeTruthy();
    expect(hostDocument.activeElement).toBe(reset);
    expect(reset?.scrollIntoViewCount).toBe(0);

    wrapper.unmount();
  });

  it("preserves the same drawing when navigating DRAW to WORD and back to DRAW", async () => {
    const wrapper = await mountVue(DdoingDemo);

    await wrapper.trigger(wrapper.findButton("그림 입력으로")!, "click");
    const originalCanvas = wrapper.all().find((element) => element.tagName === "CANVAS");
    expect(originalCanvas).toBeTruthy();
    expect(originalCanvas?.toDataURL()).toContain(",blank-");

    await wrapper.trigger(wrapper.findButton("사과 샘플 그림 그리기")!, "click");
    expect(originalCanvas?.toDataURL()).toContain(",ink-");
    expect(wrapper.findByText("3개 획 입력")).toBeTruthy();
    expect(wrapper.findButton("입력 완료")?.disabled).toBe(false);

    await wrapper.trigger(wrapper.findButton("이전 단계")!, "click");
    expect(wrapper.findByText("학습할 단어 제시", "H4")).toBeTruthy();
    await wrapper.trigger(wrapper.findButton("그림 입력으로")!, "click");

    const restoredCanvas = wrapper.all().find((element) => element.tagName === "CANVAS");
    expect(restoredCanvas).toBeTruthy();
    expect(restoredCanvas).not.toBe(originalCanvas);
    expect(restoredCanvas?.toDataURL()).toContain(",ink-");
    expect(wrapper.findByText("3개 획 입력")).toBeTruthy();
    expect(wrapper.findButton("입력 완료")?.disabled).toBe(false);

    wrapper.unmount();
  });

  it("keeps clear and full reset boundaries blank across drawing-stage remounts", async () => {
    const wrapper = await mountVue(DdoingDemo);

    await wrapper.trigger(wrapper.findButton("그림 입력으로")!, "click");
    await wrapper.trigger(wrapper.findButton("사과 샘플 그림 그리기")!, "click");
    await wrapper.trigger(wrapper.findButton("모두 지우기")!, "click");

    expect(wrapper.findByText("입력 대기")).toBeTruthy();
    expect(wrapper.findButton("입력 완료")?.disabled).toBe(true);
    await wrapper.trigger(wrapper.findButton("이전 단계")!, "click");
    await wrapper.trigger(wrapper.findButton("그림 입력으로")!, "click");
    expect(wrapper.all().find((element) => element.tagName === "CANVAS")?.toDataURL()).toContain(",blank-");
    expect(wrapper.findButton("입력 완료")?.disabled).toBe(true);

    await wrapper.trigger(wrapper.findButton("사과 샘플 그림 그리기")!, "click");
    await wrapper.trigger(wrapper.findButton("전체 초기화")!, "click");
    expect(wrapper.findByText("학습할 단어 제시", "H4")).toBeTruthy();
    await wrapper.trigger(wrapper.findButton("그림 입력으로")!, "click");
    expect(wrapper.all().find((element) => element.tagName === "CANVAS")?.toDataURL()).toContain(",blank-");
    expect(wrapper.findByText("입력 대기")).toBeTruthy();
    expect(wrapper.findButton("입력 완료")?.disabled).toBe(true);

    wrapper.unmount();
  });

  it("restores the submitted drawing from completion and starts the next word with a blank canvas", async () => {
    const wrapper = await mountVue(DdoingDemo);

    await wrapper.trigger(wrapper.findButton("그림 입력으로")!, "click");
    await wrapper.trigger(wrapper.findButton("사과 샘플 그림 그리기")!, "click");
    await wrapper.trigger(wrapper.findButton("입력 완료")!, "click");
    await wrapper.trigger(wrapper.findButton("이미지 제출")!, "click");
    await wrapper.trigger(wrapper.findButton("점수·경험치 보기")!, "click");
    expect(wrapper.findByText("활동 점수·경험치와 다음 문제", "H4")).toBeTruthy();
    expect(wrapper.all().find((element) => element.tagName === "CANVAS")?.toDataURL()).toContain(",ink-");

    await wrapper.trigger(wrapper.findButton("전체 흐름 마치기")!, "click");
    expect(wrapper.findByText("한 문제의 전체 학습 흐름을 확인했습니다", "H4")).toBeTruthy();
    await wrapper.trigger(wrapper.findButton("이전 단계")!, "click");
    expect(wrapper.findByText("활동 점수·경험치와 다음 문제", "H4")).toBeTruthy();
    expect(wrapper.all().find((element) => element.tagName === "CANVAS")?.toDataURL()).toContain(",ink-");

    await wrapper.trigger(wrapper.findButton("전체 흐름 마치기")!, "click");
    const nextWord = wrapper.findButton("우산도 체험하기");
    expect(nextWord).toBeTruthy();
    nextWord?.focus();
    await wrapper.trigger(nextWord!, "click");
    expect(wrapper.findByText("우산", "STRONG")).toBeTruthy();
    const nextRoundHeading = wrapper.findByText("학습할 단어 제시", "H4");
    expect(hostDocument.activeElement).toBe(nextRoundHeading);
    expect(nextRoundHeading?.focusCount).toBeGreaterThan(0);
    expect(nextRoundHeading?.scrollIntoViewCount).toBeGreaterThan(0);
    await wrapper.trigger(wrapper.findButton("그림 입력으로")!, "click");
    expect(wrapper.all().find((element) => element.tagName === "CANVAS")?.toDataURL()).toContain(",blank-");
    expect(wrapper.findButton("입력 완료")?.disabled).toBe(true);

    wrapper.unmount();
  });

  it("returns focus and scroll to the first word after the final restart CTA", async () => {
    const wrapper = await mountVue(DdoingDemo);

    for (const word of ["사과", "우산", "고양이"]) {
      await wrapper.trigger(wrapper.findButton("그림 입력으로")!, "click");
      await wrapper.trigger(wrapper.findButton(`${word} 샘플 그림 그리기`)!, "click");
      await wrapper.trigger(wrapper.findButton("입력 완료")!, "click");
      await wrapper.trigger(wrapper.findButton("이미지 제출")!, "click");
      await wrapper.trigger(wrapper.findButton("점수·경험치 보기")!, "click");
      await wrapper.trigger(wrapper.findButton("전체 흐름 마치기")!, "click");

      const continueButton = wrapper.findButton(word === "사과" ? "우산도 체험하기" : word === "우산" ? "고양이도 체험하기" : "처음부터 다시 보기");
      expect(continueButton).toBeTruthy();
      continueButton?.focus();
      await wrapper.trigger(continueButton!, "click");
      await nextTick();

      const heading = wrapper.findByText("학습할 단어 제시", "H4");
      expect(hostDocument.activeElement).toBe(heading);
      expect(heading?.scrollIntoViewCount).toBeGreaterThan(0);
    }

    expect(wrapper.findByText("사과", "STRONG")).toBeTruthy();
    wrapper.unmount();
  });

  it("presents the five learning stages in order", () => {
    const labels = ["단어", "그림", "제출", "판정", "점수"];
    const positions = labels.map((label) => source.indexOf(`shortTitle: "${label}"`));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(source).toContain("학습할 단어 제시");
    expect(source).toContain("Canvas에 그림 입력");
    expect(source).toContain("그림 이미지를 제출 형태로 변환");
    expect(source).toContain("공개용 판정 응답 확인");
    expect(source).toContain("활동 점수·경험치와 다음 문제");
  });

  it("makes the browser-only simulation and non-semantic score explicit", () => {
    expect(source).toContain("샘플 데이터 데모");
    expect(source).toContain("AI 서버를 호출하지 않는 브라우저 재현");
    expect(source).toContain("단어 일치나 정답 여부를 판정하지 않습니다");
    expect(source).toContain("semanticMatch: NOT_EVALUATED");
    expect(source).toContain("활동 지표이며, 그림의 의미를 판정한 값이 아닙니다");
    expect(source).not.toMatch(/DEMO CORRECT|TRY AGAIN|정답!|accepted|ACCEPTANCE_SCORE/);
    expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|new\s+WebSocket|https?:\/\//i);
  });

  it("draws a distinct sample for every word instead of reusing the apple", () => {
    expect(source).toContain("function drawAppleSample");
    expect(source).toContain("function drawUmbrellaSample");
    expect(source).toContain("function drawCatSample");
    expect(source).toContain('currentWord.value.word === "사과"');
    expect(source).toContain('currentWord.value.word === "우산"');
    expect(source).toContain('currentWord.value.word === "고양이"');
    expect(source).toContain("단어별 샘플 그림");
  });

  it("separates user action, screen change, original ownership, and demo-only reconstruction", () => {
    expect(source).toContain("사용자 행동");
    expect(source).toContain("화면 변화");
    expect(source).toContain("원 프로젝트 담당");
    expect(source).toContain("공개 데모 재현");
    expect(source).toContain("Canvas 드로잉 화면과 입력 상태 UI");
    expect(source).toContain("Pointer Event·ResizeObserver·단어별 샘플 그림 추가");
    expect(source).toContain("AI 판정 응답을 학습 결과 화면에 연결");
    expect(source.match(/^\s+demo:/gm)).toHaveLength(6);
  });

  it("supports bounded navigation, reset, accessibility, and timer cleanup", () => {
    expect(source).toContain("이전 단계");
    expect(source).toContain("전체 초기화");
    expect(source).toContain("nextStep");
    expect(source).toContain(":disabled=\"index > highestVisitedStep\"");
    expect(source).toContain(":aria-current=\"currentStep === index ? 'step' : undefined\"");
    expect(source).toContain("키보드 사용자는 단어별 샘플 그림 그리기 버튼");
    expect(source).toContain("role=\"timer\"");
    expect(source).toContain("onBeforeUnmount");
    expect(source).toMatch(/onBeforeUnmount\(\(\) => \{\s*clearTimer\(\);/);
    expect(source).toContain("focusRoundStart");
    expect(source).toContain('target.focus({ preventScroll: true })');
    expect(source).toContain('behavior: reduceMotion ? "auto" : "smooth", block: "start"');
    expect(source).toContain("scroll-margin-top: 5.5rem");
    expect(source).toContain("@media (max-width: 430px)");
    expect(source).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
