<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="project"
        class="case-study-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="detailTitleId"
        @click.self="emit('close')"
      >
        <div ref="modalRef" class="case-study-modal flex max-h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl">
          <div class="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] p-5 md:p-6">
            <div>
              <p class="section-kicker">Project Detail</p>
              <h3 :id="detailTitleId" class="text-primary mt-2 text-2xl font-black">{{ project.project.title }}</h3>
              <p class="text-muted mt-2 text-sm">{{ project.project.period }} · {{ project.project.category }}</p>
            </div>
            <button
              type="button"
              class="focus-ring surface-strong text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:text-[var(--accent-strong)]"
              aria-label="상세 닫기"
              @click="emit('close')"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-5 md:p-8" tabindex="0" aria-label="프로젝트 상세 내용">
            <ProjectCaseVisual
              v-if="project.project.id === 'pps' || project.project.id === 'tsms' || project.project.id === 'reachrich'"
              :project-id="project.project.id"
              class="mb-8"
            />
            <img
              v-else-if="project.project.image"
              :src="project.project.image.src"
              :alt="project.project.image.alt"
              :width="project.project.image.width"
              :height="project.project.image.height"
              decoding="async"
              class="mb-8 max-h-80 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] object-contain p-3"
            />

            <div class="grid gap-6">
              <DetailBlock title="프로젝트 개요" :items="[project.detail.overview]" />

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

              <template v-else>
                <DetailBlock title="담당 범위" :items="project.detail.scope" />
                <DetailBlock
                  v-if="!hasDetailedCaseStudies(project.project.id)"
                  title="주요 구현 내용"
                  :items="project.detail.workPoints"
                />
              </template>

              <ProjectCaseStudyList
                v-if="hasDetailedCaseStudies(project.project.id)"
                :project-id="project.project.id"
              />

              <section v-if="!hasDetailedCaseStudies(project.project.id) && project.detail.caseStudy">
                <h4 class="text-primary mb-3 font-black">문제 해결 과정</h4>
                <div class="case-process-grid grid gap-3 md:grid-cols-2">
                  <article class="case-process-step rounded-xl p-5">
                    <h5 class="case-step-label">01 · 문제</h5>
                    <p class="text-secondary mt-3 text-sm leading-6">{{ project.detail.caseStudy.problem }}</p>
                  </article>
                  <article class="case-process-step rounded-xl p-5">
                    <h5 class="case-step-label">02 · 판단</h5>
                    <p class="text-secondary mt-3 text-sm leading-6">{{ project.detail.caseStudy.decision }}</p>
                  </article>
                  <article class="case-process-step rounded-xl p-5">
                    <h5 class="case-step-label">03 · 구현</h5>
                    <ul class="mt-3 grid gap-2">
                      <li v-for="item in project.detail.caseStudy.implementation" :key="item" class="role-detail-item text-secondary text-sm leading-6">
                        {{ item }}
                      </li>
                    </ul>
                  </article>
                  <article class="case-process-step rounded-xl p-5">
                    <h5 class="case-step-label">04 · 결과</h5>
                    <ul class="mt-3 grid gap-2">
                      <li v-for="item in project.detail.caseStudy.outcome" :key="item" class="role-detail-item text-secondary text-sm leading-6">
                        {{ item }}
                      </li>
                    </ul>
                  </article>
                </div>
              </section>

              <DetailBlock
                v-if="!hasDetailedCaseStudies(project.project.id) && !project.detail.caseStudy"
                title="결과"
                :items="project.detail.results"
              />
              <DetailBlock title="사용 기술" :items="project.detail.techUsage" />
              <DetailBlock title="공개 범위" :items="[project.detail.disclosure]" />

              <div v-if="project.detail.resources.length">
                <h4 class="text-primary mb-3 font-black">관련 자료</h4>
                <div class="flex flex-wrap gap-2">
                  <a
                    v-for="resource in project.detail.resources"
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
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, defineComponent, h, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { ExternalLink, X } from "@lucide/vue";
import ProjectCaseVisual from "@/components/ProjectCaseVisual.vue";
import type { RoleFocusId } from "@/data/portfolio";
import type { PresentedProject } from "@/utils/projectPresentation";

const props = defineProps<{
  project: PresentedProject | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const ProjectCaseStudyList = defineAsyncComponent(() => import("@/components/ProjectCaseStudyList.vue"));
const detailedCaseProjectIds = new Set(["pps", "tsms", "ssafast", "ddoing", "modac", "reachrich"]);
const hasDetailedCaseStudies = (projectId: string) => detailedCaseProjectIds.has(projectId);

const DetailBlock = defineComponent({
  props: { title: { type: String, required: true }, items: { type: Array as () => string[], required: true } },
  setup(blockProps) {
    return () => h("section", [
      h("h4", { class: "text-primary mb-3 font-black" }, blockProps.title),
      h("ul", { class: "grid gap-3" }, blockProps.items.map((item) => h("li", { class: "surface-strong text-secondary rounded-lg p-4 text-sm leading-6" }, item))),
    ]);
  },
});

const roleSections = computed(() => {
  const activeProject = props.project?.project;
  if (!activeProject?.perspectives) return [];

  return (["frontend", "backend"] as RoleFocusId[]).flatMap((id) => {
    const detail = activeProject.perspectives?.[id]?.detail;
    if (!detail?.scope?.length || !detail.workPoints?.length) return [];

    return [{
      id,
      label: id === "frontend" ? "Frontend" : "Backend",
      scope: detail.scope,
      workPoints: detail.workPoints,
    }];
  });
});

const detailTitleId = computed(() => `project-detail-${props.project?.project.id ?? "closed"}`);
const modalRef = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLElement | null>(null);
const isolatedAppRoot = ref<HTMLElement | null>(null);
let previousAppAriaHidden: string | null = null;
let previousAppInert = false;
let previousBodyOverflow = "";
const FOCUSABLE = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

const isolateBackground = () => {
  if (isolatedAppRoot.value) return;
  const appRoot = document.querySelector<HTMLElement>("#app");
  if (!appRoot) return;

  isolatedAppRoot.value = appRoot;
  previousAppAriaHidden = appRoot.getAttribute("aria-hidden");
  previousAppInert = appRoot.inert;
  previousBodyOverflow = document.body.style.overflow;
  appRoot.inert = true;
  appRoot.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "hidden";
};

const restoreBackground = () => {
  const appRoot = isolatedAppRoot.value;
  if (!appRoot) return;
  appRoot.inert = previousAppInert;
  if (previousAppAriaHidden === null) appRoot.removeAttribute("aria-hidden");
  else appRoot.setAttribute("aria-hidden", previousAppAriaHidden);
  document.body.style.overflow = previousBodyOverflow;
  isolatedAppRoot.value = null;
  previousAppAriaHidden = null;
  previousAppInert = false;
  previousBodyOverflow = "";
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.project) return;
  if (event.key === "Escape") {
    emit("close");
    return;
  }
  if (event.key !== "Tab" || !modalRef.value) return;

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
};

watch(
  () => props.project,
  async (project, previousProject) => {
    if (project) {
      if (!previousProject) {
        triggerEl.value = document.activeElement as HTMLElement;
        window.addEventListener("keydown", handleKeydown);
      }
      await nextTick();
      modalRef.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
      isolateBackground();
      return;
    }

    if (previousProject) {
      window.removeEventListener("keydown", handleKeydown);
      restoreBackground();
      await nextTick();
      triggerEl.value?.focus();
    }
  },
);

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  restoreBackground();
});
</script>

<style scoped>
.case-step-label {
  color: var(--fresh-blue-strong);
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0;
}
.case-process-step {
  border: 1px solid rgba(49, 130, 246, 0.12);
  background: rgba(255, 255, 255, 0.72);
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
