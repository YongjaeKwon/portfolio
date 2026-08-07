<template>
  <section id="projects" class="section-tone-blue py-24 md:py-28">
    <div class="section-shell">
      <div class="reveal mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="flex items-center gap-3">
            <span class="section-index">01</span>
            <h2 class="section-kicker">Projects</h2>
          </div>
          <h3 class="section-title">주요 개발 경험</h3>
          <p class="section-copy">{{ activeTrackData.projectIntro }}</p>
        </div>
        <FocusTabs />
      </div>

      <div class="grid gap-6">
        <article
          v-for="(item, index) in representativeProjects"
          :key="item.project.id"
          v-tilt
          class="case-study-card interactive-surface tilt group overflow-hidden rounded-[2.25rem] p-5 md:p-7"
        >
          <div :class="['grid items-stretch gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8', index % 2 === 1 ? 'case-layout-reverse' : '']">
            <div class="case-visual relative flex min-h-64 items-center justify-center overflow-hidden rounded-[1.75rem] p-3 md:p-4">
              <div class="case-visual-orb pointer-events-none absolute inset-0"></div>
              <ProjectCaseVisual :project-id="item.project.id" class="relative transition duration-500 group-hover:scale-[1.01]" />
            </div>

            <div class="flex flex-col py-1">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <p class="section-kicker">Featured Case</p>
                  <span class="rounded-full bg-[var(--fresh-blue-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--fresh-blue-strong)]">운영 중</span>
                </div>
                <p class="text-secondary font-mono tnum text-xs font-semibold">{{ item.project.period }}</p>
              </div>
              <h3 class="text-primary mt-4 text-2xl font-black leading-9 md:text-3xl">{{ item.project.title }}</h3>
              <p class="text-secondary mt-3 text-base font-semibold leading-7">{{ item.card.summary }}</p>

              <div class="mt-4 grid gap-2">
                <p v-for="line in item.card.description" :key="line" class="text-muted text-sm leading-6">{{ line }}</p>
              </div>

              <div v-if="item.detail.caseStudy" class="case-result mt-5 rounded-2xl p-4">
                <div>
                  <p class="case-step-label">문제</p>
                  <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.detail.caseStudy.problem }}</p>
                </div>
                <div class="case-result-divider mt-4 pt-4">
                  <p class="case-step-label">확인된 결과</p>
                  <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.detail.caseStudy.outcome[0] }}</p>
                </div>
              </div>
              <div v-else class="case-result mt-5 rounded-2xl p-4">
                <p class="case-step-label">실제 운영</p>
                <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.card.result }}</p>
              </div>

              <div class="mt-5 flex flex-wrap gap-2">
                <span v-for="keyword in item.card.keywords" :key="keyword" class="rounded-full border border-[var(--fresh-border)] bg-white/70 px-3 py-1.5 text-xs font-bold text-secondary">{{ keyword }}</span>
              </div>

              <div class="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                <p class="text-muted text-xs font-bold"><span class="text-primary">담당</span> {{ item.card.workRange }}</p>
                <button type="button" class="focus-ring fresh-button inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition hover:gap-2.5" :aria-label="`${item.project.title} 상세 보기`" @click="openDetail(item)">
                  상세 보기
                  <ArrowRight class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-if="otherProjects.length" class="reveal mt-20 border-t border-[var(--fresh-border)] pt-14">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 class="section-kicker">Team & Personal</h3>
            <p class="text-primary mt-3 text-2xl font-black">개인·팀 프로젝트</p>
          </div>
          <p class="text-muted max-w-xl text-sm leading-6">교육 과정과 개인 학습을 통해 진행한 프로젝트입니다. 주요 구현 내용과 코드는 GitHub에서 확인할 수 있습니다.</p>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="item in otherProjects" :key="item.project.id" class="project-compact-card interactive-surface group flex h-full flex-col overflow-hidden rounded-[1.75rem] p-5">
            <div class="flex items-center justify-between gap-3">
              <span class="rounded-full border border-[var(--fresh-border)] bg-white/70 px-3 py-1.5 text-xs font-bold text-[var(--fresh-blue-strong)]">{{ item.project.category }}</span>
              <span class="text-muted font-mono tnum text-xs">{{ item.project.period }}</span>
            </div>
            <div v-if="item.project.image" class="project-thumb mt-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl p-3">
              <img
                :src="item.project.image.previewSrc ?? item.project.image.src"
                :alt="item.project.image.alt"
                :width="item.project.image.previewWidth ?? item.project.image.width"
                :height="item.project.image.previewHeight ?? item.project.image.height"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <h4 class="text-primary mt-5 text-xl font-black leading-7">{{ item.project.shortTitle }}</h4>
            <p class="text-secondary mt-3 text-sm font-semibold leading-6">{{ item.card.summary }}</p>
            <p class="text-muted mt-3 text-sm leading-6">{{ item.card.description[0] }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="stack in item.project.stack.slice(0, 4)" :key="stack" class="tech-chip rounded-full border border-[var(--fresh-border)] bg-white/70 px-2.5 py-1 text-xs font-bold text-secondary">{{ stack }}</span>
            </div>
            <button type="button" class="focus-ring mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm font-black text-[var(--fresh-blue-strong)] transition hover:gap-2.5" :aria-label="`${item.project.title} 상세 보기`" @click="openDetail(item)">
              프로젝트 보기
              <ArrowRight class="h-4 w-4" />
            </button>
          </article>
        </div>
      </div>

    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="activeProject"
          class="case-study-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="detailTitleId"
          @click.self="closeDetail"
        >
          <div ref="modalRef" class="case-study-modal flex max-h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl">
            <div class="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] p-5 md:p-6">
              <div>
                <p class="section-kicker">Project Detail</p>
                <h3 :id="detailTitleId" class="text-primary mt-2 text-2xl font-black">{{ activeProject.project.title }}</h3>
                <p class="text-muted mt-2 text-sm">{{ activeProject.project.period }} · {{ activeProject.project.category }}</p>
              </div>
              <button type="button" class="focus-ring surface-strong text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:text-[var(--accent-strong)]" aria-label="상세 닫기" @click="closeDetail">
                <X class="h-5 w-5" />
              </button>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto p-5 md:p-8" tabindex="0" aria-label="프로젝트 상세 내용">
              <ProjectCaseVisual
                v-if="activeProject.project.id === 'pps' || activeProject.project.id === 'tsms'"
                :project-id="activeProject.project.id"
                class="mb-8"
              />
              <img
                v-else-if="activeProject.project.image"
                :src="activeProject.project.image.src"
                :alt="activeProject.project.image.alt"
                :width="activeProject.project.image.width"
                :height="activeProject.project.image.height"
                decoding="async"
                class="mb-8 max-h-80 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] object-contain p-3"
              />

              <div class="grid gap-6">
                <DetailBlock title="프로젝트 개요" :items="[activeProject.detail.overview]" />

                <section v-if="roleSections.length">
                  <h4 class="text-primary mb-3 font-black">영역별 담당 내용</h4>
                  <div class="grid gap-4">
                    <article
                      v-for="section in roleSections"
                      :key="section.id"
                      class="role-contribution rounded-xl p-5 md:p-6"
                    >
                      <div class="mb-5 flex items-center gap-3">
                        <span class="rounded-full bg-[var(--fresh-blue-soft)] px-3 py-1.5 text-xs font-black text-[var(--fresh-blue-strong)]">
                          {{ section.label }}
                        </span>
                      </div>

                      <div class="grid gap-5 md:grid-cols-2">
                        <div>
                          <h5 class="text-primary text-sm font-black">주요 역할</h5>
                          <ul class="mt-3 grid gap-2.5">
                            <li v-for="item in section.scope" :key="item" class="role-detail-item text-secondary text-sm leading-6">
                              {{ item }}
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 class="text-primary text-sm font-black">주요 구현 내용</h5>
                          <ul class="mt-3 grid gap-2.5">
                            <li v-for="item in section.workPoints" :key="item" class="role-detail-item text-secondary text-sm leading-6">
                              {{ item }}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </article>
                  </div>
                </section>

                <ProjectCaseStudyList
                  v-if="hasDetailedCaseStudies(activeProject.project.id)"
                  :project-id="activeProject.project.id"
                />

                <section v-else-if="activeProject.detail.caseStudy">
                  <h4 class="text-primary mb-3 font-black">문제 해결 과정</h4>
                  <div class="case-process-grid grid gap-3 md:grid-cols-2">
                    <article class="case-process-step rounded-xl p-5">
                      <h5 class="case-step-label">01 · 문제</h5>
                      <p class="text-secondary mt-3 text-sm leading-6">{{ activeProject.detail.caseStudy.problem }}</p>
                    </article>
                    <article class="case-process-step rounded-xl p-5">
                      <h5 class="case-step-label">02 · 판단</h5>
                      <p class="text-secondary mt-3 text-sm leading-6">{{ activeProject.detail.caseStudy.decision }}</p>
                    </article>
                    <article class="case-process-step rounded-xl p-5">
                      <h5 class="case-step-label">03 · 구현</h5>
                      <ul class="mt-3 grid gap-2">
                        <li v-for="item in activeProject.detail.caseStudy.implementation" :key="item" class="role-detail-item text-secondary text-sm leading-6">
                          {{ item }}
                        </li>
                      </ul>
                    </article>
                    <article class="case-process-step rounded-xl p-5">
                      <h5 class="case-step-label">04 · 결과</h5>
                      <ul class="mt-3 grid gap-2">
                        <li v-for="item in activeProject.detail.caseStudy.outcome" :key="item" class="role-detail-item text-secondary text-sm leading-6">
                          {{ item }}
                        </li>
                      </ul>
                    </article>
                  </div>
                </section>

                <template v-else>
                  <DetailBlock title="주요 역할" :items="activeProject.detail.scope" />
                  <DetailBlock title="주요 구현 내용" :items="activeProject.detail.workPoints" />
                </template>
                <DetailBlock
                  v-if="!hasDetailedCaseStudies(activeProject.project.id) && !activeProject.detail.caseStudy"
                  title="결과"
                  :items="activeProject.detail.results"
                />
                <DetailBlock title="사용 기술" :items="activeProject.detail.techUsage" />
                <DetailBlock title="공개 범위" :items="[activeProject.detail.disclosure]" />

                <div v-if="activeProject.detail.resources.length">
                  <h4 class="text-primary mb-3 font-black">관련 자료</h4>
                  <div class="flex flex-wrap gap-2">
                    <a
                      v-for="resource in activeProject.detail.resources"
                      :key="resource.label"
                      :href="resource.href"
                      :target="resource.type === 'github' ? '_blank' : undefined"
                      :rel="resource.type === 'github' ? 'noreferrer' : undefined"
                      class="focus-ring fresh-list-item text-secondary inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition hover:text-[var(--fresh-blue-strong)]"
                    >
                      <ExternalLink class="h-4 w-4" />
                      {{ resource.label }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ArrowRight, ExternalLink, X } from "@lucide/vue";
import FocusTabs from "@/components/FocusTabs.vue";
import ProjectCaseVisual from "@/components/ProjectCaseVisual.vue";
import { featuredProjects, focusTracks, type RoleFocusId } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { presentProject, type PresentedProject } from "@/utils/projectPresentation";
import { createLatestFrameScheduler } from "@/utils/frameScheduler";

const ProjectCaseStudyList = defineAsyncComponent(() => import("@/components/ProjectCaseStudyList.vue"));
const detailedCaseProjectIds = new Set(["pps", "tsms"]);
const hasDetailedCaseStudies = (projectId: string) => detailedCaseProjectIds.has(projectId);

const DetailBlock = defineComponent({
  props: { title: { type: String, required: true }, items: { type: Array as () => string[], required: true } },
  setup(props) {
    return () => h("section", [
      h("h4", { class: "text-primary mb-3 font-black" }, props.title),
      h("ul", { class: "grid gap-3" }, props.items.map((item) => h("li", { class: "surface-strong text-secondary rounded-lg p-4 text-sm leading-6" }, item))),
    ]);
  },
});

const { activeTrack } = useFocusTrack();
const activeTrackData = computed(() => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]);

const presentedProjects = computed(() => {
  const order = activeTrackData.value.projectOrder;
  return featuredProjects
    .filter((project) => project.focuses.includes(activeTrack.value))
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    .map((project) => presentProject(project, activeTrack.value));
});

const representativeProjects = computed(() =>
  presentedProjects.value.filter((item) => item.project.id === "pps" || item.project.id === "tsms")
);

const otherProjects = computed(() =>
  presentedProjects.value.filter((item) => item.project.id !== "pps" && item.project.id !== "tsms")
);

const activeProject = ref<PresentedProject | null>(null);
const roleSections = computed(() => {
  const project = activeProject.value?.project;
  if (!project?.perspectives) return [];

  return (["frontend", "backend"] as RoleFocusId[]).flatMap((id) => {
    const detail = project.perspectives?.[id]?.detail;
    if (!detail?.scope?.length || !detail.workPoints?.length) return [];

    return [{
      id,
      label: id === "frontend" ? "Frontend" : "Backend",
      scope: detail.scope,
      workPoints: detail.workPoints,
    }];
  });
});
const detailTitleId = "project-detail-title";
const modalRef = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLElement | null>(null);
const FOCUSABLE = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

const openDetail = (project: PresentedProject) => {
  triggerEl.value = document.activeElement as HTMLElement;
  activeProject.value = project;
};

const closeDetail = () => {
  activeProject.value = null;
  nextTick(() => triggerEl.value?.focus());
};

watch(activeTrack, () => {
  if (activeProject.value) closeDetail();
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && activeProject.value) {
    closeDetail();
    return;
  }
  if (event.key === "Tab" && activeProject.value && modalRef.value) {
    const focusable = [...modalRef.value.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
};

watch(activeProject, (project) => {
  document.body.style.overflow = project ? "hidden" : "";
  if (project) nextTick(() => modalRef.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus());
});

onMounted(() => window.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});

type TiltHandlers = {
  destroy: () => void;
};

const tiltHandlers = new WeakMap<HTMLElement, TiltHandlers>();
const vTilt = {
  mounted(el: HTMLElement) {
    const hoverPointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const passiveOptions = { passive: true } as const;
    const activeScrollOptions = { passive: true, capture: true } as const;
    let pointerListenersActive = false;
    let hoverActive = false;
    let rect: DOMRect | null = null;
    let latestPoint: { x: number; y: number } | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const resetTilt = () => {
      el.style.transition = "transform 0.35s ease";
      el.style.transform = "";
    };
    const scheduler = createLatestFrameScheduler((point: { x: number; y: number }) => {
      if (!hoverActive) {
        if (el.matches(":hover")) {
          activateHover(point);
        } else {
          stopActiveHover();
          resetTilt();
          return;
        }
      }
      if (!el.matches(":hover")) {
        stopActiveHover();
        resetTilt();
        return;
      }

      latestPoint = point;
      if (!rect) rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        resetTilt();
        return;
      }

      const px = (point.x - rect.left) / rect.width - 0.5;
      const py = (point.y - rect.top) / rect.height - 0.5;
      el.style.transition = "transform 0s";
      el.style.transform = `perspective(1100px) rotateY(${px * 2}deg) rotateX(${-py * 2}deg)`;
    });

    const invalidateGeometry = () => {
      rect = null;
      if (latestPoint) scheduler.schedule(latestPoint);
    };
    const detachActiveHoverObservation = () => {
      window.removeEventListener("scroll", invalidateGeometry, activeScrollOptions);
      window.removeEventListener("resize", invalidateGeometry);
      resizeObserver?.disconnect();
      resizeObserver = null;
    };
    const stopActiveHover = () => {
      scheduler.cancel();
      detachActiveHoverObservation();
      hoverActive = false;
      rect = null;
      latestPoint = null;
    };
    const activateHover = (point: { x: number; y: number }) => {
      if (hoverActive) return;
      hoverActive = true;
      latestPoint = point;
      rect = null;
      window.addEventListener("scroll", invalidateGeometry, activeScrollOptions);
      window.addEventListener("resize", invalidateGeometry, passiveOptions);
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(invalidateGeometry);
        resizeObserver.observe(el);
      }
    };
    const onEnter = (event: PointerEvent) => {
      const point = { x: event.clientX, y: event.clientY };
      activateHover(point);
      scheduler.schedule(point);
    };
    const onMove = (event: PointerEvent) => {
      const point = { x: event.clientX, y: event.clientY };
      latestPoint = point;
      scheduler.schedule(point);
    };
    const onLeave = () => {
      stopActiveHover();
      resetTilt();
    };
    const attachPointerListeners = () => {
      if (pointerListenersActive) return;
      el.addEventListener("pointerenter", onEnter, passiveOptions);
      el.addEventListener("pointermove", onMove, passiveOptions);
      el.addEventListener("pointerleave", onLeave, passiveOptions);
      pointerListenersActive = true;
    };
    const detachPointerListeners = () => {
      if (!pointerListenersActive) return;
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      pointerListenersActive = false;
    };
    const reconcilePointerEffects = () => {
      const pointerEffectsEnabled = hoverPointerQuery.matches && !reducedMotionQuery.matches;
      if (pointerEffectsEnabled) {
        attachPointerListeners();
      } else {
        detachPointerListeners();
        stopActiveHover();
        resetTilt();
      }
    };

    hoverPointerQuery.addEventListener("change", reconcilePointerEffects);
    reducedMotionQuery.addEventListener("change", reconcilePointerEffects);
    reconcilePointerEffects();
    tiltHandlers.set(el, {
      destroy: () => {
        hoverPointerQuery.removeEventListener("change", reconcilePointerEffects);
        reducedMotionQuery.removeEventListener("change", reconcilePointerEffects);
        detachPointerListeners();
        stopActiveHover();
        resetTilt();
      },
    });
  },
  unmounted(el: HTMLElement) {
    const handlers = tiltHandlers.get(el);
    if (!handlers) return;
    handlers.destroy();
    tiltHandlers.delete(el);
  },
};
</script>

<style scoped>
.case-study-card {
  border: 1px solid rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 24px 70px rgba(38, 69, 111, 0.11);
  backdrop-filter: blur(22px);
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
  .case-layout-reverse .case-visual { order: 2; }
}
.case-result {
  border: 1px solid rgba(49, 130, 246, 0.12);
  background: linear-gradient(105deg, rgba(49, 130, 246, 0.075), rgba(83, 199, 245, 0.05));
}
.case-step-label {
  color: var(--fresh-blue-strong);
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0;
}
.case-result-divider {
  border-top: 1px solid rgba(49, 130, 246, 0.12);
}
.case-process-step {
  border: 1px solid rgba(49, 130, 246, 0.12);
  background: rgba(255, 255, 255, 0.72);
}
.project-compact-card {
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 16px 45px rgba(38, 69, 111, 0.08);
  backdrop-filter: blur(18px);
}
.project-thumb {
  border: 1px solid rgba(49, 130, 246, 0.08);
  background: linear-gradient(145deg, rgba(49, 130, 246, 0.065), rgba(255, 255, 255, 0.72));
}
.role-contribution {
  border: 1px solid rgba(49, 130, 246, 0.12);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 34px rgba(38, 69, 111, 0.07);
}
.role-detail-item {
  position: relative;
  padding-left: 1rem;
}
.role-detail-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.65rem;
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 999px;
  background: var(--fresh-blue);
}
.modal-enter-active { transition: opacity 0.22s ease; }
.modal-leave-active { transition: opacity 0.18s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-active .case-study-modal { animation: modal-panel-in 0.26s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-leave-active .case-study-modal { animation: modal-panel-out 0.18s ease forwards; }
@keyframes modal-panel-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modal-panel-out {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to { opacity: 0; transform: scale(0.95) translateY(10px); }
}
.case-study-backdrop { background: rgb(var(--page-bg-rgb) / 0.46); }
.case-study-modal {
  border: 1px solid var(--border-strong);
  background: #ffffff;
  box-shadow: var(--shadow);
  color: var(--text-primary);
}
</style>
