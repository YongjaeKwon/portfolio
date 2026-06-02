<template>
  <section id="techstack" class="py-24">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">04</span>
        <p class="section-kicker">Tech Stack</p>
      </div>
      <h2 class="reveal reveal-d1 section-title">기술 스택</h2>
      <p class="reveal reveal-d2 section-copy">
        {{ activeTrackData.fitDescription }}
      </p>

      <!-- 🍁 메이플 모드: 인벤토리 레어도 범례 -->
      <div class="maple-legend mt-4 items-center gap-4 text-xs font-bold">
        <span class="text-secondary flex items-center gap-1.5">
          <span class="h-3.5 w-3.5 rounded border-2" style="border-color: #f0932b"></span>
          실무 (유니크)
        </span>
        <span class="text-secondary flex items-center gap-1.5">
          <span class="h-3.5 w-3.5 rounded border-2" style="border-color: #4a90d9"></span>
          학습 (레어)
        </span>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <article
          v-for="(group, idx) in techGroups"
          :key="group.title"
          :class="['reveal surface interactive-surface rounded-xl p-6', `reveal-d${idx + 1}`]"
        >
          <div class="flex items-center gap-3">
            <div class="grid h-11 w-11 place-items-center rounded-lg border border-white/8 bg-white/4 text-white/45">
              <component :is="iconMap[group.icon]" class="h-5 w-5" />
            </div>
            <h3 class="text-primary text-xl font-black">{{ group.title }}</h3>
          </div>
          <div class="mt-5 flex flex-wrap gap-2">
            <!-- 프로젝트에 쓰인 기술: 클릭하면 프로젝트 섹션으로 이동 + 필터 적용 -->
            <template v-for="item in group.items" :key="item">
              <button
                v-if="stacksInProjects.has(item)"
                type="button"
                :title="`${item}을(를) 사용한 프로젝트 보기`"
                class="tech-chip rarity-unique surface-strong text-secondary group inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
                @click="linkToProjects(item)"
              >
                <TechIcon :name="item" />
                {{ item }}
                <ArrowUpRight class="text-white/30 h-3.5 w-3.5 transition group-hover:text-[var(--accent-strong)]" />
              </button>
              <span
                v-else
                class="tech-chip rarity-rare surface-strong text-secondary inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
              >
                <TechIcon :name="item" />
                {{ item }}
              </span>
            </template>
          </div>
        </article>
      </div>

      <div class="mt-14">
        <p class="section-kicker">Strengths</p>
        <h3 class="text-primary mt-3 text-2xl font-black md:text-3xl">{{ activeTrackData.fitTitle }}</h3>
        <p class="text-muted mt-3 max-w-3xl leading-7">
          {{ activeTrackData.target }}
        </p>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <article
            v-for="item in activeTrackData.fitItems"
            :key="item.label"
            class="surface interactive-surface rounded-xl p-6"
          >
            <div class="flex gap-4">
              <div class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/8 bg-white/4 text-white/45">
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
  ArrowUpRight,
  Boxes,
  Code,
  Database,
  Layers,
  RadioTower,
  Server,
  Smartphone,
} from "@lucide/vue";
import { computed } from "vue";
import type { Component } from "vue";
import TechIcon from "@/components/TechIcon.vue";
import { focusTracks, projects, techGroups } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { useProjectFilter } from "@/composables/useProjectFilter";

const { activeFilter } = useProjectFilter();
const { activeTrack } = useFocusTrack();
const activeTrackData = computed(
  () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]
);

/** 적어도 한 프로젝트에서 쓰인 스택 집합 — 클릭 가능 여부 판단에 사용 */
const stacksInProjects = new Set(projects.flatMap((p) => p.stack));

/** 스택 클릭 → 필터 설정 → 프로젝트 섹션으로 스크롤 */
const linkToProjects = (stack: string) => {
  activeFilter.value = stack;
  const el = document.getElementById("projects");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `${location.pathname}${location.search}#projects`);
  }
};

const iconMap: Record<string, Component> = {
  Boxes,
  Code,
  Database,
  Layers,
  RadioTower,
  Server,
  Smartphone,
};
</script>
