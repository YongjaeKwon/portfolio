<template>
  <section id="profile" class="py-24">
    <div class="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <div class="reveal">
        <div class="flex items-center gap-3">
          <span class="section-index">00</span>
          <p class="section-kicker">About</p>
        </div>
        <h2 class="section-title">업무 시스템 웹 개발자</h2>
        <p class="section-copy">
          Vue, WebSquare, JSP 기반 업무 화면을 구현하며 권한, 상태, 조회 조건처럼 기존 업무 흐름에 영향을 주는 부분까지 함께 확인했습니다.
        </p>
      </div>

      <div class="reveal reveal-d2 grid gap-4">
        <div class="fresh-card rounded-[2rem] p-6">
          <p class="text-secondary text-lg leading-8">{{ profile.summary }}</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <article
            v-for="item in aboutCards"
            :key="item.label"
            class="fresh-list-item interactive-surface rounded-2xl p-5"
          >
            <component :is="item.icon" class="h-5 w-5 text-[var(--fresh-blue)]" />
            <p class="text-muted mt-4 text-sm font-semibold">{{ item.label }}</p>
            <p class="text-primary mt-2 font-black">{{ item.value }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Database, MonitorSmartphone, Workflow } from "@lucide/vue";
import { profile } from "@/data/portfolio";

const aboutCards = [
  {
    label: "실무 환경",
    value: "B2B · B2G 업무 시스템",
    icon: Workflow,
  },
  {
    label: "주요 화면",
    value: "입력 · 조회 · 상세 · 엑셀",
    icon: MonitorSmartphone,
  },
  {
    label: "확인 범위",
    value: "API 응답 · MyBatis SQL",
    icon: Database,
  },
];
</script>
