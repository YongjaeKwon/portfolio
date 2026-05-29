<template>
  <canvas ref="canvas" class="block h-full w-full" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * 시그니처 모티프 — 실시간 시세 라인 차트.
 * "거래소·실시간 데이터 대시보드 프론트엔드" 포지셔닝의 시각적 표현.
 * - rAF로 우→좌 흐르는 라인 + area fill
 * - 뷰포트 밖 / 탭 비활성 / reduced-motion 시 애니메이션 정지 (CPU 절약)
 */
const canvas = ref<HTMLCanvasElement | null>(null);
let raf = 0;
let ro: ResizeObserver | null = null;
let io: IntersectionObserver | null = null;
let running = false;
let onVisibility: (() => void) | null = null;

onMounted(() => {
  const cv = canvas.value;
  if (!cv) return;
  const ctx = cv.getContext("2d");
  if (!ctx) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cssW = 0;
  let cssH = 0;
  let dpr = 1;

  const POINTS = 64;
  const data: number[] = [];
  let v = 0.5;
  for (let i = 0; i < POINTS; i++) {
    v = Math.max(0.15, Math.min(0.85, v + (Math.random() - 0.5) * 0.12));
    data.push(v);
  }

  const hexA = (hex: string, a: number) => {
    const m = hex.replace("#", "");
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // CSS 크기가 바뀌었으면 버퍼 재설정 (초기 레이아웃 타이밍 문제 자가 치유)
  const ensureSize = () => {
    const rect = cv.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (Math.round(rect.width) !== Math.round(cssW) || Math.round(rect.height) !== Math.round(cssH)) {
      cssW = rect.width;
      cssH = rect.height;
      cv.width = Math.max(1, Math.floor(cssW * dpr));
      cv.height = Math.max(1, Math.floor(cssH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  };

  const draw = () => {
    ensureSize();
    const w = cssW;
    const h = cssH;
    if (w < 2 || h < 2) return;

    const accent =
      getComputedStyle(cv).getPropertyValue("--accent").trim() || "#2dd4bf";
    ctx.clearRect(0, 0, w, h);

    const pad = 8;
    const stepX = (w - pad * 2) / (data.length - 1);
    const y = (val: number) => pad + (1 - val) * (h - pad * 2);

    const trace = () => {
      ctx.beginPath();
      ctx.moveTo(pad, y(data[0]));
      for (let i = 1; i < data.length; i++) {
        const x0 = pad + (i - 1) * stepX;
        const x1 = pad + i * stepX;
        const cx = (x0 + x1) / 2;
        ctx.bezierCurveTo(cx, y(data[i - 1]), cx, y(data[i]), x1, y(data[i]));
      }
    };

    // area
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, hexA(accent, 0.22));
    grad.addColorStop(1, hexA(accent, 0));
    ctx.save();
    trace();
    ctx.lineTo(w - pad, h);
    ctx.lineTo(pad, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // line
    trace();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = "round";
    ctx.stroke();

    // leading dot
    const lastX = pad + (data.length - 1) * stepX;
    const lastY = y(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lastX, lastY, 7, 0, Math.PI * 2);
    ctx.fillStyle = hexA(accent, 0.2);
    ctx.fill();
  };

  let frame = 0;
  const tick = () => {
    if (!running) return;
    frame++;
    if (frame % 9 === 0) {
      const nv = Math.max(
        0.15,
        Math.min(0.85, data[data.length - 1] + (Math.random() - 0.5) * 0.14)
      );
      data.push(nv);
      data.shift();
    }
    draw();
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running || reduced) return;
    running = true;
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  ro = new ResizeObserver(() => draw());
  ro.observe(cv);

  // 뷰포트 진입 시에만 애니메이션
  io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) start();
      else stop();
    },
    { threshold: 0 }
  );
  io.observe(cv);

  // 탭 비활성 시 정지
  onVisibility = () => {
    if (document.hidden) stop();
    else if (!reduced) start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  // 초기 1프레임 (reduced 포함) — 레이아웃 후 그리기
  requestAnimationFrame(() => requestAnimationFrame(draw));
});

onBeforeUnmount(() => {
  running = false;
  cancelAnimationFrame(raf);
  ro?.disconnect();
  io?.disconnect();
  if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
});
</script>
