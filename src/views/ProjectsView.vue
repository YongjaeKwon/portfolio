<template>
  <section id="projects" class="py-24">
    <div class="section-shell">
      <div class="reveal mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="section-kicker">Featured Projects</p>
          <h2 class="section-title">프로젝트 경험</h2>
          <p class="section-copy">
            실제 업무에서 맡았던 화면 개발과 운영 개선 작업을 중심으로 정리했습니다.
          </p>
        </div>
        <div class="surface hidden rounded-lg p-4 md:block">
          <p class="text-muted text-xs font-semibold uppercase tracking-[0.2em]">Main Work</p>
          <p class="accent-text mt-2 text-sm font-bold">UI · API · Operation</p>
        </div>
      </div>

      <div class="grid gap-5">
        <article
          v-for="(project, index) in projects"
          :key="project.title"
          :class="['reveal surface interactive-surface group rounded-xl p-5 md:p-6', `reveal-d${Math.min(index, 4)}`]"
        >
          <div class="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div :class="['rounded-lg border p-5', accentPanel(project.accent)]">
              <p class="text-xs font-black uppercase tracking-[0.22em] opacity-80">
                {{ project.category }}
              </p>
              <h3 class="text-primary mt-4 text-3xl font-black">{{ project.shortTitle }}</h3>
              <p class="text-secondary mt-4 text-sm leading-6">
                {{ project.period }}<br />
                {{ project.team }} · {{ project.role }}
              </p>
            </div>

            <div>
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-primary mt-2 text-2xl font-black">{{ project.title }}</h3>
                </div>
                <button
                  v-if="project.links?.[0]?.type === 'case'"
                  type="button"
                  :title="`${project.shortTitle} ${project.links[0].label} 보기`"
                  :aria-label="`${project.shortTitle} ${project.links[0].label} 보기`"
                  class="focus-ring surface-strong text-primary mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:-translate-y-0.5 hover:text-[var(--accent-strong)] group-hover:text-[var(--accent-strong)]"
                  @click="openCaseStudy(project)"
                >
                  <ArrowRight class="h-5 w-5 transition group-hover:translate-x-0.5" />
                </button>
                <a
                  v-else-if="project.links?.[0]"
                  :href="project.links[0].href"
                  target="_blank"
                  rel="noreferrer"
                  :title="`${project.shortTitle} ${project.links[0].label} 열기`"
                  :aria-label="`${project.shortTitle} ${project.links[0].label} 열기`"
                  class="focus-ring surface-strong text-primary mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:-translate-y-0.5 hover:text-[var(--accent-strong)] group-hover:text-[var(--accent-strong)]"
                >
                  <ArrowRight class="h-5 w-5 transition group-hover:translate-x-0.5" />
                </a>
              </div>

              <p class="text-secondary mt-4 max-w-4xl leading-7">{{ project.summary }}</p>

              <ul :class="['text-secondary mt-5 grid gap-3 text-sm leading-6', highlightGridClass(project.highlights.length)]">
                <li
                  v-for="highlight in project.highlights"
                  :key="highlight"
                  class="surface-strong rounded-lg p-4"
                >
                  <CircleCheck class="mb-3 h-4 w-4 text-emerald-500" />
                  {{ highlight }}
                </li>
              </ul>

              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="stack in project.stack"
                  :key="stack"
                  class="tech-chip surface-strong text-secondary inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold"
                >
                  <TechIcon :name="stack" />
                  {{ stack }}
                </span>
              </div>

            </div>
          </div>
        </article>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
      <div
        v-if="activeCaseStudy"
        class="case-study-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="caseStudyTitleId"
        @click.self="closeCaseStudy"
      >
        <div ref="modalRef" class="case-study-modal max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-xl">
          <div class="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 md:p-6">
            <div>
              <p class="section-kicker">Case Study</p>
              <h3 :id="caseStudyTitleId" class="text-primary mt-2 text-2xl font-black">
                {{ activeCaseStudy.title }}
              </h3>
            </div>
            <button
              type="button"
              class="focus-ring surface-strong text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:text-[var(--accent-strong)]"
              aria-label="케이스 스터디 닫기"
              @click="closeCaseStudy"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="max-h-[calc(88vh-96px)] overflow-y-auto p-5 md:p-8">
            <p v-if="caseStudyStatus === 'loading'" class="text-secondary leading-7">
              내용을 불러오는 중입니다.
            </p>
            <p v-else-if="caseStudyStatus === 'error'" class="text-secondary leading-7">
              README를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </p>
            <div v-else class="case-study-prose" v-html="caseStudyHtml"></div>
          </div>
        </div>
      </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ArrowRight, CircleCheck, X } from "@lucide/vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import TechIcon from "@/components/TechIcon.vue";
import { projects } from "@/data/portfolio";

type Project = (typeof projects)[number];

const activeCaseStudy = ref<Project | null>(null);
const caseStudyHtml = ref("");
const caseStudyStatus = ref<"idle" | "loading" | "ready" | "error">("idle");
const caseStudyCache = new Map<string, string>();
const caseStudyTitleId = "case-study-title";

// Focus management
const modalRef = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLElement | null>(null);
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

marked.use({
  gfm: true,
  breaks: false,
});

const openCaseStudy = async (project: Project) => {
  triggerEl.value = document.activeElement as HTMLElement;
  activeCaseStudy.value = project;
  caseStudyHtml.value = "";
  caseStudyStatus.value = "loading";

  const link = project.links?.find((item) => item.type === "case");

  if (!link) {
    caseStudyStatus.value = "error";
    return;
  }

  try {
    if (caseStudyCache.has(link.href)) {
      caseStudyHtml.value = caseStudyCache.get(link.href) ?? "";
      caseStudyStatus.value = "ready";
      return;
    }

    const response = await fetch(link.href);

    if (!response.ok) {
      throw new Error("Failed to load case study");
    }

    const markdown = await response.text();
    const bodyMarkdown = markdown.replace(/^# .+\r?\n+/, "");
    const rawHtml = await marked.parse(bodyMarkdown);
    const html = DOMPurify.sanitize(rawHtml);
    caseStudyCache.set(link.href, html);
    caseStudyHtml.value = html;
    caseStudyStatus.value = "ready";
  } catch {
    caseStudyStatus.value = "error";
  }
};

const closeCaseStudy = () => {
  activeCaseStudy.value = null;
  caseStudyHtml.value = "";
  caseStudyStatus.value = "idle";
  nextTick(() => triggerEl.value?.focus());
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && activeCaseStudy.value) {
    closeCaseStudy();
    return;
  }
  // Focus trap — keep Tab key inside modal
  if (event.key === "Tab" && activeCaseStudy.value && modalRef.value) {
    const focusable = [...modalRef.value.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
};

watch(activeCaseStudy, (project) => {
  document.body.style.overflow = project ? "hidden" : "";
  if (project) {
    // Move focus into modal after DOM update
    nextTick(() => {
      const first = modalRef.value?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    });
  }
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});

const accentPanel = (_accent: string) => "border-white/6 bg-white/3";

const highlightGridClass = (count: number) => {
  return count > 3 ? "md:grid-cols-2" : "md:grid-cols-3";
};
</script>

<style scoped>
/* ── Modal transition ── */
.modal-enter-active {
  transition: opacity 0.22s ease;
}
.modal-leave-active {
  transition: opacity 0.18s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .case-study-modal {
  animation: modal-panel-in 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-leave-active .case-study-modal {
  animation: modal-panel-out 0.18s ease forwards;
}
@keyframes modal-panel-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}
@keyframes modal-panel-out {
  from { opacity: 1; transform: scale(1)    translateY(0); }
  to   { opacity: 0; transform: scale(0.95) translateY(10px); }
}

.case-study-backdrop {
  background: rgb(var(--page-bg-rgb) / 0.46);
}

:root[data-theme="light"] .case-study-backdrop {
  background: rgb(15 23 42 / 0.28);
}

.case-study-modal {
  border: 1px solid var(--border-strong);
  background: #1b222e;
  box-shadow: var(--shadow);
  color: var(--text-primary);
}

:root[data-theme="light"] .case-study-modal {
  background: #ffffff;
}

.case-study-prose {
  color: var(--text-secondary);
}

.case-study-prose :deep(h1) {
  margin: 0 0 1rem;
  color: var(--text-primary);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  line-height: 1.15;
}

.case-study-prose :deep(h2) {
  margin: 2rem 0 0.75rem;
  color: var(--text-primary);
  font-size: 1.15rem;
  font-weight: 900;
}

.case-study-prose :deep(p),
.case-study-prose :deep(li) {
  color: var(--text-secondary);
  font-size: 0.98rem;
  line-height: 1.8;
}

.case-study-prose :deep(p) {
  margin: 0 0 1rem;
}

.case-study-prose :deep(ul) {
  margin: 0;
  padding-left: 1.25rem;
  list-style: disc;
}

.case-study-prose :deep(li + li) {
  margin-top: 0.45rem;
}

.case-study-prose :deep(blockquote) {
  margin: 0 0 1.5rem;
  border-left: 4px solid var(--accent);
  border-radius: 0.5rem;
  background: var(--accent-soft);
  padding: 0.9rem 1rem;
}

.case-study-prose :deep(blockquote p) {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.case-study-prose :deep(code) {
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  background: var(--surface-soft);
  padding: 0.1rem 0.35rem;
  color: var(--accent);
}
</style>
