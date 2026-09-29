<template>
  <figure
    :class="['case-figure', `case-figure--${projectId}`, { 'is-compact': compact }]"
    :aria-label="t(`${projectName} 대표 개선 사례 요약`, `${projectName} highlight case summary`)"
  >
    <template v-if="projectId === 'pps'">
      <p class="cf-number font-mono tnum">300~400<small>{{ t("건", " files") }}</small></p>
      <p class="cf-lead">{{ t("현장 엔지니어 증빙 첨부파일을 한 요청에서 압축하던 다운로드", "Field-engineer evidence files zipped inside one request") }}</p>
      <ol class="cf-steps">
        <li>
          <span>{{ t("문제", "Problem") }}</span>
          <strong>{{ t("긴 동기 요청", "Long sync request") }}</strong>
          <p>{{ t("진행 중인지 실패했는지 알 수 없음", "No way to tell progress from failure") }}</p>
        </li>
        <li>
          <span>{{ t("판단", "Decision") }}</span>
          <strong>{{ t("작업 ID 분리", "Separate job ID") }}</strong>
          <p>{{ t("요청과 압축 실행을 떼어 냄", "Request split from compression") }}</p>
        </li>
        <li>
          <span>{{ t("결과", "Result") }}</span>
          <strong>{{ t("상태 추적", "Status tracking") }}</strong>
          <p>{{ t("새로고침 후에도 이어서 확인", "Resumes after a refresh") }}</p>
        </li>
      </ol>
      <dl class="cf-facts">
        <div><dt>{{ t("상태", "States") }}</dt><dd>{{ t("대기 · 진행 · 완료 · 실패", "waiting · running · done · failed") }}</dd></div>
        <div><dt>{{ t("담당", "Scope") }}</dt><dd>{{ t("화면 · 서버 · 배포", "UI · server · deployment") }}</dd></div>
      </dl>
    </template>

    <template v-else-if="projectId === 'tsms'">
      <p class="cf-title font-heading">{{ t("흩어진 운영 업무를 확인할 수 있는 이력으로", "Scattered operations became verifiable histories") }}</p>
      <ol class="cf-cases">
        <li>
          <strong>{{ t("중고거래 모니터링", "Used-market monitoring") }}</strong>
          <p>{{ t("외부 사이트에 직접 요청하지 않고, 담당자가 확인한 URL 문자열만 분석합니다.", "Only staff-verified URL strings are analyzed, with no direct requests to external sites.") }}</p>
          <p class="cf-path">{{ t("검색 링크 → URL 분석 → 중복 · 이력", "search links → URL analysis → duplicates · history") }}</p>
        </li>
        <li>
          <strong>{{ t("학교 방문 점검", "On-site school inspections") }}</strong>
          <p>{{ t("종이 점검을 일정, 대상, 미점검 사유, 재점검 회차까지 시스템에서 처리하게 바꿨습니다.", "Paper inspections became one flow: schedules, targets, missed reasons and re-inspection rounds.") }}</p>
          <p class="cf-path">{{ t("일정 · 대상 → 현장 점검 → 재점검 · 결과", "schedule · targets → field check → re-check · results") }}</p>
        </li>
      </ol>
      <p class="cf-note">{{ t("이 밖에 QR 발급, 안내 메시지, 공통 연계", "Also: QR issuance, notifications, shared integrations") }}</p>
    </template>

    <template v-else>
      <p v-if="!compact" class="cf-title font-heading">{{ t("계좌와 시장 데이터를 검증 · 운영 화면으로 연결", "Account and market data wired to validation and operations") }}</p>
      <p class="cf-path">{{ t("토스 · KRX → SQLite · Parquet → 검증 · 모의운용 → React 콘솔", "Toss · KRX → SQLite · Parquet → validation · paper trading → React console") }}</p>
      <dl class="cf-counts">
        <div><dt>{{ t("백엔드 테스트", "backend tests") }}</dt><dd class="font-mono tnum">205</dd></div>
        <div><dt>{{ t("프론트엔드 테스트", "frontend tests") }}</dt><dd class="font-mono tnum">96</dd></div>
        <div><dt>{{ t("자동 워크플로", "workflows") }}</dt><dd class="font-mono tnum">3</dd></div>
      </dl>
      <p v-if="!compact" class="cf-note">{{ t("2026년 8월 새 저장소로 다시 설계", "Redesigned in a new repository, Aug 2026") }}</p>
    </template>
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/i18n/locale";

const props = withDefaults(defineProps<{ projectId: string; compact?: boolean }>(), { compact: false });
const projectName = computed(() => ({ pps: "PPS", tsms: "TSMS" })[props.projectId] ?? "ReachRich");
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

.cf-number {
  font-size: clamp(3rem, 2rem + 3vw, 4.25rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.06em;
}

.cf-number small {
  margin-left: 0.15rem;
  font-family: var(--font-body);
  font-size: 0.4em;
  font-weight: 900;
  letter-spacing: 0;
}

.cf-lead {
  margin-top: -0.5rem !important;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.6;
}

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

.cf-steps span,
.cf-facts dt {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
}

.cf-steps strong {
  font-size: 0.95rem;
  font-weight: 900;
}

.cf-steps p,
.cf-cases p {
  color: var(--text-secondary);
  font-size: 0.8125rem;
  line-height: 1.55;
}

.cf-facts {
  display: grid;
  gap: 0.35rem;
  border-top: 1px solid var(--fresh-border);
  padding-top: 0.9rem;
  font-size: 0.8125rem;
}

.cf-facts div {
  display: grid;
  grid-template-columns: 3rem 1fr;
}

.cf-facts dd {
  margin: 0;
  font-weight: 700;
}

.cf-cases {
  display: grid;
  padding: 0;
  list-style: none;
}

.cf-cases li {
  display: grid;
  gap: 0.35rem;
  border-top: 1px solid var(--fresh-border);
  padding: 0.9rem 0;
}

.cf-cases strong {
  font-size: 1rem;
  font-weight: 900;
}

.cf-path {
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.6;
}

.cf-note {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.cf-counts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--fresh-border);
}

.cf-counts div {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  gap: 0.25rem;
  padding-top: 0.9rem;
}

.cf-counts dd {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
}

.cf-counts dt {
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 700;
}

/* ReachRich: 어두운 판 */
.case-figure--reachrich {
  --text-primary: var(--fresh-stage-ink);
  --text-secondary: #dcdad3;
  --text-muted: var(--fresh-stage-muted);
  --fresh-border: rgba(246, 245, 241, 0.16);
  border-top-color: var(--fresh-accent);
  background: var(--fresh-stage-raised);
}

/* 프로젝트 카드 썸네일 */
.case-figure.is-compact {
  height: 100%;
  align-content: space-between;
  border-top: 0;
  border-radius: var(--fresh-radius-md);
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

  .cf-counts dd {
    font-size: 2rem;
  }
}
</style>
