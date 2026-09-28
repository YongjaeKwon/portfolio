<template>
  <div :class="['case-story', `case-story--${projectId}`, { 'is-compact': compact }]" role="img" :aria-label="t(`${projectName} 대표 개선 사례 요약`, `${projectName} highlight case summary`)">
    <header class="story-header">
      <div>
        <strong>{{ projectName }}</strong>
      </div>
      <span class="story-note">{{ storyNote }}</span>
    </header>

    <div v-if="projectId === 'pps'" class="story-body">
      <section class="story-lead">
        <span class="story-lead-icon"><Archive class="h-5 w-5" /></span>
        <div>
          <p>{{ t("대표 개선 사례", "Highlight case") }}</p>
          <h3 v-if="isEn">Long downloads became<br />trackable jobs</h3>
          <h3 v-else>오래 걸리는 다운로드를<br />추적 가능한 작업으로 전환</h3>
        </div>
      </section>

      <div class="story-journey" :aria-label="t('대량 다운로드 개선 흐름', 'Bulk download improvement flow')">
        <article class="journey-step is-problem">
          <span>{{ t("문제", "Problem") }}</span>
          <strong>{{ t("긴 동기 요청", "Long sync request") }}</strong>
          <p>{{ t("진행·실패 여부를 알기 어려움", "Progress and failures invisible") }}</p>
        </article>
        <ArrowRight class="journey-arrow h-4 w-4" />
        <article class="journey-step is-decision">
          <span>{{ t("판단", "Decision") }}</span>
          <strong>{{ t("작업 ID 분리", "Job-ID separation") }}</strong>
          <p>{{ t("요청과 압축 실행을 분리", "Request split from compression") }}</p>
        </article>
        <ArrowRight class="journey-arrow h-4 w-4" />
        <article class="journey-step is-result">
          <span>{{ t("결과", "Result") }}</span>
          <strong>{{ t("상태 추적", "Status tracking") }}</strong>
          <p>{{ t("새로고침 후에도 이어서 확인", "Resumes after page refresh") }}</p>
        </article>
      </div>

      <div class="story-facts">
        <article>
          <span>{{ t("처리 대상", "Workload") }}</span>
          <strong>{{ t("300~400건", "300–400 files") }}</strong>
          <p>{{ t("CE 증빙 첨부파일", "CE evidence attachments") }}</p>
        </article>
        <article>
          <span>{{ t("상태 구분", "States") }}</span>
          <strong>{{ t("4단계", "4 states") }}</strong>
          <p>{{ t("대기·진행·완료·실패", "Waiting · running · done · failed") }}</p>
        </article>
        <article>
          <span>{{ t("담당 범위", "Scope") }}</span>
          <strong>{{ t("전 과정", "End-to-end") }}</strong>
          <p>{{ t("화면·서버·배포", "UI · server · deployment") }}</p>
        </article>
      </div>
    </div>

    <div v-else-if="projectId === 'tsms'" class="story-body">
      <section class="story-lead">
        <span class="story-lead-icon"><Network class="h-5 w-5" /></span>
        <div>
          <p>{{ t("대표 업무 흐름", "Highlight workflows") }}</p>
          <h3 v-if="isEn">Scattered operations became<br />verifiable histories</h3>
          <h3 v-else>분산된 운영 업무를<br />확인 가능한 이력으로 연결</h3>
        </div>
      </section>

      <div class="operation-cases">
        <article class="operation-case">
          <div class="operation-title">
            <span><ScanSearch class="h-4 w-4" /></span>
            <div><small>{{ t("사례 1", "Case 1") }}</small><strong>{{ t("중고거래 모니터링", "Used-market monitoring") }}</strong></div>
          </div>
          <p>{{ t("외부 사이트에 직접 요청하지 않고 담당자가 확인한 URL 문자열만 분석합니다.", "Only staff-verified URL strings are analyzed — no direct requests to external sites.") }}</p>
          <div class="operation-flow"><span>{{ t("검색 링크", "Search links") }}</span><i></i><span>{{ t("URL 분석", "URL analysis") }}</span><i></i><span>{{ t("중복·이력", "Duplicates · history") }}</span></div>
        </article>

        <article class="operation-case">
          <div class="operation-title">
            <span><ClipboardCheck class="h-4 w-4" /></span>
            <div><small>{{ t("사례 2", "Case 2") }}</small><strong>{{ t("학교 방문 점검", "On-site school inspections") }}</strong></div>
          </div>
          <p>{{ t("종이 점검을 일정, 대상, 미점검 사유, 재점검 회차까지 시스템에서 처리하게 바꿨습니다.", "Paper inspections became a connected flow: schedules, targets, missed reasons, and re-inspection rounds.") }}</p>
          <div class="operation-flow"><span>{{ t("일정·대상", "Schedule · targets") }}</span><i></i><span>{{ t("현장 점검", "Field inspection") }}</span><i></i><span>{{ t("재점검·결과", "Re-inspection · results") }}</span></div>
        </article>
      </div>

      <div class="story-scope">
        <span><QrCode class="h-4 w-4" /> {{ t("QR 발급", "QR issuance") }}</span>
        <span><MessageSquareText class="h-4 w-4" /> {{ t("안내 메시지", "Notifications") }}</span>
        <span><ServerCog class="h-4 w-4" /> {{ t("공통 연계", "Shared integrations") }}</span>
      </div>
    </div>

    <div v-else class="story-body reachrich-story">
      <section class="story-lead">
        <span class="story-lead-icon"><Workflow class="h-5 w-5" /></span>
        <div>
          <p>{{ t("2026.08 새 저장소 재설계", "Redesigned in a new repo, Aug 2026") }}</p>
          <h3 v-if="isEn">Account and market data<br />wired to validation & operations</h3>
          <h3 v-else>계좌와 시장 데이터를<br />검증·운영 화면으로 연결</h3>
        </div>
      </section>

      <div class="reachrich-pipeline" :aria-label="t('ReachRich 데이터와 운영 흐름', 'ReachRich data and operations flow')">
        <article>
          <span><WalletCards class="h-4 w-4" /></span>
          <small>{{ t("수집", "Collect") }}</small>
          <strong>{{ t("토스·KRX", "Toss · KRX") }}</strong>
        </article>
        <ArrowRight class="reachrich-arrow h-4 w-4" />
        <article>
          <span><Database class="h-4 w-4" /></span>
          <small>{{ t("저장", "Mirror") }}</small>
          <strong>SQLite·Parquet</strong>
        </article>
        <ArrowRight class="reachrich-arrow h-4 w-4" />
        <article>
          <span><ShieldCheck class="h-4 w-4" /></span>
          <small>{{ t("검증", "Validate") }}</small>
          <strong>{{ t("검증·모의운용", "Validation · paper trading") }}</strong>
        </article>
        <ArrowRight class="reachrich-arrow h-4 w-4" />
        <article>
          <span><Monitor class="h-4 w-4" /></span>
          <small>{{ t("모니터링", "Observe") }}</small>
          <strong>{{ t("React 콘솔", "React console") }}</strong>
        </article>
      </div>

      <div class="story-facts reachrich-facts">
        <article>
          <span>Backend</span>
          <strong>205 tests</strong>
          <p>{{ t("pytest 통과", "pytest passing") }}</p>
        </article>
        <article>
          <span>Frontend</span>
          <strong>96 tests</strong>
          <p>{{ t("Vitest·빌드 통과", "Vitest · build passing") }}</p>
        </article>
        <article>
          <span>Automation</span>
          <strong>3 workflows</strong>
          <p>{{ t("CI·점검·모의운용", "CI · checks · paper trading") }}</p>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Archive,
  ArrowRight,
  ClipboardCheck,
  Database,
  MessageSquareText,
  Monitor,
  Network,
  QrCode,
  ScanSearch,
  ServerCog,
  ShieldCheck,
  WalletCards,
  Workflow,
} from "@lucide/vue";

import { isEn, t } from "@/i18n/locale";

const props = withDefaults(defineProps<{ projectId: string; compact?: boolean }>(), { compact: false });
const projectName = computed(() => {
  if (props.projectId === "pps") return "PPS";
  if (props.projectId === "tsms") return "TSMS";
  return "ReachRich";
});
const storyNote = computed(() =>
  props.projectId === "reachrich"
    ? t("개인 프로젝트 · 진행 중", "Personal project · in progress")
    : t("실제 업무 기준 요약", "Summary of real production work")
);
</script>

<style scoped>
.case-story {
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  background: var(--fresh-bg);
  color: var(--text-primary);
}

.case-story--tsms {
  background: var(--fresh-bg);
}

.case-story--reachrich {
  border-color: rgba(109, 163, 255, 0.24);
  background: linear-gradient(145deg, #111725, #0d111b 72%);
  color: #f0ede6;
}

.case-story--reachrich .story-header {
  border-bottom-color: rgba(240, 237, 230, 0.09);
  background: rgba(255, 255, 255, 0.025);
}

.case-story--reachrich .story-kicker,
.case-story--reachrich .story-lead p {
  color: #7eb5ff;
}

.case-story--reachrich .story-note {
  border-color: rgba(227, 197, 103, 0.2);
  background: rgba(227, 197, 103, 0.08);
  color: #e3c567;
}

.story-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 3.4rem;
  padding: 0.78rem 1rem;
  border-bottom: 1px solid rgba(49, 130, 246, 0.1);
  background: rgba(255, 255, 255, 0.62);
}

.story-header > div { display: flex; align-items: baseline; gap: 0.55rem; }
.story-kicker { margin: 0; color: var(--fresh-blue-strong); font-size: 0.58rem; font-weight: 900; letter-spacing: 0.16em; text-transform: uppercase; }
.story-header strong { font-size: 0.8rem; font-weight: 950; letter-spacing: 0.02em; }
.story-note { border: 1px solid rgba(49, 130, 246, 0.1); border-radius: 999px; background: rgba(255, 255, 255, 0.84); padding: 0.3rem 0.58rem; color: var(--text-muted); font-size: 0.56rem; font-weight: 800; white-space: nowrap; }

.story-body { display: grid; gap: 0.9rem; padding: 1rem; }
.story-lead { display: flex; align-items: center; gap: 0.75rem; }
.story-lead-icon { display: grid; width: 2.65rem; height: 2.65rem; flex: 0 0 auto; place-items: center; border-radius: 0.5rem; background: var(--fresh-blue-strong); color: white; }
.case-story--tsms .story-lead-icon { background: var(--fresh-blue-strong); }
.case-story--reachrich .story-lead-icon { background: var(--fresh-blue-strong); }
.story-lead p { margin: 0 0 0.18rem; color: var(--fresh-blue-strong); font-size: 0.58rem; font-weight: 900; letter-spacing: 0.08em; }
.story-lead h3 { margin: 0; font-size: clamp(0.86rem, 2.2vw, 1.03rem); font-weight: 950; line-height: 1.34; letter-spacing: -0.02em; }

.story-journey {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 0.35rem;
}
.journey-step { min-width: 0; border: 1px solid rgba(49, 130, 246, 0.1); border-radius: 0.5rem; background: rgba(255, 255, 255, 0.82); padding: 0.65rem; }
.journey-step > span { display: block; margin-bottom: 0.25rem; color: var(--text-muted); font-size: 0.48rem; font-weight: 800; }
.journey-step strong { display: block; font-size: 0.66rem; font-weight: 950; line-height: 1.35; }
.journey-step p { margin: 0.28rem 0 0; color: var(--text-muted); font-size: 0.52rem; font-weight: 700; line-height: 1.45; }
.journey-step.is-problem { border-color: rgba(239, 112, 96, 0.14); background: rgba(255, 248, 247, 0.88); }
.journey-step.is-decision { border-color: rgba(49, 130, 246, 0.16); background: rgba(246, 250, 255, 0.92); }
.journey-step.is-result { border-color: rgba(36, 192, 111, 0.16); background: rgba(246, 253, 249, 0.92); }
.journey-step.is-problem > span { color: #d25d50; }
.journey-step.is-decision > span { color: var(--fresh-blue-strong); }
.journey-step.is-result > span { color: #13895a; }
.journey-arrow { align-self: center; color: rgba(49, 130, 246, 0.35); }

.story-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; }
.story-facts article { min-width: 0; border-top: 1px solid rgba(49, 130, 246, 0.1); padding: 0.65rem 0.25rem 0.1rem; }
.story-facts span { display: block; color: var(--text-muted); font-size: 0.5rem; font-weight: 850; }
.story-facts strong { display: block; margin-top: 0.16rem; color: var(--fresh-blue-strong); font-size: 0.72rem; font-weight: 950; }
.story-facts p { margin: 0.13rem 0 0; color: var(--text-muted); font-size: 0.48rem; font-weight: 700; line-height: 1.35; }

.operation-cases { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.65rem; }
.operation-case { min-width: 0; border: 1px solid rgba(49, 130, 246, 0.1); border-radius: 0.5rem; background: rgba(255, 255, 255, 0.84); padding: 0.75rem; }
.operation-title { display: flex; align-items: center; gap: 0.55rem; }
.operation-title > span { display: grid; width: 2rem; height: 2rem; flex: 0 0 auto; place-items: center; border-radius: 0.375rem; background: var(--fresh-blue-soft); color: var(--fresh-blue-strong); }
.operation-title div { display: grid; gap: 0.08rem; min-width: 0; }
.operation-title small { color: var(--text-muted); font-size: 0.46rem; font-weight: 800; }
.operation-title strong { font-size: 0.63rem; font-weight: 950; white-space: nowrap; }
.operation-case > p { min-height: 2.5rem; margin: 0.55rem 0 0; color: var(--text-muted); font-size: 0.52rem; font-weight: 700; line-height: 1.5; }
.operation-flow { display: flex; align-items: center; gap: 0.25rem; margin-top: 0.6rem; }
.operation-flow span { flex: 0 1 auto; border-radius: 999px; background: rgba(49, 130, 246, 0.07); padding: 0.26rem 0.38rem; color: var(--text-secondary); font-size: 0.44rem; font-weight: 900; white-space: nowrap; }
.operation-flow i { height: 1px; min-width: 0.28rem; flex: 1 1 auto; background: rgba(49, 130, 246, 0.24); }

.story-scope { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.42rem; border-top: 1px solid rgba(49, 130, 246, 0.1); padding-top: 0.72rem; }
.story-scope span { display: inline-flex; align-items: center; gap: 0.28rem; border-radius: 999px; background: rgba(255, 255, 255, 0.85); padding: 0.34rem 0.55rem; color: var(--text-secondary); font-size: 0.5rem; font-weight: 850; }

.reachrich-pipeline {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.15fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.34rem;
}

.reachrich-pipeline article {
  display: grid;
  min-width: 0;
  justify-items: start;
  gap: 0.18rem;
  border: 1px solid rgba(126, 181, 255, 0.15);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.045);
  padding: 0.62rem;
}

.reachrich-pipeline article > span {
  display: grid;
  width: 1.75rem;
  height: 1.75rem;
  margin-bottom: 0.1rem;
  place-items: center;
  border-radius: 0.375rem;
  background: rgba(70, 147, 252, 0.13);
  color: #7eb5ff;
}

.reachrich-pipeline small { color: #8a94a6; font-size: 0.46rem; font-weight: 800; }
.reachrich-pipeline strong { color: #f0ede6; font-size: 0.57rem; font-weight: 900; line-height: 1.35; white-space: nowrap; }
.reachrich-arrow { color: rgba(126, 181, 255, 0.46); }

.reachrich-facts article { border-top-color: rgba(240, 237, 230, 0.1); }
.reachrich-facts span,
.reachrich-facts p { color: #8a94a6; }
.reachrich-facts strong { color: #e3c567; }

.case-story.is-compact { height: 100%; border-radius: 0.5rem; }
.case-story.is-compact .story-header { min-height: 2.35rem; padding: 0.48rem 0.65rem; }
.case-story.is-compact .story-kicker { font-size: 0.48rem; }
.case-story.is-compact .story-header strong { font-size: 0.66rem; }
.case-story.is-compact .story-note { padding: 0.22rem 0.42rem; font-size: 0.46rem; }
.case-story.is-compact .story-body { gap: 0.48rem; padding: 0.55rem 0.62rem; }
.case-story.is-compact .story-lead { display: none; }
.case-story.is-compact .reachrich-pipeline { gap: 0.2rem; }
.case-story.is-compact .reachrich-pipeline article { justify-items: center; gap: 0.1rem; padding: 0.35rem 0.18rem; text-align: center; }
.case-story.is-compact .reachrich-pipeline article > span { width: 1.4rem; height: 1.4rem; margin: 0; }
.case-story.is-compact .reachrich-pipeline small { display: none; }
.case-story.is-compact .reachrich-pipeline strong { font-size: 0.43rem; }
.case-story.is-compact .reachrich-arrow { width: 0.58rem; }
.case-story.is-compact .story-facts { gap: 0.28rem; }
.case-story.is-compact .story-facts article { padding: 0.35rem 0.1rem 0; text-align: center; }
.case-story.is-compact .story-facts span { font-size: 0.4rem; }
.case-story.is-compact .story-facts strong { margin-top: 0.08rem; font-size: 0.55rem; }
.case-story.is-compact .story-facts p { display: none; }

/* 전체 크기(경력 · 상세)에서는 읽히는 크기 11px 이상. compact 썸네일은 위 값을 유지한다 */
.case-story:not(.is-compact) :is(.story-kicker, .story-note, .story-lead p, .journey-step > span, .story-facts span, .operation-title small, .operation-flow span, .story-scope span, .reachrich-pipeline small) { font-size: 0.6875rem; }
.case-story:not(.is-compact) :is(.journey-step strong, .journey-step p, .story-facts p, .operation-title strong, .operation-case > p, .reachrich-pipeline strong) { font-size: 0.75rem; }

@media (max-width: 480px) {
  .story-note { display: none; }
  .story-journey { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .journey-arrow { display: none; }
  .journey-step { padding: 0.55rem; }
  .journey-step p { display: none; }
  .operation-cases { grid-template-columns: 1fr; }
  .operation-case > p { min-height: 0; }
  .case-story:not(.is-compact) .operation-flow { flex-wrap: wrap; }
  .case-story:not(.is-compact) .operation-flow i { display: none; }
  .reachrich-pipeline { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .case-story:not(.is-compact) .reachrich-pipeline { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .reachrich-arrow { display: none; }
  .reachrich-pipeline article { justify-items: center; text-align: center; }
  .reachrich-pipeline strong { font-size: 0.5rem; }
}
</style>
