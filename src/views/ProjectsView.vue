<template>
  <section id="projects" class="pb-24 pt-8 md:pb-28 md:pt-10">
    <div class="section-shell">
      <div class="reveal mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="section-title">{{ t("개인 · 팀 프로젝트", "Personal & Team Projects") }}</h2>
          <p class="section-copy">{{ activeTrackData.projectIntro }}</p>
        </div>
      </div>

      <div v-if="projectItems.length" class="reveal">
        <div :class="['grid gap-5', projectItems.length === 1 ? 'max-w-2xl' : 'md:grid-cols-2']">
          <article
            v-for="item in projectItems"
            :key="item.project.id"
            class="project-compact-card interactive-surface group flex h-full flex-col overflow-hidden rounded-lg p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-secondary rounded-full border border-[var(--fresh-border)] bg-white/70 px-3 py-1.5 text-xs font-bold">
                  {{ item.project.category }}
                </span>
                <span
                  v-if="hasInteractiveDemo(item.project.id)"
                  class="text-secondary rounded-full border border-[var(--fresh-border)] px-2.5 py-1 text-[11px] font-black"
                >
                  {{ t("샘플 데모", "Sample demo") }}
                </span>
              </div>
              <span class="text-muted font-mono tnum text-xs">{{ item.project.period }}</span>
            </div>

            <div v-if="item.project.id === 'reachrich'" class="project-thumb mt-5 h-40 overflow-hidden rounded-lg p-2">
              <ProjectCaseVisual :project-id="item.project.id" compact />
            </div>
            <div v-else-if="item.project.image" class="project-thumb mt-5 flex h-40 items-center justify-center overflow-hidden rounded-lg p-3">
              <img
                :src="item.project.image.previewSrc ?? item.project.image.src"
                :alt="item.project.image.alt"
                :width="item.project.image.previewWidth ?? item.project.image.width"
                :height="item.project.image.previewHeight ?? item.project.image.height"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-contain"
              />
            </div>

            <h3 class="text-primary mt-5 text-xl font-black leading-7">{{ item.project.shortTitle }}</h3>
            <p class="text-secondary mt-3 text-sm font-semibold leading-6">{{ item.card.summary }}</p>
            <p class="text-muted mt-3 text-sm leading-6">{{ item.card.description[0] }}</p>
            <p
              v-if="item.project.id !== 'reachrich' && !item.project.image && item.card.description[1]"
              class="text-muted mt-2 text-sm leading-6"
            >
              {{ item.card.description[1] }}
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="stack in item.project.stack.slice(0, 4)"
                :key="stack"
                class="tech-chip rounded-full border border-[var(--fresh-border)] bg-white/70 px-2.5 py-1 text-xs font-bold text-secondary"
              >
                {{ stack }}
              </span>
            </div>

            <div class="mt-auto flex flex-wrap items-center gap-3 pt-6">
              <button
                v-if="hasInteractiveDemo(item.project.id)"
                type="button"
                class="focus-ring fresh-button inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-black transition hover:gap-2.5"
                :aria-label="t(`${item.project.title} 전체 흐름 직접 체험`, `Try the full ${item.project.title} flow`)"
                @click="openInlineDemo(item)"
              >
                <Play class="h-4 w-4" />
                {{ t("직접 체험하기", "Try it yourself") }}
              </button>
              <button
                type="button"
                class="focus-ring inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-sm font-black text-[var(--fresh-blue-strong)] transition hover:gap-2.5"
                :aria-label="t(`${item.project.title} 개발 과정 상세 보기`, `View the ${item.project.title} development story`)"
                @click="openDetail(item)"
              >
                {{ t("개발 과정 보기", "Development story") }}
                <ArrowRight class="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>

        <section
          v-if="inlineDemoProject"
          ref="inlineDemoRef"
          class="guided-demo-shell mt-10 scroll-mt-28 rounded-lg p-5 md:p-7"
          aria-labelledby="guided-demo-title"
        >
          <div class="relative mb-5 pr-14">
            <div>
              <h3
                id="guided-demo-title"
                data-demo-heading
                tabindex="-1"
                class="text-primary mt-2 break-keep text-2xl font-black outline-none"
              >
                {{ inlineDemoProject.project.title }}
              </h3>
              <p class="text-muted mt-2 max-w-2xl text-sm leading-6">
                {{ t("샘플 데이터로 서비스를 재현했습니다. 단계마다 제가 실제로 맡은 부분과 데모로 만든 부분을 나눠 표시했습니다.", "The service flow is rebuilt with sample data; each step marks what I actually built versus the public simulation.") }}
              </p>
            </div>
            <button
              type="button"
              class="focus-ring surface-strong text-primary absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:text-[var(--accent-strong)]"
              :aria-label="t('프로젝트 데모 닫기', 'Close project demo')"
              @click="closeInlineDemo"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
          <ProjectDemoPanel
            :key="inlineDemoProject.project.id"
            :project-id="inlineDemoProject.project.id"
            start-expanded
            embedded
            @dialog-state-change="handleInlineDialogStateChange"
          />
        </section>
      </div>
    </div>

    <ProjectDetailModal :project="activeProject" @close="closeDetail" />
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { ArrowRight, Play, X } from "@lucide/vue";
import ProjectCaseVisual from "@/components/ProjectCaseVisual.vue";
import ProjectDetailModal from "@/components/ProjectDetailModal.vue";
import { featuredProjects, focusTracks } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { t } from "@/i18n/locale";
import { presentProject, type PresentedProject } from "@/utils/projectPresentation";

const ProjectDemoPanel = defineAsyncComponent(() => import("@/components/demos/ProjectDemoPanel.vue"));
const interactiveDemoProjectIds = new Set(["ticketrush", "ssafast", "ddoing", "modac"]);
const personalProjectIds = new Set(["ticketrush", "oneulsai", "reachrich", "ssafast", "ddoing", "modac"]);
const hasInteractiveDemo = (projectId: string) => interactiveDemoProjectIds.has(projectId);

const { activeTrack } = useFocusTrack();
const activeTrackData = computed(
  () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0],
);
const projectItems = computed(() => {
  const order = activeTrackData.value.projectOrder;
  return featuredProjects
    .filter(
      (project) =>
        personalProjectIds.has(project.id) && project.focuses.includes(activeTrack.value),
    )
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    .map((project) => presentProject(project, activeTrack.value));
});

const activeProject = ref<PresentedProject | null>(null);
const inlineDemoProjectId = ref<string | null>(null);
const inlineDemoRef = ref<HTMLElement | null>(null);
const inlineDemoTriggerEl = ref<HTMLElement | null>(null);
const isolatedAppRoot = ref<HTMLElement | null>(null);
let previousAppAriaHidden: string | null = null;
let previousBodyOverflow = "";

const inlineDemoProject = computed(
  () => projectItems.value.find((item) => item.project.id === inlineDemoProjectId.value) ?? null,
);

const openDetail = (project: PresentedProject) => {
  clearInlineDemo();
  activeProject.value = project;
};

const closeDetail = () => {
  activeProject.value = null;
};

const openInlineDemo = (project: PresentedProject) => {
  activeProject.value = null;
  inlineDemoTriggerEl.value = document.activeElement as HTMLElement;
  inlineDemoProjectId.value = project.project.id;
  nextTick(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    inlineDemoRef.value?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    inlineDemoRef.value
      ?.querySelector<HTMLElement>("[data-demo-heading]")
      ?.focus({ preventScroll: true });
  });
};

const handleInlineDialogStateChange = (open: boolean) => {
  const appRoot = document.querySelector<HTMLElement>("#app");
  if (open && appRoot) {
    if (isolatedAppRoot.value) return;
    isolatedAppRoot.value = appRoot;
    previousAppAriaHidden = appRoot.getAttribute("aria-hidden");
    previousBodyOverflow = document.body.style.overflow;
    appRoot.inert = true;
    appRoot.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "hidden";
    return;
  }

  const root = isolatedAppRoot.value;
  if (root) {
    root.inert = false;
    if (previousAppAriaHidden === null) root.removeAttribute("aria-hidden");
    else root.setAttribute("aria-hidden", previousAppAriaHidden);
  }
  document.body.style.overflow = previousBodyOverflow;
  isolatedAppRoot.value = null;
  previousAppAriaHidden = null;
  previousBodyOverflow = "";
};

const clearInlineDemo = () => {
  handleInlineDialogStateChange(false);
  inlineDemoProjectId.value = null;
};

const closeInlineDemo = () => {
  clearInlineDemo();
  nextTick(() => inlineDemoTriggerEl.value?.focus());
};

watch(activeTrack, () => {
  activeProject.value = null;
  clearInlineDemo();
});

onBeforeUnmount(() => {
  handleInlineDialogStateChange(false);
});
</script>

<style scoped>
.project-compact-card {
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.96);
}

.project-thumb {
  border: 1px solid rgba(49, 130, 246, 0.08);
  background: linear-gradient(145deg, rgba(49, 130, 246, 0.065), rgba(255, 255, 255, 0.72));
}

.guided-demo-shell {
  border: 1px solid rgba(49, 130, 246, 0.16);
  background:
    rgba(255, 255, 255, 0.96);
}
</style>
