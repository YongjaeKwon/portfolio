<template>
  <section id="techstack" class="py-24">
    <div class="section-shell">
      <h2 class="reveal section-title">{{ t("기술 스택", "Tech Stack") }}</h2>

      <dl class="reveal mt-7 divide-y divide-[var(--fresh-border)] rounded-lg border border-[var(--fresh-border)] bg-[var(--fresh-surface-solid)]">
        <div
          v-for="group in techGroups"
          :key="group.title"
          class="grid gap-3 px-5 py-4 md:grid-cols-[10rem_minmax(0,1fr)] md:items-center"
        >
          <dt class="text-primary font-black">{{ group.title }}</dt>
          <dd class="m-0 flex flex-wrap gap-2">
            <span
              v-for="item in group.items"
              :key="item"
              class="tech-chip text-secondary rounded-full border border-[var(--fresh-border)] px-3 py-1.5 text-sm font-semibold"
            >
              {{ item }}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { techGroups } from "@/data/portfolio";
import { t } from "@/i18n/locale";
</script>
