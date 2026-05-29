<template>
  <section id="contact" class="py-24">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">05</span>
        <p class="section-kicker">Contact</p>
      </div>
      <h2 class="reveal reveal-d1 section-title">같이 일하고 싶으시다면</h2>
      <p class="reveal reveal-d2 section-copy">
        프론트엔드 개발자 포지션에 관심을 두고 있습니다. 편하게 연락 주세요.
      </p>

      <div class="reveal reveal-d3 surface mt-10 rounded-xl p-8">
        <!-- 구직 상태 뱃지 -->
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden="true"></span>
          <span class="text-xs font-bold text-emerald-500">{{ profile.status }} · 즉시 합류 가능</span>
        </div>

        <h3 class="text-primary text-2xl font-black">프론트엔드 개발자로 합류하고 싶습니다</h3>
        <p class="text-secondary mt-4 max-w-2xl leading-7">
          웹·모바일 업무 화면을 실제 사용 흐름에 맞게 구현하는 데 강점이 있습니다.
          Vue, React, TypeScript 환경 모두 가능하며, API와 데이터 흐름을 함께 이해하며 개발합니다.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <a
            class="focus-ring accent-bg inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-black transition hover:brightness-110"
            :href="`mailto:${profile.email}`"
          >
            <Mail class="h-4 w-4" />
            이메일 보내기
          </a>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition hover:text-[var(--accent-strong)]"
            :href="profile.github"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink class="h-4 w-4" />
            GitHub
          </a>
          <a
            class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition hover:text-[var(--accent-strong)]"
            :href="profile.resume"
            download
          >
            <FileDown class="h-4 w-4" />
            이력서 다운로드
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ExternalLink, FileDown, Mail } from "@lucide/vue";
import { profile } from "@/data/portfolio";
</script>
