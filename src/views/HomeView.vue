<template>
  <section id="hero" class="relative min-h-screen overflow-hidden pb-20 pt-28">
    <div class="pointer-events-none absolute inset-0 opacity-35">
      <div class="grid-backdrop absolute inset-0"></div>
    </div>

    <div class="section-shell relative grid min-h-[calc(100vh-7rem)] items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
      <div>
        <div class="accent-soft inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.22em]">
          <Radar class="h-4 w-4" />
          Frontend · Operation UI
        </div>

        <h1 class="text-primary mt-8 max-w-4xl text-5xl font-black leading-[1.05] md:text-7xl">
          {{ profile.name }}
        </h1>
        <p class="text-primary mt-5 text-2xl font-bold md:text-4xl">
          {{ profile.role }}
        </p>
        <p class="text-secondary mt-7 max-w-3xl text-lg leading-8">
          {{ profile.headline }}
        </p>
        <p class="text-muted mt-4 max-w-3xl text-base leading-7">
          {{ profile.target }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="focus-ring accent-bg inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-black transition hover:brightness-105"
            @click="emit('scroll-to-section', 'projects')"
          >
            프로젝트 보기
            <ArrowRight class="h-4 w-4" />
          </button>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition hover:text-[var(--accent-strong)]"
            :href="profile.github"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <ExternalLink class="h-4 w-4" />
          </a>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition hover:text-[var(--accent-strong)]"
            :href="`mailto:${profile.email}`"
          >
            Email
            <Mail class="h-4 w-4" />
          </a>
        </div>

        <div class="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
          <div
            v-for="stat in heroStats"
            :key="stat.label"
            class="surface rounded-lg p-4"
          >
            <p class="text-muted text-xs font-semibold">{{ stat.label }}</p>
            <p class="text-primary mt-2 text-lg font-black">
              {{ stat.value }}<span class="accent-text ml-1 text-sm">{{ stat.unit }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="surface relative rounded-xl p-5">
        <div class="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-amber-500">Work Style</p>
            <h2 class="text-primary mt-2 text-xl font-black">화면을 만들 때 보는 것</h2>
          </div>
          <Activity class="accent-text h-6 w-6" />
        </div>

        <div class="mt-5 grid gap-3">
          <div
            v-for="(strength, index) in strengths"
            :key="strength.title"
            class="surface-strong interactive-surface rounded-lg p-4"
          >
            <div class="flex gap-4">
              <div class="accent-soft grid h-10 w-10 shrink-0 place-items-center rounded-md border">
                <component :is="iconMap[strength.icon]" class="h-5 w-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-muted text-xs font-black">0{{ index + 1 }}</span>
                  <h3 class="text-primary font-bold">{{ strength.title }}</h3>
                </div>
                <p class="text-muted mt-2 text-sm leading-6">{{ strength.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-lg border border-amber-400/25 bg-[var(--amber-soft)] p-4">
          <div class="flex items-center gap-3">
            <MousePointer2 class="h-5 w-5 text-amber-500" />
            <p class="text-primary text-sm font-semibold">
              사용자가 막히는 지점을 줄이는 데 신경 씁니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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

const emit = defineEmits<{
  "scroll-to-section": [id: string];
}>();

const iconMap: Record<string, Component> = {
  MonitorSmartphone,
  PanelTop,
  ShieldCheck,
  Workflow,
};
</script>
