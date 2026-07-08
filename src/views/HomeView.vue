<template>
  <section id="hero" class="fresh-mesh relative overflow-hidden pb-20 pt-24">
    <div class="pointer-events-none absolute inset-0">
      <div class="grid-backdrop hero-grid-mask absolute inset-0 opacity-20"></div>
    </div>

    <div class="section-shell relative z-10 flex min-h-[calc(100dvh-6rem)] items-center">
      <div class="max-w-4xl">
        <div class="hero-enter mb-7 flex items-center gap-5">
          <img
            :src="myPhoto"
            alt="권용재 프로필 사진"
            width="112"
            height="112"
            decoding="async"
            class="hero-photo h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-white/40 shadow-lg md:h-28 md:w-28"
          />
          <div class="inline-flex items-center gap-2 rounded-full border border-[var(--fresh-border)] bg-white/75 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--fresh-blue-strong)] shadow-sm">
            <Radar class="h-4 w-4" />
            운영 시스템 · 업무 화면 · 기능 추가
          </div>
        </div>

        <h1 class="hero-enter hero-enter-d1 max-w-4xl text-5xl font-black leading-[1.05] text-primary md:text-7xl">
          {{ hero.name }}
        </h1>
        <p class="hero-enter hero-enter-d2 font-display mt-4 text-2xl font-semibold text-secondary md:text-4xl">
          {{ hero.role }}
        </p>
        <p class="hero-enter hero-enter-d3 mt-6 max-w-3xl whitespace-pre-line text-lg leading-8 text-secondary md:text-xl md:leading-9">
          {{ hero.headline }}
        </p>
        <p class="hero-enter hero-enter-d4 mt-4 max-w-3xl whitespace-pre-line text-base leading-7 text-muted md:text-lg md:leading-8">
          {{ hero.supportText }}
        </p>

        <div class="hero-enter hero-enter-d5 mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="focus-ring fresh-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:brightness-105"
            @click="emit('scroll-to-section', 'projects')"
          >
            프로젝트 보기
            <ArrowRight class="h-4 w-4" />
          </button>
          <a
            class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            :href="profile.github"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ExternalLink class="h-4 w-4" />
          </a>
          <a
            class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            :href="profile.resume"
            download
          >
            이력서
            <FileDown class="h-4 w-4" />
          </a>
          <a
            class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            :href="`mailto:${profile.email}`"
          >
            Contact
            <Mail class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>

    <div class="section-shell relative z-10 -mt-8 pb-4">
      <div class="reveal mb-6">
        <p class="section-kicker">Core Strength</p>
        <h2 class="mt-3 text-2xl font-black text-primary md:text-3xl">
          기능을 추가하기 전에 보는 것
        </h2>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="(item, index) in coreStrengths"
          :key="item.title"
          :class="['reveal fresh-card interactive-surface rounded-[2rem] p-6', `reveal-d${index + 1}`]"
        >
          <div class="mb-5 grid h-11 w-11 place-items-center rounded-2xl border border-[var(--fresh-border)] bg-[var(--fresh-blue-soft)] text-[var(--fresh-blue)]">
            <component :is="strengthIcons[index]" class="h-5 w-5" />
          </div>
          <h3 class="text-primary text-lg font-black">{{ item.title }}</h3>
          <p class="text-secondary mt-3 text-sm leading-7">{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowRight,
  ExternalLink,
  FileDown,
  Mail,
  MonitorSmartphone,
  PanelTop,
  Radar,
  Workflow,
} from "@lucide/vue";
import { coreStrengths, hero, profile } from "@/data/portfolio";
import myPhoto from "@/public/my-photo.png";

const emit = defineEmits<{
  "scroll-to-section": [id: string];
}>();

const strengthIcons = [Workflow, MonitorSmartphone, PanelTop];
</script>

<style scoped>
.hero-grid-mask {
  -webkit-mask-image: radial-gradient(ellipse 85% 65% at 28% 32%, #000 25%, transparent 80%);
  mask-image: radial-gradient(ellipse 85% 65% at 28% 32%, #000 25%, transparent 80%);
}
</style>
