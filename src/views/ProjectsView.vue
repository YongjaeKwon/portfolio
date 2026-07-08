<template>
  <section id="projects" class="py-24">
    <div class="section-shell">
      <div class="reveal mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div class="flex items-center gap-3">
            <span class="section-index">01</span>
            <p class="section-kicker">Featured Projects</p>
          </div>
          <h2 class="section-title">주요 프로젝트</h2>
          <p class="section-copy">
            실무 프로젝트는 공개 가능한 범위에서만 정리했고,
            공개 프로젝트는 GitHub 링크를 함께 남겼습니다.
          </p>
        </div>
      </div>

      <div class="grid gap-5">
        <article
          v-for="project in featuredProjects"
          :key="project.id"
          v-tilt
          class="fresh-orb-card interactive-surface tilt group rounded-[2rem] p-5 md:p-6"
        >
          <div class="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div class="fresh-list-item rounded-[1.5rem] p-5">
              <p class="inline-flex rounded-full border border-[var(--fresh-border)] bg-white/55 px-3 py-1.5 text-xs font-bold text-[var(--fresh-blue-strong)]">
                {{ project.card.visibility }}
              </p>
              <p class="text-secondary mt-4 font-mono tnum text-sm font-semibold">
                {{ project.period }}
              </p>

              <div class="mt-6 grid gap-4">
                <div>
                  <p class="text-muted text-xs font-bold">맡은 화면</p>
                  <p class="text-primary mt-2 text-sm font-black leading-6">
                    {{ project.card.meta.workRange }}
                  </p>
                </div>
                <div>
                  <p class="text-muted text-xs font-bold">사용 기술</p>
                  <p class="text-primary mt-2 text-sm font-black leading-6">
                    {{ project.card.meta.environment }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex flex-col">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 class="text-primary text-2xl font-black">{{ project.title }}</h3>
                  <p class="text-secondary mt-3 text-base font-semibold leading-7">
                    {{ project.card.summary }}
                  </p>
                </div>
              </div>

              <div class="mt-4 grid gap-2">
                <p
                  v-for="line in project.card.description"
                  :key="line"
                  class="text-muted text-sm leading-6"
                >
                  {{ line }}
                </p>
              </div>

              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="keyword in project.card.keywords"
                  :key="keyword"
                  class="fresh-list-item text-secondary rounded-full px-3 py-1.5 text-xs font-bold"
                >
                  {{ keyword }}
                </span>
              </div>

              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="stack in project.stack.slice(0, 5)"
                  :key="stack"
                  class="tech-chip fresh-list-item text-secondary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                >
                  <TechIcon :name="stack" />
                  {{ stack }}
                </span>
              </div>

              <button
                type="button"
                class="focus-ring fresh-button mt-6 inline-flex items-center gap-1.5 self-start rounded-full px-4 py-2 text-sm font-bold transition hover:gap-2.5"
                :aria-label="`${project.title} 상세 보기`"
                @click="openDetail(project)"
              >
                상세 보기
                <ArrowRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>
      </div>

      <div class="reveal mt-20 border-t border-[var(--fresh-border)] pt-14">
        <p class="section-kicker">Public Archive</p>
        <h3 class="text-primary mt-3 text-2xl font-black md:text-3xl">공개 프로젝트 아카이브</h3>
        <p class="text-muted mt-3 max-w-3xl leading-7">
          공개로 확인할 수 있는 팀 프로젝트입니다.
          실무 이전에 진행했던 화면 작업과 팀 프로젝트 경험을 함께 정리했습니다.
        </p>

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <article
            v-for="item in publicArchive"
            :key="item.id"
            class="fresh-card interactive-surface rounded-[2rem] p-6"
          >
            <div class="flex h-full flex-col">
              <h4 class="text-primary text-xl font-black">{{ item.title }}</h4>
              <p class="text-secondary mt-2 text-sm leading-6">{{ item.summary }}</p>
              <p class="text-muted mt-4 text-sm leading-6">
                <span class="text-primary font-bold">내 역할</span>
                {{ item.role }}
              </p>
              <p class="text-muted mt-2 text-sm leading-6">
                {{ item.reason }}
              </p>
              <div class="mt-5 flex flex-wrap gap-2">
                <span
                  v-for="tech in item.tech"
                  :key="tech"
                  class="tech-chip fresh-list-item text-secondary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                >
                  <TechIcon :name="tech" />
                  {{ tech }}
                </span>
              </div>
              <a
                :href="item.github"
                target="_blank"
                rel="noreferrer"
                class="focus-ring mt-5 inline-flex items-center gap-2 self-start text-sm font-bold text-[var(--fresh-blue-strong)]"
              >
                GitHub 보기
                <ExternalLink class="h-4 w-4" />
              </a>
            </div>
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
          <div ref="modalRef" class="case-study-modal max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-xl">
            <div class="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 md:p-6">
              <div>
                <p class="section-kicker">Project Detail</p>
                <h3 :id="detailTitleId" class="text-primary mt-2 text-2xl font-black">
                  {{ activeProject.title }}
                </h3>
                <p class="text-muted mt-2 text-sm">
                  {{ activeProject.period }} · {{ activeProject.category }}
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

            <div class="max-h-[calc(88vh-110px)] overflow-y-auto p-5 md:p-8">
              <img
                v-if="activeProject.image"
                :src="activeProject.image.src"
                :alt="activeProject.image.alt"
                decoding="async"
                class="mb-8 max-h-80 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] object-contain p-3"
              />

              <div class="grid gap-6">
                <DetailBlock title="프로젝트 개요" :items="[activeProject.detail.overview]" />
                <DetailBlock title="맡은 범위" :items="activeProject.detail.scope" />
                <DetailBlock title="작업 포인트" :items="activeProject.detail.workPoints" />
                <DetailBlock title="사용 기술" :items="activeProject.detail.techUsage" />
                <DetailBlock title="공개 범위" :items="[activeProject.detail.disclosure]" />

                <div>
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
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ArrowRight, ExternalLink, X } from "@lucide/vue";
import TechIcon from "@/components/TechIcon.vue";
import { featuredProjects, publicArchive, type FeaturedProject } from "@/data/portfolio";

const DetailBlock = defineComponent({
  props: {
    title: { type: String, required: true },
    items: { type: Array as () => string[], required: true },
  },
  setup(props) {
    return () =>
      h("section", [
        h("h4", { class: "text-primary mb-3 font-black" }, props.title),
        h(
          "ul",
          { class: "grid gap-3" },
          props.items.map((item) =>
            h(
              "li",
              { class: "surface-strong text-secondary rounded-lg p-4 text-sm leading-6" },
              item
            )
          )
        ),
      ]);
  },
});

const activeProject = ref<FeaturedProject | null>(null);
const detailTitleId = "project-detail-title";
const modalRef = ref<HTMLElement | null>(null);
const triggerEl = ref<HTMLElement | null>(null);
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const openDetail = (project: FeaturedProject) => {
  triggerEl.value = document.activeElement as HTMLElement;
  activeProject.value = project;
};

const closeDetail = () => {
  activeProject.value = null;
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
  if (project) {
    nextTick(() => modalRef.value?.querySelector<HTMLElement>(FOCUSABLE)?.focus());
  }
});

onMounted(() => window.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});

type TiltHandlers = { onMove: (e: MouseEvent) => void; onLeave: () => void };
const tiltHandlers = new WeakMap<HTMLElement, TiltHandlers>();

const vTilt = {
  mounted(el: HTMLElement) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    if (reduced || noHover) return;

    const max = 2;
    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transition = "transform 0s";
      el.style.transform = `perspective(1100px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
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
    const handlers = tiltHandlers.get(el);
    if (!handlers) return;
    el.removeEventListener("mousemove", handlers.onMove);
    el.removeEventListener("mouseleave", handlers.onLeave);
    tiltHandlers.delete(el);
  },
};
</script>

<style scoped>
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
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes modal-panel-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

.case-study-backdrop {
  background: rgb(var(--page-bg-rgb) / 0.46);
}
:root[data-theme="light"] .case-study-backdrop {
  background: rgb(15 23 42 / 0.28);
}

.case-study-modal {
  border: 1px solid var(--border-strong);
  background: #ffffff;
  box-shadow: var(--shadow);
  color: var(--text-primary);
}
</style>
