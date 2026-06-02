<template>
  <section id="projects" class="py-24">
    <div class="section-shell">
      <div class="reveal mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div class="flex items-center gap-3">
            <span class="section-index">01</span>
            <p class="section-kicker">주요 프로젝트</p>
          </div>
          <h2 class="section-title">프로젝트 경험</h2>
          <p class="section-copy">
            {{ activeTrackData.projectIntro }}
          </p>
        </div>
        <div class="surface hidden rounded-lg p-4 md:block">
          <p class="text-muted text-xs font-semibold uppercase tracking-[0.2em]">지원 관점</p>
          <p class="accent-text mt-2 text-sm font-bold">{{ activeTrackData.label }}</p>
        </div>
      </div>

      <!-- ── 스택 필터 칩 ── -->
      <div class="reveal mb-6 flex flex-wrap gap-2" role="group" aria-label="프로젝트 스택 필터">
        <button
          type="button"
          :class="[
            'tech-chip surface-strong inline-flex items-center rounded-md px-3 py-1.5 text-xs font-bold transition',
            activeFilter === null ? 'filter-chip-active' : 'text-secondary',
          ]"
          :aria-pressed="activeFilter === null"
          @click="activeFilter = null"
        >
          전체
          <span class="ml-1.5 text-white/30">{{ orderedProjects.length }}</span>
        </button>
        <button
          v-for="opt in filterOptions"
          :key="opt.name"
          type="button"
          :class="[
            'tech-chip surface-strong inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition',
            activeFilter === opt.name ? 'filter-chip-active' : 'text-secondary',
          ]"
          :aria-pressed="activeFilter === opt.name"
          @click="activeFilter = activeFilter === opt.name ? null : opt.name"
        >
          <TechIcon :name="opt.name" />
          {{ opt.name }}
          <span class="ml-0.5 text-white/30">{{ opt.count }}</span>
        </button>
      </div>

      <!-- ── 프로젝트 목록 (TransitionGroup) ── -->
      <TransitionGroup name="project-filter" tag="div" class="grid gap-5" appear>
        <article
          v-for="project in filteredProjects"
          :key="project.title"
          v-tilt
          class="surface interactive-surface tilt group rounded-xl p-5 md:p-6"
        >
          <div class="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div class="rounded-lg border border-white/6 bg-white/3 p-5">
              <p class="text-xs font-black uppercase tracking-[0.22em] opacity-80">
                {{ project.category }}
              </p>
              <h3 class="text-primary mt-4 text-3xl font-black">{{ project.shortTitle }}</h3>
              <p class="text-secondary mt-4 text-sm leading-6">
                {{ project.period }}<br />
                {{ project.team }} · {{ project.role }}
              </p>
            </div>

            <div class="flex flex-col">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <span class="maple-quest-head maple-pixel mb-2">📜 QUEST</span>
                  <span class="ow-match-head mb-2">▶ COMPETITIVE</span>
                  <h3 class="text-primary mt-2 text-2xl font-black">{{ project.title }}</h3>
                </div>
                <span class="maple-quest-clear maple-pixel shrink-0">✓ CLEAR</span>
                <span class="ow-victory shrink-0">VICTORY</span>
              </div>

              <!-- 선택한 지원 관점에 맞춰 바뀌는 한 줄 컨텍스트 -->
              <p
                v-if="projectTrackNote(project)"
                class="surface-strong text-secondary mt-4 rounded-lg px-4 py-3 text-sm leading-6"
              >
                {{ projectTrackNote(project) }}
              </p>

              <!-- 핵심 성과 1줄 (전체는 상세에서) -->
              <p class="maple-label maple-pixel mt-5 -mb-1 text-xs">🎯 목표</p>
              <p class="ow-label mt-5 -mb-1 text-xs">⌖ ELIMINATIONS</p>
              <p class="text-secondary mt-4 flex items-start gap-2 text-sm leading-6">
                <CircleCheck class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {{ project.highlights[0] }}
              </p>

              <p class="maple-label maple-pixel mt-5 -mb-1 text-xs">🎁 보상 아이템</p>
              <p class="ow-label mt-5 -mb-1 text-xs">▲ CAREER PROGRESS</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="stack in project.stack"
                  :key="stack"
                  class="tech-chip surface-strong text-secondary inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold"
                >
                  <TechIcon :name="stack" />
                  {{ stack }}
                </span>
              </div>

              <button
                type="button"
                class="focus-ring accent-text mt-6 inline-flex items-center gap-1.5 self-start rounded-md text-sm font-bold transition hover:gap-2.5"
                :aria-label="`${project.shortTitle} 자세히 보기`"
                @click="openDetail(project)"
              >
                담당 업무와 성과 보기
                <ArrowRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      </TransitionGroup>

      <!-- 필터 결과 없음 -->
      <p v-if="filteredProjects.length === 0" class="text-muted py-12 text-center text-sm">
        해당 기술을 사용한 프로젝트가 없습니다.
      </p>
    </div>

    <!-- ── Project Detail Modal ── -->
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
          <div ref="modalRef" class="case-study-modal max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-xl">
            <div class="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 md:p-6">
              <div>
                <p class="section-kicker">{{ hasCaseStudy ? "Case Study" : "Project Detail" }}</p>
                <h3 :id="detailTitleId" class="text-primary mt-2 text-2xl font-black">
                  {{ activeProject.title }}
                </h3>
                <p class="text-muted mt-2 text-sm">
                  {{ activeProject.period }} · {{ activeProject.team }} · {{ activeProject.role }}
                </p>
              </div>
              <button
                type="button"
                class="focus-ring surface-strong text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:text-[var(--accent-strong)]"
                aria-label="상세 닫기"
                @click="closeDetail"
              >
                <X class="h-5 w-5" />
              </button>
            </div>

            <!-- aria-live: 로딩 상태 변화를 스크린리더에 알림 -->
            <div
              class="max-h-[calc(88vh-110px)] overflow-y-auto p-5 md:p-8"
              aria-live="polite"
              aria-atomic="true"
            >
              <!-- 스켈레톤 로딩 (마크다운 케이스 스터디 불러오는 중) -->
              <div v-if="detailStatus === 'loading'" class="space-y-5" role="status">
                <div class="skeleton h-8 w-3/5 rounded-lg"></div>
                <div class="space-y-2">
                  <div class="skeleton h-4 w-full rounded"></div>
                  <div class="skeleton h-4 w-11/12 rounded"></div>
                  <div class="skeleton h-4 w-4/5 rounded"></div>
                </div>
                <div class="skeleton h-5 w-2/5 rounded-lg"></div>
                <div class="space-y-2">
                  <div class="skeleton h-4 w-full rounded"></div>
                  <div class="skeleton h-4 w-5/6 rounded"></div>
                  <div class="skeleton h-4 w-3/4 rounded"></div>
                </div>
                <div class="skeleton h-5 w-1/3 rounded-lg"></div>
                <div class="space-y-2">
                  <div class="skeleton h-4 w-full rounded"></div>
                  <div class="skeleton h-4 w-5/6 rounded"></div>
                </div>
                <span class="sr-only">내용을 불러오는 중입니다</span>
              </div>

              <!-- 에러 + 재시도 버튼 -->
              <div
                v-else-if="detailStatus === 'error'"
                class="flex flex-col items-center gap-4 py-10 text-center"
              >
                <p class="text-secondary leading-7">내용을 불러오지 못했습니다.</p>
                <button
                  type="button"
                  class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition hover:text-[var(--accent-strong)]"
                  @click="retryLoad"
                >
                  <RotateCw class="h-4 w-4" />
                  다시 시도
                </button>
              </div>

              <!-- 마크다운 케이스 스터디 (실무 프로젝트) -->
              <div v-else-if="detailHtml" class="case-study-prose" v-html="detailHtml"></div>

              <!-- 데이터 기반 구조화 상세 (케이스 스터디가 없는 프로젝트) -->
              <div v-else class="space-y-7">
                <img
                  v-if="'image' in activeProject && activeProject.image"
                  :src="activeProject.image.src"
                  :alt="activeProject.image.alt"
                  decoding="async"
                  class="max-h-96 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] object-contain p-3"
                />

                <p class="text-secondary leading-7">{{ activeProject.summary }}</p>

                <p
                  v-if="'scope' in activeProject && activeProject.scope"
                  class="text-secondary text-sm leading-6"
                >
                  <span class="text-primary font-bold">핵심 담당 범위</span>
                  <span class="mx-2 text-white/20">/</span>
                  {{ activeProject.scope }}
                </p>

                <div>
                  <p class="text-primary mb-3 font-black">주요 작업</p>
                  <ul class="grid gap-3">
                    <li
                      v-for="highlight in activeProject.highlights"
                      :key="highlight"
                      class="surface-strong text-secondary rounded-lg p-4 text-sm leading-6"
                    >
                      <CircleCheck class="mb-3 h-4 w-4 text-emerald-500" />
                      {{ highlight }}
                    </li>
                  </ul>
                </div>

                <div>
                  <p class="text-primary mb-3 font-black">기술 스택</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="stack in activeProject.stack"
                      :key="stack"
                      class="tech-chip surface-strong text-secondary inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold"
                    >
                      <TechIcon :name="stack" />
                      {{ stack }}
                    </span>
                  </div>
                </div>

                <a
                  v-if="externalLink"
                  :href="externalLink.href"
                  target="_blank"
                  rel="noreferrer"
                  class="focus-ring nav-panel text-primary inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition hover:text-[var(--accent-strong)]"
                >
                  <ExternalLink class="h-4 w-4" />
                  {{ externalLink.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ArrowRight, CircleCheck, ExternalLink, RotateCw, X } from "@lucide/vue";
import TechIcon from "@/components/TechIcon.vue";
import { focusTracks, projects } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { useProjectFilter } from "@/composables/useProjectFilter";

type Project = (typeof projects)[number];

// ── 스택 필터 ──────────────────────────────────────────────────────────────
const { activeFilter } = useProjectFilter();
const { activeTrack } = useFocusTrack();
const activeTrackData = computed(
  () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]
);

const orderedProjects = computed(() => {
  const order = new Map(activeTrackData.value.projectOrder.map((shortTitle, idx) => [shortTitle, idx]));
  return [...projects].sort(
    (a, b) => (order.get(a.shortTitle) ?? 999) - (order.get(b.shortTitle) ?? 999)
  );
});

const projectTrackNote = (project: Project) =>
  activeTrackData.value.projectAngles[project.shortTitle] ?? "";

/** 2개 이상 프로젝트에서 사용된 스택 (출현 빈도 내림차순, 최대 10개) */
const filterOptions = computed(() => {
  const counts = new Map<string, number>();
  orderedProjects.value.forEach((p) => p.stack.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
});

const filteredProjects = computed(() =>
  activeFilter.value
    ? orderedProjects.value.filter((p) => p.stack.includes(activeFilter.value!))
    : orderedProjects.value
);

// ── Project Detail Modal ────────────────────────────────────────────────────
// 모든 프로젝트가 상세 모달을 연다. 마크다운 케이스 스터디(실무 프로젝트)는
// /case-studies/*.md를 불러와 렌더하고, 그 외 프로젝트는 데이터 기반 구조화 상세를 보여준다.
const activeProject = ref<Project | null>(null);
const detailHtml = ref(""); // 마크다운 케이스 스터디 HTML (있는 경우에만)
const detailStatus = ref<"idle" | "loading" | "ready" | "error">("idle");
const caseStudyCache = new Map<string, string>();
const detailTitleId = "project-detail-title";

const modalRef = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLElement | null>(null);
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const caseLink = (project: Project) => project.links?.find((item) => item.type === "case");
const hasCaseStudy = computed(() => !!(activeProject.value && caseLink(activeProject.value)));
const externalLink = computed(
  () => activeProject.value?.links?.find((item) => item.type !== "case") ?? null
);

// marked·DOMPurify는 케이스 스터디를 처음 열 때만 동적 로드 (초기 번들 절감)
let mdLibs: { parse: (md: string) => string | Promise<string>; sanitize: (html: string) => string } | null = null;
const loadMarkdownLibs = async () => {
  if (mdLibs) return mdLibs;
  const [{ marked }, { default: DOMPurify }] = await Promise.all([
    import("marked"),
    import("dompurify"),
  ]);
  marked.use({ gfm: true, breaks: false });
  mdLibs = { parse: (md) => marked.parse(md), sanitize: (html) => DOMPurify.sanitize(html) };
  return mdLibs;
};

const fetchCaseStudy = async (href: string) => {
  detailHtml.value = "";
  detailStatus.value = "loading";

  try {
    if (caseStudyCache.has(href)) {
      detailHtml.value = caseStudyCache.get(href) ?? "";
      detailStatus.value = "ready";
      return;
    }
    const [{ parse, sanitize }, response] = await Promise.all([
      loadMarkdownLibs(),
      fetch(href),
    ]);
    if (!response.ok) throw new Error("fetch failed");
    const markdown = await response.text();
    const rawHtml = await parse(markdown.replace(/^# .+\r?\n+/, ""));
    const html = sanitize(rawHtml);
    caseStudyCache.set(href, html);
    detailHtml.value = html;
    detailStatus.value = "ready";
  } catch {
    detailStatus.value = "error";
  }
};

const openDetail = (project: Project) => {
  triggerEl.value = document.activeElement as HTMLElement;
  activeProject.value = project;
  const link = caseLink(project);
  if (link) {
    fetchCaseStudy(link.href);
  } else {
    // 마크다운이 없는 프로젝트는 데이터 기반 구조화 상세를 즉시 표시
    detailHtml.value = "";
    detailStatus.value = "ready";
  }
};

const retryLoad = () => {
  const link = activeProject.value && caseLink(activeProject.value);
  if (link) fetchCaseStudy(link.href);
};

const closeDetail = () => {
  activeProject.value = null;
  detailHtml.value = "";
  detailStatus.value = "idle";
  nextTick(() => triggerEl.value?.focus());
};

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
    if (event.shiftKey) {
      if (document.activeElement === first) { event.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }
};

watch(activeProject, (project) => {
  document.body.style.overflow = project ? "hidden" : "";
  if (project) {
    nextTick(() => modalRef.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus());
  }
});

watch(activeTrack, () => {
  activeFilter.value = null;
});

onMounted(() => window.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});

// ── v-tilt: 포인터 기반 미세 3D 기울기 (마우스 기기 + 모션 허용 시에만) ──
type TiltHandlers = { onMove: (e: MouseEvent) => void; onLeave: () => void };
const tiltHandlers = new WeakMap<HTMLElement, TiltHandlers>();

const vTilt = {
  mounted(el: HTMLElement) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    if (reduced || noHover) return;

    const MAX = 2; // deg
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = "transform 0s";
      el.style.transform = `perspective(1100px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 0.35s ease";
      el.style.transform = "";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    tiltHandlers.set(el, { onMove, onLeave });
  },
  unmounted(el: HTMLElement) {
    const h = tiltHandlers.get(el);
    if (h) {
      el.removeEventListener("mousemove", h.onMove);
      el.removeEventListener("mouseleave", h.onLeave);
      tiltHandlers.delete(el);
    }
  },
};
</script>

<style scoped>
/* ── Project filter transition ── */
.project-filter-enter-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}
.project-filter-leave-active {
  transition: opacity 0.18s ease;
}
.project-filter-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.project-filter-leave-to {
  opacity: 0;
}
.project-filter-move {
  transition: transform 0.28s ease;
}

/* ── Modal transition ── */
.modal-enter-active { transition: opacity 0.22s ease; }
.modal-leave-active { transition: opacity 0.18s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }
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

.case-study-prose { color: var(--text-secondary); }

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
.case-study-prose :deep(p)       { margin: 0 0 1rem; }
.case-study-prose :deep(ul)      { margin: 0; padding-left: 1.25rem; list-style: disc; }
.case-study-prose :deep(li + li) { margin-top: 0.45rem; }
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
