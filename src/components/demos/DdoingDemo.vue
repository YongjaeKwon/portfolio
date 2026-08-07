<template>
  <section ref="demoRoot" class="ddoing-demo" aria-labelledby="ddoing-demo-title">
    <header class="demo-header">
      <div>
        <div class="badge-row">
          <span class="sample-badge">샘플 데이터 데모</span>
          <span class="round-badge">3단어 드로잉</span>
        </div>
        <h3 id="ddoing-demo-title">제한 시간 안에 단어를 그려보세요</h3>
        <p>Canvas와 타이머로 구성한 ddoing의 드로잉 흐름을 가볍게 체험할 수 있습니다.</p>
      </div>
      <div class="demo-notice" role="note">
        <span aria-hidden="true">i</span>
        <strong>AI 모델을 호출하지 않는 데모 판정</strong>
        <small>그린 면적과 획 수만으로 점수를 계산합니다.</small>
      </div>
    </header>

    <div v-if="phase === 'intro'" class="intro-panel">
      <div class="intro-words" aria-label="출제 단어">
        <span v-for="(item, index) in words" :key="item.word">
          <b>{{ index + 1 }}</b>{{ item.word }}
        </span>
      </div>
      <p>단어마다 {{ roundSeconds }}초가 주어집니다. 첫 선을 그리거나 샘플 그림을 누르면 시간이 시작됩니다.</p>
      <button type="button" class="primary-button" @click="startSession">
        드로잉 시작
        <span aria-hidden="true">→</span>
      </button>
    </div>

    <template v-else-if="phase !== 'complete'">
      <div class="round-status">
        <div class="round-copy">
          <span>ROUND {{ currentIndex + 1 }} / {{ words.length }}</span>
          <strong>{{ currentWord.word }}</strong>
          <small>{{ currentWord.hint }}</small>
        </div>
        <div class="timer" :class="{ urgent: secondsLeft <= 4 && phase === 'drawing' }" aria-live="polite">
          <span>{{ timerStarted ? "남은 시간" : "그리면 시작" }}</span>
          <strong>{{ secondsLeft }}<small>초</small></strong>
        </div>
      </div>

      <div class="progress-track" aria-hidden="true">
        <span :style="{ width: `${((currentIndex + 1) / words.length) * 100}%` }"></span>
      </div>

      <div class="canvas-shell" :class="{ locked: phase === 'result' }">
        <canvas
          ref="drawingCanvas"
          class="drawing-canvas"
          :aria-label="`${currentWord.word}을 그리는 캔버스`"
          :aria-describedby="phase === 'drawing' ? 'canvas-instructions' : undefined"
          @pointerdown="startDrawing"
          @pointermove="draw"
          @pointerup="stopDrawing"
          @pointercancel="stopDrawing"
          @pointerleave="stopDrawing"
        ></canvas>
        <div v-if="phase === 'drawing' && strokeCount === 0" class="canvas-placeholder" aria-hidden="true">
          <span>✎</span>
          <p>{{ currentWord.word }}을 자유롭게 그려보세요</p>
        </div>
        <span class="canvas-corner top-left" aria-hidden="true"></span>
        <span class="canvas-corner bottom-right" aria-hidden="true"></span>
      </div>
      <p id="canvas-instructions" class="sr-instructions">
        마우스 또는 터치로 캔버스에 그림을 그릴 수 있습니다. 직접 그리기 어렵다면 샘플 그림 그리기 버튼으로도 진행할 수 있습니다.
      </p>

      <div v-if="phase === 'drawing'" class="canvas-actions">
        <div class="stroke-status" aria-live="polite">
          <span aria-hidden="true"></span>
          {{ strokeCount ? `${strokeCount}개 획을 그렸어요` : "아직 그린 선이 없어요" }}
        </div>
        <div class="action-buttons">
          <button type="button" class="secondary-button" @click="drawSampleShape">
            샘플 그림 그리기
          </button>
          <button type="button" class="secondary-button" :disabled="strokeCount === 0" @click="clearCanvas">
            모두 지우기
          </button>
          <button type="button" class="primary-button compact" :disabled="strokeCount === 0" @click="submitDrawing(false)">
            그림 제출
          </button>
        </div>
      </div>

      <div v-else-if="pendingResult" class="result-panel" aria-live="assertive">
        <div class="result-score" :class="{ accepted: pendingResult.accepted }">
          <span>{{ pendingResult.accepted ? "DEMO CORRECT" : "TRY AGAIN" }}</span>
          <strong>{{ pendingResult.score }}<small>점</small></strong>
        </div>
        <div class="result-copy">
          <strong>{{ pendingResult.accepted ? "정답! 충분히 그렸어요" : "조금 더 그려볼까요?" }}</strong>
          <p>
            {{
              pendingResult.accepted
                ? "그림의 면적과 획 수가 데모 기준을 넘었습니다."
                : "선이나 형태를 조금 더 추가하면 점수가 올라갑니다."
            }}
          </p>
        </div>
        <div class="result-actions">
          <button v-if="!pendingResult.accepted" type="button" class="secondary-button" @click="retryRound">
            다시 그리기
          </button>
          <button type="button" class="primary-button compact" @click="advanceRound">
            {{ isLastWord ? "결과 보기" : "다음 단어" }}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </template>

    <div v-else class="complete-panel" aria-live="polite">
      <div class="complete-mark" aria-hidden="true">✓</div>
      <span>SESSION COMPLETE</span>
      <h4>세 단어를 모두 그렸습니다</h4>
      <p>실제 프로젝트에서는 이 단계에서 Canvas 이미지를 학습된 모델의 추론 API로 전달했습니다.</p>
      <div class="score-board">
        <div>
          <span>평균 데모 점수</span>
          <strong>{{ finalAverage }}<small>점</small></strong>
        </div>
        <div>
          <span>데모 정답</span>
          <strong>{{ acceptedCount }}<small>/ {{ words.length }}</small></strong>
        </div>
        <div>
          <span>전체 획 수</span>
          <strong>{{ totalStrokes }}<small>회</small></strong>
        </div>
      </div>
      <button type="button" class="primary-button" @click="startSession">
        다시 시작
        <span aria-hidden="true">↻</span>
      </button>
    </div>

    <section v-if="gallery.length" class="session-gallery" aria-labelledby="gallery-title">
      <div class="gallery-heading">
        <div>
          <span>SESSION GALLERY</span>
          <h4 id="gallery-title">이번 세션에서 제출한 그림</h4>
        </div>
        <small>이미지는 브라우저 메모리에만 보관됩니다.</small>
      </div>
      <div class="gallery-grid">
        <figure v-for="item in gallery" :key="item.id">
          <div class="gallery-image">
            <img :src="item.dataUrl" :alt="item.alt" />
          </div>
          <figcaption>
            <strong>{{ item.word }}</strong>
            <span>{{ item.score }}점 · {{ item.strokeCount }}획</span>
          </figcaption>
        </figure>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

type DemoPhase = "intro" | "drawing" | "result" | "complete";

interface DrawingResult {
  word: string;
  score: number;
  accepted: boolean;
  strokeCount: number;
}

interface GalleryItem extends DrawingResult {
  id: number;
  dataUrl: string;
  alt: string;
}

const ROUND_SECONDS = 12;
const ACCEPTANCE_SCORE = 42;

const words = [
  { word: "사과", hint: "둥근 모양과 꼭지를 떠올려 보세요." },
  { word: "우산", hint: "넓은 지붕과 손잡이를 그려보세요." },
  { word: "고양이", hint: "뾰족한 귀와 수염이 힌트입니다." },
] as const;

const demoRoot = ref<HTMLElement | null>(null);
const drawingCanvas = ref<HTMLCanvasElement | null>(null);
const phase = ref<DemoPhase>("intro");
const currentIndex = ref(0);
const secondsLeft = ref(ROUND_SECONDS);
const strokeCount = ref(0);
const isDrawing = ref(false);
const timerStarted = ref(false);
const pendingResult = ref<DrawingResult | null>(null);
const results = ref<DrawingResult[]>([]);
const gallery = ref<GalleryItem[]>([]);

let timerId: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let deviceScale = 1;
let gallerySequence = 0;

const roundSeconds = ROUND_SECONDS;
const currentWord = computed(() => words[currentIndex.value] ?? words[0]);
const isLastWord = computed(() => currentIndex.value === words.length - 1);
const finalAverage = computed(() => {
  if (!results.value.length) return 0;
  return Math.round(results.value.reduce((sum, item) => sum + item.score, 0) / results.value.length);
});
const acceptedCount = computed(() => results.value.filter((item) => item.accepted).length);
const totalStrokes = computed(() => results.value.reduce((sum, item) => sum + item.strokeCount, 0));

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

function resizeCanvas(preserve = true): void {
  const canvas = drawingCanvas.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;

  const previous = document.createElement("canvas");
  const hadDrawing = preserve && canvas.width > 0 && canvas.height > 0;
  if (hadDrawing) {
    previous.width = canvas.width;
    previous.height = canvas.height;
    previous.getContext("2d")?.drawImage(canvas, 0, 0);
  }

  deviceScale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * deviceScale));
  canvas.height = Math.max(1, Math.round(rect.height * deviceScale));

  const context = getContext();
  if (!context) return;
  configureContext(context);

  if (hadDrawing) {
    context.drawImage(
      previous,
      0,
      0,
      previous.width,
      previous.height,
      0,
      0,
      rect.width,
      rect.height,
    );
  }
}

function clearTimer(): void {
  if (timerId === null) return;
  window.clearInterval(timerId);
  timerId = null;
}

function startTimer(): void {
  if (timerStarted.value) return;
  clearTimer();
  secondsLeft.value = ROUND_SECONDS;
  timerStarted.value = true;
  timerId = window.setInterval(() => {
    secondsLeft.value = Math.max(0, secondsLeft.value - 1);
    if (secondsLeft.value === 0) submitDrawing(true);
  }, 1000);
}

async function beginRound(): Promise<void> {
  phase.value = "drawing";
  pendingResult.value = null;
  strokeCount.value = 0;
  isDrawing.value = false;
  timerStarted.value = false;
  secondsLeft.value = ROUND_SECONDS;
  await nextTick();
  resizeCanvas(false);
  clearCanvas();
}

async function startSession(): Promise<void> {
  clearTimer();
  currentIndex.value = 0;
  results.value = [];
  gallery.value = [];
  gallerySequence = 0;
  await beginRound();
}

function clearCanvas(): void {
  const canvas = drawingCanvas.value;
  const context = getContext();
  if (!canvas || !context) return;

  context.clearRect(0, 0, canvas.width / deviceScale, canvas.height / deviceScale);
  strokeCount.value = 0;
  isDrawing.value = false;
}

function drawSampleShape(): void {
  if (phase.value !== "drawing") return;
  const canvas = drawingCanvas.value;
  const context = getContext();
  if (!canvas || !context) return;

  startTimer();
  clearCanvas();
  const width = canvas.width / deviceScale;
  const height = canvas.height / deviceScale;
  const centerX = width / 2;
  const centerY = height / 2 + 8;
  const radiusX = Math.min(width * 0.22, 92);
  const radiusY = Math.min(height * 0.3, 78);
  let sampleStrokes = 0;

  context.save();
  context.lineWidth = 8;
  const strokePath = (drawPath: () => void) => {
    context.beginPath();
    drawPath();
    context.stroke();
    sampleStrokes += 1;
  };

  if (currentWord.value.word === "우산") {
    const canopyHalf = Math.min(width * 0.3, 120);
    const canopyY = centerY - 12;
    strokePath(() => {
      context.moveTo(centerX - canopyHalf, canopyY);
      context.quadraticCurveTo(centerX, canopyY - 120, centerX + canopyHalf, canopyY);
      context.quadraticCurveTo(centerX + canopyHalf * 0.68, canopyY - 10, centerX + canopyHalf * 0.35, canopyY);
      context.quadraticCurveTo(centerX, canopyY - 12, centerX - canopyHalf * 0.35, canopyY);
      context.quadraticCurveTo(centerX - canopyHalf * 0.68, canopyY - 10, centerX - canopyHalf, canopyY);
    });
    strokePath(() => {
      context.moveTo(centerX, canopyY - 74);
      context.lineTo(centerX, centerY + 72);
      context.quadraticCurveTo(centerX, centerY + 98, centerX + 28, centerY + 92);
    });
    strokePath(() => {
      context.moveTo(centerX, canopyY - 72);
      context.lineTo(centerX - canopyHalf * 0.35, canopyY);
    });
    strokePath(() => {
      context.moveTo(centerX, canopyY - 72);
      context.lineTo(centerX + canopyHalf * 0.35, canopyY);
    });
  } else if (currentWord.value.word === "고양이") {
    const faceRadius = Math.min(width * 0.2, height * 0.28, 78);
    strokePath(() => context.arc(centerX, centerY, faceRadius, 0, Math.PI * 2));
    strokePath(() => {
      context.moveTo(centerX - faceRadius * 0.72, centerY - faceRadius * 0.62);
      context.lineTo(centerX - faceRadius * 0.52, centerY - faceRadius * 1.2);
      context.lineTo(centerX - faceRadius * 0.12, centerY - faceRadius * 0.92);
    });
    strokePath(() => {
      context.moveTo(centerX + faceRadius * 0.12, centerY - faceRadius * 0.92);
      context.lineTo(centerX + faceRadius * 0.52, centerY - faceRadius * 1.2);
      context.lineTo(centerX + faceRadius * 0.72, centerY - faceRadius * 0.62);
    });
    strokePath(() => {
      context.arc(centerX - faceRadius * 0.34, centerY - faceRadius * 0.16, 5, 0, Math.PI * 2);
      context.moveTo(centerX + faceRadius * 0.34 + 5, centerY - faceRadius * 0.16);
      context.arc(centerX + faceRadius * 0.34, centerY - faceRadius * 0.16, 5, 0, Math.PI * 2);
    });
    strokePath(() => {
      context.moveTo(centerX, centerY + 4);
      context.lineTo(centerX - 8, centerY + 14);
      context.lineTo(centerX + 8, centerY + 14);
      context.closePath();
      context.moveTo(centerX, centerY + 14);
      context.quadraticCurveTo(centerX - 10, centerY + 30, centerX - 22, centerY + 25);
      context.moveTo(centerX, centerY + 14);
      context.quadraticCurveTo(centerX + 10, centerY + 30, centerX + 22, centerY + 25);
    });
    strokePath(() => {
      [-14, 4, 22].forEach((offset) => {
        context.moveTo(centerX - 18, centerY + offset);
        context.lineTo(centerX - faceRadius - 34, centerY + offset - 5);
        context.moveTo(centerX + 18, centerY + offset);
        context.lineTo(centerX + faceRadius + 34, centerY + offset - 5);
      });
    });
  } else {
    strokePath(() => context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2));
    strokePath(() => {
      context.moveTo(centerX, centerY - radiusY);
      context.quadraticCurveTo(centerX + 4, centerY - radiusY - 24, centerX + 14, centerY - radiusY - 30);
    });
    strokePath(() => context.ellipse(centerX + 30, centerY - radiusY - 20, 25, 11, -0.45, 0, Math.PI * 2));
    strokePath(() => context.arc(centerX - radiusX * 0.35, centerY - radiusY * 0.15, 5, 0, Math.PI * 2));
  }
  context.restore();
  configureContext(context);
  strokeCount.value = sampleStrokes;
}

function canvasPoint(event: PointerEvent): { x: number; y: number } {
  const canvas = drawingCanvas.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function startDrawing(event: PointerEvent): void {
  if (phase.value !== "drawing") return;
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
}

function draw(event: PointerEvent): void {
  if (!isDrawing.value || phase.value !== "drawing") return;
  event.preventDefault();

  const context = getContext();
  if (!context) return;
  const point = canvasPoint(event);
  context.lineTo(point.x, point.y);
  context.stroke();
}

function stopDrawing(event: PointerEvent): void {
  if (!isDrawing.value) return;
  event.preventDefault();

  const canvas = drawingCanvas.value;
  const context = getContext();
  context?.closePath();
  isDrawing.value = false;
  strokeCount.value += 1;

  if (canvas?.hasPointerCapture?.(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
}

function calculateDemoScore(): number {
  const canvas = drawingCanvas.value;
  const context = getContext();
  if (!canvas || !context || strokeCount.value === 0) return 0;

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const step = Math.max(1, Math.round(deviceScale * 2));
  let sampled = 0;
  let painted = 0;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      sampled += 1;
      const alphaIndex = (y * canvas.width + x) * 4 + 3;
      if ((pixels[alphaIndex] ?? 0) > 18) painted += 1;
    }
  }

  const coverage = sampled ? painted / sampled : 0;
  const coverageScore = Math.min(72, Math.round(coverage * 1800));
  const strokeScore = Math.min(28, strokeCount.value * 7);
  return Math.min(100, coverageScore + strokeScore);
}

function submitDrawing(fromTimeout: boolean): void {
  if (phase.value !== "drawing") return;
  if (!fromTimeout && strokeCount.value === 0) return;

  clearTimer();
  if (isDrawing.value) {
    getContext()?.closePath();
    isDrawing.value = false;
    strokeCount.value += 1;
  }
  const score = calculateDemoScore();
  const result: DrawingResult = {
    word: currentWord.value.word,
    score,
    accepted: score >= ACCEPTANCE_SCORE,
    strokeCount: strokeCount.value,
  };

  pendingResult.value = result;
  phase.value = "result";

  const canvas = drawingCanvas.value;
  if (canvas && strokeCount.value > 0) {
    const attempt = gallery.value.filter((item) => item.word === result.word).length + 1;
    gallery.value.push({
      ...result,
      id: ++gallerySequence,
      dataUrl: canvas.toDataURL("image/png"),
      alt: `${result.word} 그리기 ${attempt}번째 제출 이미지, 데모 점수 ${score}점`,
    });
  }
}

async function retryRound(): Promise<void> {
  await beginRound();
}

async function advanceRound(): Promise<void> {
  if (!pendingResult.value) return;
  results.value.push(pendingResult.value);

  if (isLastWord.value) {
    clearTimer();
    phase.value = "complete";
    return;
  }

  currentIndex.value += 1;
  await beginRound();
}

onMounted(() => {
  if (typeof ResizeObserver === "undefined" || !demoRoot.value) return;
  resizeObserver = new ResizeObserver(() => {
    if (phase.value === "drawing" || phase.value === "result") resizeCanvas(true);
  });
  resizeObserver.observe(demoRoot.value);
});

onBeforeUnmount(() => {
  clearTimer();
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<style scoped>
.ddoing-demo {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  background:
    radial-gradient(circle at 92% 4%, rgba(83, 199, 245, 0.13), transparent 28%),
    var(--surface-strong);
  color: var(--text-primary);
}

.demo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.35rem;
  border-bottom: 1px solid var(--border);
}

.badge-row { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-bottom: 0.75rem; }
.sample-badge,
.round-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.34rem 0.64rem;
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.04em;
}
.sample-badge { background: var(--fresh-blue-soft); color: var(--fresh-blue-strong); }
.round-badge { border: 1px solid var(--border); color: var(--text-muted); }

.demo-header h3 { margin: 0; font-size: clamp(1.05rem, 2.3vw, 1.35rem); letter-spacing: -0.035em; }
.demo-header p { max-width: 35rem; margin: 0.45rem 0 0; color: var(--text-muted); font-size: 0.82rem; line-height: 1.65; }
.demo-notice {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.55rem;
  min-width: 15.5rem;
  border: 1px solid rgba(49, 130, 246, 0.16);
  border-radius: 1rem;
  background: rgba(49, 130, 246, 0.055);
  padding: 0.8rem;
}
.demo-notice > span {
  display: grid;
  grid-row: 1 / 3;
  width: 1.45rem;
  height: 1.45rem;
  place-items: center;
  border-radius: 50%;
  background: var(--fresh-blue);
  color: white;
  font-size: 0.72rem;
  font-weight: 900;
}
.demo-notice strong { font-size: 0.72rem; }
.demo-notice small { margin-top: 0.17rem; color: var(--text-muted); font-size: 0.65rem; line-height: 1.45; }

.intro-panel,
.complete-panel { display: grid; justify-items: center; padding: 2.25rem 1.35rem; text-align: center; }
.intro-words { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.7rem; }
.intro-words span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.72);
  padding: 0.68rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 850;
  box-shadow: var(--elev-1);
}
.intro-words b { color: var(--fresh-blue-strong); font-family: var(--font-mono); font-size: 0.65rem; }
.intro-panel > p { max-width: 34rem; margin: 1rem auto 1.25rem; color: var(--text-muted); font-size: 0.8rem; line-height: 1.65; }

.primary-button,
.secondary-button {
  display: inline-flex;
  min-height: 2.55rem;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-radius: 999px;
  padding: 0.7rem 1.15rem;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 850;
  transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}
.primary-button { border: 0; background: var(--accent-gradient); color: white; box-shadow: 0 10px 24px rgba(49, 130, 246, 0.2); }
.secondary-button { border: 1px solid var(--border); background: var(--surface-strong); color: var(--text-secondary); }
.primary-button.compact { padding-inline: 1rem; }
.primary-button:hover:not(:disabled),
.secondary-button:hover:not(:disabled) { transform: translateY(-1px); }
.primary-button:focus-visible,
.secondary-button:focus-visible { outline: 3px solid rgba(49, 130, 246, 0.3); outline-offset: 2px; }
.primary-button:disabled,
.secondary-button:disabled { cursor: not-allowed; opacity: 0.42; box-shadow: none; }

.round-status { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.15rem 1.35rem 0.9rem; }
.round-copy { display: grid; gap: 0.15rem; }
.round-copy > span { color: var(--fresh-blue-strong); font-family: var(--font-mono); font-size: 0.62rem; font-weight: 900; letter-spacing: 0.12em; }
.round-copy > strong { font-size: 1.4rem; letter-spacing: -0.035em; }
.round-copy > small { color: var(--text-muted); font-size: 0.72rem; }
.timer { min-width: 5.5rem; border: 1px solid var(--border); border-radius: 1rem; background: var(--surface-soft); padding: 0.65rem 0.8rem; text-align: center; }
.timer > span { display: block; color: var(--text-muted); font-size: 0.6rem; font-weight: 800; }
.timer > strong { color: var(--fresh-blue-strong); font-family: var(--font-mono); font-size: 1.4rem; line-height: 1.15; }
.timer strong small { margin-left: 0.12rem; font-family: var(--font-body); font-size: 0.62rem; }
.timer.urgent { border-color: rgba(239, 68, 68, 0.25); background: rgba(239, 68, 68, 0.06); animation: timer-pulse 800ms ease-in-out infinite alternate; }
.timer.urgent > strong { color: #dc2626; }

.progress-track { height: 3px; margin: 0 1.35rem 0.9rem; overflow: hidden; border-radius: 999px; background: var(--surface-soft); }
.progress-track span { display: block; height: 100%; border-radius: inherit; background: var(--accent-gradient); transition: width 220ms ease; }

.canvas-shell {
  position: relative;
  margin: 0 1.35rem;
  overflow: hidden;
  border: 1px solid var(--border-strong);
  border-radius: 1.1rem;
  background:
    linear-gradient(rgba(49, 130, 246, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(49, 130, 246, 0.035) 1px, transparent 1px),
    #fff;
  background-size: 22px 22px;
  box-shadow: inset 0 0 0 4px rgba(255, 255, 255, 0.7);
}
.drawing-canvas { display: block; width: 100%; height: clamp(14rem, 34vw, 19rem); cursor: crosshair; touch-action: none; }
.canvas-shell.locked .drawing-canvas { cursor: default; pointer-events: none; }
.canvas-placeholder { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; color: rgba(49, 65, 88, 0.42); pointer-events: none; }
.canvas-placeholder span { font-size: 1.8rem; }
.canvas-placeholder p { margin: 0.35rem 0 0; font-size: 0.75rem; font-weight: 750; }
.canvas-corner { position: absolute; width: 1.1rem; height: 1.1rem; pointer-events: none; }
.canvas-corner.top-left { top: 0.7rem; left: 0.7rem; border-top: 2px solid var(--fresh-blue); border-left: 2px solid var(--fresh-blue); }
.canvas-corner.bottom-right { right: 0.7rem; bottom: 0.7rem; border-right: 2px solid var(--fresh-blue); border-bottom: 2px solid var(--fresh-blue); }
.sr-instructions { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.canvas-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.9rem 1.35rem 1.3rem; }
.stroke-status { display: flex; align-items: center; gap: 0.45rem; color: var(--text-muted); font-size: 0.7rem; font-weight: 700; }
.stroke-status span { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--fresh-blue); box-shadow: 0 0 0 4px var(--fresh-blue-soft); }
.action-buttons { display: flex; gap: 0.55rem; }

.result-panel { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 1rem; margin: 0.9rem 1.35rem 1.35rem; border: 1px solid var(--border); border-radius: 1.1rem; background: var(--surface-soft); padding: 0.9rem; }
.result-score { min-width: 5rem; border-radius: 0.85rem; background: rgba(245, 158, 11, 0.1); padding: 0.65rem; text-align: center; }
.result-score.accepted { background: rgba(16, 185, 129, 0.1); }
.result-score > span { display: block; color: #b45309; font-family: var(--font-mono); font-size: 0.5rem; font-weight: 900; letter-spacing: 0.08em; }
.result-score.accepted > span { color: #047857; }
.result-score > strong { font-family: var(--font-mono); font-size: 1.25rem; }
.result-score strong small { margin-left: 0.08rem; font-family: var(--font-body); font-size: 0.58rem; }
.result-copy > strong { font-size: 0.88rem; }
.result-copy > p { margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.7rem; line-height: 1.5; }
.result-actions { display: flex; gap: 0.5rem; }

.complete-mark { display: grid; width: 3.25rem; height: 3.25rem; place-items: center; border-radius: 50%; background: rgba(16, 185, 129, 0.12); color: #059669; font-size: 1.4rem; font-weight: 950; }
.complete-panel > span { margin-top: 0.7rem; color: var(--fresh-blue-strong); font-family: var(--font-mono); font-size: 0.6rem; font-weight: 900; letter-spacing: 0.15em; }
.complete-panel h4 { margin: 0.3rem 0 0; font-size: 1.3rem; }
.complete-panel > p { max-width: 36rem; margin: 0.55rem auto 1rem; color: var(--text-muted); font-size: 0.76rem; line-height: 1.6; }
.score-board { display: grid; width: min(100%, 34rem); grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-bottom: 1.15rem; }
.score-board > div { border: 1px solid var(--border); border-radius: 0.9rem; background: var(--surface-soft); padding: 0.75rem; }
.score-board span { display: block; color: var(--text-muted); font-size: 0.62rem; font-weight: 750; }
.score-board strong { display: block; margin-top: 0.15rem; font-family: var(--font-mono); font-size: 1.25rem; }
.score-board strong small { margin-left: 0.1rem; color: var(--text-muted); font-family: var(--font-body); font-size: 0.6rem; }

.session-gallery { border-top: 1px solid var(--border); padding: 1.15rem 1.35rem 1.35rem; }
.gallery-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 0.8rem; }
.gallery-heading span { color: var(--fresh-blue-strong); font-family: var(--font-mono); font-size: 0.58rem; font-weight: 900; letter-spacing: 0.13em; }
.gallery-heading h4 { margin: 0.18rem 0 0; font-size: 0.9rem; }
.gallery-heading > small { color: var(--text-muted); font-size: 0.62rem; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(7.4rem, 1fr)); gap: 0.65rem; }
.gallery-grid figure { min-width: 0; margin: 0; border: 1px solid var(--border); border-radius: 0.9rem; background: var(--surface-soft); padding: 0.45rem; }
.gallery-image { display: grid; aspect-ratio: 4 / 3; place-items: center; overflow: hidden; border-radius: 0.6rem; background: #fff; }
.gallery-image img { width: 100%; height: 100%; object-fit: contain; }
.gallery-grid figcaption { display: flex; align-items: center; justify-content: space-between; gap: 0.35rem; padding: 0.45rem 0.15rem 0.05rem; }
.gallery-grid figcaption strong { font-size: 0.7rem; }
.gallery-grid figcaption span { color: var(--text-muted); font-size: 0.58rem; white-space: nowrap; }

@keyframes timer-pulse { to { transform: scale(1.025); } }

@media (max-width: 700px) {
  .demo-header { display: grid; padding: 1rem; }
  .demo-notice { min-width: 0; }
  .round-status { padding: 1rem 1rem 0.8rem; }
  .progress-track { margin-inline: 1rem; }
  .canvas-shell { margin-inline: 1rem; }
  .drawing-canvas { height: 15rem; }
  .canvas-actions { align-items: stretch; flex-direction: column; padding: 0.85rem 1rem 1rem; }
  .action-buttons { display: grid; grid-template-columns: 1fr 1fr; }
  .action-buttons .secondary-button:first-child { grid-column: 1 / -1; }
  .result-panel { grid-template-columns: auto 1fr; margin: 0.8rem 1rem 1rem; }
  .result-actions { grid-column: 1 / -1; justify-content: flex-end; }
  .session-gallery { padding: 1rem; }
  .gallery-heading { align-items: flex-start; flex-direction: column; gap: 0.3rem; }
}

@media (max-width: 430px) {
  .round-copy > small { max-width: 12rem; }
  .timer { min-width: 4.8rem; }
  .drawing-canvas { height: 13rem; }
  .result-panel { grid-template-columns: 1fr; text-align: center; }
  .result-score { justify-self: center; }
  .result-actions { grid-column: auto; display: grid; width: 100%; }
  .score-board { gap: 0.4rem; }
  .score-board > div { padding: 0.6rem 0.35rem; }
  .score-board span { min-height: 1.8rem; }
}

@media (prefers-reduced-motion: reduce) {
  .timer.urgent { animation: none; }
  .primary-button,
  .secondary-button,
  .progress-track span { transition: none; }
}
</style>
