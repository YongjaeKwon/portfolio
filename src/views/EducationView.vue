<template>
  <section id="education" class="py-24">
    <div class="section-shell">
      <p class="reveal section-kicker">Education & Certificates</p>
      <h2 class="reveal reveal-d1 section-title">교육, 자격, 수상</h2>

      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <article
          v-for="(item, idx) in education"
          :key="item.title"
          :class="['reveal surface interactive-surface rounded-xl p-6', `reveal-d${idx + 1}`]"
        >
          <component :is="iconMap[item.icon]" class="h-6 w-6 text-white/40" />
          <p class="text-muted mt-5 text-sm font-semibold">{{ item.period }}</p>
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
