<template>
  <section ref="demoRoot" class="ddoing-demo" aria-labelledby="ddoing-demo-title">
    <header class="demo-header">
      <div>
        <div class="badge-row">
          <span class="sample-badge">{{ t("샘플 데이터 데모", "Sample-data demo") }}</span>
          <span class="round-badge">{{ t("5단계 학습 흐름", "5-step learning flow") }}</span>
        </div>
        <h3 id="ddoing-demo-title">{{ t("그림으로 단어를 학습하는 전체 흐름", "The full flow of learning words by drawing") }}</h3>
        <p>{{ t("단어 확인부터 Canvas 입력, 이미지 제출, 판정 응답과 점수 반영까지 순서대로 살펴볼 수 있습니다.", "Walk through checking the word, Canvas input, image submission, the judgement response, and scoring — in order.") }}</p>
      </div>
      <div class="demo-notice" role="note">
        <span aria-hidden="true">i</span>
        <div>
          <strong>{{ t("AI 서버를 호출하지 않는 브라우저 재현", "A browser re-creation with no AI server calls") }}</strong>
          <small>{{ t("샘플 데이터로 화면 흐름만 재현하며 단어 일치나 정답 여부를 판정하지 않습니다.", "Only the screen flow is re-created with sample data — no word matching or correctness is judged.") }}</small>
        </div>
      </div>
    </header>

    <nav class="step-navigation" :aria-label="t('ddoing 학습 흐름 단계', 'ddoing learning flow steps')">
      <ol>
        <li v-for="(step, index) in guideSteps" :key="step.id" :class="stepState(index)">
          <button
            type="button"
            :disabled="index > highestVisitedStep"
            :aria-current="currentStep === index ? 'step' : undefined"
            @click="goToStep(index)"
          >
            <b>{{ index + 1 }}</b>
            <span>{{ step.shortTitle }}</span>
          </button>
        </li>
      </ol>
    </nav>

    <div v-if="phase === 'active'" class="guided-workspace">
      <div class="round-bar">
        <div>
          <span>WORD {{ currentIndex + 1 }} / {{ words.length }}</span>
          <strong>{{ currentWord.word }}</strong>
        </div>
        <button type="button" class="text-button" @click="resetSession">
          {{ t("전체 초기화", "Reset all") }}
          <span aria-hidden="true">↻</span>
        </button>
      </div>

      <section class="step-panel" :aria-labelledby="`guide-step-${currentGuideStep.id}`">
        <div class="step-heading">
          <span>STEP {{ currentStep + 1 }}</span>
          <h4
            :id="`guide-step-${currentGuideStep.id}`"
            ref="stepHeading"
            tabindex="-1"
          >
            {{ currentGuideStep.title }}
          </h4>
          <p>{{ currentGuideStep.description }}</p>
        </div>

        <div class="responsibility-grid" :aria-label="t('현재 단계 설명', 'Current step description')">
          <div>
            <span>{{ t("사용자 행동", "User action") }}</span>
            <strong>{{ currentGuideStep.userAction }}</strong>
          </div>
          <div>
            <span>{{ t("화면 변화", "Screen change") }}</span>
            <strong>{{ currentGuideStep.screenChange }}</strong>
          </div>
          <div>
            <span>{{ t("원 프로젝트 담당", "Built in the original") }}</span>
            <strong>{{ currentGuideStep.implementation }}</strong>
          </div>
          <div>
            <span>{{ t("공개 데모 재현", "Re-created in this demo") }}</span>
            <strong>{{ currentGuideStep.demo }}</strong>
          </div>
        </div>

        <div v-if="currentStep === STEP.WORD" class="word-stage">
          <span>{{ t("오늘의 단어", "Today's word") }}</span>
          <strong>{{ currentWord.word }}</strong>
          <p>{{ currentWord.hint }}</p>
          <div class="word-route" :aria-label="t('현재 문제 학습 순서', 'Learning order for this question')">
            <span>{{ t("단어 확인", "Check the word") }}</span><i aria-hidden="true">→</i><span>{{ t("그림 입력", "Draw") }}</span><i aria-hidden="true">→</i><span>{{ t("결과 확인", "See results") }}</span>
          </div>
        </div>

        <template v-else>
          <div class="drawing-layout">
            <div class="canvas-column">
              <div class="canvas-shell" :class="{ locked: drawingLocked }">
                <canvas
                  ref="drawingCanvas"
                  class="drawing-canvas"
                  :aria-label="t(`${currentWord.object} 그리는 캔버스`, `Canvas for drawing ${currentWord.object}`)"
                  aria-describedby="canvas-instructions"
                  @pointerdown="startDrawing"
                  @pointermove="draw"
                  @pointerup="stopDrawing"
                  @pointercancel="stopDrawing"
                  @pointerleave="stopDrawing"
                ></canvas>
                <div v-if="strokeCount === 0" class="canvas-placeholder" aria-hidden="true">
                  <span>✎</span>
                  <p>{{ t(`${currentWord.object} 자유롭게 그려보세요`, `Draw ${currentWord.object} however you like`) }}</p>
                </div>
              </div>
              <p id="canvas-instructions" class="sr-instructions">
                {{ t("마우스나 터치로 그림을 그릴 수 있습니다. 키보드 사용자는 단어별 샘플 그림 그리기 버튼으로 같은 흐름을 체험할 수 있습니다.", "Draw with mouse or touch. Keyboard users can follow the same flow with the per-word sample drawing button.") }}
              </p>

              <div v-if="currentStep === STEP.DRAW" class="drawing-tools">
                <div class="timer" :class="{ urgent: secondsLeft <= 4 && timerStarted }" role="timer" :aria-label="timerLabel">
                  <span>{{ timerStarted ? t("남은 시간", "Time left") : t("첫 입력 시 시작", "Starts on first input") }}</span>
                  <strong>{{ secondsLeft }}<small>{{ t("초", "s") }}</small></strong>
                </div>
                <div class="drawing-status" aria-live="polite">
                  <strong>{{ strokeCount ? t(`${strokeCount}개 획 입력`, `${strokeCount} strokes`) : t("입력 대기", "Waiting for input") }}</strong>
                  <small>{{ timerExpired ? t("시간은 종료됐지만 공개 데모는 계속 진행할 수 있습니다.", "Time is up, but the public demo can continue.") : t("시간은 흐름을 보여주는 안내용입니다.", "The timer is only illustrative of the flow.") }}</small>
                </div>
                <div class="tool-actions">
                  <button type="button" class="secondary-button" @click="drawSampleShape">
                    {{ t(`${currentWord.word} 샘플 그림 그리기`, `Draw a sample ${currentWord.word}`) }}
                  </button>
                  <button type="button" class="secondary-button" :disabled="strokeCount === 0" @click="clearCanvas()">
                    {{ t("모두 지우기", "Clear all") }}
                  </button>
                </div>
              </div>
            </div>

            <aside class="stage-detail">
              <template v-if="currentStep === STEP.DRAW">
                <span class="detail-kicker">CANVAS INPUT</span>
                <h5>{{ t("그림 입력을 이미지로 바꿀 준비", "Preparing drawings to become images") }}</h5>
                <p>{{ t("공개 데모에서는 포인터 좌표를 Canvas 경로로 이어 그리고, 화면 크기와 기기 배율이 달라도 선이 유지되도록 다시 구성했습니다.", "The public demo joins pointer coordinates into Canvas paths, rebuilt so strokes survive different screen sizes and device pixel ratios.") }}</p>
                <ul>
                  <li>{{ t("마우스·터치 Pointer Event 처리", "Mouse/touch Pointer Event handling") }}</li>
                  <li>{{ t("ResizeObserver 기반 캔버스 보정", "ResizeObserver-based canvas correction") }}</li>
                  <li>{{ t("단어마다 다른 접근성용 샘플 도형", "Per-word sample shapes for accessibility") }}</li>
                </ul>
              </template>

              <template v-else-if="currentStep === STEP.SUBMIT">
                <span class="detail-kicker">IMAGE SUBMIT</span>
                <h5>{{ t("Canvas 이미지를 제출 데이터로 변환", "Converting the Canvas image into submit data") }}</h5>
                <p>{{ t("현재 그림을 PNG Data URL로 변환해 브라우저 메모리에만 보관합니다.", "The current drawing becomes a PNG Data URL, kept only in browser memory.") }}</p>
                <dl class="data-list">
                  <div><dt>{{ t("형식", "Format") }}</dt><dd>image/png</dd></div>
                  <div><dt>{{ t("저장 위치", "Stored in") }}</dt><dd>{{ t("브라우저 메모리", "Browser memory") }}</dd></div>
                  <div><dt>{{ t("외부 전송", "Sent externally") }}</dt><dd>{{ t("없음", "None") }}</dd></div>
                </dl>
                <p class="privacy-note">{{ t("이 버튼은 실제 네트워크 요청 없이 제출 상태만 재현합니다.", "This button re-creates the submit state without any real network request.") }}</p>
              </template>

              <template v-else-if="currentStep === STEP.RESPONSE && pendingResult">
                <span class="detail-kicker">PUBLIC DEMO RESPONSE</span>
                <h5>{{ t("공개용 판정 응답 수신", "Receiving the public judgement response") }}</h5>
                <div class="response-card" role="status" aria-live="polite">
                  <span>200 · DRAWING_RECEIVED</span>
                  <strong>{{ t("그림 입력을 확인했습니다", "Drawing input received") }}</strong>
                  <p>semanticMatch: NOT_EVALUATED</p>
                </div>
                <p class="privacy-note">{{ t("실제 AI 분류 결과가 아닙니다. 단어 일치 여부와 정답을 표시하지 않습니다.", "Not a real AI classification — word matching and correctness are never shown.") }}</p>
              </template>

              <template v-else-if="currentStep === STEP.SCORE && pendingResult">
                <span class="detail-kicker">LEARNING REWARD</span>
                <h5>{{ t("학습 활동 점수와 경험치 반영", "Applying activity score and XP") }}</h5>
                <div class="reward-grid">
                  <div><span>{{ t("활동 점수", "Activity score") }}</span><strong>{{ pendingResult.activityScore }}<small>{{ t("점", "pts") }}</small></strong></div>
                  <div><span>{{ t("경험치", "Experience") }}</span><strong>+{{ pendingResult.experience }}<small>XP</small></strong></div>
                  <div><span>{{ t("입력 획", "Strokes") }}</span><strong>{{ pendingResult.strokeCount }}<small>{{ t("회", "") }}</small></strong></div>
                </div>
                <p>{{ t("점수는 브라우저에서 확인한 입력 면적과 획 수로 만든 활동 지표이며, 그림의 의미를 판정한 값이 아닙니다.", "Scores are activity metrics from input area and stroke count measured in the browser — not a judgement of what the drawing means.") }}</p>
                <div class="next-word-card">
                  <span>{{ isLastWord ? t("마지막 문제", "Last question") : t("다음 문제", "Next question") }}</span>
                  <strong>{{ isLastWord ? t("전체 학습 결과 확인", "See the session results") : words[currentIndex + 1]?.word }}</strong>
                </div>
              </template>
            </aside>
          </div>
        </template>
      </section>

      <div class="step-controls">
        <button type="button" class="secondary-button" :disabled="currentStep === STEP.WORD" @click="previousStep">
          <span aria-hidden="true">←</span>
          {{ t("이전 단계", "Previous step") }}
        </button>
        <p aria-live="polite">{{ controlHint }}</p>
        <button type="button" class="primary-button" :disabled="!canAdvance" @click="nextStep">
          {{ nextButtonLabel }}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>

    <div v-else class="complete-panel" aria-live="polite">
      <div class="complete-mark" aria-hidden="true">✓</div>
      <span>GUIDED DEMO COMPLETE</span>
      <h4>{{ t("한 문제의 전체 학습 흐름을 확인했습니다", "You've seen the full learning flow for one question") }}</h4>
      <p>{{ t("실제 프로젝트에서는 제출 이미지를 학습된 모델의 추론 API로 전달했습니다. 공개 데모는 브라우저 안에서만 동작하며, 다른 단어는 선택해서 이어서 체험할 수 있습니다.", "In the real project, submitted images went to the trained model's inference API. The public demo runs entirely in the browser, and you can pick another word to keep going.") }}</p>
      <div class="score-board">
        <div><span>{{ t("평균 활동 점수", "Average activity score") }}</span><strong>{{ finalAverage }}<small>{{ t("점", "pts") }}</small></strong></div>
        <div><span>{{ t("획득 경험치", "Total XP") }}</span><strong>{{ totalExperience }}<small>XP</small></strong></div>
        <div><span>{{ t("전체 입력 획", "Total strokes") }}</span><strong>{{ totalStrokes }}<small>{{ t("회", "") }}</small></strong></div>
      </div>
      <div class="complete-actions">
        <button type="button" class="secondary-button" @click="returnToLastStep">{{ t("이전 단계", "Previous step") }}</button>
        <button type="button" class="primary-button" @click="startOptionalRound">
          {{ isLastWord ? t("처음부터 다시 보기", "Start over") : t(`${words[currentIndex + 1]?.word}도 체험하기`, `Try "${words[currentIndex + 1]?.word}" too`) }}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>

    <section v-if="gallery.length" class="session-gallery" aria-labelledby="gallery-title">
      <div class="gallery-heading">
        <div>
          <span>SESSION GALLERY</span>
          <h4 id="gallery-title">{{ t("브라우저에서 만든 제출 이미지", "Submitted images created in the browser") }}</h4>
        </div>
        <small>{{ t("새로고침하거나 데모를 닫으면 사라집니다.", "They disappear on refresh or when the demo closes.") }}</small>
      </div>
      <div class="gallery-grid">
        <figure v-for="item in gallery" :key="item.id">
          <div class="gallery-image"><img :src="item.dataUrl" :alt="item.alt" /></div>
          <figcaption>
            <strong>{{ item.word }}</strong>
            <span>{{ t(`활동 ${item.activityScore}점 · +${item.experience} XP`, `Activity ${item.activityScore} pts · +${item.experience} XP`) }}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { t } from "@/i18n/locale";

type DemoPhase = "active" | "complete";

interface GuideStep {
  id: "word" | "draw" | "submit" | "response" | "score";
  shortTitle: string;
  title: string;
  description: string;
  userAction: string;
  screenChange: string;
  implementation: string;
  demo: string;
}

interface DrawingResult {
  roundIndex: number;
  word: string;
  activityScore: number;
  experience: number;
  strokeCount: number;
  coveragePercent: number;
  sampleUsed: boolean;
}

interface GalleryItem extends DrawingResult {
  id: number;
  dataUrl: string;
  alt: string;
}

const STEP = { WORD: 0, DRAW: 1, SUBMIT: 2, RESPONSE: 3, SCORE: 4 } as const;
const ROUND_SECONDS = 15;

const guideSteps: readonly GuideStep[] = [
  {
    id: "word",
    shortTitle: t("단어", "Word"),
    title: t("학습할 단어 제시", "The word to learn"),
    description: t("문제 단어와 형태를 떠올릴 수 있는 힌트를 확인합니다.", "Check the word and a hint that helps you picture its shape."),
    userAction: t("단어와 힌트 확인", "Check the word and hint"),
    screenChange: t("현재 문제 표시", "Current question shown"),
    implementation: t("학습 문제·라운드 화면과 진행 상태 UI", "Question/round screens and progress UI"),
    demo: t("샘플 단어와 힌트를 고정 데이터로 구성", "Sample words and hints as fixed data"),
  },
  {
    id: "draw",
    shortTitle: t("그림", "Draw"),
    title: t("Canvas에 그림 입력", "Drawing on the Canvas"),
    description: t("마우스나 터치로 직접 그리거나 단어별 샘플을 불러옵니다.", "Draw with mouse or touch, or load a per-word sample."),
    userAction: t("그림 그리기", "Draw a picture"),
    screenChange: t("획 수·타이머 갱신", "Stroke count and timer update"),
    implementation: t("Canvas 드로잉 화면과 입력 상태 UI", "Canvas drawing screen and input-state UI"),
    demo: t("Pointer Event·ResizeObserver·단어별 샘플 그림 추가", "Pointer Events, ResizeObserver, per-word samples added"),
  },
  {
    id: "submit",
    shortTitle: t("제출", "Submit"),
    title: t("그림 이미지를 제출 형태로 변환", "Converting the drawing for submission"),
    description: t("그림을 PNG 데이터로 변환하는 과정을 확인하고 제출합니다.", "See the drawing become PNG data, then submit it."),
    userAction: t("이미지 제출", "Submit the image"),
    screenChange: t("제출 상태 표시", "Submission state shown"),
    implementation: t("그림 제출 상태와 API 연동 화면", "Submission state and API integration screens"),
    demo: t("PNG Data URL을 브라우저 메모리에만 보관", "PNG Data URL kept only in browser memory"),
  },
  {
    id: "response",
    shortTitle: t("판정", "Response"),
    title: t("공개용 판정 응답 확인", "The public judgement response"),
    description: t("외부 요청 없이 브라우저에서 만든 수신 응답을 확인합니다.", "Check a response generated in the browser — no external requests."),
    userAction: t("응답 내용 확인", "Review the response"),
    screenChange: t("수신 상태 표시", "Received state shown"),
    implementation: t("AI 판정 응답을 학습 결과 화면에 연결", "AI judgement wired to the results screen"),
    demo: t("외부 AI 대신 의미 판정 없는 수신 응답 생성", "A no-judgement response generated instead of external AI"),
  },
  {
    id: "score",
    shortTitle: t("점수", "Score"),
    title: t("활동 점수·경험치와 다음 문제", "Activity score, XP, and the next question"),
    description: t("학습 활동 지표를 확인한 뒤 다음 단어로 이동합니다.", "Review the activity metrics, then move to the next word."),
    userAction: t("점수 확인·다음 이동", "Check score, move on"),
    screenChange: t("보상·다음 문제 표시", "Reward and next question shown"),
    implementation: t("점수·라운드 결과 UI와 상태 반영", "Score/round result UI and state updates"),
    demo: t("입력 면적·획 수로 샘플 활동 지표 생성", "Sample metrics from input area and strokes"),
  },
] as const;

const words = [
  { id: "apple", word: t("사과", "Apple"), object: t("사과를", "an apple"), hint: t("둥근 열매와 꼭지, 잎을 떠올려 보세요.", "Picture a round fruit with a stem and a leaf.") },
  { id: "umbrella", word: t("우산", "Umbrella"), object: t("우산을", "an umbrella"), hint: t("넓은 지붕과 길게 내려오는 손잡이를 그려보세요.", "Draw a wide canopy and a long handle.") },
  { id: "cat", word: t("고양이", "Cat"), object: t("고양이를", "a cat"), hint: t("뾰족한 귀와 눈, 코, 수염이 힌트입니다.", "Pointy ears, eyes, a nose, and whiskers are your hints.") },
] as const;

const demoRoot = ref<HTMLElement | null>(null);
const drawingCanvas = ref<HTMLCanvasElement | null>(null);
const stepHeading = ref<HTMLElement | null>(null);
const phase = ref<DemoPhase>("active");
const currentIndex = ref(0);
const currentStep = ref<number>(STEP.WORD);
const highestVisitedStep = ref<number>(STEP.WORD);
const secondsLeft = ref(ROUND_SECONDS);
const strokeCount = ref(0);
const isDrawing = ref(false);
const timerStarted = ref(false);
const timerExpired = ref(false);
const sampleUsed = ref(false);
const pendingResult = ref<DrawingResult | null>(null);
const results = ref<DrawingResult[]>([]);
const gallery = ref<GalleryItem[]>([]);

let timerId: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let deviceScale = 1;
let gallerySequence = 0;
let preparedCanvas: HTMLCanvasElement | null = null;
let canvasSnapshot: HTMLCanvasElement | null = null;

const currentWord = computed(() => words[currentIndex.value] ?? words[0]);
const currentGuideStep = computed(() => guideSteps[currentStep.value] ?? guideSteps[0]);
const isLastWord = computed(() => currentIndex.value === words.length - 1);
const drawingLocked = computed(() => currentStep.value !== STEP.DRAW || pendingResult.value !== null);
const canAdvance = computed(() => {
  if (currentStep.value === STEP.DRAW || currentStep.value === STEP.SUBMIT) return strokeCount.value > 0;
  if (currentStep.value === STEP.RESPONSE || currentStep.value === STEP.SCORE) return pendingResult.value !== null;
  return true;
});
const nextButtonLabel = computed(() => {
  if (currentStep.value === STEP.WORD) return t("그림 입력으로", "Start drawing");
  if (currentStep.value === STEP.DRAW) return t("입력 완료", "Done drawing");
  if (currentStep.value === STEP.SUBMIT) return t("이미지 제출", "Submit image");
  if (currentStep.value === STEP.RESPONSE) return t("점수·경험치 보기", "See score & XP");
  return t("전체 흐름 마치기", "Finish the flow");
});
const controlHint = computed(() => {
  if (currentStep.value === STEP.DRAW && strokeCount.value === 0) return t("그림을 직접 그리거나 단어별 샘플을 불러오세요.", "Draw something yourself or load the per-word sample.");
  if (currentStep.value === STEP.SUBMIT) return t("제출해도 외부 서버로 전송되지 않습니다.", "Submitting sends nothing to external servers.");
  if (pendingResult.value && currentStep.value < STEP.RESPONSE) return t("제출 이후 이전 단계는 확인용으로만 볼 수 있습니다.", "After submitting, earlier steps are view-only.");
  return t(`${currentStep.value + 1} / ${guideSteps.length} 단계`, `Step ${currentStep.value + 1} of ${guideSteps.length}`);
});
const timerLabel = computed(() => timerStarted.value ? t(`그림 입력 남은 시간 ${secondsLeft.value}초`, `${secondsLeft.value} seconds left to draw`) : t("첫 입력 시 15초 타이머 시작", "A 15-second timer starts on first input"));
const finalAverage = computed(() => results.value.length
  ? Math.round(results.value.reduce((sum, item) => sum + item.activityScore, 0) / results.value.length)
  : 0);
const totalExperience = computed(() => results.value.reduce((sum, item) => sum + item.experience, 0));
const totalStrokes = computed(() => results.value.reduce((sum, item) => sum + item.strokeCount, 0));

function stepState(index: number): Record<string, boolean> {
  return {
    active: currentStep.value === index,
    complete: index < currentStep.value || (pendingResult.value !== null && index <= STEP.SUBMIT),
    available: index <= highestVisitedStep.value,
  };
}

function getContext(): CanvasRenderingContext2D | null {
  return drawingCanvas.value?.getContext("2d", { willReadFrequently: true }) ?? null;
}

function configureContext(context: CanvasRenderingContext2D): void {
  context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 5;
  context.strokeStyle = "#25324a";
}

function captureCanvasSnapshot(): void {
  const canvas = drawingCanvas.value;
  if (!canvas || strokeCount.value === 0 || canvas.width < 1 || canvas.height < 1) {
    canvasSnapshot = null;
    return;
  }

  const snapshot = document.createElement("canvas");
  snapshot.width = canvas.width;
  snapshot.height = canvas.height;
  snapshot.getContext("2d")?.drawImage(canvas, 0, 0);
  canvasSnapshot = snapshot;
}

function resizeCanvas(preserve = true): void {
  const canvas = drawingCanvas.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;

  const source = preserve
    ? (preparedCanvas === canvas && canvas.width > 0 && canvas.height > 0 ? canvas : canvasSnapshot)
    : null;
  const previous = source ? document.createElement("canvas") : null;
  if (source && previous) {
    previous.width = source.width;
    previous.height = source.height;
    previous.getContext("2d")?.drawImage(source, 0, 0);
  }

  deviceScale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * deviceScale));
  canvas.height = Math.max(1, Math.round(rect.height * deviceScale));
  preparedCanvas = canvas;

  const context = getContext();
  if (!context) return;
  configureContext(context);
  if (previous) {
    context.drawImage(previous, 0, 0, previous.width, previous.height, 0, 0, rect.width, rect.height);
  }
}

function clearTimer(): void {
  if (timerId !== null) window.clearInterval(timerId);
  timerId = null;
}

function runTimer(): void {
  clearTimer();
  if (currentStep.value !== STEP.DRAW || pendingResult.value || secondsLeft.value <= 0) return;
  timerId = window.setInterval(() => {
    secondsLeft.value = Math.max(0, secondsLeft.value - 1);
    if (secondsLeft.value === 0) {
      timerExpired.value = true;
      finishActiveStroke();
      clearTimer();
    }
  }, 1000);
}

function startTimer(): void {
  if (!timerStarted.value) {
    timerStarted.value = true;
    secondsLeft.value = ROUND_SECONDS;
  }
  runTimer();
}

function finishActiveStroke(): void {
  if (!isDrawing.value) return;
  getContext()?.closePath();
  isDrawing.value = false;
  strokeCount.value += 1;
  captureCanvasSnapshot();
}

async function prepareCanvas(preserve = false): Promise<void> {
  await nextTick();
  resizeCanvas(preserve);
  if (!preserve) clearCanvas(false);
}

async function focusRoundStart(): Promise<void> {
  await nextTick();
  const target = stepHeading.value;
  if (!target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

async function goToStep(index: number): Promise<void> {
  if (index < STEP.WORD || index > highestVisitedStep.value || phase.value !== "active") return;
  if (currentStep.value === STEP.DRAW) finishActiveStroke();
  if (currentStep.value >= STEP.DRAW) captureCanvasSnapshot();
  clearTimer();
  currentStep.value = index;
  if (index >= STEP.DRAW) await prepareCanvas(true);
  if (index === STEP.DRAW && timerStarted.value && !timerExpired.value && !pendingResult.value) runTimer();
}

async function openStep(index: number): Promise<void> {
  highestVisitedStep.value = Math.max(highestVisitedStep.value, index);
  await goToStep(index);
}

async function previousStep(): Promise<void> {
  await goToStep(currentStep.value - 1);
}

async function nextStep(): Promise<void> {
  if (!canAdvance.value) return;
  if (currentStep.value === STEP.WORD) {
    await openStep(STEP.DRAW);
    return;
  }
  if (currentStep.value === STEP.DRAW) {
    finishActiveStroke();
    clearTimer();
    await openStep(STEP.SUBMIT);
    return;
  }
  if (currentStep.value === STEP.SUBMIT) {
    submitDrawing();
    await openStep(STEP.RESPONSE);
    return;
  }
  if (currentStep.value === STEP.RESPONSE) {
    await openStep(STEP.SCORE);
    return;
  }
  await advanceRound();
}

async function resetCurrentRound(): Promise<void> {
  clearTimer();
  phase.value = "active";
  currentStep.value = STEP.WORD;
  highestVisitedStep.value = STEP.WORD;
  secondsLeft.value = ROUND_SECONDS;
  strokeCount.value = 0;
  isDrawing.value = false;
  timerStarted.value = false;
  timerExpired.value = false;
  sampleUsed.value = false;
  pendingResult.value = null;
  preparedCanvas = null;
  canvasSnapshot = null;
  await nextTick();
}

async function resetSession(): Promise<void> {
  currentIndex.value = 0;
  results.value = [];
  gallery.value = [];
  gallerySequence = 0;
  await resetCurrentRound();
}

function clearCanvas(resetTimer = false): void {
  const canvas = drawingCanvas.value;
  const context = getContext();
  if (!canvas || !context || pendingResult.value) return;
  context.clearRect(0, 0, canvas.width / deviceScale, canvas.height / deviceScale);
  strokeCount.value = 0;
  isDrawing.value = false;
  sampleUsed.value = false;
  canvasSnapshot = null;
  if (resetTimer) {
    clearTimer();
    timerStarted.value = false;
    timerExpired.value = false;
    secondsLeft.value = ROUND_SECONDS;
  }
}

function strokePath(context: CanvasRenderingContext2D, drawPath: () => void): void {
  context.beginPath();
  drawPath();
  context.stroke();
}

function drawAppleSample(context: CanvasRenderingContext2D, width: number, height: number): number {
  const x = width / 2;
  const y = height / 2 + 12;
  const rx = Math.min(width * 0.2, 82);
  const ry = Math.min(height * 0.27, 70);
  strokePath(context, () => context.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2));
  strokePath(context, () => { context.moveTo(x, y - ry); context.quadraticCurveTo(x + 2, y - ry - 26, x + 14, y - ry - 32); });
  strokePath(context, () => context.ellipse(x + 31, y - ry - 21, 24, 10, -0.45, 0, Math.PI * 2));
  return 3;
}

function drawUmbrellaSample(context: CanvasRenderingContext2D, width: number, height: number): number {
  const x = width / 2;
  const canopyY = height / 2 - 6;
  const half = Math.min(width * 0.29, 112);
  strokePath(context, () => {
    context.moveTo(x - half, canopyY);
    context.quadraticCurveTo(x, canopyY - 112, x + half, canopyY);
    context.quadraticCurveTo(x + half * 0.65, canopyY - 12, x + half * 0.33, canopyY);
    context.quadraticCurveTo(x, canopyY - 14, x - half * 0.33, canopyY);
    context.quadraticCurveTo(x - half * 0.65, canopyY - 12, x - half, canopyY);
  });
  strokePath(context, () => { context.moveTo(x, canopyY - 68); context.lineTo(x, canopyY + 88); context.quadraticCurveTo(x, canopyY + 112, x + 30, canopyY + 103); });
  strokePath(context, () => { context.moveTo(x, canopyY - 67); context.lineTo(x - half * 0.33, canopyY); });
  strokePath(context, () => { context.moveTo(x, canopyY - 67); context.lineTo(x + half * 0.33, canopyY); });
  return 4;
}

function drawCatSample(context: CanvasRenderingContext2D, width: number, height: number): number {
  const x = width / 2;
  const y = height / 2 + 14;
  const r = Math.min(width * 0.18, height * 0.25, 68);
  strokePath(context, () => context.arc(x, y, r, 0, Math.PI * 2));
  strokePath(context, () => { context.moveTo(x - r * 0.72, y - r * 0.6); context.lineTo(x - r * 0.5, y - r * 1.22); context.lineTo(x - r * 0.1, y - r * 0.9); });
  strokePath(context, () => { context.moveTo(x + r * 0.1, y - r * 0.9); context.lineTo(x + r * 0.5, y - r * 1.22); context.lineTo(x + r * 0.72, y - r * 0.6); });
  strokePath(context, () => {
    context.arc(x - r * 0.32, y - r * 0.15, 4, 0, Math.PI * 2);
    context.moveTo(x + r * 0.32 + 4, y - r * 0.15);
    context.arc(x + r * 0.32, y - r * 0.15, 4, 0, Math.PI * 2);
  });
  strokePath(context, () => { context.moveTo(x - 8, y + 9); context.lineTo(x, y + 16); context.lineTo(x + 8, y + 9); });
  strokePath(context, () => {
    [-8, 10].forEach((offset) => {
      context.moveTo(x - 14, y + offset); context.lineTo(x - r - 30, y + offset - 4);
      context.moveTo(x + 14, y + offset); context.lineTo(x + r + 30, y + offset - 4);
    });
  });
  return 6;
}

function drawSampleShape(): void {
  if (currentStep.value !== STEP.DRAW || pendingResult.value) return;
  const canvas = drawingCanvas.value;
  const context = getContext();
  if (!canvas || !context) return;
  startTimer();
  clearCanvas();
  const width = canvas.width / deviceScale;
  const height = canvas.height / deviceScale;
  context.save();
  context.lineWidth = 8;
  let sampleStrokes = 0;
  if (currentWord.value.id === "apple") sampleStrokes = drawAppleSample(context, width, height);
  if (currentWord.value.id === "umbrella") sampleStrokes = drawUmbrellaSample(context, width, height);
  if (currentWord.value.id === "cat") sampleStrokes = drawCatSample(context, width, height);
  context.restore();
  configureContext(context);
  strokeCount.value = sampleStrokes;
  sampleUsed.value = true;
  captureCanvasSnapshot();
}

function canvasPoint(event: PointerEvent): { x: number; y: number } {
  const rect = drawingCanvas.value?.getBoundingClientRect();
  return rect ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : { x: 0, y: 0 };
}

function startDrawing(event: PointerEvent): void {
  if (drawingLocked.value) return;
  event.preventDefault();
  startTimer();
  const canvas = drawingCanvas.value;
  const context = getContext();
  if (!canvas || !context) return;
  canvas.setPointerCapture?.(event.pointerId);
  const point = canvasPoint(event);
  context.beginPath();
  context.moveTo(point.x, point.y);
  isDrawing.value = true;
  sampleUsed.value = false;
}

function draw(event: PointerEvent): void {
  if (!isDrawing.value || drawingLocked.value) return;
  event.preventDefault();
  const point = canvasPoint(event);
  const context = getContext();
  if (!context) return;
  context.lineTo(point.x, point.y);
  context.stroke();
}

function stopDrawing(event: PointerEvent): void {
  if (!isDrawing.value) return;
  event.preventDefault();
  finishActiveStroke();
  const canvas = drawingCanvas.value;
  if (canvas?.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
}

function calculateActivityMetrics(): Pick<DrawingResult, "activityScore" | "experience" | "coveragePercent"> {
  const canvas = drawingCanvas.value;
  const context = getContext();
  if (!canvas || !context || strokeCount.value === 0) return { activityScore: 0, experience: 0, coveragePercent: 0 };
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const step = Math.max(1, Math.round(deviceScale * 2));
  let sampled = 0;
  let painted = 0;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      sampled += 1;
      if ((pixels[(y * canvas.width + x) * 4 + 3] ?? 0) > 18) painted += 1;
    }
  }
  const coveragePercent = sampled ? Math.round((painted / sampled) * 1000) / 10 : 0;
  const activityScore = Math.min(100, 25 + Math.round(coveragePercent * 3.2) + Math.min(35, strokeCount.value * 5));
  const experience = Math.min(50, 8 + Math.round(activityScore / 4));
  return { activityScore, experience, coveragePercent };
}

function submitDrawing(): void {
  if (currentStep.value !== STEP.SUBMIT || strokeCount.value === 0 || pendingResult.value) return;
  clearTimer();
  const metrics = calculateActivityMetrics();
  const result: DrawingResult = {
    roundIndex: currentIndex.value,
    word: currentWord.value.word,
    strokeCount: strokeCount.value,
    sampleUsed: sampleUsed.value,
    ...metrics,
  };
  pendingResult.value = result;
  const canvas = drawingCanvas.value;
  if (canvas) {
    gallery.value.push({
      ...result,
      id: ++gallerySequence,
      dataUrl: canvas.toDataURL("image/png"),
      alt: t(
        `${result.word} 제출 이미지, 브라우저 활동 점수 ${result.activityScore}점`,
        `Submitted drawing of ${result.word}, browser activity score ${result.activityScore}`,
      ),
    });
  }
}

function savePendingResult(): void {
  if (!pendingResult.value) return;
  const next = [...results.value];
  next[pendingResult.value.roundIndex] = pendingResult.value;
  results.value = next;
}

async function advanceRound(): Promise<void> {
  if (!pendingResult.value) return;
  savePendingResult();
  captureCanvasSnapshot();
  clearTimer();
  phase.value = "complete";
}

async function startOptionalRound(): Promise<void> {
  if (isLastWord.value) {
    await resetSession();
    await focusRoundStart();
    return;
  }
  currentIndex.value += 1;
  await resetCurrentRound();
  await focusRoundStart();
}

async function returnToLastStep(): Promise<void> {
  phase.value = "active";
  currentStep.value = STEP.SCORE;
  highestVisitedStep.value = STEP.SCORE;
  await prepareCanvas(true);
}

onMounted(() => {
  if (typeof ResizeObserver === "undefined" || !demoRoot.value) return;
  resizeObserver = new ResizeObserver(() => {
    if (currentStep.value >= STEP.DRAW && phase.value === "active") resizeCanvas(true);
  });
  resizeObserver.observe(demoRoot.value);
});

onBeforeUnmount(() => {
  clearTimer();
  resizeObserver?.disconnect();
  resizeObserver = null;
  preparedCanvas = null;
  canvasSnapshot = null;
});
</script>

<style scoped>
.ddoing-demo {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  background: radial-gradient(circle at 94% 2%, rgba(83, 199, 245, 0.14), transparent 30%), var(--surface-strong);
  color: var(--text-primary);
}

.demo-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.25rem; padding: 1.35rem; border-bottom: 1px solid var(--border); }
.badge-row { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.7rem; }
.sample-badge,
.round-badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 0.34rem 0.64rem; font-size: 0.68rem; font-weight: 850; letter-spacing: 0.04em; }
.sample-badge { color: var(--fresh-blue-strong); background: var(--fresh-blue-soft); }
.round-badge { border: 1px solid var(--border); color: var(--text-muted); }
.demo-header h3 { margin: 0; font-size: clamp(1.08rem, 2.4vw, 1.38rem); letter-spacing: -0.035em; }
.demo-header p { max-width: 38rem; margin: 0.45rem 0 0; color: var(--text-muted); font-size: 0.82rem; line-height: 1.65; }
.demo-notice { display: flex; min-width: min(19rem, 100%); gap: 0.65rem; border: 1px solid rgba(49, 130, 246, 0.18); border-radius: 1rem; background: rgba(49, 130, 246, 0.055); padding: 0.78rem; }
.demo-notice > span { display: grid; width: 1.5rem; height: 1.5rem; flex: 0 0 auto; place-items: center; border-radius: 50%; color: white; background: var(--fresh-blue); font-size: 0.72rem; font-weight: 900; }
.demo-notice strong,
.demo-notice small { display: block; }
.demo-notice strong { font-size: 0.72rem; }
.demo-notice small { margin-top: 0.2rem; color: var(--text-muted); font-size: 0.64rem; line-height: 1.5; }

.step-navigation { width: 100%; min-width: 0; max-width: 100%; overflow-x: auto; border-bottom: 1px solid var(--border); background: rgba(247, 249, 252, 0.6); scrollbar-width: thin; }
.step-navigation ol { display: grid; min-width: 39rem; grid-template-columns: repeat(5, 1fr); margin: 0; padding: 0.75rem 1.1rem; list-style: none; }
.step-navigation li { position: relative; }
.step-navigation li:not(:last-child)::after { position: absolute; top: 1rem; right: -0.45rem; width: 0.9rem; height: 1px; background: var(--border-strong); content: ""; }
.step-navigation button { display: flex; width: 100%; align-items: center; gap: 0.45rem; border: 0; padding: 0.25rem 0.45rem; color: var(--text-muted); background: transparent; font: inherit; text-align: left; }
.step-navigation button:not(:disabled) { cursor: pointer; }
.step-navigation button:disabled { cursor: not-allowed; opacity: 0.46; }
.step-navigation b { display: grid; width: 1.55rem; height: 1.55rem; flex: 0 0 auto; place-items: center; border: 1px solid var(--border); border-radius: 50%; background: var(--surface-strong); font: 800 0.62rem var(--font-mono); }
.step-navigation span { font-size: 0.7rem; font-weight: 800; }
.step-navigation li.active button { color: var(--fresh-blue-strong); }
.step-navigation li.active b { border-color: transparent; color: white; background: var(--fresh-blue); box-shadow: 0 0 0 4px var(--fresh-blue-soft); }
.step-navigation li.complete b { border-color: rgba(16, 185, 129, 0.24); color: #047857; background: rgba(16, 185, 129, 0.1); }
.step-navigation button:focus-visible { border-radius: 0.5rem; outline: 3px solid rgba(49, 130, 246, 0.25); outline-offset: 1px; }

.round-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.35rem 0; }
.round-bar > div { display: flex; align-items: baseline; gap: 0.55rem; }
.round-bar span { color: var(--fresh-blue-strong); font: 850 0.6rem var(--font-mono); letter-spacing: 0.1em; }
.round-bar strong { font-size: 1rem; }
.text-button { display: inline-flex; align-items: center; gap: 0.35rem; border: 0; padding: 0.35rem; color: var(--text-muted); background: transparent; font: inherit; font-size: 0.68rem; font-weight: 800; cursor: pointer; }
.text-button:hover { color: var(--fresh-blue-strong); }
.text-button:focus-visible { border-radius: 0.4rem; outline: 3px solid rgba(49, 130, 246, 0.25); outline-offset: 1px; }

.step-panel { margin: 0.8rem 1.35rem 1rem; border: 1px solid var(--border); border-radius: 1.2rem; background: rgba(255, 255, 255, 0.58); padding: 1rem; }
.step-heading > span { color: var(--fresh-blue-strong); font: 900 0.58rem var(--font-mono); letter-spacing: 0.13em; }
.step-heading h4 { margin: 0.22rem 0 0; scroll-margin-top: 5.5rem; font-size: 1.08rem; letter-spacing: -0.025em; outline: none; }
.step-heading p { margin: 0.34rem 0 0; color: var(--text-muted); font-size: 0.82rem; line-height: 1.6; }

.responsibility-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.55rem; margin-top: 0.85rem; }
.responsibility-grid > div { min-width: 0; border: 1px solid var(--border); border-radius: 0.75rem; background: var(--surface-soft); padding: 0.65rem 0.72rem; }
.responsibility-grid span { display: block; color: var(--text-muted); font-size: 0.68rem; font-weight: 800; }
.responsibility-grid strong { display: block; margin-top: 0.18rem; font-size: 0.78rem; line-height: 1.5; }

.word-stage { display: grid; min-height: 14rem; place-content: center; justify-items: center; margin-top: 0.9rem; border-radius: 1rem; background: radial-gradient(circle at 50% 35%, rgba(49, 130, 246, 0.12), transparent 48%), var(--surface-soft); text-align: center; }
.word-stage > span { color: var(--fresh-blue-strong); font: 850 0.62rem var(--font-mono); letter-spacing: 0.1em; }
.word-stage > strong { margin-top: 0.25rem; font-size: clamp(2rem, 7vw, 3.4rem); letter-spacing: -0.06em; }
.word-stage > p { margin: 0.4rem 0 0; color: var(--text-muted); font-size: 0.78rem; }
.word-route { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.45rem; margin-top: 1rem; }
.word-route span { border: 1px solid var(--border); border-radius: 999px; background: var(--surface-strong); padding: 0.36rem 0.62rem; color: var(--text-secondary); font-size: 0.64rem; font-weight: 800; }
.word-route i { color: var(--fresh-blue); font-style: normal; }

.drawing-layout { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(14rem, 0.75fr); gap: 0.8rem; margin-top: 0.9rem; }
.canvas-column { min-width: 0; }
.canvas-shell { position: relative; overflow: hidden; border: 1px solid var(--border-strong); border-radius: 1rem; background: linear-gradient(rgba(49, 130, 246, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(49, 130, 246, 0.035) 1px, transparent 1px), #fff; background-size: 22px 22px; box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.7); }
.drawing-canvas { display: block; width: 100%; height: clamp(13rem, 31vw, 18rem); cursor: crosshair; touch-action: none; }
.canvas-shell.locked .drawing-canvas { cursor: default; pointer-events: none; }
.canvas-placeholder { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; color: rgba(49, 65, 88, 0.4); pointer-events: none; }
.canvas-placeholder span { font-size: 1.7rem; }
.canvas-placeholder p { margin: 0.3rem 0 0; font-size: 0.72rem; font-weight: 750; }
.sr-instructions { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.drawing-tools { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 0.65rem; margin-top: 0.65rem; }
.timer { min-width: 5rem; border: 1px solid var(--border); border-radius: 0.75rem; background: var(--surface-soft); padding: 0.48rem 0.65rem; text-align: center; }
.timer > span { display: block; color: var(--text-muted); font-size: 0.53rem; font-weight: 800; }
.timer > strong { color: var(--fresh-blue-strong); font: 800 1.15rem var(--font-mono); }
.timer strong small { margin-left: 0.1rem; font: 700 0.55rem var(--font-body); }
.timer.urgent { border-color: rgba(239, 68, 68, 0.26); background: rgba(239, 68, 68, 0.06); animation: timer-pulse 800ms ease-in-out infinite alternate; }
.timer.urgent > strong { color: #dc2626; }
.drawing-status { display: grid; gap: 0.1rem; }
.drawing-status strong { font-size: 0.7rem; }
.drawing-status small { color: var(--text-muted); font-size: 0.6rem; line-height: 1.4; }
.tool-actions { display: flex; grid-column: 1 / -1; flex-wrap: wrap; justify-content: flex-end; gap: 0.45rem; }

.stage-detail { min-width: 0; border: 1px solid var(--border); border-radius: 1rem; background: var(--surface-soft); padding: 0.9rem; }
.detail-kicker { color: var(--fresh-blue-strong); font: 900 0.55rem var(--font-mono); letter-spacing: 0.11em; }
.stage-detail h5 { margin: 0.3rem 0 0; font-size: 0.86rem; }
.stage-detail > p { margin: 0.45rem 0 0; color: var(--text-muted); font-size: 0.78rem; line-height: 1.6; }
.stage-detail ul { display: grid; gap: 0.35rem; margin: 0.7rem 0 0; padding: 0; list-style: none; }
.stage-detail li { position: relative; padding-left: 0.8rem; color: var(--text-secondary); font-size: 0.75rem; line-height: 1.5; }
.stage-detail li::before { position: absolute; top: 0.5em; left: 0; width: 0.3rem; height: 0.3rem; border-radius: 50%; background: var(--fresh-blue); content: ""; }
.data-list { display: grid; gap: 0.4rem; margin: 0.75rem 0 0; }
.data-list > div { display: flex; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.35rem; }
.data-list dt { color: var(--text-muted); font-size: 0.61rem; }
.data-list dd { margin: 0; color: var(--text-secondary); font: 750 0.61rem var(--font-mono); text-align: right; }
.privacy-note { border-radius: 0.65rem; background: rgba(49, 130, 246, 0.07); padding: 0.55rem; color: var(--fresh-blue-strong) !important; }
.response-card { margin-top: 0.7rem; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 0.78rem; background: rgba(16, 185, 129, 0.07); padding: 0.7rem; }
.response-card span { color: #047857; font: 800 0.52rem var(--font-mono); }
.response-card strong { display: block; margin-top: 0.25rem; font-size: 0.75rem; }
.response-card p { margin: 0.3rem 0 0; color: var(--text-muted); font: 700 0.56rem var(--font-mono); }
.reward-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; margin-top: 0.7rem; }
.reward-grid > div { border: 1px solid var(--border); border-radius: 0.7rem; background: var(--surface-strong); padding: 0.55rem 0.35rem; text-align: center; }
.reward-grid span { display: block; color: var(--text-muted); font-size: 0.54rem; }
.reward-grid strong { display: block; margin-top: 0.14rem; font: 800 1rem var(--font-mono); }
.reward-grid small { margin-left: 0.08rem; font: 700 0.5rem var(--font-body); }
.next-word-card { display: grid; gap: 0.12rem; margin-top: 0.7rem; border-radius: 0.7rem; background: var(--fresh-blue-soft); padding: 0.6rem; }
.next-word-card span { color: var(--fresh-blue-strong); font-size: 0.55rem; font-weight: 850; }
.next-word-card strong { font-size: 0.74rem; }

.primary-button,
.secondary-button { display: inline-flex; min-height: 2.45rem; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 999px; padding: 0.65rem 1rem; font: inherit; font-size: 0.72rem; font-weight: 850; transition: transform 160ms ease, opacity 160ms ease; }
.primary-button { border: 0; color: white; background: var(--accent-gradient); box-shadow: 0 9px 20px rgba(49, 130, 246, 0.18); }
.secondary-button { border: 1px solid var(--border); color: var(--text-secondary); background: var(--surface-strong); }
.primary-button:hover:not(:disabled),
.secondary-button:hover:not(:disabled) { transform: translateY(-1px); }
.primary-button:focus-visible,
.secondary-button:focus-visible { outline: 3px solid rgba(49, 130, 246, 0.28); outline-offset: 2px; }
.primary-button:disabled,
.secondary-button:disabled { cursor: not-allowed; opacity: 0.4; box-shadow: none; }
.step-controls { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.8rem; border-top: 1px solid var(--border); padding: 0.9rem 1.35rem 1.25rem; }
.step-controls p { margin: 0; color: var(--text-muted); font-size: 0.64rem; line-height: 1.45; text-align: center; }

.complete-panel { display: grid; justify-items: center; padding: 2.1rem 1.35rem; text-align: center; }
.complete-mark { display: grid; width: 3.2rem; height: 3.2rem; place-items: center; border-radius: 50%; color: #047857; background: rgba(16, 185, 129, 0.11); font-size: 1.35rem; font-weight: 900; }
.complete-panel > span { margin-top: 0.7rem; color: var(--fresh-blue-strong); font: 900 0.58rem var(--font-mono); letter-spacing: 0.13em; }
.complete-panel h4 { margin: 0.3rem 0 0; font-size: 1.25rem; }
.complete-panel > p { max-width: 39rem; margin: 0.5rem auto 1rem; color: var(--text-muted); font-size: 0.75rem; line-height: 1.6; }
.score-board { display: grid; width: min(100%, 34rem); grid-template-columns: repeat(3, 1fr); gap: 0.55rem; }
.score-board > div { border: 1px solid var(--border); border-radius: 0.85rem; background: var(--surface-soft); padding: 0.72rem; }
.score-board span { display: block; color: var(--text-muted); font-size: 0.6rem; }
.score-board strong { display: block; margin-top: 0.15rem; font: 800 1.2rem var(--font-mono); }
.score-board small { margin-left: 0.08rem; font: 700 0.55rem var(--font-body); }
.complete-actions { display: flex; gap: 0.55rem; margin-top: 1rem; }

.session-gallery { border-top: 1px solid var(--border); padding: 1.1rem 1.35rem 1.3rem; }
.gallery-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 0.75rem; }
.gallery-heading span { color: var(--fresh-blue-strong); font: 900 0.56rem var(--font-mono); letter-spacing: 0.12em; }
.gallery-heading h4 { margin: 0.15rem 0 0; font-size: 0.88rem; }
.gallery-heading > small { color: var(--text-muted); font-size: 0.6rem; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr)); gap: 0.6rem; }
.gallery-grid figure { min-width: 0; margin: 0; border: 1px solid var(--border); border-radius: 0.85rem; background: var(--surface-soft); padding: 0.42rem; }
.gallery-image { display: grid; aspect-ratio: 4 / 3; place-items: center; overflow: hidden; border-radius: 0.55rem; background: white; }
.gallery-image img { width: 100%; height: 100%; object-fit: contain; }
.gallery-grid figcaption { display: flex; align-items: center; justify-content: space-between; gap: 0.3rem; padding: 0.4rem 0.1rem 0.03rem; }
.gallery-grid figcaption strong { font-size: 0.68rem; }
.gallery-grid figcaption span { color: var(--text-muted); font-size: 0.55rem; white-space: nowrap; }

@keyframes timer-pulse { to { transform: scale(1.025); } }

@media (max-width: 760px) {
  .demo-header { display: grid; padding: 1rem; }
  .demo-notice { min-width: 0; }
  .round-bar { padding-inline: 1rem; }
  .step-panel { margin-inline: 1rem; padding: 0.85rem; }
  .responsibility-grid { grid-template-columns: 1fr; }
  .drawing-layout { grid-template-columns: 1fr; }
  .drawing-canvas { height: 14rem; }
  .step-controls { grid-template-columns: 1fr 1fr; padding-inline: 1rem; }
  .step-controls p { grid-column: 1 / -1; grid-row: 1; }
  .step-controls button { width: 100%; }
  .session-gallery { padding-inline: 1rem; }
  .gallery-heading { align-items: flex-start; flex-direction: column; gap: 0.25rem; }
}

@media (max-width: 430px) {
  .step-navigation ol { min-width: 34rem; padding-inline: 0.75rem; }
  .round-bar { align-items: flex-start; }
  .round-bar > div { display: grid; gap: 0.15rem; }
  .drawing-canvas { height: 12rem; }
  .drawing-tools { grid-template-columns: 1fr; }
  .timer { width: 100%; }
  .tool-actions { display: grid; grid-column: auto; }
  .reward-grid,
  .score-board { gap: 0.35rem; }
  .reward-grid > div,
  .score-board > div { padding-inline: 0.25rem; }
  .complete-actions { display: grid; width: 100%; }
  .gallery-grid figcaption { align-items: flex-start; flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  .timer.urgent { animation: none; }
  .primary-button,
  .secondary-button { transition: none; }
}
</style>
