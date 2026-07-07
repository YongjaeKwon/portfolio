<template>
  <section id="profile" class="py-24">
    <div class="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <div class="reveal">
        <div class="flex items-center gap-3">
          <span class="section-index">00</span>
          <p class="section-kicker">About</p>
        </div>
        <h2 class="section-title">운영 중인 업무 시스템을 다뤄왔습니다</h2>
        <p class="section-copy">
          화면을 새로 만드는 일뿐 아니라, 기존 구조 안에서 어떤 값이 어디서 오고 어떻게 보여야 하는지 확인하는 일을 중요하게 봅니다.
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
    label: "주요 경험",
    value: "포탈·A/S·자산",
    icon: Workflow,
  },
  {
    label: "화면 환경",
    value: "Vue·WebSquare·JSP",
    icon: MonitorSmartphone,
  },
  {
    label: "확인 기준",
    value: "목록·엑셀·대시보드",
    icon: Database,
  },
];
</script>
