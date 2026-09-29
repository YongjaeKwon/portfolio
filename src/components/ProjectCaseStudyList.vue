<template>
  <section v-if="caseStudies.length" class="deep-cases" :aria-labelledby="headingId">
    <div class="deep-cases-heading">
      <div>
        <h4 :id="headingId" class="font-heading text-primary text-2xl font-black tracking-[-0.03em]">{{ t("상세 개발 사례", "Detailed Case Studies") }}</h4>
      </div>
      <p class="text-muted max-w-lg text-sm leading-6">
        {{ t("사례마다 문제, 제약, 판단, 구현, 결과 순서로 적었습니다.", "Problems solved in this project and how they were implemented, case by case.") }}
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
                    <span class="min-w-0 flex-1">
            <span class="deep-case-meta">{{ study.area }}</span>
            <strong class="text-primary mt-1 block text-base font-black leading-6">{{ study.title }}</strong>
            <span class="text-muted mt-1 block text-sm leading-5">{{ study.summary }}</span>
          </span>
          <ChevronDown class="deep-case-chevron h-5 w-5 shrink-0" aria-hidden="true" />
        </summary>

        <div class="deep-case-content">
          <div class="deep-case-context">
            <div class="deep-case-phase">
              <span>{{ t("문제", "Problem") }}</span>
              <p>{{ study.problem }}</p>
            </div>
            <div class="deep-case-phase">
              <span>{{ t("제약", "Constraint") }}</span>
              <p>{{ study.constraint }}</p>
            </div>
            <div class="deep-case-phase">
              <span>{{ t("판단", "Decision") }}</span>
              <p>{{ study.decision }}</p>
            </div>
          </div>

          <section class="deep-case-implementation">
            <h5 class="text-primary text-sm font-black">{{ t("주요 구현", "Key implementation") }}</h5>
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

          <div class="deep-case-phase deep-case-outcome">
            <span>{{ t("결과", "Outcome") }}</span>
            <p>{{ study.outcome }}</p>
          </div>

          <figure v-if="study.code" class="deep-case-code">
            <figcaption class="deep-case-code-header">
              <strong>{{ study.code.title }}</strong>
              <span>{{ study.code.language }}</span>
            </figcaption>
            <pre tabindex="0" :aria-label="t(`${study.title} 코드 예시`, `Code example: ${study.title}`)"><code>{{ study.code.content }}</code></pre>
            <p>{{ study.code.note }}</p>
          </figure>
        </div>
      </details>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChevronDown } from "@lucide/vue";
import { hasProjectCaseStudies, projectCaseStudies } from "@/data/caseStudies";
import { t } from "@/i18n/locale";

const props = defineProps<{ projectId: string }>();

const caseStudies = computed(() =>
  hasProjectCaseStudies(props.projectId) ? projectCaseStudies[props.projectId] : []
);
const headingId = computed(() => `${props.projectId}-case-studies-title`);
</script>

<style scoped>
/* 사례 목록: 선과 글자만. 번호 상자 · 색 라벨 · 색 상자 없음 */
.deep-cases {
  display: grid;
  gap: 1.25rem;
}

.deep-cases-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
}

.deep-case-list {
  border-top: 2px solid var(--fresh-rule);
}

.deep-case {
  border-bottom: 1px solid var(--fresh-border);
}

.deep-case-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 0;
  cursor: pointer;
  list-style: none;
}

.deep-case-summary::-webkit-details-marker {
  display: none;
}

.deep-case-summary:hover strong {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.deep-case-meta {
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.deep-case-chevron {
  color: var(--text-primary);
  transition: transform 0.22s ease;
}

.deep-case[open] .deep-case-chevron {
  transform: rotate(180deg);
}

.deep-case-content {
  display: grid;
  gap: 1.25rem;
  padding: 0 0 1.5rem;
}

.deep-case-context {
  display: grid;
}

.deep-case-phase {
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: 1rem;
  border-top: 1px solid var(--fresh-border);
  padding: 0.85rem 0;
}

.deep-case-phase > span {
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 900;
}

.deep-case-phase p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

.deep-case-outcome {
  border-top: 2px solid var(--fresh-rule);
}

.deep-case-outcome p {
  color: var(--text-primary);
  font-weight: 700;
}

.deep-case-implementation-item {
  position: relative;
  padding-left: 1.1rem;
}

.deep-case-implementation-item::before {
  position: absolute;
  left: 0;
  color: var(--text-muted);
  content: "–";
}

.deep-case-code {
  overflow: hidden;
  margin: 0;
  border-radius: var(--fresh-radius-md);
  color: var(--fresh-stage-ink);
  background: var(--fresh-stage);
}

.deep-case-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid rgba(246, 245, 241, 0.12);
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
}

.deep-case-code-header > span:last-child {
  color: var(--fresh-stage-muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.deep-case-code pre {
  max-width: 100%;
  overflow-x: auto;
  margin: 0;
  padding: 1rem;
  outline-offset: -3px;
}

.deep-case-code pre:focus-visible {
  outline: 2px solid var(--fresh-accent);
}

.deep-case-code code {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.75;
  white-space: pre;
}

.deep-case-code > p {
  margin: 0;
  border-top: 1px solid rgba(246, 245, 241, 0.1);
  padding: 0.75rem 1rem;
  color: var(--fresh-stage-muted);
  font-size: 0.75rem;
  line-height: 1.55;
}

@media (max-width: 700px) {
  .deep-cases-heading {
    align-items: start;
    flex-direction: column;
    gap: 0.5rem;
  }

  .deep-case-phase {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deep-case-chevron {
    transition: none;
  }
}
</style>
