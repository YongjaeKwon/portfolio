import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import ModacDemo from "../src/components/demos/ModacDemo.vue";
import { attachClientRender, hostDocument, mountVue } from "./utils/vueHostMount";

const source = readFileSync(
  fileURLToPath(new URL("../src/components/demos/ModacDemo.vue", import.meta.url)),
  "utf8",
);
attachClientRender(ModacDemo, source);

describe("MODAC guided demo", () => {
  it("opens and closes the private-room dialog, emits its state, and restores focus", async () => {
    const dialogStates: boolean[] = [];
    const wrapper = await mountVue(ModacDemo, {
      onDialogStateChange: (open: boolean) => dialogStates.push(open),
    });

    const privateRoom = wrapper.all().find((element) =>
      element.tagName === "BUTTON" && element.getAttribute("aria-label")?.includes("프론트엔드 면접 준비"),
    );
    expect(privateRoom).toBeTruthy();
    await wrapper.trigger(privateRoom!, "click");
    expect(wrapper.findByText("참여 조건 확인", "STRONG")).toBeTruthy();
    await wrapper.trigger(wrapper.findButton("참여 절차로")!, "click");

    const entryTrigger = wrapper.findButton("초대 코드 입력");
    expect(entryTrigger).toBeTruthy();
    await wrapper.trigger(entryTrigger!, "click");

    expect(dialogStates).toEqual([true]);
    expect(wrapper.findByText("비공개 스터디 입장", "H4")).toBeTruthy();
    expect(hostDocument.activeElement?.getAttribute("id")).toBe("modac-invite-code");

    const close = wrapper.findButton("×");
    expect(close?.getAttribute("aria-label")).toBe("초대 코드 입력 닫기");
    await wrapper.trigger(close!, "click");

    expect(dialogStates).toEqual([true, false]);
    expect(wrapper.findByText("비공개 스터디 입장", "H4")).toBeFalsy();
    expect(hostDocument.activeElement).toBe(entryTrigger);

    wrapper.unmount();
  });

  it("validates the invite code and enters the study room without a real server", async () => {
    const wrapper = await mountVue(ModacDemo);
    const privateRoom = wrapper.all().find((element) =>
      element.tagName === "BUTTON" && element.getAttribute("aria-label")?.includes("프론트엔드 면접 준비"),
    );
    expect(privateRoom).toBeTruthy();
    await wrapper.trigger(privateRoom!, "click");
    await wrapper.trigger(wrapper.findButton("참여 절차로")!, "click");
    await wrapper.trigger(wrapper.findButton("초대 코드 입력")!, "click");

    const inviteInput = wrapper.all().find((element) => element.getAttribute("id") === "modac-invite-code");
    const inviteForm = wrapper.all().find((element) => element.className.includes("invite-dialog"));
    expect(inviteInput).toBeTruthy();
    expect(inviteForm).toBeTruthy();

    await wrapper.setValue(inviteInput!, "WRONG");
    await wrapper.trigger(inviteForm!, "submit");
    expect(wrapper.findByText("초대 코드가 일치하지 않습니다.")).toBeTruthy();

    await wrapper.setValue(inviteInput!, "MODAC");
    await wrapper.trigger(inviteForm!, "submit");
    expect(wrapper.findByText("스터디룸 활동", "STRONG")).toBeTruthy();
    expect(wrapper.findByText("용재 님이 스터디룸에 입장했습니다.")).toBeTruthy();
    expect(wrapper.findByText("비공개 스터디 입장", "H4")).toBeFalsy();

    wrapper.unmount();
  });

  it("keeps the header reset in place but focuses the first-stage heading from the record CTA", async () => {
    const wrapper = await mountVue(ModacDemo);

    const headerReset = wrapper.findButton("처음부터");
    expect(headerReset).toBeTruthy();
    headerReset?.focus();
    await wrapper.trigger(headerReset!, "click");
    expect(hostDocument.activeElement).toBe(headerReset);
    expect(headerReset?.scrollIntoViewCount).toBe(0);

    const publicRoom = wrapper.all().find((element) =>
      element.tagName === "BUTTON" && element.getAttribute("aria-label")?.includes("퇴근 후 알고리즘"),
    );
    expect(publicRoom).toBeTruthy();
    await wrapper.trigger(publicRoom!, "click");
    await wrapper.trigger(wrapper.findButton("참여 절차로")!, "click");
    await wrapper.trigger(wrapper.findButton("스터디 참여")!, "click");

    const roomHeader = wrapper.all().find((element) => element.className.includes("room-view-header"));
    const chatForm = wrapper.all().find((element) => element.className.includes("chat-form"));
    const completionAction = wrapper.all().find((element) => element.className.includes("room-completion-action"));
    const recordButton = wrapper.findButton("활동 기록 확인하기");
    expect(roomHeader?.querySelector("button")).toBeFalsy();
    expect(roomHeader?.textContent).toContain("참여 중");
    expect(wrapper.all().indexOf(completionAction!)).toBeGreaterThan(wrapper.all().indexOf(chatForm!));
    expect(recordButton).toBeTruthy();
    recordButton?.focus();
    await wrapper.trigger(recordButton!, "click");
    await nextTick();

    const recordHeading = wrapper.findByText("퇴근 후 알고리즘", "H4");
    expect(hostDocument.activeElement).toBe(recordHeading);
    expect(recordHeading?.focusCount).toBeGreaterThan(0);
    expect(recordHeading?.scrollIntoViewCount).toBeGreaterThan(0);

    const restart = wrapper.findButton("다른 흐름 다시 체험");
    expect(restart).toBeTruthy();
    restart?.focus();
    await wrapper.trigger(restart!, "click");
    await nextTick();

    const firstStageHeading = wrapper.findByText("참여할 스터디를 선택하세요", "H4");
    expect(hostDocument.activeElement).toBe(firstStageHeading);
    expect(firstStageHeading?.focusCount).toBeGreaterThan(0);
    expect(firstStageHeading?.scrollIntoViewCount).toBeGreaterThan(0);
    wrapper.unmount();
  });

  it("closes an open invite dialog during reset without restoring its stale trigger focus", async () => {
    const dialogStates: boolean[] = [];
    const wrapper = await mountVue(ModacDemo, {
      onDialogStateChange: (open: boolean) => dialogStates.push(open),
    });
    const privateRoom = wrapper.all().find((element) =>
      element.tagName === "BUTTON" && element.getAttribute("aria-label")?.includes("프론트엔드 면접 준비"),
    );
    await wrapper.trigger(privateRoom!, "click");
    await wrapper.trigger(wrapper.findButton("참여 절차로")!, "click");
    const entryTrigger = wrapper.findButton("초대 코드 입력");
    await wrapper.trigger(entryTrigger!, "click");

    const headerReset = wrapper.findButton("처음부터");
    headerReset?.focus();
    await wrapper.trigger(headerReset!, "click");

    expect(dialogStates).toEqual([true, false]);
    expect(wrapper.findByText("비공개 스터디 입장", "H4")).toBeFalsy();
    expect(hostDocument.activeElement).toBe(headerReset);
    expect(hostDocument.activeElement).not.toBe(entryTrigger);
    wrapper.unmount();
  });

  it("shows the whole study journey in five ordered stages", () => {
    const stages = ["스터디 탐색", "참여 조건 확인", "참여 요청", "스터디룸 활동", "활동 기록 확인"];
    const positions = stages.map((stage) => source.indexOf(`title: t("${stage}"`));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(source).toContain("currentStep === 1");
    expect(source).toContain("currentStep === 5 && activeRoom");
  });

  it("separates the original implementation boundary from browser-only demo work", () => {
    expect(source).toContain("사용자 행동");
    expect(source).toContain("화면 변화");
    expect(source).toContain("원 프로젝트 담당");
    expect(source).toContain("공개 데모 재현");
    expect(source).toContain("팀이 구현한 전체 서비스 중 제가 맡은 화면과 상태 처리 중심");
    expect(source).toContain("채팅 UI와 팀 WebSocket 연동 결과 반영");
    expect(source).toContain("활동 기록·통계 화면 UI");
    expect(source.match(/^\s+demo:/gm)).toHaveLength(5);
  });

  it("keeps the public demo browser-only and explicit about simulated data", () => {
    expect(source).toContain("브라우저에서 실행되는 공개용 시뮬레이션");
    expect(source).toContain("외부 서버·DB·WebSocket에 연결하지 않으며");
    expect(source).toContain("서버 저장 없이 UI 흐름만 재현");
    expect(source).not.toMatch(/\bfetch\s*\(|\baxios\b|new\s+WebSocket|https?:\/\//i);
  });

  it("retains invite validation, focus handling, timer cleanup, and reset", () => {
    expect(source).toContain('<Teleport to="body">');
    expect(source).toContain("trapInviteFocus");
    expect(source).toContain("DEMO_INVITE_CODE");
    expect(source).toContain("clearReplyTimers");
    expect(source).toContain("onBeforeUnmount");
    expect(source).toContain("selectedRoomId.value = null");
    expect(source).toContain("showActivityRecord.value = false");
    expect(source).toContain('ref="activityRecordHeading" tabindex="-1"');
    expect(source).toContain("room-completion-action");
    expect(source).not.toContain('class="leave-button"');
    expect(source).toContain("await closeInviteDialogState(false)");
    expect(source).toContain("focusRoomListStart");
    expect(source).toContain('target.focus({ preventScroll: true })');
    expect(source).toContain('behavior: reduceMotion ? "auto" : "smooth", block: "start"');
    expect(source).toContain("scroll-margin-top: 5.5rem");
  });
});
