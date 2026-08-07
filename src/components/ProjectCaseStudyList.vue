<template>
  <section v-if="caseStudies.length" class="deep-cases" :aria-labelledby="headingId">
    <div class="deep-cases-heading">
      <div>
        <p class="section-kicker">Case Studies</p>
        <h4 :id="headingId" class="text-primary mt-2 text-xl font-black">상세 개발 사례</h4>
      </div>
      <p class="text-muted max-w-lg text-sm leading-6">
        이력서에 줄여 쓴 문제와 제약, 구현 과정을 사례별로 정리했습니다.
      </p>
    </div>

    <div class="deep-case-list">
      <details
        v-for="(study, index) in caseStudies"
        :key="study.id"
        :open="index === 0"
        class="deep-case"
      >
        <summary class="focus-ring deep-case-summary">
          <span class="deep-case-index">{{ String(index + 1).padStart(2, "0") }}</span>
          <span class="min-w-0 flex-1">
            <span class="deep-case-meta">{{ study.area }}</span>
            <strong class="text-primary mt-1 block text-base font-black leading-6">{{ study.title }}</strong>
            <span class="text-muted mt-1 block text-sm leading-5">{{ study.summary }}</span>
          </span>
          <ChevronDown class="deep-case-chevron h-5 w-5 shrink-0" aria-hidden="true" />
        </summary>

        <div class="deep-case-content">
          <div class="deep-case-context">
            <div class="deep-case-phase is-problem">
              <span>문제</span>
              <p>{{ study.problem }}</p>
            </div>
            <div class="deep-case-phase is-constraint">
              <span>제약</span>
              <p>{{ study.constraint }}</p>
            </div>
            <div class="deep-case-phase is-decision">
              <span>판단</span>
              <p>{{ study.decision }}</p>
            </div>
          </div>

          <section class="deep-case-implementation">
            <h5 class="text-primary text-sm font-black">주요 구현</h5>
            <ul class="mt-3 grid gap-2.5">
              <li
                v-for="item in study.implementation"
                :key="item"
                class="deep-case-implementation-item text-secondary text-sm leading-6"
              >
                {{ item }}
              </li>
            </ul>
          </section>

          <div class="deep-case-outcome">
            <CircleCheckBig class="h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <span>확인된 변화</span>
              <p>{{ study.outcome }}</p>
            </div>
          </div>

          <figure v-if="study.code" class="deep-case-code">
            <figcaption class="deep-case-code-header">
              <span class="flex items-center gap-2">
                <Code2 class="h-4 w-4" aria-hidden="true" />
                <strong>{{ study.code.title }}</strong>
              </span>
              <span>{{ study.code.language }}</span>
            </figcaption>
            <pre tabindex="0" :aria-label="`${study.title} 코드 예시`"><code>{{ study.code.content }}</code></pre>
            <p>{{ study.code.note }}</p>
          </figure>
        </div>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronDown, CircleCheckBig, Code2 } from "@lucide/vue";
import { hasProjectCaseStudies, projectCaseStudies } from "@/data/caseStudies";

const props = defineProps<{ projectId: string }>();

const caseStudies = computed(() =>
  hasProjectCaseStudies(props.projectId) ? projectCaseStudies[props.projectId] : []
);
const headingId = computed(() => `${props.projectId}-case-studies-title`);
</script>

<style scoped>
.deep-cases {
  display: grid;
  gap: 1rem;
}

.deep-cases-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
}

.deep-case-list {
  display: grid;
  gap: 0.8rem;
}

.deep-case {
  overflow: hidden;
  border: 1px solid rgba(49, 130, 246, 0.13);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 10px 30px rgba(38, 69, 111, 0.055);
}

.deep-case[open] {
  border-color: rgba(49, 130, 246, 0.24);
  box-shadow: 0 16px 42px rgba(38, 69, 111, 0.09);
}

.deep-case-summary {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 1.1rem;
  cursor: pointer;
  list-style: none;
  transition: background 0.2s ease;
}

.deep-case-summary::-webkit-details-marker {
  display: none;
}

.deep-case-summary:hover {
  background: rgba(49, 130, 246, 0.045);
}

.deep-case-index {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 0.75rem;
  background: var(--fresh-blue-soft);
  color: var(--fresh-blue-strong);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  font-weight: 900;
}

.deep-case-meta {
  color: var(--fresh-blue-strong);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.06em;
}

.deep-case-chevron {
  color: var(--text-muted);
  transition: transform 0.22s ease;
}

.deep-case[open] .deep-case-chevron {
  transform: rotate(180deg);
}

.deep-case-content {
  display: grid;
  gap: 1rem;
  border-top: 1px solid rgba(49, 130, 246, 0.1);
  padding: 1.1rem;
  background: linear-gradient(145deg, rgba(247, 250, 255, 0.86), rgba(255, 255, 255, 0.78));
}

.deep-case-context {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
}

.deep-case-phase {
  min-width: 0;
  border: 1px solid rgba(49, 130, 246, 0.1);
  border-radius: 0.8rem;
  padding: 0.85rem;
  background: rgba(255, 255, 255, 0.78);
}

.deep-case-phase > span,
.deep-case-outcome span {
  display: inline-block;
  margin-bottom: 0.45rem;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.deep-case-phase p,
.deep-case-outcome p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.65;
}

.deep-case-phase.is-problem > span { color: #c75b4e; }
.deep-case-phase.is-constraint > span { color: #7a5bb8; }
.deep-case-phase.is-decision > span { color: var(--fresh-blue-strong); }

.deep-case-implementation {
  border-radius: 0.8rem;
  padding: 0.95rem;
  background: rgba(255, 255, 255, 0.68);
}

.deep-case-implementation-item {
  position: relative;
  padding-left: 1rem;
}

.deep-case-implementation-item::before {
  position: absolute;
  top: 0.67rem;
  left: 0;
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 999px;
  background: var(--fresh-blue);
  content: "";
}

.deep-case-outcome {
  display: flex;
  gap: 0.75rem;
  border: 1px solid rgba(25, 158, 104, 0.16);
  border-radius: 0.8rem;
  padding: 0.9rem;
  color: #128154;
  background: rgba(241, 252, 247, 0.82);
}

.deep-case-outcome span {
  display: block;
  margin-bottom: 0.25rem;
}

.deep-case-outcome p {
  font-size: 0.84rem;
  font-weight: 650;
}

.deep-case-code {
  overflow: hidden;
  margin: 0;
  border: 1px solid rgba(31, 45, 71, 0.14);
  border-radius: 0.9rem;
  color: #dce8ff;
  background: #172033;
  box-shadow: 0 16px 36px rgba(18, 29, 51, 0.16);
}

.deep-case-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 0.9rem;
  color: #eff6ff;
  font-size: 0.76rem;
}

.deep-case-code-header > span:last-child {
  color: #86b7ff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.68rem;
  font-weight: 800;
}

.deep-case-code pre {
  max-width: 100%;
  overflow-x: auto;
  margin: 0;
  padding: 1rem;
  outline-offset: -3px;
}

.deep-case-code pre:focus-visible {
  outline: 2px solid #86b7ff;
}

.deep-case-code code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.76rem;
  line-height: 1.75;
  white-space: pre;
}

.deep-case-code > p {
  margin: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.75rem 0.9rem;
  color: #9eacc5;
  font-size: 0.7rem;
  line-height: 1.55;
}

@media (max-width: 700px) {
  .deep-cases-heading {
    align-items: start;
    flex-direction: column;
    gap: 0.5rem;
  }

  .deep-case-context {
    grid-template-columns: 1fr;
  }

  .deep-case-summary {
    align-items: flex-start;
    padding: 0.9rem;
  }

  .deep-case-content {
    padding: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deep-case-chevron,
  .deep-case-summary {
    transition: none;
  }
}
</style>
