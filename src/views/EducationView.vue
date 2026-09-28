<template>
  <section id="education" class="py-24 md:py-28">
    <div class="section-shell">
      <h2 class="reveal section-title">{{ t("학력 · 교육 · 자격", "Education & Certificates") }}</h2>

      <ol class="reveal mt-7 divide-y divide-[var(--fresh-border)] rounded-lg border border-[var(--fresh-border)] bg-[var(--fresh-surface-solid)]">
        <li
          v-for="item in education"
          :key="item.title"
          class="grid gap-1 px-5 py-4 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-6"
        >
          <p class="text-muted font-mono tnum text-sm font-semibold">{{ item.period }}</p>
          <div>
            <h3 class="text-primary font-black">{{ item.title }}</h3>
            <p class="text-secondary mt-1 text-sm leading-6">{{ item.description }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { education } from "@/data/portfolio";
import { t } from "@/i18n/locale";
</script>
