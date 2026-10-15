<template>
  <figure
    :class="['case-figure', `case-figure--${projectId}`, { 'case-figure--compact': compact }]"
    :aria-label="t(`${projectName} 대표 개선 사례 요약`, `${projectName} highlight case summary`)"
  >
    <template v-if="compact && compactFlow">
      <figcaption class="cf-compact-title">{{ compactFlow.title }}</figcaption>
      <ol class="cf-compact-steps">
        <li v-for="(step, index) in compactFlow.steps" :key="step">
          <div class="cf-compact-step-top" aria-hidden="true">
            <span class="font-mono">0{{ index + 1 }}</span>
            <ArrowRight v-if="index < compactFlow.steps.length - 1" class="cf-compact-arrow" />
          </div>
          <strong>{{ step }}</strong>
        </li>
      </ol>
    </template>

    <template v-else-if="projectId === 'reachrich'">
      <figcaption class="cf-title font-heading">{{ t("데이터 수집부터 대시보드까지", "From data collection to the dashboard") }}</figcaption>
      <ol class="cf-steps">
        <li><span>{{ t("수집", "Collect") }}</span><strong>{{ t("계좌 · 시세 API", "Account · market APIs") }}</strong></li>
        <li><span>{{ t("저장", "Store") }}</span><strong>SQLite · Parquet</strong></li>
        <li><span>{{ t("조회", "View") }}</span><strong>FastAPI · React</strong></li>
      </ol>
    </template>

  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight } from "@lucide/vue";
import { t } from "@/i18n/locale";

const props = defineProps<{ projectId: string; compact?: boolean }>();
const projectName = computed(() => props.projectId === "reachrich" ? "ReachRich" : props.projectId.toUpperCase());
const compactFlow = computed(() => {
  const flows: Record<string, { title: string; steps: string[] }> = {
    tsms: {
      title: t("A/S 조회 개선", "Service-query improvement"),
      steps: [t("통합 뷰 조회 분석", "Analyze view query"), t("접수별 최신 이력 조회", "Fetch latest per case"), t("기존 결과 대조", "Compare results")],
    },
    pps: {
      title: t("대용량 첨부파일 다운로드", "Bulk attachment download"),
      steps: [t("작업 번호 발급", "Create job ID"), t("비동기 압축", "Compress async"), t("상태 확인·다운로드", "Track & download")],
    },
    sr30: {
      title: t("기간별 실적 조회", "Period-based reporting"),
      steps: [t("조회 기간 선택", "Select period"), t("월 목록·실적 집계", "Aggregate by month"), t("월별 열·소계 표시", "Show columns & totals")],
    },
  };
  return flows[props.projectId];
});
</script>

<style scoped>
/* 판 하나, 안쪽은 선과 글자만. 카드 · 배지 · 알약 · 색 라벨을 쓰지 않는다 */
.case-figure {
  display: grid;
  gap: 1.25rem;
  width: 100%;
  margin: 0;
  border-top: 2px solid var(--fresh-rule);
  background: var(--fresh-bg-soft);
  padding: 1.5rem;
  color: var(--text-primary);
}

.case-figure p,
.case-figure dl,
.case-figure ol {
  margin: 0;
}

.case-figure--compact {
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 1rem;
  border-top-width: 1px;
}

.cf-compact-title { font-size: 0.875rem; font-weight: 800; }
.cf-compact-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; padding: 0; list-style: none; }
.cf-compact-steps li { display: grid; align-content: start; gap: 0.4rem; }
.cf-compact-step-top { display: flex; min-height: 1rem; align-items: center; justify-content: space-between; gap: 0.5rem; }
.cf-compact-arrow { width: 1rem; height: 1rem; flex: none; color: var(--text-muted); }
.cf-compact-steps span { color: var(--text-muted); font-size: 0.65rem; }
.cf-compact-steps strong { font-size: 0.875rem; overflow-wrap: anywhere; line-height: 1.6; word-break: keep-all; }

.cf-title {
  font-size: 1.4rem;
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.03em;
}

.cf-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--fresh-border);
}

.cf-steps li {
  display: grid;
  align-content: start;
  gap: 0.2rem;
  padding: 0.9rem 0.9rem 0 0;
}

.cf-steps li + li {
  border-left: 1px solid var(--fresh-border);
  padding-left: 0.9rem;
}

.cf-steps span {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
}

.cf-steps strong {
  font-size: 0.95rem;
  font-weight: 900;
}

@media (max-width: 480px) {
  .cf-steps {
    grid-template-columns: 1fr;
  }

  .cf-steps li,
  .cf-steps li + li {
    border-left: 0;
    padding: 0.75rem 0 0;
  }

}
</style>
