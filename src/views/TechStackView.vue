<template>
  <section id="techstack" class="py-24">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">01</span>
        <h2 class="section-kicker">Tech Stack</h2>
      </div>

      <div class="mt-7 grid gap-3 md:grid-cols-2">
        <article
          v-for="(group, idx) in techGroups"
          :key="group.title"
          :class="['reveal fresh-card interactive-surface rounded-[1.5rem] p-5', `reveal-d${idx + 1}`]"
        >
          <h3 class="text-primary text-lg font-black">{{ group.title }}</h3>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="item in group.items"
              :key="item"
              class="tech-chip fresh-list-item text-secondary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold"
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
import TechIcon from "@/components/TechIcon.vue";
import { techGroups } from "@/data/portfolio";
</script>
