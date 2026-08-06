<template>
  <div :class="['case-story', `case-story--${projectId}`]" :aria-label="`${projectName} 대표 개선 사례 요약`">
    <header class="story-header">
      <div>
        <p class="story-kicker">Project case</p>
        <strong>{{ projectName }}</strong>
      </div>
      <span class="story-note">실제 업무 기준 요약</span>
    </header>

    <div v-if="projectId === 'pps'" class="story-body">
      <section class="story-lead">
        <span class="story-lead-icon"><Archive class="h-5 w-5" /></span>
        <div>
          <p>대표 개선 사례</p>
          <h3>오래 걸리는 다운로드를<br />추적 가능한 작업으로 전환</h3>
        </div>
      </section>

      <div class="story-journey" aria-label="대량 다운로드 개선 흐름">
        <article class="journey-step is-problem">
          <span>Problem</span>
          <strong>긴 동기 요청</strong>
          <p>진행·실패 여부를 알기 어려움</p>
        </article>
        <ArrowRight class="journey-arrow h-4 w-4" />
        <article class="journey-step is-decision">
          <span>Decision</span>
          <strong>작업 ID 분리</strong>
          <p>요청과 압축 실행을 분리</p>
        </article>
        <ArrowRight class="journey-arrow h-4 w-4" />
        <article class="journey-step is-result">
          <span>Result</span>
          <strong>상태 추적</strong>
          <p>새로고침 후에도 이어서 확인</p>
        </article>
      </div>

      <div class="story-facts">
        <article>
          <span>처리 대상</span>
          <strong>300~400건</strong>
          <p>CE 증빙 첨부파일</p>
        </article>
        <article>
          <span>상태 구분</span>
          <strong>4단계</strong>
          <p>대기·진행·완료·실패</p>
        </article>
        <article>
          <span>담당 범위</span>
          <strong>End-to-end</strong>
          <p>화면·서버·배포</p>
        </article>
      </div>
    </div>

    <div v-else class="story-body">
      <section class="story-lead">
        <span class="story-lead-icon"><Network class="h-5 w-5" /></span>
        <div>
          <p>대표 업무 흐름</p>
          <h3>분산된 운영 업무를<br />확인 가능한 이력으로 연결</h3>
        </div>
      </section>

      <div class="operation-cases">
        <article class="operation-case">
          <div class="operation-title">
            <span><ScanSearch class="h-4 w-4" /></span>
            <div><small>Case 01</small><strong>중고거래 모니터링</strong></div>
          </div>
          <p>외부 사이트에 직접 요청하지 않고 담당자가 확인한 URL 문자열만 분석합니다.</p>
          <div class="operation-flow"><span>검색 링크</span><i></i><span>URL 분석</span><i></i><span>중복·이력</span></div>
        </article>

        <article class="operation-case">
          <div class="operation-title">
            <span><ClipboardCheck class="h-4 w-4" /></span>
            <div><small>Case 02</small><strong>학교 방문 점검</strong></div>
          </div>
          <p>종이 점검을 일정과 대상, 미점검 사유와 재점검 회차까지 이어지는 흐름으로 바꿨습니다.</p>
          <div class="operation-flow"><span>일정·대상</span><i></i><span>현장 점검</span><i></i><span>재점검·결과</span></div>
        </article>
      </div>

      <div class="story-scope">
        <span><QrCode class="h-4 w-4" /> QR 발급</span>
        <span><MessageSquareText class="h-4 w-4" /> 안내 메시지</span>
        <span><ServerCog class="h-4 w-4" /> 공통 연계</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Archive, ArrowRight, ClipboardCheck, MessageSquareText, Network, QrCode, ScanSearch, ServerCog } from "@lucide/vue";

const props = defineProps<{ projectId: string }>();
const projectName = props.projectId === "pps" ? "PPS" : "TSMS";
</script>

<style scoped>
.case-story {
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(49, 130, 246, 0.13);
  border-radius: 1.4rem;
  background:
    radial-gradient(circle at 92% 8%, rgba(83, 199, 245, 0.15), transparent 32%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(244, 249, 255, 0.92));
  box-shadow: 0 20px 52px rgba(38, 69, 111, 0.1);
  color: var(--text-primary);
}

.case-story--tsms {
  background:
    radial-gradient(circle at 8% 5%, rgba(90, 118, 255, 0.12), transparent 30%),
    radial-gradient(circle at 96% 96%, rgba(36, 192, 111, 0.1), transparent 28%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(245, 249, 255, 0.92));
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
.story-lead-icon { display: grid; width: 2.65rem; height: 2.65rem; flex: 0 0 auto; place-items: center; border-radius: 0.85rem; background: linear-gradient(145deg, var(--fresh-blue), #53c7f5); box-shadow: 0 10px 22px rgba(49, 130, 246, 0.2); color: white; }
.case-story--tsms .story-lead-icon { background: linear-gradient(145deg, #496ee9, #2ab987); }
.story-lead p { margin: 0 0 0.18rem; color: var(--fresh-blue-strong); font-size: 0.58rem; font-weight: 900; letter-spacing: 0.08em; }
.story-lead h3 { margin: 0; font-size: clamp(0.86rem, 2.2vw, 1.03rem); font-weight: 950; line-height: 1.34; letter-spacing: -0.02em; }

.story-journey {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 0.35rem;
}
.journey-step { min-width: 0; border: 1px solid rgba(49, 130, 246, 0.1); border-radius: 0.85rem; background: rgba(255, 255, 255, 0.82); padding: 0.65rem; }
.journey-step > span { display: block; margin-bottom: 0.25rem; color: var(--text-muted); font-size: 0.48rem; font-weight: 950; letter-spacing: 0.08em; text-transform: uppercase; }
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
.operation-case { min-width: 0; border: 1px solid rgba(49, 130, 246, 0.1); border-radius: 1rem; background: rgba(255, 255, 255, 0.84); padding: 0.75rem; box-shadow: 0 8px 24px rgba(38, 69, 111, 0.05); }
.operation-title { display: flex; align-items: center; gap: 0.55rem; }
.operation-title > span { display: grid; width: 2rem; height: 2rem; flex: 0 0 auto; place-items: center; border-radius: 0.65rem; background: var(--fresh-blue-soft); color: var(--fresh-blue-strong); }
.operation-title div { display: grid; gap: 0.08rem; min-width: 0; }
.operation-title small { color: var(--text-muted); font-size: 0.46rem; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; }
.operation-title strong { font-size: 0.63rem; font-weight: 950; white-space: nowrap; }
.operation-case > p { min-height: 2.5rem; margin: 0.55rem 0 0; color: var(--text-muted); font-size: 0.52rem; font-weight: 700; line-height: 1.5; }
.operation-flow { display: flex; align-items: center; gap: 0.25rem; margin-top: 0.6rem; }
.operation-flow span { flex: 0 1 auto; border-radius: 999px; background: rgba(49, 130, 246, 0.07); padding: 0.26rem 0.38rem; color: var(--text-secondary); font-size: 0.44rem; font-weight: 900; white-space: nowrap; }
.operation-flow i { height: 1px; min-width: 0.28rem; flex: 1 1 auto; background: rgba(49, 130, 246, 0.24); }

.story-scope { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.42rem; border-top: 1px solid rgba(49, 130, 246, 0.1); padding-top: 0.72rem; }
.story-scope span { display: inline-flex; align-items: center; gap: 0.28rem; border-radius: 999px; background: rgba(255, 255, 255, 0.85); padding: 0.34rem 0.55rem; color: var(--text-secondary); font-size: 0.5rem; font-weight: 850; }

@media (max-width: 480px) {
  .story-note { display: none; }
  .story-journey { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .journey-arrow { display: none; }
  .journey-step { padding: 0.55rem; }
  .journey-step p { display: none; }
  .operation-cases { grid-template-columns: 1fr; }
  .operation-case > p { min-height: 0; }
}
</style>
