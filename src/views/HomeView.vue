<template>
  <section id="hero" class="relative min-h-[100dvh] overflow-hidden pb-20 pt-24">
    <!-- Backdrop: 가장자리로 부드럽게 사라지는 미세 그리드 -->
    <div class="pointer-events-none absolute inset-0">
      <div class="grid-backdrop hero-grid-mask absolute inset-0 opacity-20"></div>
      <!-- 🍁 메이플 모드 전용 구름 (기본 모드에선 CSS로 숨김) -->
      <div class="hero-clouds" aria-hidden="true">
        <span class="cloud" style="top: 12%; animation-duration: 42s">☁️</span>
        <span class="cloud" style="top: 28%; animation-duration: 58s; animation-delay: -22s">⛅</span>
        <span class="cloud" style="top: 6%; animation-duration: 50s; animation-delay: -38s">☁️</span>
      </div>
    </div>

    <div class="section-shell relative z-10 grid min-h-[calc(100dvh-6rem)] items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
      <!-- Left column -->
      <div>
        <!-- 프로필 사진 + (메이플) 캐릭터 레벨 뱃지 — 한 줄, 세로 중앙 정렬 -->
        <div class="hero-enter mb-7 flex items-center gap-5">
          <img
            :src="myPhoto"
            alt="권용재 프로필 사진"
            width="112"
            height="112"
            decoding="async"
            class="hero-photo h-28 w-28 shrink-0 rounded-full object-cover ring-1 ring-white/15 shadow-lg"
          />
          <!-- 🍁 메이플 모드 전용 캐릭터 레벨 뱃지 -->
          <div
            class="maple-lv-badge maple-pixel items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold"
            style="border-color: var(--border-strong); background: var(--surface-soft); color: var(--accent-strong)"
          >
            💻 Lv.{{ mapleLevel }} 개발자
          </div>
          <!-- 🟠 오버워치 모드 전용 역할군 배지 — FLEX = 화면·API·SQL을 두루 소화하는 올라운더 -->
          <div class="ow-role-badge">
            <span class="ow-role-icon" aria-hidden="true">◈</span>
            <span class="ow-role-text">
              <b>FLEX</b>
              <small>화면부터 API·SQL까지 다루는 웹 개발자</small>
            </span>
          </div>
        </div>

        <!-- Neutral badge — no cyan bg -->
        <div class="hero-enter hero-enter-d1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/40">
          <Radar class="h-4 w-4" />
          {{ activeTrackData.badge }}
        </div>

        <!-- Pure white — size and weight IS the statement -->
        <h1 class="hero-enter hero-enter-d2 mt-6 max-w-4xl text-5xl font-black leading-[1.05] text-white md:text-7xl">
          {{ profile.name }}
        </h1>
        <p class="hero-enter hero-enter-d3 font-display mt-4 text-2xl font-semibold text-white/80 md:text-4xl" lang="en">
          {{ displayRole }}<span v-if="showCursor" class="typing-cursor" aria-hidden="true"></span>
        </p>
        <p class="hero-enter hero-enter-d4 text-secondary mt-6 max-w-3xl text-lg leading-8">
          {{ activeTrackData.headline }}
        </p>
        <p class="hero-enter hero-enter-d4 text-muted mt-3 max-w-3xl text-base leading-7">
          {{ activeTrackData.target }}
        </p>

        <div class="hero-enter hero-enter-d5 mt-8 flex flex-wrap gap-3">
          <!-- CTA: the ONE place cyan lives -->
          <button
            type="button"
            class="focus-ring accent-bg inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-black transition hover:brightness-110"
            @click="emit('scroll-to-section', 'projects')"
          >
            프로젝트 구경하기
            <ArrowRight class="h-4 w-4" />
          </button>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition hover:text-[var(--accent-strong)]"
            :href="profile.github"
            target="_blank"
            rel="noreferrer"
          >
            GitHub 코드 보기
            <ExternalLink class="h-4 w-4" />
          </a>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition hover:text-[var(--accent-strong)]"
            :href="`mailto:${profile.email}`"
          >
            이메일로 연락하기
            <Mail class="h-4 w-4" />
          </a>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition hover:text-[var(--accent-strong)]"
            :href="activeTrackData.resume"
            download
          >
            {{ activeTrackData.resumeLabel }}
            <FileDown class="h-4 w-4" />
          </a>
        </div>

        <!-- 기본 모드: 통계 카드 -->
        <div ref="statsEl" class="default-stats hero-enter hero-enter-d6 mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
          <div
            v-for="(stat, idx) in heroStats"
            :key="stat.label"
            class="surface rounded-lg p-4"
          >
            <p class="text-muted font-display text-xs font-medium">{{ stat.label }}</p>
            <p class="font-mono tnum mt-2 text-lg font-bold text-white">
              {{ animatedStats[idx] }}<span class="ml-1 text-sm text-white/40">{{ stat.unit }}</span>
            </p>
          </div>
        </div>

        <!-- 🍁 메이플 모드: HP/MP/EXP 게이지 -->
        <div class="maple-gauges mt-10 max-w-2xl gap-3">
          <div v-for="g in mapleGauges" :key="g.key">
            <div class="mb-1 flex items-center justify-between">
              <span class="text-secondary text-xs font-bold">{{ g.label }}</span>
              <span class="maple-pixel text-muted text-xs">{{ g.value }}</span>
            </div>
            <div class="maple-gauge-track">
              <div :class="['maple-gauge-fill', `maple-gauge-${g.key}`]" :style="{ width: g.pct + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- 🍁 메이플 모드: 개발자 스탯 — 실제 직무 강점을 능력치로 표현 -->
        <p class="maple-label maple-pixel mt-5 -mb-2 max-w-2xl text-xs">📊 능력치 · 직무 강점</p>
        <div class="maple-statblock mt-4 max-w-2xl grid-cols-4 gap-2">
          <div v-for="s in developerStats" :key="s.k" class="surface rounded-lg p-3 text-center">
            <p class="text-primary text-xs font-bold">{{ s.k }}</p>
            <p class="maple-pixel mt-1 text-base font-bold" style="color: var(--accent-strong)">{{ s.v }}</p>
            <p class="text-muted mt-0.5 text-[10px] leading-tight">{{ s.note }}</p>
          </div>
        </div>

        <!-- 🟠 오버워치 모드: 필드 상태 — 체력/방어구/보호막 분절 바 + 궁극기 -->
        <div class="ow-stats mt-10 max-w-2xl">
          <div class="ow-stats-head">
            <span class="ow-stats-title">◤ FIELD STATUS ◢</span>
            <span class="ow-ult"><span class="ow-ult-dot"></span>ULTIMATE <b>READY</b></span>
          </div>
          <p class="ow-stats-legend">전투 능력치는 실제 직무 지표입니다 — 체력(투입 프로젝트)·방어구(실무 경력)·보호막(운영 이슈 대응)</p>
          <div class="mt-3 grid gap-2.5">
            <div v-for="bar in owBars" :key="bar.label">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-secondary text-[11px] font-bold uppercase tracking-wider">{{ bar.label }}</span>
                <span class="font-mono text-muted text-xs">{{ bar.value }}</span>
              </div>
              <div :class="['ow-bar', `ow-bar-${bar.type}`]">
                <span
                  v-for="n in bar.seg"
                  :key="n"
                  :class="['ow-seg', { 'ow-seg-on': n <= bar.filled }]"
                ></span>
              </div>
            </div>
          </div>

          <!-- 어빌리티 HUD: 키바인드 타일 + 쿨다운 + 궁극기 차지 (OW 하단 HUD) -->
          <p class="ow-abilities-cap">⌖ ABILITIES · 보유 기술 (Q 궁극기 = 화면·데이터 정합성)</p>
          <div class="ow-abilities mt-2">
            <div v-for="ability in owAbilities" :key="ability.key" class="ow-ability" :title="ability.name">
              <span class="ow-ability-frame">
                <component :is="ability.icon" class="h-5 w-5" />
              </span>
              <span class="ow-key">{{ ability.key }}</span>
              <span class="ow-ability-name">{{ ability.name }}</span>
            </div>
            <div class="ow-ultimate is-ready" title="궁극기 충전 완료">
              <span class="ow-ult-badge">
                <Zap class="h-5 w-5" />
                <span class="ow-ult-charge">100%</span>
              </span>
              <span class="ow-key ow-key-ult">Q</span>
              <span class="ow-ability-name">{{ owUltimate.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column: 업무 방식 카드 -->
      <div class="surface hero-enter hero-enter-d3 relative rounded-xl p-5">
        <div class="flex items-center justify-between border-b border-white/8 pb-4">
          <div>
            <!-- Neutral kicker — no amber -->
            <p class="section-kicker">업무 방식</p>
            <h2 class="text-primary mt-2 text-xl font-black">{{ activeTrackData.workStyleTitle }}</h2>
          </div>
          <Activity class="h-6 w-6 text-white/25" />
        </div>

        <div class="mt-5 grid gap-3">
          <div
            v-for="(strength, index) in activeTrackData.strengths"
            :key="strength.title"
            class="surface-strong interactive-surface rounded-lg p-4"
          >
            <div class="flex gap-4">
              <!-- Neutral icon box — no cyan bg -->
              <div class="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/8 bg-white/5">
                <component :is="iconMap[strength.icon]" class="h-5 w-5 text-white/50" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-black text-white/25">0{{ index + 1 }}</span>
                  <h3 class="text-primary font-bold">{{ strength.title }}</h3>
                </div>
                <p class="text-muted mt-2 text-sm leading-6">{{ strength.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Amber strip kept as the one personality touch -->
        <div class="mt-5 rounded-lg border border-amber-400/20 bg-amber-400/5 p-4">
          <div class="flex items-center gap-3">
            <MousePointer2 class="h-4 w-4 text-amber-400/60" />
            <p class="text-sm font-semibold text-white/55">
              {{ activeTrackData.workStyleNote }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  Activity,
  ArrowRight,
  Database,
  ExternalLink,
  FileDown,
  Mail,
  MousePointer2,
  MonitorSmartphone,
  PanelTop,
  Radar,
  ShieldCheck,
  Workflow,
  Zap,
} from "@lucide/vue";
import type { Component } from "vue";
import { focusTracks, heroStats, profile } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";
import myPhoto from "@/public/my-photo.png";

const statsEl = ref<HTMLElement | null>(null);
const { activeTrack } = useFocusTrack();
const activeTrackData = computed(
  () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]
);

// 🍁 메이플 캐릭터 정보 — 공개 번들에 생년월일을 넣지 않고 현재 만 나이 레벨만 표시
const mapleLevel = 31;

// 경력 시작(heroStats[1] = "2024.06")에서 현재까지의 개월 수를 EXP로 사용
const [careerStartYear, careerStartMonth] = heroStats[1].value.split(".").map(Number);
const now = new Date();
const careerMonths = Math.max(
  1,
  (now.getFullYear() - careerStartYear) * 12 + (now.getMonth() + 1 - careerStartMonth)
);
// EXP = 시니어(5년차) 목표 대비 누적 경력 진행률 — 항상 채워지고 꾸준히 성장
const SENIOR_GOAL_MONTHS = 60;
const expPct = Math.min(100, Math.round((careerMonths / SENIOR_GOAL_MONTHS) * 100));

// 게이지: HP=투입 시스템, MP=운영 이슈 대응, EXP=시니어까지 경력 진행률
const mapleGauges = [
  { key: "hp", label: `HP · ${heroStats[0].label}`, value: heroStats[0].value + heroStats[0].unit, pct: 100 },
  { key: "mp", label: `MP · ${heroStats[2].label}`, value: heroStats[2].value + heroStats[2].unit, pct: 100 },
  {
    key: "exp",
    label: "EXP · 실무 경력 진행",
    value: `${careerMonths} / ${SENIOR_GOAL_MONTHS}개월`,
    pct: expPct,
  },
];

// Lv.31 기준 총 166 AP로 보수 분배: 화면 구현과 API/SQL 이해를 주력으로 반영
const developerStats = [
  { k: "STR", v: "28", note: "운영 대응·완주력" },
  { k: "DEX", v: "56", note: "화면·API 구현" },
  { k: "INT", v: "48", note: "SQL·흐름 분석" },
  { k: "LUK", v: "34", note: "이슈 재현·정합성" },
];

// 🟠 오버워치 필드 상태 — 체력(흰)/방어구(주황)/보호막(파랑) 분절 바
const owBars = [
  { type: "health", label: `HEALTH · ${heroStats[0].label}`, value: heroStats[0].value + heroStats[0].unit, seg: 8, filled: 8 },
  { type: "armor", label: "ARMOR · 실무 경력", value: heroStats[1].value, seg: 8, filled: 7 },
  { type: "shield", label: `SHIELD · ${heroStats[2].label}`, value: heroStats[2].value + heroStats[2].unit, seg: 8, filled: 6 },
];

// 🟠 오버워치 어빌리티 HUD — 직무 역량을 스킬 슬롯으로 (키바인드 + 궁극기)
const owAbilities = [
  { key: "LSHIFT", name: "화면 구현", icon: MonitorSmartphone },
  { key: "E", name: "API 연동", icon: Workflow },
  { key: "F", name: "SQL 분석", icon: Database },
];
const owUltimate = { key: "Q", name: "정합성 검증" };

const emit = defineEmits<{
  "scroll-to-section": [id: string];
}>();

const iconMap: Record<string, Component> = {
  MonitorSmartphone,
  PanelTop,
  ShieldCheck,
  Workflow,
};

// Typing animation
const displayRole = ref("");
const showCursor = ref(false);
let roleTimer: ReturnType<typeof setInterval> | undefined;
let roleDelay: ReturnType<typeof setTimeout> | undefined;

const startRoleTyping = (target: string, delay = 0) => {
  if (roleTimer) clearInterval(roleTimer);
  if (roleDelay) clearTimeout(roleDelay);
  displayRole.value = "";
  showCursor.value = true;
  roleDelay = setTimeout(() => {
    let i = 0;
    roleTimer = setInterval(() => {
      displayRole.value = target.slice(0, ++i);
      if (i >= target.length && roleTimer) {
        clearInterval(roleTimer);
        roleTimer = undefined;
        setTimeout(() => { showCursor.value = false; }, 2200);
      }
    }, 55);
  }, delay);
};

// ── Stat counters — data-driven from heroStats ──────────────────────────────
// Parses "4" → count, "2+" → count+suffix, "2024.06" → text reveal
type StatAnim =
  | { kind: "count"; max: number; suffix: string }
  | { kind: "text"; final: string };

const statAnims: StatAnim[] = heroStats.map(({ value }) => {
  const m = value.match(/^(\d+)(\+?)$/);
  if (m) return { kind: "count", max: Number(m[1]), suffix: m[2] ?? "" };
  return { kind: "text", final: value };
});

const animatedRaw = ref<(number | string)[]>(
  statAnims.map((s) => (s.kind === "count" ? 0 : "·"))
);

const animatedStats = computed(() =>
  statAnims.map((s, i) =>
    s.kind === "count"
      ? String(animatedRaw.value[i]) + s.suffix
      : String(animatedRaw.value[i])
  )
);

// 카운터 타이머/옵저버 — unmount 시 모두 정리 (누수 방지)
const counterIntervals: ReturnType<typeof setInterval>[] = [];
const counterTimeouts: ReturnType<typeof setTimeout>[] = [];
let statsIO: IntersectionObserver | undefined;

onMounted(() => {
  startRoleTyping(activeTrackData.value.role, 650);

  // Stat counters — 뷰포트 진입 시 1회 재생
  const TARGET_MS = 440;
  const runCounters = () => {
    statAnims.forEach((s, idx) => {
      if (s.kind === "count") {
        const step = Math.max(20, Math.round(TARGET_MS / s.max));
        let c = 0;
        const t = setInterval(() => {
          animatedRaw.value[idx] = ++c;
          if (c >= s.max) clearInterval(t);
        }, step);
        counterIntervals.push(t);
      } else {
        counterTimeouts.push(setTimeout(() => { animatedRaw.value[idx] = s.final; }, 350));
      }
    });
  };

  if (statsEl.value) {
    statsIO = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runCounters();
          statsIO?.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    statsIO.observe(statsEl.value);
  } else {
    counterTimeouts.push(setTimeout(runCounters, 700));
  }
});

watch(
  () => activeTrackData.value.role,
  (role) => startRoleTyping(role)
);

onBeforeUnmount(() => {
  if (roleTimer) clearInterval(roleTimer);
  if (roleDelay) clearTimeout(roleDelay);
  counterIntervals.forEach(clearInterval);
  counterTimeouts.forEach(clearTimeout);
  statsIO?.disconnect();
});
</script>

<style scoped>
/* 그리드가 가장자리로 갈수록 부드럽게 사라지도록 — 딱딱한 전면 그리드 방지 */
.hero-grid-mask {
  -webkit-mask-image: radial-gradient(ellipse 85% 65% at 28% 32%, #000 25%, transparent 80%);
  mask-image: radial-gradient(ellipse 85% 65% at 28% 32%, #000 25%, transparent 80%);
}
</style>
