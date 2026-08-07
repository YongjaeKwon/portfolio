<template>
  <section id="hero" class="fresh-mesh relative overflow-hidden pb-20 pt-28 md:pt-32">
    <div class="pointer-events-none absolute inset-0">
      <div class="grid-backdrop hero-grid-mask absolute inset-0 opacity-20"></div>
      <div class="hero-glow absolute right-[-12rem] top-24 h-[34rem] w-[34rem] rounded-full"></div>
      <div class="hero-bottom-fade absolute inset-x-0 bottom-0 h-36"></div>
    </div>

    <div class="section-shell relative z-10 grid min-h-[calc(100dvh-8rem)] items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      <div class="max-w-3xl">
        <div class="mb-7 flex items-center gap-5">
          <img
            src="/my-photo-224.webp"
            alt="권용재 프로필 사진"
            width="112"
            height="112"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            class="hero-photo h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-white/50 shadow-lg md:h-28 md:w-28"
          />
          <div class="hero-enter inline-flex items-center gap-2 rounded-full border border-[var(--fresh-border)] bg-white/80 px-3 py-2 text-xs font-bold tracking-[0.16em] text-[var(--fresh-blue-strong)] shadow-sm">
            Web Developer
          </div>
        </div>

        <h1 class="hero-enter hero-enter-d1 text-5xl font-black leading-[1.04] text-primary md:text-7xl">
          {{ profile.name }}
        </h1>
        <p class="hero-enter hero-enter-d3 mt-6 max-w-2xl whitespace-pre-line text-xl font-semibold leading-9 text-secondary md:text-2xl md:leading-10">
          {{ activeTrackData.headline }}
        </p>
        <p class="hero-enter hero-enter-d4 mt-4 max-w-2xl whitespace-pre-line text-base leading-7 text-muted md:text-lg md:leading-8">
          {{ activeTrackData.target }}
        </p>

        <div class="hero-enter hero-enter-d5 mt-7">
          <p class="text-muted mb-3 text-xs font-bold tracking-[0.08em]">직무별 보기</p>
          <FocusTabs />
        </div>

        <div class="hero-enter mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="focus-ring fresh-button inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:brightness-105"
            @click="emit('scroll-to-section', 'projects')"
          >
            프로젝트 보기
            <ArrowRight class="h-4 w-4" />
          </button>
          <a class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5" :href="profile.github" target="_blank" rel="noreferrer">
            GitHub
            <ExternalLink class="h-4 w-4" />
          </a>
          <a
            class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            :href="profile.resume"
            download="Yongjae-Kwon-Resume.pdf"
          >
            이력서
            <FileDown class="h-4 w-4" />
          </a>
          <a class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5" href="#contact">
            Contact
            <Mail class="h-4 w-4" />
          </a>
        </div>
      </div>

      <aside class="reveal hero-scope-card relative overflow-hidden rounded-[2.25rem] p-6 md:p-8">
        <div class="hero-scope-grid pointer-events-none absolute inset-0 opacity-50"></div>
        <div class="relative">
          <div class="flex items-center justify-between gap-4">
            <p class="section-kicker">Current Work</p>
            <span class="rounded-full border border-[var(--fresh-border)] bg-white/75 px-3 py-1.5 text-xs font-bold text-[var(--fresh-blue-strong)]">
              {{ activeTrackData.label }}
            </span>
          </div>
          <h2 class="text-primary mt-5 text-2xl font-black leading-9 md:text-3xl">현재 맡고 있는 업무</h2>
          <p class="text-muted mt-3 text-sm leading-6 md:text-base md:leading-7">
            운영팀과 필요한 기능을 정리하고, 개발한 기능의 검수와 배포까지 맡고 있습니다.
          </p>

          <div class="mt-7 grid gap-3">
            <article v-for="(item, index) in activeScope.items" :key="item.title" class="scope-row flex gap-4 rounded-2xl p-4">
              <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--fresh-blue-soft)] text-[var(--fresh-blue)]">
                <component :is="scopeIcons[index]" class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-primary text-sm font-black">{{ item.title }}</h3>
                <p class="text-secondary mt-1 text-sm leading-6">{{ item.description }}</p>
              </div>
            </article>
          </div>

          <div class="mt-7 border-t border-[var(--fresh-border)] pt-5">
            <p class="text-muted text-xs font-bold">주요 기술</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="tech in activeScope.tech" :key="tech" class="rounded-full border border-[var(--fresh-border)] bg-white/75 px-3 py-1.5 text-xs font-bold text-secondary shadow-sm">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight, ExternalLink, FileDown, Layers3, Mail, MessagesSquare, Rocket } from "@lucide/vue";
import FocusTabs from "@/components/FocusTabs.vue";
import { focusTracks, profile, type FocusTrackId } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";

const emit = defineEmits<{ "scroll-to-section": [id: string] }>();
const { activeTrack } = useFocusTrack();
const activeTrackData = computed(() => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]);
const scopeIcons = [MessagesSquare, Layers3, Rocket];

const scopeByTrack: Record<FocusTrackId, { items: Array<{ title: string; description: string }>; tech: string[] }> = {
  all: {
    items: [
      { title: "요구사항 협의", description: "운영팀·현업 담당자와 필요한 기능과 개발 일정을 정리합니다." },
      { title: "화면·서버 개발", description: "업무 화면과 서버 기능을 만들고 필요한 SQL을 작성합니다." },
      { title: "검수·배포", description: "담당자 검수를 거쳐 개발·운영 서버에 반영하고 결과를 확인합니다." },
    ],
    tech: ["JavaScript", "Vue", "WebSquare", "Java", "Spring", "MyBatis", "Tomcat", "Linux", "Jenkins"],
  },
  frontend: {
    items: [
      { title: "업무 화면 개발", description: "Vue와 WebSquare로 조회·등록·수정이 필요한 관리 화면을 만듭니다." },
      { title: "상태·입력 처리", description: "권한과 진행 상태에 따라 입력 조건과 버튼을 나누고 오류 내용을 표시합니다." },
      { title: "API 연동", description: "서버 응답과 화면 데이터를 맞추고 조회·저장 결과를 확인합니다." },
    ],
    tech: ["JavaScript", "Vue", "WebSquare", "JSP", "jQuery"],
  },
  backend: {
    items: [
      { title: "서버 기능 개발", description: "Java·Spring으로 조회·저장·검증과 업무 처리 기능을 개발합니다." },
      { title: "데이터·외부 연계", description: "MyBatis SQL을 작성하고 외부 시스템과 필요한 데이터를 주고받습니다." },
      { title: "배포·운영 확인", description: "Tomcat과 Linux 환경에 배포하고 로그와 DB 상태를 확인합니다." },
    ],
    tech: ["Java", "Spring Boot", "Spring MVC", "MyBatis", "MariaDB", "Tomcat", "Linux", "Jenkins"],
  },
};

const activeScope = computed(() => scopeByTrack[activeTrack.value]);
</script>

<style scoped>
.hero-grid-mask {
  -webkit-mask-image: radial-gradient(ellipse 90% 72% at 35% 40%, #000 20%, transparent 82%);
  mask-image: radial-gradient(ellipse 90% 72% at 35% 40%, #000 20%, transparent 82%);
}
.hero-glow {
  background: radial-gradient(circle, rgba(83, 199, 245, 0.18), rgba(49, 130, 246, 0.04) 48%, transparent 72%);
  filter: blur(8px);
}
.hero-bottom-fade {
  background: linear-gradient(to bottom, transparent, var(--fresh-bg));
}
.hero-scope-card {
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 28px 80px rgba(38, 69, 111, 0.14);
  backdrop-filter: blur(24px);
}
.hero-scope-grid {
  background-image:
    linear-gradient(rgba(49, 130, 246, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(49, 130, 246, 0.055) 1px, transparent 1px);
  background-size: 32px 32px;
  -webkit-mask-image: linear-gradient(to bottom left, #000, transparent 78%);
  mask-image: linear-gradient(to bottom left, #000, transparent 78%);
}
.scope-row {
  border: 1px solid rgba(49, 130, 246, 0.09);
  background: rgba(255, 255, 255, 0.68);
  transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
}
.scope-row:hover {
  transform: translateX(4px);
  border-color: rgba(49, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.9);
}
</style>
