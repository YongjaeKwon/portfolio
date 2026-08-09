<template>
  <section id="education" class="section-tone-mist py-24 md:py-28">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">04</span>
        <h2 class="section-kicker">Education &amp; Certificates</h2>
      </div>

      <div class="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="(item, idx) in education"
          :key="item.title"
          :class="['reveal fresh-card interactive-surface rounded-[1.5rem] p-6', `reveal-d${idx + 1}`]"
        >
          <component :is="iconMap[item.icon]" class="h-6 w-6 text-[var(--fresh-blue)]" />
          <p class="text-muted font-mono tnum mt-5 text-sm font-semibold">{{ item.period }}</p>
          <h3 class="text-primary mt-2 text-xl font-black">{{ item.title }}</h3>
          <p class="text-secondary mt-4 leading-7">{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Award, Database, GraduationCap } from "@lucide/vue";
import type { Component } from "vue";
import { education } from "@/data/portfolio";

const iconMap: Record<string, Component> = {
  Award,
  Database,
  GraduationCap,
};
</script>
