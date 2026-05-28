<template>
  <section id="hero" class="relative min-h-screen overflow-hidden pb-20 pt-24">
    <div class="pointer-events-none absolute inset-0 opacity-20">
      <div class="grid-backdrop absolute inset-0"></div>
    </div>

    <div class="section-shell relative grid min-h-[calc(100vh-6rem)] items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
      <!-- Left column -->
      <div>
        <img
          :src="myPhoto"
          alt="권용재 프로필 사진"
          class="hero-enter mb-6 h-16 w-16 rounded-full object-cover ring-1 ring-white/15 shadow-lg"
        />

        <!-- Neutral badge — no cyan bg -->
        <div class="hero-enter hero-enter-d1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/40">
          <Radar class="h-4 w-4" />
          Frontend · Operation UI
        </div>

        <!-- Pure white — size and weight IS the statement -->
        <h1 class="hero-enter hero-enter-d2 mt-6 max-w-4xl text-5xl font-black leading-[1.05] text-white md:text-7xl">
          {{ profile.name }}
        </h1>
        <p class="hero-enter hero-enter-d3 mt-4 text-2xl font-bold text-white/80 md:text-4xl">
          {{ displayRole }}<span v-if="showCursor" class="typing-cursor" aria-hidden="true"></span>
        </p>
        <p class="hero-enter hero-enter-d4 text-secondary mt-6 max-w-3xl text-lg leading-8">
          {{ profile.headline }}
        </p>
        <p class="hero-enter hero-enter-d4 text-muted mt-3 max-w-3xl text-base leading-7">
          {{ profile.target }}
        </p>

        <div class="hero-enter hero-enter-d5 mt-8 flex flex-wrap gap-3">
          <!-- CTA: the ONE place cyan lives -->
          <button
            type="button"
            class="focus-ring accent-bg inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-black transition hover:brightness-110"
            @click="emit('scroll-to-section', 'projects')"
          >
            프로젝트 보기
            <ArrowRight class="h-4 w-4" />
          </button>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition hover:border-white/20 hover:text-white"
            :href="profile.github"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ExternalLink class="h-4 w-4" />
          </a>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition hover:border-white/20 hover:text-white"
            :href="`mailto:${profile.email}`"
          >
            Email
            <Mail class="h-4 w-4" />
          </a>
        </div>

        <div class="hero-enter hero-enter-d6 mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
          <div
            v-for="(stat, idx) in heroStats"
            :key="stat.label"
            class="surface rounded-lg p-4"
          >
            <p class="text-muted text-xs font-semibold">{{ stat.label }}</p>
            <p class="mt-2 text-lg font-black text-white">
              {{ animatedStats[idx] }}<span class="ml-1 text-sm text-white/40">{{ stat.unit }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Right column: Work Style card -->
      <div class="surface hero-enter hero-enter-d3 relative rounded-xl p-5">
        <div class="flex items-center justify-between border-b border-white/8 pb-4">
          <div>
            <!-- Neutral kicker — no amber -->
            <p class="section-kicker">Work Style</p>
            <h2 class="text-primary mt-2 text-xl font-black">화면을 만들 때 보는 것</h2>
          </div>
          <Activity class="h-6 w-6 text-white/25" />
        </div>

        <div class="mt-5 grid gap-3">
          <div
            v-for="(strength, index) in strengths"
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
              사용자가 막히는 지점을 줄이는 데 신경 씁니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Activity,
  ArrowRight,
  ExternalLink,
  Mail,
  MousePointer2,
  MonitorSmartphone,
  PanelTop,
  Radar,
  ShieldCheck,
  Workflow,
} from "@lucide/vue";
import type { Component } from "vue";
import { heroStats, profile, strengths } from "@/data/portfolio";
import myPhoto from "@/public/my-photo.png";

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

// Stat counter
const stat0 = ref(0);
const stat1 = ref("·");
const stat2 = ref(0);

const animatedStats = computed(() => [
  String(stat0.value),
  stat1.value,
  stat2.value + "+",
]);

onMounted(() => {
  const target = profile.role;
  let i = 0;
  showCursor.value = true;
  setTimeout(() => {
    const t = setInterval(() => {
      displayRole.value = target.slice(0, ++i);
      if (i >= target.length) {
        clearInterval(t);
        setTimeout(() => { showCursor.value = false; }, 2800);
      }
    }, 75);
  }, 650);

  setTimeout(() => {
    const t0 = setInterval(() => {
      if (stat0.value < 4) stat0.value++;
      else clearInterval(t0);
    }, 110);
    setTimeout(() => { stat1.value = "2024.06"; }, 350);
    const t2 = setInterval(() => {
      if (stat2.value < 2) stat2.value++;
      else clearInterval(t2);
    }, 220);
  }, 700);
});
</script>
