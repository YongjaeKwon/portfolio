<template>
  <section id="experience" class="py-24">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">02</span>
        <p class="section-kicker">Experience</p>
      </div>
      <h2 class="reveal reveal-d1 section-title">회사에서 맡아온 일</h2>

      <div class="relative mt-10">
        <div class="absolute bottom-3 left-[7px] top-3 w-px bg-[var(--border-strong)]"></div>

        <div class="reveal reveal-d2 relative pl-9">
          <span class="absolute left-0 top-2 grid h-4 w-4 place-items-center rounded-full border border-[var(--accent)] bg-[var(--page-bg)]">
            <span class="h-1.5 w-1.5 rounded-full" :style="{ background: 'var(--accent)' }"></span>
          </span>

          <div class="fresh-card interactive-surface rounded-[2rem] p-6 md:p-7">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              <BriefcaseBusiness class="h-5 w-5 text-[var(--fresh-blue)]" />
              <span class="font-mono tnum text-muted text-sm font-semibold">{{ experience.period }}</span>
            </div>
            <h3 class="text-primary mt-3 text-2xl font-black">{{ experience.title }}</h3>
            <p class="accent-text mt-1 font-bold">{{ experience.company }}</p>

            <p class="text-secondary mt-5 leading-7">{{ experience.description }}</p>

            <ul class="text-secondary mt-6 grid gap-3 text-sm leading-6 md:grid-cols-3">
              <li
                v-for="bullet in experience.bullets"
                :key="bullet"
                class="fresh-list-item rounded-2xl p-4"
              >
                <Workflow class="mb-3 h-4 w-4 text-[var(--fresh-blue)]" />
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BriefcaseBusiness, Workflow } from "@lucide/vue";
import { experience } from "@/data/portfolio";
</script>
