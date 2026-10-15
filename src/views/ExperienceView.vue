<template>
  <section id="experience" class="pb-8 pt-12 md:pb-10 md:pt-16">
    <div class="section-shell">
      <div class="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="section-title">{{ t("경력 사항", "Work Experience") }}</h2>
        </div>
      </div>

      <article class="career-context reveal mt-8 rounded-lg p-6 md:p-7">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span class="font-mono tnum text-muted text-sm font-semibold">{{ experience.period }}</span>
        </div>
        <h3 class="text-primary mt-3 text-2xl font-black">{{ experience.title }}</h3>
        <p class="text-secondary mt-1 font-bold">{{ experience.company }}</p>
        <p class="text-secondary mt-4 max-w-3xl leading-7">{{ experience.description }}</p>
      </article>

      <div class="reveal mt-8">
        <div class="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 class="text-primary text-2xl font-black">{{ t("담당 시스템", "Systems & Contributions") }}</h3>
          </div>
          <div class="flex flex-wrap items-center gap-x-3">
            <span class="text-muted text-xs">{{ t("경험별로 보기", "Explore by area") }}</span>
            <FocusTabs />
          </div>
        </div>

        <div class="grid gap-6">
          <article
            v-for="item in workProjects"
            :key="item.project.id"
            class="case-study-card group overflow-hidden p-5 md:p-7"
          >
            <header>
              <p class="text-muted font-mono tnum text-xs font-semibold">{{ item.project.period }}</p>
              <h3 class="font-heading text-primary mt-2 text-2xl font-black leading-snug tracking-[-0.03em] md:text-3xl">{{ item.project.title }}</h3>
              <p class="text-secondary mt-3 text-sm leading-6"><strong class="text-primary mr-2">{{ t("담당", "Scope") }}</strong>{{ item.card.workRange }}</p>
            </header>
            <div class="mt-5 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
              <div>
                <p class="text-secondary text-sm leading-7">{{ item.card.summary }}</p>
                <ProjectCaseVisual v-if="activeTrack === 'all'" :project-id="item.project.id" compact />
                <ProjectTechStack :usage="item.detail.techUsage" class="mt-5" />
              </div>
              <div class="case-result pt-5 lg:pt-0">
                <p class="case-step-label">{{ t("주요 업무 및 개선", "Work & improvements") }}</p>
                <p class="text-primary mt-2 text-lg font-bold leading-7">{{ item.card.description[0] }}</p>
                <p class="text-secondary mt-3 text-sm leading-7">{{ item.card.result }}</p>
                <ul v-if="item.card.highlights?.length" class="mt-5 grid gap-4 border-t border-[var(--fresh-border)] pt-4">
                  <li v-for="highlight in item.card.highlights" :key="highlight.title">
                    <h4 class="text-primary text-sm font-bold leading-6">{{ highlight.title }}</h4>
                    <p class="text-secondary mt-1 text-sm leading-6">{{ highlight.detail }}</p>
                  </li>
                </ul>
                <p v-else-if="item.card.description[1]" class="text-muted mt-3 text-sm leading-6">{{ item.card.description[1] }}</p>
                <button type="button" class="focus-ring fresh-button mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold" :aria-label="t(`${item.project.title} 상세 보기`, `View ${item.project.title} details`)" @click="openDetail(item)">
                  {{ t("개발 과정 보기", "Development story") }} <ArrowRight class="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
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
import { ArrowRight } from "@lucide/vue";
import FocusTabs from "@/components/FocusTabs.vue";
import ProjectTechStack from "@/components/ProjectTechStack.vue";
import ProjectDetailModal from "@/components/ProjectDetailModal.vue";
import ProjectCaseVisual from "@/components/ProjectCaseVisual.vue";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { experience, featuredProjects } from "@/data/portfolio";
import { t } from "@/i18n/locale";
import { presentProject, type PresentedProject } from "@/utils/projectPresentation";

const workProjectIds = new Set(["pps", "tsms", "sr30"]);
const { activeTrack, activeTrackData } = useFocusTrack();
const workProjects = computed(() => {
  const order: readonly string[] = activeTrackData.value.projectOrder;
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

.case-study-card {
  border-top: 2px solid var(--fresh-rule);
  border-radius: 0;
  padding-inline: 0;
}

.case-result {
  border-top: 1px solid var(--fresh-border);
}
@media (min-width: 64rem) {
  .case-result { border-top: 0; border-left: 1px solid var(--fresh-border); padding-left: 2rem; }
}

.case-step-label {
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 900;
}

</style>
