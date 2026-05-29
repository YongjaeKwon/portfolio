<template>
  <section id="techstack" class="py-24">
    <div class="section-shell">
      <p class="reveal section-kicker">Tech Stack</p>
      <h2 class="reveal reveal-d1 section-title">기술 스택</h2>
      <p class="reveal reveal-d2 section-copy">
        회사 업무에서 사용한 기술과 개인 프로젝트로 다뤄본 기술을 함께 정리했습니다.
      </p>

      <div class="mt-8 grid gap-4 md:grid-cols-2">
        <article
          v-for="(group, idx) in techGroups"
          :key="group.title"
          :class="['reveal surface interactive-surface rounded-xl p-6', `reveal-d${idx + 1}`]"
        >
          <div class="flex items-center gap-3">
            <div :class="['grid h-11 w-11 place-items-center rounded-lg border', toneClass(group.tone)]">
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
                class="tech-chip surface-strong text-secondary inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
                @click="linkToProjects(item)"
              >
                <TechIcon :name="item" />
                {{ item }}
                <span class="text-white/25 ml-0.5 text-xs">↗</span>
              </button>
              <span
                v-else
                class="tech-chip surface-strong text-secondary inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
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
        <h3 class="text-primary mt-3 text-2xl font-black md:text-3xl">프론트엔드 개발자로서의 강점</h3>
        <p class="text-muted mt-3 max-w-3xl leading-7">
          화면 구현을 중심으로 일해왔고, API와 데이터 흐름을 함께 본 경험이 있습니다.
        </p>
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <article
            v-for="(item, idx) in jobFit"
            :key="item.label"
            :class="['reveal surface interactive-surface rounded-xl p-6', `reveal-d${idx + 1}`]"
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
import { jobFit, projects, techGroups } from "@/data/portfolio";
import { useProjectFilter } from "@/composables/useProjectFilter";

const { activeFilter } = useProjectFilter();

/** 적어도 한 프로젝트에서 쓰인 스택 집합 — 클릭 가능 여부 판단에 사용 */
const stacksInProjects = new Set(projects.flatMap((p) => p.stack));

/** 스택 클릭 → 필터 설정 → 프로젝트 섹션으로 스크롤 */
const linkToProjects = (stack: string) => {
  activeFilter.value = stack;
  const el = document.getElementById("projects");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", "#projects");
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

const toneClass = (_tone: string) =>
  "border-white/8 bg-white/4 text-white/45";
</script>
