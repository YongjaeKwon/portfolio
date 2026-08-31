<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { isEn, t } from "@/i18n/locale";

const emit = defineEmits<{ (event: "dialog-state-change", open: boolean): void }>();

type RoomVisibility = "public" | "private";

interface DemoRoom {
  id: number;
  title: string;
  description: string;
  category: string;
  members: number;
  capacity: number;
  visibility: RoomVisibility;
  inviteCode?: string;
}

interface ChatMessage {
  id: number;
  sender: string;
  body: string;
  time: string;
  mine?: boolean;
  system?: boolean;
}

const DEMO_INVITE_CODE = "MODAC";

const initialRooms: DemoRoom[] = [
  {
    id: 1,
    title: t("퇴근 후 알고리즘", "After-work Algorithms"),
    description: t("매주 세 문제를 풀고 풀이 과정을 나눠요.", "Solve three problems a week and share the solutions."),
    category: t("알고리즘", "Algorithms"),
    members: 3,
    capacity: 5,
    visibility: "public",
  },
  {
    id: 2,
    title: t("프론트엔드 면접 준비", "Frontend Interview Prep"),
    description: t("정해진 질문을 준비하고 서로 피드백해요.", "Prepare set questions and give each other feedback."),
    category: t("취업 준비", "Job hunting"),
    members: 2,
    capacity: 4,
    visibility: "private",
    inviteCode: DEMO_INVITE_CODE,
  },
  {
    id: 3,
    title: t("SQL 한 문제씩", "One SQL Problem a Day"),
    description: t("짧게라도 매일 꾸준히 문제를 풉니다.", "A little every day, but every day."),
    category: t("데이터베이스", "Databases"),
    members: 4,
    capacity: 4,
    visibility: "public",
  },
];

const seededMessages: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, sender: t("민지", "Minji"), body: t("오늘 문제 링크 올려두었어요!", "I posted today's problem link!"), time: "20:04" },
    { id: 2, sender: t("준호", "Junho"), body: t("저는 9시부터 같이 풀게요.", "I'll join and solve from 9."), time: "20:06" },
  ],
  2: [
    { id: 3, sender: t("서연", "Seoyeon"), body: t("오늘은 브라우저 렌더링 질문부터 볼까요?", "Shall we start with browser rendering questions today?"), time: "19:42" },
    { id: 4, sender: t("지훈", "Jihun"), body: t("좋아요. 정리한 내용도 공유할게요.", "Sounds good — I'll share my notes too."), time: "19:44" },
  ],
  3: [],
};

const cloneRooms = () => initialRooms.map((room) => ({ ...room }));
const cloneMessages = (roomId: number) =>
  (seededMessages[roomId] ?? []).map((message) => ({ ...message }));

const rooms = ref<DemoRoom[]>(cloneRooms());
const selectedRoomId = ref<number | null>(null);
const joinReady = ref(false);
const showActivityRecord = ref(false);
const pendingRoomId = ref<number | null>(null);
const activeRoomId = ref<number | null>(null);
const inviteCode = ref("");
const inviteError = ref("");
const roomError = ref("");
const chatDraft = ref("");
const messages = ref<ChatMessage[]>([]);
const chatInput = ref<HTMLInputElement | null>(null);
const chatLog = ref<HTMLElement | null>(null);
const inviteDialog = ref<HTMLFormElement | null>(null);
const inviteInput = ref<HTMLInputElement | null>(null);
const lastEntryTrigger = ref<HTMLElement | null>(null);
const roomListHeading = ref<HTMLElement | null>(null);
const activityRecordHeading = ref<HTMLElement | null>(null);
const replyTimers = new Set<number>();
let messageSequence = 10;

const activeRoom = computed(() =>
  rooms.value.find((room) => room.id === activeRoomId.value),
);

const pendingRoom = computed(() =>
  rooms.value.find((room) => room.id === pendingRoomId.value),
);

const selectedRoom = computed(() =>
  rooms.value.find((room) => room.id === selectedRoomId.value),
);

const guideSteps = [
  {
    title: t("스터디 탐색", "Browse study groups"),
    shortTitle: t("탐색", "Browse"),
    userAction: t("목록에서 스터디 선택", "Pick a study group from the list"),
    screenChange: t("인원·공개 범위·주제 확인", "Members, visibility, and topic shown"),
    ownership: t("스터디 목록·상태 UI와 탐색 화면", "Study list/state UI and browse screens"),
    demo: t("샘플 스터디 목록을 브라우저 메모리로 구성", "Sample study list built in browser memory"),
  },
  {
    title: t("참여 조건 확인", "Check join conditions"),
    shortTitle: t("조건", "Conditions"),
    userAction: t("선택한 스터디 상세 확인", "Review the selected study's details"),
    screenChange: t("정원·공개/비공개 조건 표시", "Capacity and public/private conditions shown"),
    ownership: t("상세 화면과 공개·비공개 조건 분기 UI", "Detail screens and public/private branching UI"),
    demo: t("정원과 공개 범위를 고정 샘플 조건으로 재현", "Capacity and visibility re-created as fixed sample conditions"),
  },
  {
    title: t("참여 요청", "Request to join"),
    shortTitle: t("참여", "Join"),
    userAction: t("바로 참여 또는 초대 코드 입력", "Join directly or enter an invite code"),
    screenChange: t("입장 검증 후 참여 인원 반영", "Member count updates after validation"),
    ownership: t("참여 요청·검증 결과·오류 상태 UI", "Join request, validation, and error-state UI"),
    demo: t("고정 초대 코드로 성공·오류 흐름을 브라우저에서 검증", "Success and error flows verified in-browser with a fixed invite code"),
  },
  {
    title: t("스터디룸 활동", "Study room activity"),
    shortTitle: t("활동", "Activity"),
    userAction: t("메시지 작성과 참여 흐름 확인", "Write messages and follow the participation flow"),
    screenChange: t("채팅·참여 상태 갱신", "Chat and membership state update"),
    ownership: t("채팅 UI와 팀 WebSocket 연동 결과 반영", "Chat UI reflecting the team's WebSocket integration"),
    demo: t("외부 연결 없이 메시지와 지연 응답을 화면 상태로 생성", "Messages and delayed replies generated as screen state, no external connection"),
  },
  {
    title: t("활동 기록 확인", "Review activity log"),
    shortTitle: t("기록", "Log"),
    userAction: t("이번 활동 요약 확인", "Review this session's summary"),
    screenChange: t("참여·메시지 기록 요약", "Participation and message summary"),
    ownership: t("활동 기록·통계 화면 UI", "Activity log and statistics UI"),
    demo: t("현재 세션의 참여·메시지 수를 브라우저에서 집계", "This session's participation and messages tallied in the browser"),
  },
] as const;

const currentStep = computed(() => {
  if (showActivityRecord.value) return 5;
  if (activeRoom.value) return 4;
  if (joinReady.value) return 3;
  if (selectedRoom.value) return 2;
  return 1;
});
const currentGuide = computed(() => guideSteps[currentStep.value - 1]);

const memberLabel = (room: DemoRoom) => t(`${room.members}/${room.capacity}명`, `${room.members}/${room.capacity} members`);
const isFull = (room: DemoRoom) => room.members >= room.capacity;

const clearReplyTimers = () => {
  replyTimers.forEach((timer) => window.clearTimeout(timer));
  replyTimers.clear();
};

const selectRoom = (room: DemoRoom) => {
  if (isFull(room)) {
    roomError.value = t(`‘${room.title}’은 현재 정원이 가득 찼습니다.`, `"${room.title}" is currently full.`);
    return;
  }
  roomError.value = "";
  selectedRoomId.value = room.id;
  joinReady.value = false;
};

const returnToRoomList = () => {
  joinReady.value = false;
  selectedRoomId.value = null;
  roomError.value = "";
};

const prepareJoin = () => {
  if (!selectedRoom.value) return;
  joinReady.value = true;
};

const closeInviteDialogState = async (restoreTriggerFocus: boolean) => {
  const trigger = restoreTriggerFocus ? lastEntryTrigger.value : null;
  emit("dialog-state-change", false);
  pendingRoomId.value = null;
  inviteCode.value = "";
  inviteError.value = "";
  lastEntryTrigger.value = null;
  await nextTick();
  trigger?.focus();
};

const closeInviteDialog = () => closeInviteDialogState(true);

const focusRoomListStart = async () => {
  await nextTick();
  const target = roomListHeading.value;
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
};

const scrollChatToEnd = async () => {
  await nextTick();
  if (chatLog.value) chatLog.value.scrollTop = chatLog.value.scrollHeight;
};

const enterRoom = async (room: DemoRoom) => {
  clearReplyTimers();
  roomError.value = "";

  const currentRoom = rooms.value.find((item) => item.id === room.id);
  if (!currentRoom || isFull(currentRoom)) {
    roomError.value = t("정원이 가득 찬 방에는 입장할 수 없습니다.", "You can't enter a room that is already full.");
    return;
  }

  currentRoom.members += 1;
  selectedRoomId.value = currentRoom.id;
  joinReady.value = false;
  showActivityRecord.value = false;
  activeRoomId.value = currentRoom.id;
  messages.value = [
    ...cloneMessages(currentRoom.id),
    {
      id: ++messageSequence,
      sender: t("안내", "Notice"),
      body: t("용재 님이 스터디룸에 입장했습니다.", "Yongjae joined the study room."),
      time: t("지금", "now"),
      system: true,
    },
  ];
  await closeInviteDialog();
  await scrollChatToEnd();
  chatInput.value?.focus();
};

const requestEntry = async (room: DemoRoom, event?: MouseEvent) => {
  roomError.value = "";
  if (isFull(room)) {
    roomError.value = t(`‘${room.title}’은 현재 정원이 가득 찼습니다.`, `"${room.title}" is currently full.`);
    return;
  }

  if (room.visibility === "private") {
    lastEntryTrigger.value = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    pendingRoomId.value = room.id;
    inviteCode.value = "";
    inviteError.value = "";
    await nextTick();
    inviteInput.value?.focus();
    emit("dialog-state-change", true);
    return;
  }

  void enterRoom(room);
};

const verifyInviteCode = () => {
  const room = pendingRoom.value;
  if (!room) return;

  if (inviteCode.value.trim().toUpperCase() !== room.inviteCode) {
    inviteError.value = t("초대 코드가 일치하지 않습니다. 화면에 표시된 데모 코드를 입력해 주세요.", "The invite code doesn't match. Enter the demo code shown on screen.");
    return;
  }

  void enterRoom(room);
};

const trapInviteFocus = (event: KeyboardEvent) => {
  const dialog = inviteDialog.value;
  if (!dialog) return;
  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("hidden"));
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const completeActivity = async () => {
  if (!activeRoom.value) return;
  clearReplyTimers();
  showActivityRecord.value = true;
  await nextTick();
  const target = activityRecordHeading.value;
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
};

const returnToRoom = () => {
  showActivityRecord.value = false;
};

const currentTime = () =>
  new Intl.DateTimeFormat(isEn ? "en-US" : "ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

const sendMessage = () => {
  const body = chatDraft.value.trim();
  const room = activeRoom.value;
  if (!body || !room) return;

  messages.value.push({
    id: ++messageSequence,
    sender: t("용재", "Yongjae"),
    body,
    time: currentTime(),
    mine: true,
  });
  chatDraft.value = "";
  void scrollChatToEnd();

  const roomId = room.id;
  const timer = window.setTimeout(() => {
    replyTimers.delete(timer);
    if (activeRoomId.value !== roomId) return;
    messages.value.push({
      id: ++messageSequence,
      sender: t("MODAC 봇", "MODAC bot"),
      body: t("메시지를 확인했어요. 이 응답은 화면 흐름을 보여주기 위한 모의 응답입니다.", "Got your message. This is a mock reply that illustrates the screen flow."),
      time: currentTime(),
    });
    void scrollChatToEnd();
  }, 700);
  replyTimers.add(timer);
};

const resetDemo = async () => {
  clearReplyTimers();
  rooms.value = cloneRooms();
  selectedRoomId.value = null;
  joinReady.value = false;
  showActivityRecord.value = false;
  activeRoomId.value = null;
  messages.value = [];
  chatDraft.value = "";
  roomError.value = "";
  await closeInviteDialogState(false);
};

const restartDemo = async () => {
  await resetDemo();
  await focusRoomListStart();
};

onBeforeUnmount(() => {
  clearReplyTimers();
  emit("dialog-state-change", false);
});
</script>

<template>
  <section class="modac-demo" aria-labelledby="modac-demo-title">
    <header class="demo-header">
      <div>
        <div class="demo-eyebrow">
          <span class="live-dot" aria-hidden="true"></span>
          {{ t("샘플 데이터 데모", "Sample-data demo") }}
        </div>
        <h3 id="modac-demo-title">{{ t("스터디 탐색부터 활동 기록까지", "From browsing studies to activity logs") }}</h3>
        <p>{{ t("스터디를 찾고 참여한 뒤 활동하고 기록을 확인하는 서비스 흐름을 다섯 단계로 재현했습니다.", "Five steps re-create the service flow: find a study group, join, participate, and review your log.") }}</p>
      </div>
      <button class="reset-button" type="button" @click="resetDemo">{{ t("처음부터", "Start over") }}</button>
    </header>

    <div class="simulation-notice">
      <strong>{{ t("브라우저에서 실행되는 공개용 시뮬레이션", "A public simulation running in the browser") }}</strong>
      <span>{{ t("외부 서버·DB·WebSocket에 연결하지 않으며, 팀이 구현한 전체 서비스 중 제가 맡은 화면과 상태 처리 중심으로 재구성했습니다.", "No external servers, DBs, or WebSockets — rebuilt around the screens and state handling I owned within the team's full service.") }}</span>
    </div>

    <ol class="flow-steps" :aria-label="t('MODAC 서비스 흐름 단계', 'MODAC service flow steps')">
      <li
        v-for="(step, index) in guideSteps"
        :key="step.title"
        :class="{ active: currentStep === index + 1, complete: currentStep > index + 1 }"
        :aria-current="currentStep === index + 1 ? 'step' : undefined"
      >
        <span>{{ index + 1 }}</span>
        {{ step.shortTitle }}
      </li>
    </ol>

    <section class="guide-summary" aria-live="polite">
      <div class="guide-title">
        <span>STEP {{ currentStep }}</span>
        <strong>{{ currentGuide.title }}</strong>
      </div>
      <div class="responsibility-grid">
        <div><span>{{ t("사용자 행동", "User action") }}</span><strong>{{ currentGuide.userAction }}</strong></div>
        <div><span>{{ t("화면 변화", "Screen change") }}</span><strong>{{ currentGuide.screenChange }}</strong></div>
        <div><span>{{ t("원 프로젝트 담당", "Built in the original") }}</span><strong>{{ currentGuide.ownership }}</strong></div>
        <div><span>{{ t("공개 데모 재현", "Re-created in this demo") }}</span><strong>{{ currentGuide.demo }}</strong></div>
      </div>
    </section>

    <div v-if="currentStep === 1" class="room-stage">
      <div class="stage-heading">
        <div>
          <h4 ref="roomListHeading" tabindex="-1">{{ t("참여할 스터디를 선택하세요", "Pick a study group to join") }}</h4>
          <span>{{ t("비공개방은 초대 코드 확인 후 입장할 수 있습니다.", "Private rooms require an invite code before entering.") }}</span>
        </div>
        <span class="room-count">{{ t(`${rooms.length}개 스터디`, `${rooms.length} study groups`) }}</span>
      </div>

      <p v-if="roomError" class="inline-alert" role="alert">{{ roomError }}</p>

      <div class="room-grid">
        <article
          v-for="room in rooms"
          :key="room.id"
          class="room-card"
          :class="{ full: isFull(room) }"
        >
          <div class="room-card-top">
            <span class="category-chip">{{ room.category }}</span>
            <span class="visibility-chip" :class="room.visibility">
              <span aria-hidden="true">{{ room.visibility === "private" ? "🔒" : "○" }}</span>
              {{ room.visibility === "private" ? t("비공개", "Private") : t("공개", "Public") }}
            </span>
          </div>
          <h4>{{ room.title }}</h4>
          <p>{{ room.description }}</p>
          <div class="room-card-bottom">
            <span :class="{ danger: isFull(room) }">
              {{ isFull(room) ? t("정원 마감", "Full") : memberLabel(room) }}
            </span>
            <button
              type="button"
              :disabled="isFull(room)"
              :aria-label="t(`${room.title} ${isFull(room) ? '정원 마감' : '상세 보기'}`, `${room.title} ${isFull(room) ? 'is full' : 'details'}`)"
              @click="selectRoom(room)"
            >
              {{ isFull(room) ? t("선택 불가", "Unavailable") : t("살펴보기", "Take a look") }}
            </button>
          </div>
        </article>
      </div>
    </div>

    <section v-else-if="currentStep === 2 && selectedRoom" class="decision-stage">
      <div class="room-preview-top">
        <div>
          <span class="category-chip">{{ selectedRoom.category }}</span>
          <h4>{{ selectedRoom.title }}</h4>
          <p>{{ selectedRoom.description }}</p>
        </div>
        <span class="visibility-chip" :class="selectedRoom.visibility">
          {{ selectedRoom.visibility === "private" ? t("비공개", "Private") : t("공개", "Public") }}
        </span>
      </div>
      <dl class="condition-grid">
        <div><dt>{{ t("현재 인원", "Members") }}</dt><dd>{{ memberLabel(selectedRoom) }}</dd></div>
        <div><dt>{{ t("참여 방식", "How to join") }}</dt><dd>{{ selectedRoom.visibility === "private" ? t("초대 코드 확인", "Invite code check") : t("바로 참여", "Join directly") }}</dd></div>
        <div><dt>{{ t("상태", "Status") }}</dt><dd>{{ t("참여 가능", "Open to join") }}</dd></div>
      </dl>
      <div class="stage-actions">
        <button type="button" class="secondary-button" @click="returnToRoomList">{{ t("다른 스터디 보기", "See other studies") }}</button>
        <button type="button" class="primary-button" @click="prepareJoin">{{ t("참여 절차로", "Proceed to join") }}</button>
      </div>
    </section>

    <section v-else-if="currentStep === 3 && selectedRoom" class="decision-stage">
      <div class="join-check">
        <span aria-hidden="true">{{ selectedRoom.visibility === "private" ? "🔒" : "✓" }}</span>
        <div>
          <h4>{{ selectedRoom.visibility === "private" ? t("초대 코드 확인이 필요합니다", "An invite code is required") : t("바로 참여할 수 있습니다", "You can join right away") }}</h4>
          <p v-if="selectedRoom.visibility === 'private'">{{ t("화면에 제공된 데모 코드를 입력하면 검증·오류·입장 흐름을 확인할 수 있습니다.", "Enter the demo code shown on screen to see the validation, error, and entry flow.") }}</p>
          <p v-else>{{ t("공개 스터디는 별도 승인 없이 참여 인원과 활동 화면으로 이어집니다.", "Public studies proceed to the member count and activity screen without approval.") }}</p>
        </div>
      </div>
      <div class="stage-actions">
        <button type="button" class="secondary-button" @click="joinReady = false">{{ t("조건 다시 보기", "Review conditions") }}</button>
        <button type="button" class="primary-button" @click="requestEntry(selectedRoom, $event)">
          {{ selectedRoom.visibility === "private" ? t("초대 코드 입력", "Enter invite code") : t("스터디 참여", "Join study") }}
        </button>
      </div>
    </section>

    <div v-else-if="currentStep === 4 && activeRoom" class="room-view">
      <header class="room-view-header">
        <div>
          <span>{{ activeRoom.category }} · {{ memberLabel(activeRoom) }}</span>
          <h4>{{ activeRoom.title }}</h4>
        </div>
        <span class="room-status">
          <span class="room-status-dot" aria-hidden="true"></span>
          {{ t("참여 중", "Joined") }}
        </span>
      </header>

      <div class="chat-notice">
        <span aria-hidden="true">●</span>
        {{ t("실시간 서버 대신 미리 준비한 샘플 응답으로 동작합니다.", "Runs on prepared sample replies instead of a real-time server.") }}
      </div>

      <div ref="chatLog" class="chat-log" role="log" aria-live="polite" :aria-label="t('스터디 채팅 메시지', 'Study chat messages')">
        <div
          v-for="message in messages"
          :key="message.id"
          class="chat-message"
          :class="{ mine: message.mine, system: message.system }"
        >
          <template v-if="message.system">
            <span>{{ message.body }}</span>
          </template>
          <template v-else>
            <div class="message-meta">
              <strong>{{ message.sender }}</strong>
              <time>{{ message.time }}</time>
            </div>
            <p>{{ message.body }}</p>
          </template>
        </div>
      </div>

      <form class="chat-form" @submit.prevent="sendMessage">
        <label class="sr-only" for="modac-chat-message">{{ t("채팅 메시지", "Chat message") }}</label>
        <input
          id="modac-chat-message"
          ref="chatInput"
          v-model="chatDraft"
          type="text"
          maxlength="120"
          autocomplete="off"
          :placeholder="t('메시지를 입력해 보세요', 'Type a message')"
        />
        <button type="submit" :disabled="!chatDraft.trim()">{{ t("보내기", "Send") }}</button>
      </form>

      <div class="room-completion-action">
        <div>
          <span>{{ t("다음 단계", "Next step") }}</span>
          <strong>{{ t("이제 활동 기록을 확인해 보세요", "Now check your activity log") }}</strong>
          <p>{{ t("이번 참여와 화면에 표시된 메시지를 한눈에 정리합니다.", "Your participation and on-screen messages, summarized at a glance.") }}</p>
        </div>
        <button type="button" class="primary-button" @click="completeActivity">
          {{ t("활동 기록 확인하기", "View activity log") }}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>

    <section v-else-if="currentStep === 5 && activeRoom" class="record-stage">
      <div class="record-heading">
        <span class="record-check" aria-hidden="true">✓</span>
        <div>
          <span>{{ t("이번 데모 활동", "This demo session") }}</span>
          <h4 ref="activityRecordHeading" tabindex="-1">{{ activeRoom.title }}</h4>
          <p>{{ t("참여부터 메시지 작성까지의 화면 상태를 브라우저 메모리에서 요약했습니다.", "Screen state from joining through messaging, summarized from browser memory.") }}</p>
        </div>
      </div>
      <dl class="record-grid">
        <div><dt>{{ t("참여 상태", "Membership") }}</dt><dd>{{ t("참여 중", "Joined") }}</dd></div>
        <div><dt>{{ t("표시된 메시지", "Messages shown") }}</dt><dd>{{ t(`${messages.length}건`, `${messages.length}`) }}</dd></div>
        <div><dt>{{ t("저장 위치", "Stored in") }}</dt><dd>{{ t("브라우저 메모리", "Browser memory") }}</dd></div>
      </dl>
      <p class="record-note">{{ t("실제 서비스에서는 스터디 활동과 통계·기록 화면으로 이어집니다. 이 데모는 서버 저장 없이 UI 흐름만 재현합니다.", "The real service continues into study activity, statistics, and log screens. This demo re-creates only the UI flow, with nothing saved server-side.") }}</p>
      <div class="stage-actions">
        <button type="button" class="secondary-button" @click="returnToRoom">{{ t("스터디룸으로", "Back to the room") }}</button>
        <button type="button" class="primary-button" @click="restartDemo">{{ t("다른 흐름 다시 체험", "Try another flow") }}</button>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="pendingRoom" class="dialog-backdrop" @click.self="closeInviteDialog">
        <form
          ref="inviteDialog"
          class="invite-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="invite-dialog-title"
          @keydown.esc.stop.prevent="closeInviteDialog"
          @keydown.tab="trapInviteFocus"
          @submit.prevent="verifyInviteCode"
        >
          <button
            class="dialog-close"
            type="button"
            :aria-label="t('초대 코드 입력 닫기', 'Close invite code dialog')"
            @click="closeInviteDialog"
          >
            ×
          </button>
          <span class="dialog-icon" aria-hidden="true">🔒</span>
          <h4 id="invite-dialog-title">{{ t("비공개 스터디 입장", "Enter a private study") }}</h4>
          <p>{{ t(`‘${pendingRoom.title}’에 참여하려면 초대 코드를 입력해 주세요.`, `Enter the invite code to join "${pendingRoom.title}".`) }}</p>

          <div class="demo-code">
            <span>{{ t("데모 초대 코드", "Demo invite code") }}</span>
            <strong>{{ DEMO_INVITE_CODE }}</strong>
          </div>

          <label for="modac-invite-code">{{ t("초대 코드", "Invite code") }}</label>
          <input
            id="modac-invite-code"
            ref="inviteInput"
            v-model="inviteCode"
            type="text"
            autocomplete="off"
            placeholder="MODAC"
            :aria-invalid="Boolean(inviteError)"
            :aria-describedby="inviteError ? 'invite-code-error' : undefined"
          />
          <p v-if="inviteError" id="invite-code-error" class="field-error" role="alert">
            {{ inviteError }}
          </p>
          <button class="confirm-button" type="submit">{{ t("코드 확인 후 입장", "Verify code and enter") }}</button>
        </form>
      </div>
    </Teleport>

    <footer class="demo-footer">
      <span>{{ t("샘플 데이터는 브라우저 메모리에서만 사용됩니다.", "Sample data lives only in browser memory.") }}</span>
      <span>{{ t("WebSocket · OAuth · 외부 저장소 미연결", "No WebSocket · OAuth · external storage") }}</span>
    </footer>
  </section>
</template>

<style scoped>
.modac-demo {
  position: relative;
  overflow: hidden;
  color: var(--text-primary, var(--fresh-ink));
  border: 1px solid var(--border, var(--fresh-border));
  border-radius: 24px;
  background:
    radial-gradient(circle at 100% 0%, rgb(var(--accent-rgb, 49 130 246) / 0.12), transparent 34%),
    var(--surface-strong, var(--fresh-surface-solid));
  box-shadow: var(--fresh-shadow-sm);
}

.demo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 24px 24px 18px;
}

.demo-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
  color: var(--accent-strong, var(--fresh-blue-strong));
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--fresh-green);
  box-shadow: 0 0 0 4px rgb(36 192 111 / 0.13);
}

.demo-header h3 {
  margin: 0;
  font-size: clamp(20px, 3vw, 26px);
  line-height: 1.25;
}

.demo-header p {
  margin: 8px 0 0;
  color: var(--text-secondary, var(--fresh-ink-soft));
  font-size: 14px;
  line-height: 1.65;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

button:focus-visible,
input:focus-visible {
  outline: 3px solid rgb(var(--accent-rgb, 49 130 246) / 0.24);
  outline-offset: 2px;
}

button:disabled {
  cursor: not-allowed;
}

.reset-button {
  flex: 0 0 auto;
  border: 1px solid var(--border-strong, var(--fresh-border));
  border-radius: 999px;
  background: var(--surface, #fff);
  color: var(--text-secondary, var(--fresh-ink-soft));
  padding: 8px 13px;
  font-size: 12px;
  font-weight: 750;
}

.reset-button:hover {
  border-color: var(--accent, var(--fresh-blue));
  color: var(--accent-strong, var(--fresh-blue-strong));
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding: 0 24px 20px;
  list-style: none;
}

.flow-steps li {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  border-radius: 10px;
  background: var(--surface-soft, var(--fresh-bg-soft));
  color: var(--text-muted, var(--fresh-muted));
  font-size: 12px;
  font-weight: 750;
}

.flow-steps li span {
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border-radius: 50%;
  background: var(--surface, #fff);
  font-size: 10px;
}

.flow-steps li.active {
  background: var(--accent-soft, var(--fresh-blue-soft));
  color: var(--accent-strong, var(--fresh-blue-strong));
}

.flow-steps li.complete {
  color: var(--fresh-green);
}

.simulation-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0 24px 16px;
  padding: 12px 14px;
  border: 1px solid rgb(var(--accent-rgb, 49 130 246) / 0.14);
  border-radius: 12px;
  background: rgb(var(--accent-rgb, 49 130 246) / 0.055);
}

.simulation-notice strong {
  flex: 0 0 auto;
  color: var(--accent-strong, var(--fresh-blue-strong));
  font-size: 11px;
}

.simulation-notice span {
  color: var(--text-secondary, var(--fresh-ink-soft));
  font-size: 11px;
  line-height: 1.55;
}

.guide-summary {
  margin: 0 12px 12px;
  padding: 16px 18px;
  border: 1px solid var(--border, var(--fresh-border));
  border-radius: 16px;
  background: rgb(255 255 255 / 0.68);
}

.guide-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.guide-title > span {
  color: var(--accent-strong, var(--fresh-blue-strong));
  font-size: 10px;
  font-weight: 850;
}

.guide-title > strong {
  font-size: 14px;
}

.responsibility-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.responsibility-grid > div {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--surface-soft, var(--fresh-bg-soft));
}

.responsibility-grid span,
.responsibility-grid strong {
  display: block;
}

.responsibility-grid span {
  color: var(--text-muted, var(--fresh-muted));
  font-size: 11px;
  font-weight: 750;
}

.responsibility-grid strong {
  margin-top: 4px;
  color: var(--text-secondary, var(--fresh-ink-soft));
  font-size: 12px;
  line-height: 1.5;
}

.room-stage,
.room-view,
.decision-stage,
.record-stage {
  margin: 0 12px 12px;
  border: 1px solid var(--border, var(--fresh-border));
  border-radius: 18px;
  background: rgb(255 255 255 / 0.72);
}

.room-stage {
  padding: 18px;
}

.decision-stage,
.record-stage {
  padding: 20px;
}

.room-preview-top,
.join-check,
.record-heading,
.stage-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.room-preview-top h4,
.join-check h4,
.record-heading h4 {
  margin: 7px 0 5px;
  font-size: 18px;
}

.room-preview-top p,
.join-check p,
.record-heading p,
.record-note {
  margin: 0;
  color: var(--text-secondary, var(--fresh-ink-soft));
  font-size: 12px;
  line-height: 1.65;
}

.condition-grid,
.record-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0;
}

.condition-grid > div,
.record-grid > div {
  padding: 13px;
  border-radius: 12px;
  background: var(--surface-soft, var(--fresh-bg-soft));
}

.condition-grid dt,
.record-grid dt {
  color: var(--text-muted, var(--fresh-muted));
  font-size: 10px;
  font-weight: 750;
}

.condition-grid dd,
.record-grid dd {
  margin: 5px 0 0;
  font-size: 12px;
  font-weight: 850;
}

.join-check {
  justify-content: flex-start;
  padding: 16px;
  border-radius: 14px;
  background: var(--surface-soft, var(--fresh-bg-soft));
}

.join-check > span,
.record-check {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 12px;
  background: var(--accent-soft, var(--fresh-blue-soft));
  color: var(--accent-strong, var(--fresh-blue-strong));
  font-weight: 900;
}

.stage-actions {
  justify-content: flex-end;
  margin-top: 18px;
}

.primary-button,
.secondary-button {
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 850;
}

.primary-button {
  border: 0;
  background: var(--accent-gradient, var(--fresh-gradient-blue));
  color: var(--accent-contrast, #fff);
}

.secondary-button {
  border: 1px solid var(--border-strong, var(--fresh-border));
  background: var(--surface, #fff);
  color: var(--text-secondary, var(--fresh-ink-soft));
}

.record-heading {
  justify-content: flex-start;
}

.record-heading > div > span {
  color: var(--fresh-green);
  font-size: 10px;
  font-weight: 850;
}

.record-heading h4 {
  scroll-margin-top: 5.5rem;
  outline: none;
}

.record-note {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgb(var(--accent-rgb, 49 130 246) / 0.055);
}

.stage-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.stage-heading h4,
.stage-heading span {
  display: block;
}

.stage-heading h4 {
  margin: 0;
  scroll-margin-top: 5.5rem;
  font-size: 15px;
  outline: none;
}

.stage-heading div > span {
  margin-top: 4px;
  color: var(--text-muted, var(--fresh-muted));
  font-size: 12px;
}

.stage-heading .room-count {
  color: var(--accent-strong, var(--fresh-blue-strong));
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.inline-alert,
.field-error {
  color: #d13c3c;
  font-size: 12px;
  line-height: 1.5;
}

.inline-alert {
  margin: 0 0 12px;
  padding: 9px 11px;
  border-radius: 9px;
  background: rgb(239 68 68 / 0.08);
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.room-card {
  display: flex;
  min-width: 0;
  min-height: 188px;
  flex-direction: column;
  padding: 15px;
  border: 1px solid var(--border, var(--fresh-border));
  border-radius: 15px;
  background: var(--surface-strong, #fff);
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.room-card:hover:not(.full) {
  transform: translateY(-2px);
  border-color: rgb(var(--accent-rgb, 49 130 246) / 0.25);
  box-shadow: var(--fresh-shadow-sm);
}

.room-card.full {
  opacity: 0.68;
}

.room-card-top,
.room-card-bottom,
.room-view-header,
.message-meta,
.demo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.category-chip,
.visibility-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
}

.category-chip {
  color: var(--accent-strong, var(--fresh-blue-strong));
}

.visibility-chip {
  padding: 4px 7px;
  background: var(--surface-soft, var(--fresh-bg-soft));
  color: var(--text-muted, var(--fresh-muted));
}

.visibility-chip.private {
  background: var(--violet-soft, rgb(124 92 255 / 0.1));
  color: var(--fresh-purple);
}

.room-card h4 {
  margin: 18px 0 7px;
  font-size: 16px;
  line-height: 1.35;
}

.room-card > p {
  margin: 0;
  color: var(--text-secondary, var(--fresh-ink-soft));
  font-size: 12px;
  line-height: 1.6;
}

.room-card-bottom {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--border, var(--fresh-border));
}

.room-card-bottom > span {
  color: var(--text-muted, var(--fresh-muted));
  font-size: 11px;
  font-weight: 750;
}

.room-card-bottom > span.danger {
  color: #d13c3c;
}

.room-card-bottom button,
.chat-form button,
.confirm-button {
  border: 0;
  border-radius: 10px;
  background: var(--accent-gradient, var(--fresh-gradient-blue));
  color: var(--accent-contrast, #fff);
  font-size: 11px;
  font-weight: 850;
}

.room-card-bottom button {
  padding: 8px 10px;
}

.room-card-bottom button:disabled,
.chat-form button:disabled {
  background: var(--surface-soft, #eef2f6);
  color: var(--text-muted, var(--fresh-muted));
}

.room-view {
  overflow: hidden;
}

.room-view-header {
  padding: 16px 18px;
  border-bottom: 1px solid var(--border, var(--fresh-border));
}

.room-view-header span {
  color: var(--accent-strong, var(--fresh-blue-strong));
  font-size: 11px;
  font-weight: 750;
}

.room-view-header h4 {
  margin: 3px 0 0;
  font-size: 17px;
}

.room-view-header .room-status {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgb(36 192 111 / 0.1);
  color: var(--fresh-green);
  white-space: nowrap;
}

.room-view-header .room-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentcolor;
}

.chat-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px 12px;
  background: var(--surface-soft, var(--fresh-bg-soft));
  color: var(--text-muted, var(--fresh-muted));
  font-size: 11px;
}

.chat-notice span {
  color: var(--fresh-green);
  font-size: 8px;
}

.chat-log {
  display: flex;
  min-height: 240px;
  max-height: 300px;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 18px;
  background:
    linear-gradient(rgb(255 255 255 / 0.7), rgb(255 255 255 / 0.7)),
    var(--surface-soft, #f7f9fc);
}

.chat-message {
  align-self: flex-start;
  max-width: min(78%, 430px);
}

.chat-message.mine {
  align-self: flex-end;
}

.chat-message.system {
  align-self: center;
  max-width: 100%;
  color: var(--text-muted, var(--fresh-muted));
  font-size: 10px;
}

.message-meta {
  justify-content: flex-start;
  margin: 0 4px 4px;
  color: var(--text-muted, var(--fresh-muted));
  font-size: 10px;
}

.message-meta strong {
  color: var(--text-secondary, var(--fresh-ink-soft));
}

.chat-message.mine .message-meta {
  justify-content: flex-end;
}

.chat-message p {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--border, var(--fresh-border));
  border-radius: 4px 14px 14px;
  background: var(--surface-strong, #fff);
  font-size: 12px;
  line-height: 1.55;
}

.chat-message.mine p {
  border: 0;
  border-radius: 14px 4px 14px 14px;
  background: var(--accent, var(--fresh-blue));
  color: var(--accent-contrast, #fff);
}

.chat-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--border, var(--fresh-border));
}

.chat-form input,
.invite-dialog input {
  min-width: 0;
  border: 1px solid var(--border-strong, var(--fresh-border));
  background: var(--surface-strong, #fff);
  color: var(--text-primary, var(--fresh-ink));
}

.chat-form input {
  min-height: 42px;
  padding: 0 13px;
  border-radius: 11px;
  font-size: 13px;
}

.chat-form button {
  min-width: 70px;
  padding: 0 16px;
}

.room-completion-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
  border-top: 1px solid var(--border, var(--fresh-border));
  background:
    linear-gradient(110deg, rgb(var(--accent-rgb, 49 130 246) / 0.08), transparent 68%),
    var(--surface-strong, #fff);
}

.room-completion-action > div > span,
.room-completion-action > div > strong,
.room-completion-action > div > p {
  display: block;
}

.room-completion-action > div > span {
  color: var(--accent-strong, var(--fresh-blue-strong));
  font-size: 10px;
  font-weight: 850;
}

.room-completion-action > div > strong {
  margin-top: 3px;
  font-size: 14px;
}

.room-completion-action > div > p {
  margin: 4px 0 0;
  color: var(--text-secondary, var(--fresh-ink-soft));
  font-size: 11px;
  line-height: 1.55;
}

.room-completion-action > button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 42px;
}

.dialog-backdrop {
  position: fixed;
  z-index: 80;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow-y: auto;
  background: rgb(18 23 34 / 0.4);
  backdrop-filter: blur(4px);
}

.invite-dialog {
  position: relative;
  width: min(100%, 360px);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 24px;
  border-radius: 20px;
  background: var(--surface-strong, #fff);
  box-shadow: var(--fresh-shadow-lg);
}

.dialog-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--surface-soft, #f3f6fa);
  color: var(--text-muted, var(--fresh-muted));
  font-size: 20px;
}

.dialog-icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 13px;
  background: var(--violet-soft, rgb(124 92 255 / 0.1));
}

.invite-dialog h4 {
  margin: 14px 0 6px;
  font-size: 19px;
}

.invite-dialog > p {
  margin: 0;
  color: var(--text-secondary, var(--fresh-ink-soft));
  font-size: 12px;
  line-height: 1.6;
}

.demo-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  padding: 11px 13px;
  border: 1px dashed rgb(var(--accent-rgb, 49 130 246) / 0.35);
  border-radius: 11px;
  background: var(--accent-soft, var(--fresh-blue-soft));
}

.demo-code span {
  color: var(--text-secondary, var(--fresh-ink-soft));
  font-size: 11px;
}

.demo-code strong {
  color: var(--accent-strong, var(--fresh-blue-strong));
  font-family: var(--font-mono, monospace);
  letter-spacing: 0.12em;
}

.invite-dialog label {
  display: block;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 800;
}

.invite-dialog input {
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  padding: 0 12px;
  border-radius: 11px;
  text-transform: uppercase;
}

.field-error {
  margin: 6px 0 0 !important;
}

.confirm-button {
  width: 100%;
  min-height: 44px;
  margin-top: 14px;
}

.demo-footer {
  flex-wrap: wrap;
  padding: 4px 18px 16px;
  color: var(--text-muted, var(--fresh-muted));
  font-size: 10px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 760px) {
  .responsibility-grid {
    grid-template-columns: 1fr;
  }

  .condition-grid,
  .record-grid {
    grid-template-columns: 1fr;
  }

  .room-grid {
    grid-template-columns: 1fr;
  }

  .room-card {
    min-height: 160px;
  }
}

@media (max-width: 520px) {
  .demo-header {
    padding: 20px 16px 16px;
  }

  .flow-steps {
    gap: 5px;
    padding: 0 16px 16px;
  }

  .flow-steps li {
    flex-direction: column;
    gap: 4px;
    font-size: 10px;
  }

  .flow-steps li span {
    width: 16px;
    height: 16px;
  }

  .simulation-notice {
    display: grid;
    margin-inline: 16px;
  }

  .guide-summary,
  .room-stage,
  .decision-stage,
  .record-stage {
    padding: 14px;
  }

  .stage-actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .stage-actions button {
    width: 100%;
  }

  .stage-heading {
    display: block;
  }

  .stage-heading .room-count {
    margin-top: 8px;
  }

  .chat-log {
    min-height: 280px;
    padding: 14px;
  }

  .chat-message {
    max-width: 88%;
  }

  .room-completion-action {
    align-items: stretch;
    flex-direction: column;
    padding: 16px;
  }

  .room-completion-action > button {
    width: 100%;
  }

  .demo-footer {
    display: grid;
    justify-content: start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .room-card {
    transition: none;
  }
}
</style>
