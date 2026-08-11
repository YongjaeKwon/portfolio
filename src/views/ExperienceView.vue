<template>
  <section id="experience" class="section-tone-blue pb-8 pt-24 md:pb-10 md:pt-28">
    <div class="section-shell">
      <div class="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="flex items-center gap-3">
            <span class="section-index">02</span>
            <h2 class="section-kicker">Experience</h2>
          </div>
          <h3 class="section-title">경력 사항</h3>
          <p class="section-copy">현재 회사에서 담당하는 업무와 개발·운영해 온 시스템을 함께 정리했습니다.</p>
        </div>
        <FocusTabs />
      </div>

      <article class="career-context reveal reveal-d2 mt-8 rounded-[2rem] p-6 md:p-7">
        <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              <BriefcaseBusiness class="h-5 w-5 text-[var(--fresh-blue)]" />
              <span class="font-mono tnum text-muted text-sm font-semibold">{{ experience.period }}</span>
            </div>
            <h3 class="text-primary mt-3 text-2xl font-black">{{ experience.title }}</h3>
            <p class="accent-text mt-1 font-bold">{{ experience.company }}</p>
            <p class="text-secondary mt-5 max-w-3xl leading-7">{{ experience.description }}</p>
          </div>

          <ul class="career-responsibilities grid gap-2 sm:grid-cols-3 lg:max-w-md lg:grid-cols-1" aria-label="담당 업무 요약">
            <li v-for="item in experience.responsibilities" :key="item">
              <CheckCircle2 class="h-4 w-4 shrink-0 text-[var(--fresh-blue)]" aria-hidden="true" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </article>

      <div class="reveal mt-14">
        <div class="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 class="text-primary text-2xl font-black">담당 시스템</h3>
            <p class="text-muted mt-2 text-sm leading-6">회사에서 실제 운영 중인 두 시스템과 대표 개선 경험입니다.</p>
          </div>
          <span class="text-muted font-mono text-xs">PPS · TSMS</span>
        </div>

        <div class="grid gap-6">
          <article
            v-for="(item, index) in workProjects"
            :key="item.project.id"
            v-tilt
            class="case-study-card interactive-surface tilt group overflow-hidden rounded-[2.25rem] p-5 md:p-7"
          >
            <div :class="['grid items-stretch gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8', index % 2 === 1 ? 'case-layout-reverse' : '']">
              <div class="case-visual relative flex min-h-64 items-center justify-center overflow-hidden rounded-[1.75rem] p-3 md:p-4">
                <div class="case-visual-orb pointer-events-none absolute inset-0" />
                <ProjectCaseVisual
                  :project-id="item.project.id"
                  class="relative transition duration-500 group-hover:scale-[1.01]"
                />
              </div>

              <div class="flex flex-col py-1">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <span class="rounded-full bg-[var(--fresh-blue-soft)] px-3 py-1.5 text-[10px] font-black text-[var(--fresh-blue-strong)]">
                    실무 · 운영 중
                  </span>
                  <p class="text-secondary font-mono tnum text-xs font-semibold">{{ item.project.period }}</p>
                </div>

                <h3 class="text-primary mt-4 text-2xl font-black leading-9 md:text-3xl">{{ item.project.title }}</h3>
                <p class="text-secondary mt-3 text-base font-semibold leading-7">{{ item.card.summary }}</p>

                <div class="mt-4 grid gap-2">
                  <p v-for="line in item.card.description" :key="line" class="text-muted text-sm leading-6">
                    {{ line }}
                  </p>
                </div>

                <div v-if="item.detail.caseStudy" class="case-result mt-5 rounded-2xl p-4">
                  <div>
                    <p class="case-step-label">문제</p>
                    <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.detail.caseStudy.problem }}</p>
                  </div>
                  <div class="case-result-divider mt-4 pt-4">
                    <p class="case-step-label">개선 결과</p>
                    <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.detail.caseStudy.outcome[0] }}</p>
                  </div>
                </div>
                <div v-else class="case-result mt-5 rounded-2xl p-4">
                  <p class="case-step-label">실제 운영</p>
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
                    <span class="text-primary">담당</span>
                    {{ item.card.workRange }}
                  </p>
                  <button
                    type="button"
                    class="focus-ring fresh-button inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition hover:gap-2.5"
                    :aria-label="`${item.project.title} 상세 보기`"
                    @click="openDetail(item)"
                  >
                    상세 보기
                    <ArrowRight class="h-4 w-4" />
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
import { ArrowRight, BriefcaseBusiness, CheckCircle2 } from "@lucide/vue";
import FocusTabs from "@/components/FocusTabs.vue";
import ProjectCaseVisual from "@/components/ProjectCaseVisual.vue";
import ProjectDetailModal from "@/components/ProjectDetailModal.vue";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { experience, featuredProjects, focusTracks } from "@/data/portfolio";
import { vTilt } from "@/directives/tilt";
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
  border: 1px solid rgba(255, 255, 255, 0.92);
  background:
    radial-gradient(circle at 92% 12%, rgba(83, 199, 245, 0.12), transparent 32%),
    rgba(255, 255, 255, 0.96);
  box-shadow: 0 20px 60px rgba(38, 69, 111, 0.09);
}

.career-responsibilities li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 2.75rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid rgba(49, 130, 246, 0.1);
  border-radius: 0.9rem;
  background: rgba(248, 251, 255, 0.84);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 750;
  line-height: 1.45;
}

.case-study-card {
  border: 1px solid rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 70px rgba(38, 69, 111, 0.11);
}

.case-visual {
  border: 1px solid rgba(49, 130, 246, 0.1);
  background:
    linear-gradient(145deg, rgba(49, 130, 246, 0.11), rgba(83, 199, 245, 0.055)),
    rgba(248, 251, 255, 0.92);
}

.case-visual-orb {
  background:
    radial-gradient(circle at 18% 22%, rgba(49, 130, 246, 0.18), transparent 38%),
    radial-gradient(circle at 88% 80%, rgba(83, 199, 245, 0.2), transparent 42%);
}

@media (min-width: 64rem) {
  .case-layout-reverse .case-visual {
    order: 2;
  }
}

.case-result {
  border: 1px solid rgba(49, 130, 246, 0.12);
  background: linear-gradient(105deg, rgba(49, 130, 246, 0.075), rgba(83, 199, 245, 0.05));
}

.case-step-label {
  color: var(--fresh-blue-strong);
  font-size: 0.6875rem;
  font-weight: 900;
}

.case-result-divider {
  border-top: 1px solid rgba(49, 130, 246, 0.12);
}
</style>
