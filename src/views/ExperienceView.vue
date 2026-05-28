<template>
  <section id="experience" class="py-24">
    <div class="section-shell">
      <p class="reveal section-kicker">Experience</p>
      <h2 class="reveal reveal-d1 section-title">회사에서 맡고 있는 일</h2>

      <div class="reveal surface mt-8 overflow-hidden rounded-xl">
        <div class="grid gap-0 lg:grid-cols-[0.34fr_0.66fr]">
          <div class="border-b border-[var(--border)] bg-[var(--surface-soft)] p-6 lg:border-b-0 lg:border-r">
            <BriefcaseBusiness class="h-8 w-8 text-cyan-500" />
            <p class="text-muted mt-6 text-sm font-semibold">{{ experience.period }}</p>
            <h3 class="text-primary mt-2 text-2xl font-black">{{ experience.title }}</h3>
            <p class="accent-text mt-2 font-bold">{{ experience.company }}</p>
          </div>

          <div class="p-6">
            <p class="text-secondary leading-7">{{ experience.description }}</p>
            <ul class="text-secondary mt-6 grid gap-3 text-sm leading-6 md:grid-cols-3">
              <li
                v-for="bullet in experience.bullets"
                :key="bullet"
                class="surface-strong rounded-lg p-4"
              >
                <Workflow class="mb-3 h-4 w-4 text-emerald-500" />
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
