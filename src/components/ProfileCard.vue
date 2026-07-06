<template>
  <section id="profile" class="py-24">
    <div class="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <div class="reveal">
        <div class="flex items-center gap-3">
          <span class="section-index">00</span>
          <p class="section-kicker">About</p>
        </div>
        <h2 class="section-title">업무가 보이는 화면을 만드는 개발자</h2>
        <p class="section-copy">
          사용자가 어떤 순서로 일하는지 먼저 보고, 화면과 데이터 기준이 같은 방향을 가리키도록 맞춥니다.
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
    value: "포탈·자산·AS",
    icon: Workflow,
    iconClass: "text-white/45",
  },
  {
    label: "강점",
    value: "데이터 기준 정리",
    icon: Database,
    iconClass: "text-white/45",
  },
];
</script>
