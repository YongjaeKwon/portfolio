<template>
  <section id="profile" class="py-16 md:py-20">
    <div class="section-shell">
      <div class="reveal">
        <div class="flex items-center gap-3">
          <span class="section-index">00</span>
          <h2 class="section-kicker">About</h2>
        </div>
        <div class="mt-5 grid max-w-2xl gap-1.5">
          <p
            v-for="paragraph in aboutParagraphs"
            :key="paragraph"
            class="text-secondary text-lg leading-8"
          >
            {{ paragraph.trim() }}
          </p>
        </div>

        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <article
            v-for="item in aboutHighlights"
            :key="item.label"
            class="fresh-list-item flex items-center gap-3 rounded-2xl px-4 py-3.5"
          >
            <div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--fresh-blue-soft)] text-[var(--fresh-blue)]">
              <component :is="item.icon" class="h-4 w-4" />
            </div>
            <div class="min-w-0">
              <p class="text-muted text-xs font-semibold">{{ item.label }}</p>
              <p class="text-primary mt-1 text-sm font-bold leading-5">{{ item.value }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Database, MonitorSmartphone, Workflow } from "@lucide/vue";
import { profile } from "@/data/portfolio";

const aboutParagraphs = profile.summary.match(/[^.]+\./g) ?? [profile.summary];

const aboutHighlights = [
  {
    label: "개발 영역",
    value: "화면 · 서버 · 데이터",
    icon: MonitorSmartphone,
  },
  {
    label: "업무 형태",
    value: "신규 기능 · 운영 개선",
    icon: Workflow,
  },
  {
    label: "실무 경험",
    value: "개발 · 배포 · 운영 확인",
    icon: Database,
  },
];
</script>
