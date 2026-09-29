<template>
  <section id="experience" class="pb-8 pt-24 md:pb-10 md:pt-28">
    <div class="section-shell">
      <div class="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="section-title">{{ t("경력 사항", "Work Experience") }}</h2>
          <p class="section-copy">{{ t("지금 회사에서 맡은 일과 운영 중인 시스템입니다.", "What I own at my current company, alongside the systems I've built and operated.") }}</p>
        </div>
      </div>

      <article class="career-context reveal mt-8 rounded-lg p-6 md:p-7">
        <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span class="font-mono tnum text-muted text-sm font-semibold">{{ experience.period }}</span>
            </div>
            <h3 class="text-primary mt-3 text-2xl font-black">{{ experience.title }}</h3>
            <p class="accent-text mt-1 font-bold">{{ experience.company }}</p>
            <p class="text-secondary mt-5 max-w-3xl leading-7">{{ experience.description }}</p>
          </div>

          <ul class="career-responsibilities grid gap-2 sm:grid-cols-3 lg:max-w-md lg:grid-cols-1" :aria-label="t('담당 업무 요약', 'Responsibilities summary')">
            <li v-for="item in experience.responsibilities" :key="item">
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </article>

      <div class="reveal mt-14">
        <div class="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 class="text-primary text-2xl font-black">{{ t("담당 시스템", "Systems I Own") }}</h3>
            <p class="text-muted mt-2 text-sm leading-6">{{ t("운영 중인 두 시스템과 각각의 대표 개선 사례입니다.", "Two systems running in production at my company, with a highlighted improvement for each.") }}</p>
          </div>
        </div>

        <div class="grid gap-6">
          <article
            v-for="(item, index) in workProjects"
            :key="item.project.id"
            class="case-study-card group overflow-hidden p-5 md:p-7"
          >
            <div :class="['grid items-stretch gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8', index % 2 === 1 ? 'case-layout-reverse' : '']">
              <div class="case-visual relative flex min-h-64 items-center justify-center">
                <ProjectCaseVisual
                  :project-id="item.project.id"
                  class="relative"
                />
              </div>

              <div class="flex flex-col py-1">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <span class="text-secondary inline-flex items-center gap-1.5 rounded-full border border-[var(--fresh-border)] px-3 py-1.5 text-[11px] font-black">
                    <span class="h-1.5 w-1.5 rounded-full bg-[var(--fresh-green)]" aria-hidden="true"></span>
                    {{ t("운영 중", "Live in production") }}
                  </span>
                  <p class="text-secondary font-mono tnum text-xs font-semibold">{{ item.project.period }}</p>
                </div>

                <h3 class="font-heading text-primary mt-4 text-3xl font-black leading-tight tracking-[-0.04em] md:text-[2.5rem]">{{ item.project.title }}</h3>
                <p class="text-secondary mt-3 text-base font-semibold leading-7">{{ item.card.summary }}</p>

                <div class="mt-4 grid gap-2">
                  <p v-for="line in item.card.description" :key="line" class="text-muted text-sm leading-6">
                    {{ line }}
                  </p>
                </div>

                <div v-if="item.detail.caseStudy" class="case-result mt-5 pt-5">
                  <div>
                    <p class="case-step-label">{{ t("문제", "Problem") }}</p>
                    <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.detail.caseStudy.problem }}</p>
                  </div>
                  <div class="case-result-divider mt-4 pt-4">
                    <p class="case-step-label">{{ t("개선 결과", "Outcome") }}</p>
                    <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.detail.caseStudy.outcome[0] }}</p>
                  </div>
                </div>
                <div v-else class="case-result mt-5 pt-5">
                  <p class="case-step-label">{{ t("운영 결과", "In production") }}</p>
                  <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.card.result }}</p>
                </div>

                <div class="mt-5 flex flex-wrap gap-2">
                  <span
                    v-for="keyword in item.card.keywords"
                    :key="keyword"
                    class="rounded-full border border-[var(--fresh-border)] bg-white/70 px-3 py-1.5 text-xs font-bold text-secondary"
                  >
                    {{ keyword }}
                  </span>
                </div>

                <div class="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                  <p class="text-muted text-xs font-bold">
                    <span class="text-primary">{{ t("담당", "Scope") }}</span>
                    {{ item.card.workRange }}
                  </p>
                  <button
                    type="button"
                    class="focus-ring fresh-button inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition hover:gap-2.5"
                    :aria-label="t(`${item.project.title} 상세 보기`, `View ${item.project.title} details`)"
                    @click="openDetail(item)"
                  >
                    {{ t("개발 과정 보기", "Development story") }}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <ProjectDetailModal :project="activeProject" @close="closeDetail" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ProjectCaseVisual from "@/components/ProjectCaseVisual.vue";
import ProjectDetailModal from "@/components/ProjectDetailModal.vue";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { experience, featuredProjects, focusTracks } from "@/data/portfolio";
import { t } from "@/i18n/locale";
import { presentProject, type PresentedProject } from "@/utils/projectPresentation";

const workProjectIds = new Set(["pps", "tsms"]);
const { activeTrack } = useFocusTrack();
const activeTrackData = computed(
  () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0],
);
const workProjects = computed(() => {
  const order = activeTrackData.value.projectOrder;
  return featuredProjects
    .filter(
      (project) => workProjectIds.has(project.id) && project.focuses.includes(activeTrack.value),
    )
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    .map((project) => presentProject(project, activeTrack.value));
});

const activeProject = ref<PresentedProject | null>(null);
const openDetail = (project: PresentedProject) => {
  activeProject.value = project;
};
const closeDetail = () => {
  activeProject.value = null;
};

watch(activeTrack, closeDetail);
</script>

<style scoped>
.career-context {
  border-top: 2px solid var(--fresh-rule);
  border-radius: 0;
  padding-inline: 0;
}

.career-responsibilities li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 2.75rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid rgba(17, 17, 17, 0.1);
  border-radius: 0.5rem;
  background: #ffffff;
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 750;
  line-height: 1.45;
}

.case-study-card {
  border-top: 2px solid var(--fresh-rule);
  border-radius: 0;
  padding-inline: 0;
}

@media (min-width: 64rem) {
  .case-layout-reverse .case-visual {
    order: 2;
  }
}

.case-result {
  border-top: 1px solid var(--fresh-border);
}

.case-step-label {
  color: var(--fresh-accent-strong);
  font-size: 0.6875rem;
  font-weight: 900;
}

.case-result-divider {
  border-top: 1px solid var(--fresh-border);
}
</style>
