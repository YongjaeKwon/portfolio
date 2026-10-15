<template>
  <section id="projects" class="fresh-stage pb-24 pt-8 md:pb-28 md:pt-10">
    <div class="section-shell">
      <div class="reveal mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="section-title">{{ t("개인 · 팀 프로젝트", "Personal & Team Projects") }}<span class="text-[var(--fresh-accent)]">.</span></h2>
          <p class="section-copy">{{ activeTrackData.projectIntro }}</p>
        </div>
      </div>

      <div v-if="projectItems.length" class="reveal">
        <section v-for="group in projectGroups" :key="group.id" class="project-group" :aria-labelledby="`project-group-${group.id}`">
          <h3 :id="`project-group-${group.id}`" class="text-primary mb-7 flex items-center gap-3 text-lg font-bold">
            {{ group.title }} <span class="text-muted font-mono text-sm">{{ group.items.length }}</span>
          </h3>
          <div class="grid gap-x-12 gap-y-12 md:grid-cols-2">
            <template v-for="(item, index) in group.items" :key="item.project.id">
              <article
                class="project-compact-card group flex h-full flex-col"
                :style="{ order: index * 2, '--thumb-rotation': index % 2 ? '1.5deg' : '-1.5deg' }"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-secondary rounded-full border border-[var(--fresh-border)] px-3 py-1.5 text-xs font-bold">
                      {{ item.project.category }}
                    </span>
                    <span
                      v-if="hasInteractiveDemo(item.project.id)"
                      class="text-secondary rounded-full border border-[var(--fresh-border)] px-2.5 py-1 text-[11px] font-black"
                    >
                      {{ t("직접 체험 가능", "Interactive demo") }}
                    </span>
                  </div>
                  <span class="text-muted font-mono tnum text-xs">{{ item.project.period }}</span>
                </div>

                <button v-if="item.project.image" type="button" :aria-label="t(`${item.project.shortTitle} 이미지와 상세 보기`, `View ${item.project.shortTitle} image and details`)" class="project-thumb focus-ring relative mt-5 flex w-full cursor-pointer aspect-video items-center justify-center overflow-hidden rounded-lg" @click="openDetail(item)">
                  <img
                    :src="item.project.image.previewSrc ?? item.project.image.src"
                    :alt="item.project.image.alt"
                    :width="item.project.image.previewWidth ?? item.project.image.width"
                    :height="item.project.image.previewHeight ?? item.project.image.height"
                    loading="lazy"
                    decoding="async"
                    :class="['h-full w-full object-top', item.project.image.caption ? 'object-contain bg-white' : 'object-cover']"
                  />
                </button>

                <h3 class="font-heading text-primary mt-7 text-2xl font-black leading-8 tracking-[-0.03em] md:text-[1.75rem]">{{ item.project.shortTitle }}</h3>
                <p v-if="item.project.subtitle" class="text-primary mt-1 text-sm font-semibold leading-6">{{ item.project.subtitle }}</p>
                <p class="text-secondary mt-3 text-sm leading-7">{{ item.card.summary }}</p>
                <p class="text-muted mt-3 text-sm leading-6">{{ item.card.description[0] }}</p>
                <p
                  v-if="!item.project.image && item.card.description[1]"
                  class="text-muted mt-2 text-sm leading-6"
                >
                  {{ item.card.description[1] }}
                </p>

                <ProjectTechStack :usage="item.detail.techUsage" class="mt-5" />

                <div class="mt-auto pt-6">
                  <div v-if="hasInteractiveDemo(item.project.id)" class="mb-5">
                    <button
                      type="button"
                      class="project-demo-cta focus-ring"
                      :aria-label="`${item.project.shortTitle} · ${demoInvites[item.project.id].label}`"
                      :aria-describedby="`demo-invite-note-${item.project.id}`"
                      :aria-expanded="inlineDemoProjectId === item.project.id"
                      :aria-controls="inlineDemoProjectId === item.project.id ? 'guided-demo' : undefined"
                      @click="openInlineDemo(item)"
                    >
                      <span class="project-demo-play" aria-hidden="true"><Play /></span>
                      <span class="project-demo-copy">
                        <strong>{{ demoInvites[item.project.id].label }}</strong>
                        <span>{{ demoInvites[item.project.id].hint }}</span>
                      </span>
                      <ArrowRight class="project-demo-arrow" aria-hidden="true" />
                    </button>
                    <p :id="`demo-invite-note-${item.project.id}`" class="text-muted mt-3 text-xs leading-5">{{ t("로그인 없이 바로 실행 · 샘플 데이터로 체험", "No sign-in needed · Demo with sample data") }}</p>
                  </div>
                  <div class="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      :class="['focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold', hasInteractiveDemo(item.project.id) ? 'project-story-link' : 'fresh-button']"
                      :aria-label="t(`${item.project.title} 개발 과정 상세 보기`, `View the ${item.project.title} development story`)"
                      @click="openDetail(item)"
                    >
                      {{ t("개발 과정 보기", "Development story") }} <ArrowRight class="h-4 w-4 shrink-0" aria-hidden="true" />
                    </button>
                    <a v-for="resource in item.detail.resources.filter(resource => resource.type === 'github' && resource.href)" :key="resource.href" :href="resource.href" target="_blank" rel="noreferrer" class="focus-ring text-secondary inline-flex min-h-11 items-center rounded-full px-2 py-2 text-sm font-bold" :aria-label="`${item.project.shortTitle} GitHub`">GitHub ↗</a>
                  </div>
                </div>
              </article>
              <section
                v-if="inlineDemoProjectId === item.project.id"
                id="guided-demo"
                :ref="setInlineDemoRef"
                class="guided-demo-shell fresh-paper scroll-mt-24 rounded-lg p-4 md:col-span-2 md:p-7"
                :style="{ '--demo-order': index * 2 + 1, '--demo-row-order': Math.floor(index / 2) * 4 + 3 }"
                aria-labelledby="guided-demo-title"
              >
                <div class="relative mb-4 pr-14">
                  <div>
                    <h3
                      id="guided-demo-title"
                      data-demo-heading
                      tabindex="-1"
                      class="text-primary mt-2 break-keep text-2xl font-black outline-none"
                    >
                      {{ item.project.shortTitle }}
                    </h3>
                  </div>
                  <button
                    type="button"
                    class="focus-ring surface-strong text-primary absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:text-[var(--accent-strong)]"
                    :aria-label="t('프로젝트 데모 닫기', 'Close project demo')"
                    @click="closeInlineDemo"
                  >
                    <X class="h-5 w-5" />
                  </button>
                </div>
                <ProjectDemoPanel
                  :key="item.project.id"
                  :project-id="item.project.id"
                  start-expanded
                  embedded
                  @ready="focusInlineDemo"
                  @dialog-state-change="handleInlineDialogStateChange"
                />
              </section>
            </template>
          </div>
        </section>
      </div>
    </div>

    <ProjectDetailModal :project="activeProject" @close="closeDetail" />
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { ArrowRight, Play, X } from "@lucide/vue";
import ProjectTechStack from "@/components/ProjectTechStack.vue";
import ProjectDetailModal from "@/components/ProjectDetailModal.vue";
import { featuredProjects } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { t } from "@/i18n/locale";
import { presentProject, type PresentedProject } from "@/utils/projectPresentation";

const ProjectDemoPanel = defineAsyncComponent(() => import("@/components/demos/ProjectDemoPanel.vue"));
const interactiveDemoProjectIds = new Set(["ticketrush", "ssafast", "ddoing", "modac"]);
const personalProjectIds = new Set(["oneulsai", "ticketrush", "reachrich", "ssafast", "ddoing", "modac"]);
const hasInteractiveDemo = (projectId: string) => interactiveDemoProjectIds.has(projectId);
const demoInvites = computed<Record<string, { label: string; hint: string }>>(() => ({
  ticketrush: { label: t("직접 예매해 보기", "Try booking a ticket"), hint: t("좌석 선택부터 예매 완료까지", "From seat selection to booking confirmation") },
  ssafast: { label: t("API 테스트해 보기", "Try the API test flow"), hint: t("명세를 작성하고 테스트 결과 확인하기", "Write a spec and explore simulated results") },
  ddoing: { label: t("직접 그려 보기", "Try drawing a word"), hint: t("영어 단어를 그림으로 표현해 보세요", "Turn an English word into a drawing") },
  modac: { label: t("스터디 참여해 보기", "Try joining a study group"), hint: t("스터디에 입장하고 채팅 남겨 보기", "Enter a study room and send a message") },
}));

const { activeTrack, activeTrackData } = useFocusTrack();
const projectItems = computed(() => {
  const order: readonly string[] = activeTrackData.value.projectOrder;
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

const teamProjectIds = new Set(["ssafast", "ddoing", "modac"]);
const projectGroups = computed(() => [
  { id: "personal", title: t("개인 프로젝트", "Personal projects"), items: projectItems.value.filter((item) => !teamProjectIds.has(item.project.id)) },
  { id: "team", title: t("교육 · 팀 프로젝트", "Training & team projects"), items: projectItems.value.filter((item) => teamProjectIds.has(item.project.id)) },
].filter((group) => group.items.length));

const setInlineDemoRef = (element: unknown) => {
  if (element instanceof HTMLElement) inlineDemoRef.value = element;
};

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
  if (inlineDemoProjectId.value === project.project.id) {
    focusInlineDemo();
    return;
  }
  inlineDemoProjectId.value = project.project.id;
};

const focusInlineDemo = () => {
  nextTick(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    inlineDemoRef.value
      ?.querySelector<HTMLElement>("[data-demo-heading]")
      ?.focus({ preventScroll: true });
    inlineDemoRef.value?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
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
  inlineDemoRef.value = null;
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
.project-thumb {
  background: var(--fresh-stage-raised);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  transform: rotate(var(--thumb-rotation, -1.5deg));
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.project-group + .project-group { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--fresh-border); }

@media (hover: hover) and (pointer: fine) {
  .project-compact-card:hover .project-thumb {
    transform: rotate(0deg);
  }
}

.project-demo-cta {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr) 1.25rem;
  align-items: center;
  gap: 1rem;
  width: 100%;
  min-height: 6rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid var(--fresh-accent);
  border-radius: var(--fresh-radius-md);
  background: var(--fresh-accent);
  color: var(--fresh-ink);
  box-shadow: 0 4px 0 #8e2e1b;
  text-align: left;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
}

.project-demo-play { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 50%; background: var(--fresh-ink); color: var(--fresh-stage-ink); }
.project-demo-play svg { width: 1.1rem; height: 1.1rem; fill: currentColor; margin-left: 2px; }
.project-demo-copy { display: grid; gap: 0.3rem; overflow-wrap: anywhere; word-break: keep-all; }
.project-demo-copy strong { font-size: 1.1rem; font-weight: 900; line-height: 1.4; }
.project-demo-copy > span { font-size: 0.8rem; font-weight: 500; line-height: 1.6; }
.project-demo-arrow { width: 1.25rem; height: 1.25rem; transition: transform 180ms ease; }
.project-story-link { border: 1px solid var(--fresh-border); color: var(--text-primary); }

@media (hover: hover) and (pointer: fine) {
  .project-demo-cta:hover { background: #f16549; transform: translateY(-3px); box-shadow: 0 7px 0 #8e2e1b; }
  .project-demo-cta:hover .project-demo-arrow {
    transform: translateX(4px);
  }
  .project-story-link:hover { background: var(--fresh-stage-raised); }
}

.project-demo-cta:active { transform: translateY(3px); box-shadow: 0 1px 0 #8e2e1b; }

@media (max-width: 480px) {
  .project-demo-cta { gap: 0.75rem; padding: 1rem; }
  .project-demo-copy strong { font-size: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  .project-thumb,
  .project-demo-cta,
  .project-demo-arrow {
    transition: none;
  }
  .project-demo-cta:hover,
  .project-demo-cta:active,
  .project-demo-cta:hover .project-demo-arrow { transform: none; }
}

.guided-demo-shell {
  order: var(--demo-order);
  border: 1px solid var(--fresh-border);
}
@media (min-width: 768px) {
  .guided-demo-shell { order: var(--demo-row-order); }
}
</style>
