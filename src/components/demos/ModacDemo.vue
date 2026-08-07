<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";

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
    title: "퇴근 후 알고리즘",
    description: "매주 세 문제를 풀고 풀이 과정을 나눠요.",
    category: "알고리즘",
    members: 3,
    capacity: 5,
    visibility: "public",
  },
  {
    id: 2,
    title: "프론트엔드 면접 준비",
    description: "정해진 질문을 준비하고 서로 피드백해요.",
    category: "취업 준비",
    members: 2,
    capacity: 4,
    visibility: "private",
    inviteCode: DEMO_INVITE_CODE,
  },
  {
    id: 3,
    title: "SQL 한 문제씩",
    description: "짧게라도 매일 꾸준히 문제를 풉니다.",
    category: "데이터베이스",
    members: 4,
    capacity: 4,
    visibility: "public",
  },
];

const seededMessages: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, sender: "민지", body: "오늘 문제 링크 올려두었어요!", time: "20:04" },
    { id: 2, sender: "준호", body: "저는 9시부터 같이 풀게요.", time: "20:06" },
  ],
  2: [
    { id: 3, sender: "서연", body: "오늘은 브라우저 렌더링 질문부터 볼까요?", time: "19:42" },
    { id: 4, sender: "지훈", body: "좋아요. 정리한 내용도 공유할게요.", time: "19:44" },
  ],
  3: [],
};

const cloneRooms = () => initialRooms.map((room) => ({ ...room }));
const cloneMessages = (roomId: number) =>
  (seededMessages[roomId] ?? []).map((message) => ({ ...message }));

const rooms = ref<DemoRoom[]>(cloneRooms());
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
const replyTimers = new Set<number>();
let messageSequence = 10;

const activeRoom = computed(() =>
  rooms.value.find((room) => room.id === activeRoomId.value),
);

const pendingRoom = computed(() =>
  rooms.value.find((room) => room.id === pendingRoomId.value),
);

const currentStep = computed(() => (activeRoom.value ? 3 : pendingRoom.value ? 2 : 1));

const memberLabel = (room: DemoRoom) => `${room.members}/${room.capacity}명`;
const isFull = (room: DemoRoom) => room.members >= room.capacity;

const clearReplyTimers = () => {
  replyTimers.forEach((timer) => window.clearTimeout(timer));
  replyTimers.clear();
};

const closeInviteDialog = async () => {
  emit("dialog-state-change", false);
  pendingRoomId.value = null;
  inviteCode.value = "";
  inviteError.value = "";
  await nextTick();
  lastEntryTrigger.value?.focus();
  lastEntryTrigger.value = null;
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
    roomError.value = "정원이 가득 찬 방에는 입장할 수 없습니다.";
    return;
  }

  currentRoom.members += 1;
  activeRoomId.value = currentRoom.id;
  messages.value = [
    ...cloneMessages(currentRoom.id),
    {
      id: ++messageSequence,
      sender: "안내",
      body: "용재 님이 스터디룸에 입장했습니다.",
      time: "지금",
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
    roomError.value = `‘${room.title}’은 현재 정원이 가득 찼습니다.`;
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
    inviteError.value = "초대 코드가 일치하지 않습니다. 화면에 표시된 데모 코드를 입력해 주세요.";
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

const leaveRoom = () => {
  clearReplyTimers();
  const room = activeRoom.value;
  if (room) room.members = Math.max(0, room.members - 1);
  activeRoomId.value = null;
  messages.value = [];
  chatDraft.value = "";
  roomError.value = "";
};

const currentTime = () =>
  new Intl.DateTimeFormat("ko-KR", {
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
    sender: "용재",
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
      sender: "MODAC 봇",
      body: "메시지를 확인했어요. 이 응답은 화면 흐름을 보여주기 위한 모의 응답입니다.",
      time: currentTime(),
    });
    void scrollChatToEnd();
  }, 700);
  replyTimers.add(timer);
};

const resetDemo = () => {
  clearReplyTimers();
  rooms.value = cloneRooms();
  activeRoomId.value = null;
  messages.value = [];
  chatDraft.value = "";
  roomError.value = "";
  closeInviteDialog();
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
          샘플 데이터 데모
        </div>
        <h3 id="modac-demo-title">스터디룸 입장과 채팅 흐름</h3>
        <p>공개방 입장, 비공개방 초대 코드 확인, 참여 인원과 채팅 상태 변화를 샘플 데이터로 재현했습니다.</p>
      </div>
      <button class="reset-button" type="button" @click="resetDemo">처음부터</button>
    </header>

    <ol class="flow-steps" aria-label="데모 진행 단계">
      <li :class="{ active: currentStep >= 1 }"><span>1</span> 방 선택</li>
      <li :class="{ active: currentStep >= 2 }"><span>2</span> 입장 검증</li>
      <li :class="{ active: currentStep >= 3 }"><span>3</span> 채팅 참여</li>
    </ol>

    <div v-if="!activeRoom" class="room-stage">
      <div class="stage-heading">
        <div>
          <strong>참여할 스터디를 선택하세요</strong>
          <span>비공개방은 초대 코드 확인 후 입장할 수 있습니다.</span>
        </div>
        <span class="room-count">{{ rooms.length }}개 스터디</span>
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
              {{ room.visibility === "private" ? "비공개" : "공개" }}
            </span>
          </div>
          <h4>{{ room.title }}</h4>
          <p>{{ room.description }}</p>
          <div class="room-card-bottom">
            <span :class="{ danger: isFull(room) }">
              {{ isFull(room) ? "정원 마감" : memberLabel(room) }}
            </span>
            <button
              type="button"
              :disabled="isFull(room)"
              :aria-label="`${room.title} ${isFull(room) ? '정원 마감' : '입장하기'}`"
              @click="requestEntry(room, $event)"
            >
              {{ isFull(room) ? "입장 불가" : "입장하기" }}
            </button>
          </div>
        </article>
      </div>
    </div>

    <div v-else class="room-view">
      <header class="room-view-header">
        <div>
          <span>{{ activeRoom.category }} · {{ memberLabel(activeRoom) }}</span>
          <h4>{{ activeRoom.title }}</h4>
        </div>
        <button type="button" class="leave-button" @click="leaveRoom">방 나가기</button>
      </header>

      <div class="chat-notice">
        <span aria-hidden="true">●</span>
        실시간 서버 대신 미리 준비한 샘플 응답으로 동작합니다.
      </div>

      <div ref="chatLog" class="chat-log" role="log" aria-live="polite" aria-label="스터디 채팅 메시지">
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
        <label class="sr-only" for="modac-chat-message">채팅 메시지</label>
        <input
          id="modac-chat-message"
          ref="chatInput"
          v-model="chatDraft"
          type="text"
          maxlength="120"
          autocomplete="off"
          placeholder="메시지를 입력해 보세요"
        />
        <button type="submit" :disabled="!chatDraft.trim()">보내기</button>
      </form>
    </div>

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
            aria-label="초대 코드 입력 닫기"
            @click="closeInviteDialog"
          >
            ×
          </button>
          <span class="dialog-icon" aria-hidden="true">🔒</span>
          <h4 id="invite-dialog-title">비공개 스터디 입장</h4>
          <p>‘{{ pendingRoom.title }}’에 참여하려면 초대 코드를 입력해 주세요.</p>

          <div class="demo-code">
            <span>데모 초대 코드</span>
            <strong>{{ DEMO_INVITE_CODE }}</strong>
          </div>

          <label for="modac-invite-code">초대 코드</label>
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
          <button class="confirm-button" type="submit">코드 확인 후 입장</button>
        </form>
      </div>
    </Teleport>

    <footer class="demo-footer">
      <span>샘플 데이터는 브라우저 메모리에서만 사용됩니다.</span>
      <span>WebSocket · OAuth · 외부 저장소 미연결</span>
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

.reset-button,
.leave-button {
  flex: 0 0 auto;
  border: 1px solid var(--border-strong, var(--fresh-border));
  border-radius: 999px;
  background: var(--surface, #fff);
  color: var(--text-secondary, var(--fresh-ink-soft));
  padding: 8px 13px;
  font-size: 12px;
  font-weight: 750;
}

.reset-button:hover,
.leave-button:hover {
  border-color: var(--accent, var(--fresh-blue));
  color: var(--accent-strong, var(--fresh-blue-strong));
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

.room-stage,
.room-view {
  margin: 0 12px 12px;
  border: 1px solid var(--border, var(--fresh-border));
  border-radius: 18px;
  background: rgb(255 255 255 / 0.72);
}

.room-stage {
  padding: 18px;
}

.stage-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.stage-heading strong,
.stage-heading span {
  display: block;
}

.stage-heading strong {
  font-size: 15px;
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
    gap: 4px;
    font-size: 10px;
  }

  .flow-steps li span {
    width: 16px;
    height: 16px;
  }

  .room-stage {
    padding: 14px;
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
