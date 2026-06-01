<template>
  <section id="profile" class="py-24">
    <div class="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <div class="reveal">
        <div class="flex items-center gap-3">
          <span class="section-index">00</span>
          <p class="section-kicker">About</p>
        </div>
        <h2 class="section-title">실제 업무 흐름에 맞춰 구현하는 개발자</h2>
        <p class="section-copy">
          화면, API 응답, 권한 조건, 데이터 조회 흐름을 따로 보지 않고 사용자가 실제로 거치는 순서로 기능을 확인합니다.
        </p>
      </div>

      <div class="reveal reveal-d2 grid gap-4">
        <div class="surface rounded-xl p-6">
          <p class="text-secondary text-lg leading-8">{{ profile.summary }}</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <article
            v-for="item in aboutCards"
            :key="item.label"
            class="surface interactive-surface rounded-lg p-5"
          >
            <component :is="item.icon" class="h-5 w-5" :class="item.iconClass" />
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
    label: "주요 분야",
    value: "웹/모바일 업무 UI",
    icon: MonitorSmartphone,
    iconClass: "text-white/45",
  },
  {
    label: "경험",
    value: "운영 시스템 4건",
    icon: Workflow,
    iconClass: "text-white/45",
  },
  {
    label: "강점",
    value: "API·SQL 흐름 이해",
    icon: Database,
    iconClass: "text-white/45",
  },
];
</script>
