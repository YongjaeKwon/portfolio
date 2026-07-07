<template>
  <section id="techstack" class="py-24">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">04</span>
        <p class="section-kicker">Tech Stack</p>
      </div>
      <h2 class="reveal reveal-d1 section-title">기술은 어디에 썼는지 중심으로</h2>
      <p class="reveal reveal-d2 section-copy">
        기술 이름을 많이 나열하기보다, 업무 화면과 조회 기준을 맞추는 과정에서 어떤 도구를 사용했는지 보여줍니다.
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
            <template v-for="item in group.items" :key="item">
              <button
                v-if="stacksInProjects.has(item)"
                type="button"
                :title="`${item} 관련 프로젝트 보기`"
                class="tech-chip fresh-list-item text-secondary group inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold"
                @click="linkToProjects(item)"
              >
                <TechIcon :name="item" />
                {{ item }}
                <ArrowUpRight class="h-3.5 w-3.5 text-white/30 transition group-hover:text-[var(--accent-strong)]" />
              </button>
              <span
                v-else
                class="tech-chip fresh-list-item text-secondary inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold"
              >
                <TechIcon :name="item" />
                {{ item }}
              </span>
            </template>
          </div>
        </article>
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
  MonitorSmartphone,
  Server,
} from "@lucide/vue";
import type { Component } from "vue";
import TechIcon from "@/components/TechIcon.vue";
import { featuredProjects, techGroups } from "@/data/portfolio";
import { useProjectFilter } from "@/composables/useProjectFilter";

const { activeFilter } = useProjectFilter();
const stacksInProjects = new Set(featuredProjects.flatMap((project) => project.stack));

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
  MonitorSmartphone,
  Server,
};
</script>
