<template>
  <section id="projects" class="py-24">
    <div class="section-shell">
      <div class="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="section-kicker">Featured Projects</p>
          <h2 class="section-title">프로젝트 경험</h2>
          <p class="section-copy">
            실제 업무에서 맡았던 화면 개발과 운영 개선 작업을 중심으로 정리했습니다.
          </p>
        </div>
        <div class="surface hidden rounded-lg p-4 md:block">
          <p class="text-muted text-xs font-semibold uppercase tracking-[0.2em]">Main Work</p>
          <p class="accent-text mt-2 text-sm font-bold">UI · API · Operation</p>
        </div>
      </div>

      <div class="grid gap-5">
        <article
          v-for="(project, index) in projects"
          :key="project.title"
          class="surface interactive-surface group rounded-xl p-5 md:p-6"
        >
          <div class="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div :class="['rounded-lg border p-5', accentPanel(project.accent)]">
              <p class="text-xs font-black uppercase tracking-[0.22em] opacity-80">
                {{ project.category }}
              </p>
              <h3 class="text-primary mt-4 text-3xl font-black">{{ project.shortTitle }}</h3>
              <p class="text-secondary mt-4 text-sm leading-6">
                {{ project.period }}<br />
                {{ project.team }} · {{ project.role }}
              </p>
              <div class="mt-6 h-1.5 overflow-hidden rounded-full bg-black/10">
                <div :class="['h-full rounded-full', progressClass(project.accent)]" :style="{ width: `${86 - index * 9}%` }"></div>
              </div>
            </div>

            <div>
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-primary mt-2 text-2xl font-black">{{ project.title }}</h3>
                </div>
                <ArrowRight class="text-muted mt-2 h-5 w-5 transition group-hover:translate-x-1 group-hover:text-[var(--accent-strong)]" />
              </div>

              <p class="text-secondary mt-4 max-w-4xl leading-7">{{ project.summary }}</p>

              <ul class="text-secondary mt-5 grid gap-3 text-sm leading-6 md:grid-cols-3">
                <li
                  v-for="highlight in project.highlights"
                  :key="highlight"
                  class="surface-strong rounded-lg p-4"
                >
                  <CircleCheck class="mb-3 h-4 w-4 text-emerald-500" />
                  {{ highlight }}
                </li>
              </ul>

              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="stack in project.stack"
                  :key="stack"
                  class="surface-strong text-secondary inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold"
                >
                  <TechIcon :name="stack" />
                  {{ stack }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, CircleCheck } from "@lucide/vue";
import TechIcon from "@/components/TechIcon.vue";
import { projects } from "@/data/portfolio";

const accentPanel = (accent: string) => {
  const classes: Record<string, string> = {
    cyan: "border-cyan-300/25 bg-cyan-300/10",
    emerald: "border-emerald-300/25 bg-emerald-300/10",
    amber: "border-amber-300/25 bg-amber-300/10",
    violet: "border-violet-300/25 bg-violet-300/10",
    blue: "border-blue-300/25 bg-blue-300/10",
  };

  return classes[accent] ?? classes.cyan;
};

const progressClass = (accent: string) => {
  const classes: Record<string, string> = {
    cyan: "bg-cyan-300",
    emerald: "bg-emerald-300",
    amber: "bg-amber-300",
    violet: "bg-violet-300",
    blue: "bg-blue-300",
  };

  return classes[accent] ?? classes.cyan;
};
</script>
