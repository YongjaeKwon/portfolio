<template>
  <section class="ticketrush-demo" aria-labelledby="ticketrush-demo-title">
    <header class="demo-header">
      <div>
        <div class="badge-row">
          <span class="sample-badge">{{ t("샘플 데이터 데모", "Sample-data demo") }}</span>
          <span class="round-badge">{{ t("4단계 예매 흐름", "4-step booking flow") }}</span>
        </div>
        <h3 id="ticketrush-demo-title">{{ t("이중 예매 0건을 지키는 예매 흐름", "A booking flow that keeps double bookings at zero") }}</h3>
        <p>{{ t("대기열 입장부터 좌석 홀드, 100명 동시 요청 경쟁과 결제 확정까지 실제 설계를 브라우저에서 재현합니다.", "From queue admission to seat holds, a 100-request race, and payment confirmation — the real design, re-created in the browser.") }}</p>
      </div>
      <div class="demo-notice" role="note">
        <span aria-hidden="true">i</span>
        <div>
          <strong>{{ t("서버·Redis·DB 없이 동작하는 브라우저 시뮬레이션", "A browser simulation with no server, Redis, or DB") }}</strong>
          <small>{{ t("실제 저장소의 3겹 방어 설계와 통합 테스트 시나리오를 샘플 데이터로 재현합니다. 외부 요청은 발생하지 않습니다.", "The repository's three-layer defense and its integration-test scenarios are re-created with sample data. No external requests are made.") }}</small>
        </div>
      </div>
    </header>

    <nav class="step-navigation" :aria-label="t('티켓러시 예매 흐름 단계', 'ticket-rush booking flow steps')">
      <ol>
        <li v-for="(step, index) in steps" :key="step.id" :class="stepState(index)">
          <button
            type="button"
            :disabled="index > highestVisitedStep"
            :aria-current="currentStep === index ? 'step' : undefined"
            @click="goToStep(index)"
          >
            <b>{{ index + 1 }}</b>
            <span>{{ step.short }}</span>
          </button>
        </li>
      </ol>
    </nav>

    <section class="step-panel">
      <div class="step-heading">
        <h4>{{ steps[currentStep].title }}</h4>
        <p>{{ steps[currentStep].caption }}</p>
      </div>

      <!-- 1단계: 대기열 -->
      <div v-if="currentStep === 0" class="queue-stage">
        <div class="queue-card" role="status">
          <template v-if="queuePosition > 0">
            <span class="queue-label">{{ t("내 앞의 대기 인원", "People ahead of me") }}</span>
            <strong class="queue-number">{{ queuePosition.toLocaleString() }}</strong>
            <div class="queue-bar" aria-hidden="true">
              <div class="queue-bar-fill" :style="{ width: `${queueProgress}%` }"></div>
            </div>
            <small>{{ t("ZSET 순번 기준으로 N명씩 입장시킵니다.", "Admitted N at a time by ZSET rank.") }}</small>
          </template>
          <template v-else>
            <span class="queue-label">{{ t("입장 완료", "Admitted") }}</span>
            <strong class="queue-token">{{ t("입장권 발급됨", "Entry token issued") }}</strong>
            <code class="token-chip">entry.{{ tokenSuffix }}</code>
            <small>{{ t("이후 좌석 요청은 이 입장권(JWT)이 있어야 통과합니다.", "Seat requests from here require this entry token (JWT).") }}</small>
          </template>
        </div>
        <button v-if="queuePosition > 0 && !queueRunning" type="button" class="primary-button" @click="startQueue">
          {{ t("대기열 입장 시작", "Join the queue") }}
        </button>
        <button v-if="queuePosition === 0" type="button" class="primary-button" @click="advanceTo(1)">
          {{ t("좌석 선택으로 이동", "Go to seat selection") }}
        </button>
        <p class="scope-note">{{ t("실제 구현: Redis ZSET 대기열, N명 배치 입장, JWT 입장권 · 데모: 대기 인원 감소 애니메이션", "Actually built: Redis ZSET queue, batch admission, JWT tokens · Demo: the countdown animation") }}</p>
      </div>

      <!-- 2단계: 좌석 홀드 -->
      <div v-else-if="currentStep === 1" class="seat-stage">
        <div class="seat-map" role="group" :aria-label="t('좌석 배치도', 'Seat map')">
          <button
            v-for="seat in seats"
            :key="seat.id"
            type="button"
            class="seat"
            :class="seat.state"
            :disabled="seat.state !== 'free' && seat.state !== 'mine'"
            :aria-label="seatAriaLabel(seat)"
            @click="holdSeat(seat)"
          >
            {{ seat.id }}
          </button>
        </div>
        <div class="seat-legend">
          <span><i class="dot free"></i>{{ t("선택 가능", "Available") }}</span>
          <span><i class="dot mine"></i>{{ t("내 홀드", "My hold") }}</span>
          <span><i class="dot held"></i>{{ t("다른 사람 홀드", "Held by others") }}</span>
          <span><i class="dot sold"></i>{{ t("확정", "Confirmed") }}</span>
        </div>
        <div v-if="mySeatId" class="hold-status" role="status">
          <strong>{{ t(`좌석 ${mySeatId} 홀드 성공`, `Seat ${mySeatId} held`) }}</strong>
          <span>{{ t("남은 시간", "Time left") }} <b>{{ holdClock }}</b> · {{ t("만료되면 결제가 거부됩니다.", "Payment is rejected after expiry.") }}</span>
          <button type="button" class="primary-button" @click="advanceTo(2)">
            {{ t("동시 요청 경쟁 보기", "Watch the contention race") }}
          </button>
        </div>
        <p class="scope-note">{{ t("실제 구현: Redis SET NX EX 5분 홀드 · 데모: 홀드 타이머와 좌석 상태 표시", "Actually built: Redis SET NX EX 5-minute holds · Demo: the timer and seat-state display") }}</p>
      </div>

      <!-- 3단계: 동시성 경쟁 -->
      <div v-else-if="currentStep === 2" class="race-stage">
        <div class="race-controls">
          <label class="outage-toggle">
            <input v-model="redisOutage" type="checkbox" :disabled="raceRunning" />
            <span>{{ t("Redis 장애 상황 재현", "Reproduce a Redis outage") }}</span>
          </label>
          <button type="button" class="primary-button" :disabled="raceRunning" @click="startRace">
            {{ raceDone ? t("다시 실행", "Run again") : t(`같은 좌석에 ${RACE_SIZE}명 동시 요청`, `${RACE_SIZE} concurrent requests, one seat`) }}
          </button>
        </div>

        <div class="race-progress" role="status">
          <span>{{ t("처리한 요청", "Requests processed") }}</span>
          <strong>{{ processedCount }} / {{ RACE_SIZE }}</strong>
          <div class="queue-bar" aria-hidden="true">
            <div class="queue-bar-fill" :style="{ width: `${(processedCount / RACE_SIZE) * 100}%` }"></div>
          </div>
        </div>

        <ol class="defense-layers">
          <li v-for="layer in defenseLayers" :key="layer.id" :class="{ breached: layer.breached, active: raceDone && !layer.breached }">
            <div class="layer-head">
              <b>{{ layer.name }}</b>
              <span v-if="layer.breached" class="layer-tag down">{{ t("장애로 무력화", "Down in outage") }}</span>
              <span v-else-if="raceDone" class="layer-tag ok">{{ t(`${layer.blocked}건 차단`, `${layer.blocked} blocked`) }}</span>
            </div>
            <small>{{ layer.description }}</small>
          </li>
        </ol>

        <div v-if="raceDone" class="race-result" role="status">
          <div class="result-chip success">{{ t("확정 성공", "Confirmed") }} <b>1</b></div>
          <div class="result-chip rejected">{{ redisOutage ? t("DB 유니크 제약 거부", "Rejected by DB unique") : "SEAT_ALREADY_HELD" }} <b>{{ redisOutage ? 1 : RACE_SIZE - 1 }}</b></div>
          <div v-if="redisOutage" class="result-chip rejected">{{ t("홀드 실패", "Hold failed") }} <b>{{ RACE_SIZE - 2 }}</b></div>
          <p>
            {{
              redisOutage
                ? t("Redis가 죽어 홀드가 2건 통과했지만, DB의 (회차·좌석) 유니크 제약이 두 번째 확정을 물리적으로 거부해 최종 확정은 1건만 남았습니다. 실제 통합 테스트로 재현하는 시나리오입니다.", "With Redis down, two holds slipped through — but the DB unique constraint on (show, seat) physically rejected the second confirmation, leaving exactly one. This mirrors the real integration test.")
                : t("Redis SET NX가 첫 요청만 통과시키고 나머지는 SEAT_ALREADY_HELD로 거절됐습니다. 실제 경합 테스트에서 성공은 정확히 1건입니다.", "Redis SET NX let only the first request through; the rest were rejected with SEAT_ALREADY_HELD. In the real contention test, exactly one succeeds.")
            }}
          </p>
          <button type="button" class="primary-button" @click="advanceTo(3)">
            {{ t("결제·확정으로 이동", "Go to payment") }}
          </button>
        </div>
        <p class="scope-note">{{ t("실제 구현: 1석 100요청 경합 테스트, Redis 장애 통합 테스트 · 데모: 요청 처리 애니메이션", "Actually built: the 100-request contention test and Redis-outage integration test · Demo: the processing animation") }}</p>
      </div>

      <!-- 4단계: 결제·확정 -->
      <div v-else class="confirm-stage">
        <div class="confirm-grid">
          <div class="confirm-panel">
            <h5>{{ t("모의 결제", "Mock payment") }}</h5>
            <p>{{ t(`좌석 ${mySeatId ?? "B4"} · 홀드 검증 후 결제`, `Seat ${mySeatId ?? "B4"} · payment after hold check`) }}</p>
            <button type="button" class="primary-button" :disabled="paymentState !== 'idle'" @click="confirmPayment">
              {{ paymentState === "idle" ? t("결제 요청", "Pay now") : paymentState === "processing" ? t("처리 중…", "Processing…") : t("확정 완료", "Confirmed") }}
            </button>
            <small v-if="paymentState === 'done'">{{ t("같은 멱등성 키의 재시도는 새 결제를 만들지 않습니다.", "Retries with the same idempotency key never create a second payment.") }}</small>
          </div>
          <div class="confirm-panel">
            <h5>{{ t("아웃박스 이벤트 로그", "Outbox event log") }}</h5>
            <ul class="outbox-log" aria-live="polite">
              <li v-for="event in outboxEvents" :key="event.id">
                <code>{{ event.name }}</code>
                <span>{{ event.detail }}</span>
              </li>
              <li v-if="outboxEvents.length === 0" class="log-empty">{{ t("결제를 실행하면 한 트랜잭션의 이벤트가 기록됩니다.", "Run the payment to see events from a single transaction.") }}</li>
            </ul>
          </div>
        </div>
        <p class="scope-note">{{ t("실제 구현: 멱등성 키, 트랜잭셔널 아웃박스, SSE 좌석 상태 스트림 · 데모: 이벤트 로그와 상태 갱신 표시", "Actually built: idempotency keys, a transactional outbox, SSE seat-status streams · Demo: the log and status display") }}</p>
      </div>
    </section>

    <footer class="demo-footer">
      <button type="button" class="text-button" @click="resetDemo">
        {{ t("데모 전체 초기화", "Reset the demo") }}
        <span aria-hidden="true">↻</span>
      </button>
      <span class="repo-link">{{ t("전체 코드와 테스트는 상세보기의 GitHub 링크에서 확인할 수 있습니다.", "Full code and tests are linked from the detail view's GitHub resource.") }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { t } from "@/i18n/locale";

const RACE_SIZE = 100;
const QUEUE_START = 4218;
const HOLD_SECONDS = 5 * 60;

type SeatState = "free" | "mine" | "held" | "sold";
type Seat = { id: string; state: SeatState };

const steps = [
  { id: "queue", short: t("대기열", "Queue"), title: t("대기열 입장", "Queue admission"), caption: t("수요가 몰릴 때 서버를 지키는 첫 관문입니다.", "The first gate that protects the server under load.") },
  { id: "hold", short: t("좌석 홀드", "Seat hold"), title: t("좌석 선점(홀드)", "Holding a seat"), caption: t("좌석을 5분 동안 선점하고 다른 요청을 거절합니다.", "A seat is held for five minutes; other requests are rejected.") },
  { id: "race", short: t("동시 요청", "The race"), title: t("같은 좌석을 노리는 동시 요청", "Concurrent requests for one seat"), caption: t("이 프로젝트의 핵심 — 세 겹의 방어를 눈으로 확인합니다.", "The heart of the project — watch the three defense layers work.") },
  { id: "confirm", short: t("결제 확정", "Confirm"), title: t("결제와 확정", "Payment and confirmation"), caption: t("멱등 처리와 아웃박스로 정확히 한 번만 확정합니다.", "Idempotency and the outbox confirm exactly once.") },
] as const;

const currentStep = ref(0);
const highestVisitedStep = ref(0);
const timers: number[] = [];

const track = (id: number) => {
  timers.push(id);
  return id;
};
const clearTimers = () => {
  while (timers.length > 0) {
    const id = timers.pop();
    if (id !== undefined) {
      window.clearInterval(id);
      window.clearTimeout(id);
    }
  }
};

const stepState = (index: number) => ({
  done: index < currentStep.value,
  current: index === currentStep.value,
  locked: index > highestVisitedStep.value,
});
const goToStep = (index: number) => {
  if (index <= highestVisitedStep.value) currentStep.value = index;
};
const advanceTo = (index: number) => {
  highestVisitedStep.value = Math.max(highestVisitedStep.value, index);
  currentStep.value = index;
};

// 1단계: 대기열
const queuePosition = ref(QUEUE_START);
const queueRunning = ref(false);
const tokenSuffix = ref("a1b2c3");
const queueProgress = computed(() => Math.min(100, ((QUEUE_START - queuePosition.value) / QUEUE_START) * 100));
const startQueue = () => {
  queueRunning.value = true;
  const interval = track(
    window.setInterval(() => {
      const drop = Math.max(37, Math.round(queuePosition.value * 0.18));
      queuePosition.value = Math.max(0, queuePosition.value - drop);
      if (queuePosition.value === 0) {
        window.clearInterval(interval);
        queueRunning.value = false;
        tokenSuffix.value = Math.random().toString(36).slice(2, 8);
      }
    }, 240),
  );
};

// 2단계: 좌석 홀드
const seatRows = ["A", "B", "C", "D"] as const;
const initialSeats = (): Seat[] =>
  seatRows.flatMap((row) =>
    Array.from({ length: 8 }, (_, col) => {
      const id = `${row}${col + 1}`;
      const taken = ["A2", "A6", "B7", "C1", "C5", "D3"].includes(id);
      return { id, state: taken ? "held" : "free" } as Seat;
    }),
  );
const seats = ref<Seat[]>(initialSeats());
const mySeatId = ref<string | null>(null);
const holdRemaining = ref(HOLD_SECONDS);
const holdClock = computed(() => {
  const minutes = Math.floor(holdRemaining.value / 60);
  const seconds = holdRemaining.value % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
});
const seatAriaLabel = (seat: Seat) => {
  const states = {
    free: t("선택 가능", "available"),
    mine: t("내 홀드", "my hold"),
    held: t("다른 사람 홀드", "held by others"),
    sold: t("확정", "confirmed"),
  } as const;
  return `${t("좌석", "Seat")} ${seat.id} · ${states[seat.state]}`;
};
let holdInterval: number | null = null;
const holdSeat = (seat: Seat) => {
  if (seat.state === "held" || seat.state === "sold") return;
  for (const item of seats.value) if (item.state === "mine") item.state = "free";
  seat.state = "mine";
  mySeatId.value = seat.id;
  holdRemaining.value = HOLD_SECONDS;
  if (holdInterval !== null) window.clearInterval(holdInterval);
  holdInterval = track(
    window.setInterval(() => {
      holdRemaining.value = Math.max(0, holdRemaining.value - 1);
      if (holdRemaining.value === 0 && holdInterval !== null) window.clearInterval(holdInterval);
    }, 1000),
  );
};

// 3단계: 동시성 경쟁
const redisOutage = ref(false);
const raceRunning = ref(false);
const raceDone = ref(false);
const processedCount = ref(0);
const defenseLayers = computed(() => [
  {
    id: "redis",
    name: t("1차 · Redis SET NX 선점", "Layer 1 · Redis SET NX hold"),
    description: t("동시 요청 중 첫 한 건만 홀드를 얻습니다. 빠르지만 Redis가 죽으면 사라집니다.", "Only the first concurrent request wins the hold. Fast — but gone if Redis dies."),
    breached: redisOutage.value,
    blocked: RACE_SIZE - 1,
  },
  {
    id: "domain",
    name: t("2차 · 도메인 규칙", "Layer 2 · Domain rules"),
    description: t("만료됐거나 존재하지 않는 홀드로는 결제를 진행할 수 없습니다.", "Payment cannot proceed on an expired or missing hold."),
    breached: false,
    blocked: redisOutage.value ? RACE_SIZE - 2 : 0,
  },
  {
    id: "db",
    name: t("최종 · DB (회차·좌석) 유니크 제약", "Final · DB unique on (show, seat)"),
    description: t("Redis가 통째로 죽어도 같은 좌석의 두 번째 확정 INSERT는 DB가 물리적으로 거부합니다.", "Even with Redis fully down, the DB physically rejects a second confirmation for the same seat."),
    breached: false,
    blocked: redisOutage.value ? 1 : 0,
  },
]);
const startRace = () => {
  raceRunning.value = true;
  raceDone.value = false;
  processedCount.value = 0;
  const interval = track(
    window.setInterval(() => {
      processedCount.value = Math.min(RACE_SIZE, processedCount.value + 7);
      if (processedCount.value >= RACE_SIZE) {
        window.clearInterval(interval);
        raceRunning.value = false;
        raceDone.value = true;
      }
    }, 60),
  );
};

// 4단계: 결제·확정
type OutboxEvent = { id: number; name: string; detail: string };
const paymentState = ref<"idle" | "processing" | "done">("idle");
const outboxEvents = ref<OutboxEvent[]>([]);
const confirmPayment = () => {
  paymentState.value = "processing";
  const seatLabel = mySeatId.value ?? "B4";
  const pushEvent = (delay: number, name: string, detail: string) =>
    track(
      window.setTimeout(() => {
        outboxEvents.value = [...outboxEvents.value, { id: outboxEvents.value.length + 1, name, detail }];
      }, delay),
    );
  pushEvent(200, "PaymentApproved", t(`멱등성 키 pay.${tokenSuffix.value} · 승인`, `idempotency key pay.${tokenSuffix.value} · approved`));
  pushEvent(700, "SeatConfirmed", t(`좌석 ${seatLabel} · HELD → CONFIRMED (같은 트랜잭션에서 기록)`, `seat ${seatLabel} · HELD → CONFIRMED (written in the same transaction)`));
  pushEvent(1200, "SeatStatusPushed", t("SSE 스트림으로 좌석 상태 갱신 전파", "seat-status update pushed over the SSE stream"));
  track(
    window.setTimeout(() => {
      paymentState.value = "done";
      const mine = seats.value.find((seat) => seat.state === "mine");
      if (mine) mine.state = "sold";
    }, 1300),
  );
};

const resetDemo = () => {
  clearTimers();
  holdInterval = null;
  currentStep.value = 0;
  highestVisitedStep.value = 0;
  queuePosition.value = QUEUE_START;
  queueRunning.value = false;
  seats.value = initialSeats();
  mySeatId.value = null;
  holdRemaining.value = HOLD_SECONDS;
  redisOutage.value = false;
  raceRunning.value = false;
  raceDone.value = false;
  processedCount.value = 0;
  paymentState.value = "idle";
  outboxEvents.value = [];
};

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<style scoped>
.ticketrush-demo {
  display: grid;
  gap: 1.1rem;
  min-width: 0;
}
.demo-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}
.demo-header h3 {
  margin: 0.4rem 0 0.3rem;
  font-size: 1.05rem;
  font-weight: 800;
}
.demo-header p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted, #667085);
  max-width: 34rem;
}
.badge-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.sample-badge,
.round-badge {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
}
.sample-badge {
  background: rgba(21, 179, 115, 0.14);
  color: #0d7a4e;
}
.round-badge {
  background: rgba(49, 130, 246, 0.12);
  color: #1d4ed8;
}
.demo-notice {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  max-width: 21rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid rgba(49, 130, 246, 0.2);
  border-radius: 0.9rem;
  background: rgba(239, 246, 255, 0.7);
  font-size: 0.76rem;
}
.demo-notice span {
  display: inline-flex;
  width: 1.1rem;
  height: 1.1rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #1d4ed8;
  color: #fff;
  font-weight: 800;
  flex: none;
}
.demo-notice strong {
  display: block;
  font-size: 0.78rem;
}
.demo-notice small {
  color: var(--text-muted, #667085);
}
.step-navigation ol {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.step-navigation button {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid rgba(100, 116, 139, 0.25);
  border-radius: 0.8rem;
  background: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}
.step-navigation li.current button {
  border-color: #1d4ed8;
  background: rgba(49, 130, 246, 0.1);
  color: #1d4ed8;
}
.step-navigation li.done button {
  color: #0d7a4e;
}
.step-navigation button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.step-navigation b {
  display: inline-flex;
  width: 1.3rem;
  height: 1.3rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(100, 116, 139, 0.15);
  font-size: 0.72rem;
  flex: none;
}
.step-panel {
  display: grid;
  gap: 0.9rem;
  padding: 1rem;
  border: 1px solid rgba(100, 116, 139, 0.18);
  border-radius: 1rem;
  background: #fff;
}
.step-heading h4 {
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
  font-weight: 800;
}
.step-heading p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted, #667085);
}
.queue-stage,
.race-stage,
.confirm-stage,
.seat-stage {
  display: grid;
  gap: 0.85rem;
  justify-items: start;
}
.queue-card {
  display: grid;
  gap: 0.45rem;
  width: 100%;
  max-width: 22rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(49, 130, 246, 0.2);
  border-radius: 1rem;
  background: linear-gradient(150deg, rgba(239, 246, 255, 0.9), #fff);
}
.queue-label {
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #1d4ed8;
}
.queue-number {
  font-size: 1.9rem;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}
.queue-token {
  font-size: 1.1rem;
  font-weight: 900;
  color: #0d7a4e;
}
.token-chip {
  justify-self: start;
  padding: 0.2rem 0.55rem;
  border-radius: 0.5rem;
  background: rgba(13, 122, 78, 0.1);
  font-size: 0.78rem;
}
.queue-card small {
  color: var(--text-muted, #667085);
  font-size: 0.74rem;
}
.queue-bar {
  height: 0.45rem;
  border-radius: 999px;
  background: rgba(100, 116, 139, 0.15);
  overflow: hidden;
}
.queue-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #3182f6, #15b373);
  transition: width 0.2s ease;
}
.primary-button {
  padding: 0.55rem 1rem;
  border: 0;
  border-radius: 999px;
  background: #1d4ed8;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
}
.primary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.text-button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  border: 0;
  background: none;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted, #667085);
  cursor: pointer;
}
.scope-note {
  margin: 0;
  font-size: 0.72rem;
  color: var(--text-muted, #94a3b8);
}
.seat-map {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 0.35rem;
  width: 100%;
  max-width: 24rem;
}
.seat {
  padding: 0.42rem 0;
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 0.45rem;
  background: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
}
.seat.mine {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}
.seat.held {
  background: rgba(100, 116, 139, 0.18);
  color: #94a3b8;
  cursor: not-allowed;
}
.seat.sold {
  background: rgba(21, 179, 115, 0.2);
  border-color: rgba(13, 122, 78, 0.4);
  color: #0d7a4e;
  cursor: not-allowed;
}
.seat-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  font-size: 0.72rem;
  color: var(--text-muted, #667085);
}
.seat-legend .dot {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  margin-right: 0.3rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(100, 116, 139, 0.4);
}
.seat-legend .dot.mine {
  background: #1d4ed8;
  border-color: #1d4ed8;
}
.seat-legend .dot.held {
  background: rgba(100, 116, 139, 0.3);
}
.seat-legend .dot.sold {
  background: rgba(21, 179, 115, 0.5);
}
.hold-status {
  display: grid;
  gap: 0.4rem;
  justify-items: start;
  font-size: 0.8rem;
}
.hold-status b {
  font-variant-numeric: tabular-nums;
}
.race-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
}
.outage-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
}
.race-progress {
  display: grid;
  gap: 0.3rem;
  width: 100%;
  max-width: 22rem;
  font-size: 0.76rem;
  color: var(--text-muted, #667085);
}
.race-progress strong {
  font-size: 1rem;
  color: #111827;
  font-variant-numeric: tabular-nums;
}
.defense-layers {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
}
.defense-layers li {
  padding: 0.65rem 0.8rem;
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 0.8rem;
  background: #fff;
  transition: border-color 0.2s ease;
}
.defense-layers li.active {
  border-color: rgba(13, 122, 78, 0.5);
  background: rgba(21, 179, 115, 0.06);
}
.defense-layers li.breached {
  border-style: dashed;
  border-color: rgba(220, 38, 38, 0.45);
  background: rgba(254, 242, 242, 0.6);
}
.layer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  font-size: 0.79rem;
}
.layer-tag {
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
}
.layer-tag.ok {
  background: rgba(21, 179, 115, 0.15);
  color: #0d7a4e;
}
.layer-tag.down {
  background: rgba(220, 38, 38, 0.12);
  color: #b91c1c;
}
.defense-layers small {
  color: var(--text-muted, #667085);
  font-size: 0.72rem;
}
.race-result {
  display: grid;
  gap: 0.55rem;
  justify-items: start;
  width: 100%;
}
.result-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
}
.result-chip.success {
  background: rgba(21, 179, 115, 0.16);
  color: #0d7a4e;
}
.result-chip.rejected {
  background: rgba(100, 116, 139, 0.14);
  color: #475467;
}
.race-result p {
  margin: 0;
  max-width: 34rem;
  font-size: 0.78rem;
  color: var(--text-muted, #667085);
}
.confirm-grid {
  display: grid;
  gap: 0.8rem;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}
.confirm-panel {
  display: grid;
  gap: 0.5rem;
  justify-items: start;
  padding: 0.85rem 0.95rem;
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 0.9rem;
  background: #fff;
}
.confirm-panel h5 {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 800;
}
.confirm-panel p {
  margin: 0;
  font-size: 0.76rem;
  color: var(--text-muted, #667085);
}
.confirm-panel small {
  font-size: 0.72rem;
  color: #0d7a4e;
}
.outbox-log {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
  font-size: 0.74rem;
}
.outbox-log li {
  display: grid;
  gap: 0.15rem;
  padding: 0.45rem 0.6rem;
  border-left: 3px solid #15b373;
  border-radius: 0.4rem;
  background: rgba(21, 179, 115, 0.06);
}
.outbox-log code {
  font-weight: 800;
}
.outbox-log .log-empty {
  border-left-color: rgba(100, 116, 139, 0.3);
  background: rgba(100, 116, 139, 0.06);
  color: var(--text-muted, #667085);
}
.demo-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
}
.repo-link {
  font-size: 0.78rem;
  font-weight: 800;
  color: #1d4ed8;
  text-decoration: none;
}
@media (max-width: 640px) {
  .step-navigation ol {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
