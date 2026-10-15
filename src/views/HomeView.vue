<template>
  <section id="hero" class="relative pb-6 pt-24 md:pb-8 md:pt-28">
    <div class="section-shell relative z-10">
      <div class="grid items-center gap-8 pt-2 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3">
            <img
              src="/my-photo-224.webp"
              :alt="t('권용재 프로필 사진', 'Portrait of Yongjae Kwon')"
              width="112"
              height="112"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="hero-photo h-12 w-12 shrink-0 rounded-full object-cover md:h-14 md:w-14"
            />
            <p class="text-primary text-base font-black leading-tight">
              {{ profile.name }}
              <span class="text-muted mt-1 block text-sm font-semibold">{{ t("Java·Spring 웹 개발자", "Java & Spring Web Developer") }}</span>
            </p>
          </div>

          <p class="text-muted mt-4 text-sm leading-6">{{ experience.company }} · <span class="whitespace-nowrap font-mono tnum">{{ experience.period }}</span></p>

          <h1 class="hero-title text-primary mt-5">
            {{ headline.body }}<span v-if="headline.stop" class="text-[var(--fresh-accent)]">{{ headline.stop }}</span>
          </h1>
          <div class="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              class="focus-ring fresh-button inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition active:scale-[0.98]"
              @click="emit('scroll-to-section', 'experience')"
            >
              {{ t("개발 경험 보기", "See my experience") }}
              <span aria-hidden="true">→</span>
            </button>
            <a
              class="focus-ring fresh-button-soft inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition active:scale-[0.98]"
              :href="profile.resume"
              download="Yongjae-Kwon-Resume.pdf"
            >
              {{ t("이력서 PDF", "Resume PDF (Korean)") }}
            </a>
            <a
              class="focus-ring fresh-button-soft inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition active:scale-[0.98]"
              :href="profile.career"
              download="Yongjae-Kwon-Career.pdf"
            >
              {{ t("경력기술서 PDF", "Career Details PDF (Korean)") }}
            </a>
            <a
              class="focus-ring fresh-button-soft inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition active:scale-[0.98]"
              :href="profile.portfolio"
              download="Yongjae-Kwon-Portfolio.pdf"
            >
              {{ t("포트폴리오 PDF", "Portfolio PDF (Korean)") }}
            </a>
          </div>
        </div>

        <figure class="hero-current hidden lg:block">
          <img src="/projects/oneulsai-preview.webp" alt="" width="960" height="540" loading="lazy" decoding="async" class="hero-shot" />
          <figcaption class="mt-6 text-sm leading-6">
            <span class="text-muted block text-xs font-bold">{{ t("최근 개인 프로젝트 · 개발 중", "Current personal project · in development") }}</span>
            <strong class="text-primary mt-1 block text-lg">{{ t("오늘사이", "Oneulsai") }}</strong>
            <span class="text-secondary">{{ t("여러 사람과 차례로 1:1 대화를 나누고, 서로 마음이 맞는 상대를 찾는 오프라인 로테이션 소개팅 서비스", "An in-person speed dating service where people meet through one-to-one conversations and connect when the interest is mutual.") }}</span>
            <button v-if="currentProject" type="button" class="focus-ring text-primary mt-3 flex min-h-11 w-fit items-center gap-2 rounded-full text-sm font-bold" @click="activeProject = currentProject">
              {{ t("오늘사이 자세히 보기", "Explore Oneulsai") }} <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </button>
          </figcaption>
        </figure>
      </div>

    </div>
    <ProjectDetailModal :project="activeProject" @close="activeProject = null" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowRight } from "@lucide/vue";
import ProjectDetailModal from "@/components/ProjectDetailModal.vue";
import { profile, experience, focusTracks, featuredProjects } from "@/data/portfolio";
import { t } from "@/i18n/locale";
import { presentProject, type PresentedProject } from "@/utils/projectPresentation";

const activeProject = ref<PresentedProject | null>(null);
const currentProject = computed(() => {
  const project = featuredProjects.find((item) => item.id === "oneulsai");
  return project ? presentProject(project, "all") : null;
});

const emit = defineEmits<{ "scroll-to-section": [id: string] }>();
// 제목 끝 마침표만 강조색으로 뗀다.
const headline = computed(() => {
  const text = focusTracks[0].headline;
  return text.endsWith(".") ? { body: text.slice(0, -1), stop: "." } : { body: text, stop: "" };
});

</script>

<style scoped>
.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 1.2rem + 2.6vw, 3.5rem);
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: -0.045em;
}

.hero-current { margin: 0; }
.hero-shot {
  width: 100%;
  height: auto;
  border: 2px solid var(--fresh-ink);
  border-radius: var(--fresh-radius-md);
  box-shadow: var(--fresh-shadow-md);
  transform: rotate(2deg);
}

</style>
