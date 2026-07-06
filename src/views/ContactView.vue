<template>
  <section id="contact" class="py-24">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">05</span>
        <p class="section-kicker">Contact</p>
      </div>
      <h2 class="reveal reveal-d1 section-title">함께 일하고 싶으시다면</h2>
      <p class="reveal reveal-d2 section-copy">
        운영 시스템과 관리자 도구의 업무 흐름을 이해하며 화면을 만드는 웹 개발자입니다. 이력서와 프로젝트 내용을 검토하신 뒤 이메일로 연락 주세요.
      </p>

      <div class="reveal reveal-d3 fresh-cta-panel mt-10 rounded-[2rem] p-8">
        <div class="fresh-aurora" aria-hidden="true"></div>
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--fresh-border)] bg-white/60 px-3 py-1.5">
          <span class="h-2 w-2 rounded-full bg-[var(--fresh-blue)]" aria-hidden="true"></span>
          <span class="text-xs font-bold text-[var(--fresh-blue-strong)]">Portfolio & Resume</span>
        </div>

        <h3 class="text-primary text-2xl font-black">{{ activeTrackData.contactTitle }}</h3>
        <p class="text-secondary mt-4 max-w-2xl leading-7">
          {{ activeTrackData.contactDescription }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <a
            class="focus-ring fresh-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:brightness-105"
            :href="`mailto:${profile.email}`"
          >
            <Mail class="h-4 w-4" />
            이메일 보내기
          </a>
          <a
            class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            :href="profile.github"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink class="h-4 w-4" />
            GitHub
          </a>
          <a
            class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            :href="activeTrackData.resume"
            download
          >
            <FileDown class="h-4 w-4" />
            {{ activeTrackData.resumeLabel }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ExternalLink, FileDown, Mail } from "@lucide/vue";
import { computed } from "vue";
import { focusTracks, profile } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";

const { activeTrack } = useFocusTrack();
const activeTrackData = computed(
  () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]
);
</script>
