<template>
  <section id="education" class="section-tone-mist py-24 md:py-28">
    <div class="section-shell">
      <h2 class="reveal section-title">{{ t("학력 · 교육 · 자격", "Education & Certificates") }}</h2>

      <div class="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="item in education"
          :key="item.title"
          class="reveal fresh-card interactive-surface rounded-[1.5rem] p-6"
        >
          <component :is="iconMap[item.icon]" class="text-muted h-6 w-6" aria-hidden="true" />
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
import { t } from "@/i18n/locale";

const iconMap: Record<string, Component> = {
  Award,
  Database,
  GraduationCap,
};
</script>
