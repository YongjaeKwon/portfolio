<template>
  <section id="techstack" class="py-24">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">04</span>
        <p class="section-kicker">Tech Stack</p>
      </div>
      <h2 class="reveal reveal-d1 section-title">주로 사용한 기술</h2>
      <p class="reveal reveal-d2 section-copy">
        프로젝트에서 실제 사용한 기술과 담당 범위를 기준으로 정리했습니다.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <article
          v-for="(group, idx) in techGroups"
          :key="group.title"
          :class="['reveal fresh-card interactive-surface rounded-[2rem] p-6', `reveal-d${idx + 1}`]"
        >
          <div class="flex items-start gap-4">
            <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--fresh-border)] bg-[var(--fresh-blue-soft)] text-[var(--fresh-blue)]">
              <component :is="iconMap[group.icon]" class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-primary text-xl font-black">{{ group.title }}</h3>
              <p class="text-secondary mt-3 leading-7">{{ group.description }}</p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="item in group.items"
              :key="item"
              class="tech-chip fresh-list-item text-secondary inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold"
            >
              <TechIcon :name="item" />
              {{ item }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Boxes,
  Code,
  Layers,
  MonitorSmartphone,
  Server,
} from "@lucide/vue";
import type { Component } from "vue";
import TechIcon from "@/components/TechIcon.vue";
import { techGroups } from "@/data/portfolio";

const iconMap: Record<string, Component> = {
  Boxes,
  Code,
  Layers,
  MonitorSmartphone,
  Server,
};
</script>
