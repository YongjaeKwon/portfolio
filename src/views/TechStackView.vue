<template>
  <section id="techstack" class="py-24">
    <div class="section-shell">
      <p class="section-kicker">Tech Stack</p>
      <h2 class="section-title">기술 스택</h2>
      <p class="section-copy">
        회사 업무에서 사용한 기술과 개인 프로젝트로 다뤄본 기술을 함께 정리했습니다.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <article
          v-for="group in techGroups"
          :key="group.title"
          class="surface interactive-surface rounded-xl p-6"
        >
          <div class="flex items-center gap-3">
            <div :class="['grid h-11 w-11 place-items-center rounded-lg border', toneClass(group.tone)]">
              <component :is="iconMap[group.icon]" class="h-5 w-5" />
            </div>
            <h3 class="text-primary text-xl font-black">{{ group.title }}</h3>
          </div>
          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="item in group.items"
              :key="item"
              class="surface-strong text-secondary inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
            >
              <TechIcon :name="item" />
              {{ item }}
            </span>
          </div>
        </article>
      </div>

      <div class="mt-14">
        <p class="section-kicker">Strengths</p>
        <h3 class="text-primary mt-3 text-2xl font-black md:text-3xl">프론트엔드 개발자로서의 강점</h3>
        <p class="text-muted mt-3 max-w-3xl leading-7">
          화면 구현을 중심으로 일해왔고, API와 데이터 흐름을 함께 본 경험이 있습니다.
        </p>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <article
            v-for="item in jobFit"
            :key="item.label"
            class="surface interactive-surface rounded-xl p-6"
          >
            <div class="flex gap-4">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-amber-400/25 bg-[var(--amber-soft)] text-amber-500">
                <component :is="iconMap[item.icon]" class="h-5 w-5" />
              </div>
              <div>
                <h4 class="text-primary text-lg font-black">{{ item.label }}</h4>
                <p class="text-secondary mt-3 leading-7">{{ item.description }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Boxes,
  Code,
  Database,
  Layers,
  RadioTower,
  Server,
  Smartphone,
} from "@lucide/vue";
import type { Component } from "vue";
import TechIcon from "@/components/TechIcon.vue";
import { jobFit, techGroups } from "@/data/portfolio";

const iconMap: Record<string, Component> = {
  Boxes,
  Code,
  Database,
  Layers,
  RadioTower,
  Server,
  Smartphone,
};

const toneClass = (tone: string) => {
  const classes: Record<string, string> = {
    cyan: "border-cyan-400/25 bg-[var(--accent-soft)] text-cyan-500",
    emerald: "border-emerald-400/25 bg-[var(--emerald-soft)] text-emerald-500",
    amber: "border-amber-400/25 bg-[var(--amber-soft)] text-amber-500",
    violet: "border-violet-400/25 bg-[var(--violet-soft)] text-violet-500",
  };

  return classes[tone] ?? classes.cyan;
};
</script>
