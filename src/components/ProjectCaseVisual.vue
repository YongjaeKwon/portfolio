<template>
  <div class="case-reconstruction" :aria-label="`${projectName} 공개용 화면 구성`">
    <div class="case-window-bar">
      <div class="case-window-dots" aria-hidden="true"><span></span><span></span><span></span></div>
      <p>{{ projectName }} · 업무 흐름 재구성</p>
      <span class="case-public-note">실제 화면 아님</span>
    </div>

    <div v-if="projectId === 'pps'" class="pps-layout">
      <aside class="mock-sidebar" aria-label="협력사 포탈 메뉴 예시">
        <div class="mock-brand">PPS</div>
        <span class="is-active">협력사 관리</span>
        <span>현장 엔지니어 관리</span>
        <span>교육·자료</span>
        <span>계정 관리</span>
      </aside>

      <div class="mock-workspace">
        <div class="mock-heading-row">
          <div>
            <p class="mock-eyebrow">대량 첨부파일</p>
            <h3>다운로드 작업</h3>
          </div>
          <span class="status-chip is-running">압축 파일 생성 중</span>
        </div>

        <div class="download-job-card">
          <div class="job-icon"><Archive class="h-5 w-5" /></div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-3">
              <strong>교육 증빙자료 모음</strong>
              <span>상태 확인</span>
            </div>
            <div class="job-progress" aria-label="압축 작업 진행 중">
              <i></i><i></i><i></i><i class="is-muted"></i><i class="is-muted"></i>
            </div>
            <p>작업 ID로 진행 상태를 확인하고 새로고침 후에도 이어서 조회</p>
          </div>
        </div>

        <div class="mock-bottom-grid">
          <article>
            <div class="mock-card-title"><UserRoundCog class="h-4 w-4" /> 본사 계정 관리</div>
            <div class="mock-pills"><span>입력 확인</span><span>계정·인사정보 저장</span><span>사내 시스템 전송</span></div>
          </article>
          <article>
            <div class="mock-card-title"><ServerCog class="h-4 w-4" /> 배포 작업</div>
            <div class="deploy-flow"><span>빌드</span><ArrowRight class="h-3.5 w-3.5" /><span>서버 2</span><ArrowRight class="h-3.5 w-3.5" /><span>서버 1</span></div>
          </article>
        </div>
      </div>
    </div>

    <div v-else class="tsms-layout">
      <div class="device-lifecycle">
        <div v-for="(step, index) in lifecycleSteps" :key="step.label" class="lifecycle-step">
          <div class="lifecycle-icon"><component :is="step.icon" class="h-4 w-4" /></div>
          <span>{{ step.label }}</span>
          <ArrowRight v-if="index < lifecycleSteps.length - 1" class="lifecycle-arrow h-4 w-4" />
        </div>
      </div>

      <div class="tsms-feature-grid">
        <article class="tsms-feature-card">
          <div class="mock-card-title"><ScanSearch class="h-4 w-4" /> 중고거래 모니터링</div>
          <p>외부 사이트에 직접 접속하지 않고 입력된 URL 문자열을 분석합니다.</p>
          <div class="process-line"><span>URL 입력</span><ArrowRight class="h-3.5 w-3.5" /><span>형식 판별</span><ArrowRight class="h-3.5 w-3.5" /><span>중복 확인</span></div>
        </article>
        <article class="tsms-feature-card">
          <div class="mock-card-title"><ClipboardCheck class="h-4 w-4" /> 프리미엄케어 점검</div>
          <p>종이로 관리하던 점검 업무를 일정과 대상, 회차별 이력으로 연결했습니다.</p>
          <div class="inspection-stages"><span>일정</span><span>대상</span><span>재점검</span><span>결과</span></div>
        </article>
      </div>

      <div class="tsms-footer-line">
        <span><QrCode class="h-4 w-4" /> QR 발급</span>
        <span><MessageSquareText class="h-4 w-4" /> 안내 메시지</span>
        <span><Network class="h-4 w-4" /> 공통 API</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Archive,
  ArrowRight,
  ClipboardCheck,
  MessageSquareText,
  Network,
  PackageCheck,
  QrCode,
  ScanSearch,
  ServerCog,
  ShieldCheck,
  UserRoundCog,
  Wrench,
} from "@lucide/vue";

const props = defineProps<{ projectId: string }>();
const projectName = props.projectId === "pps" ? "PPS" : "TSMS";
const lifecycleSteps = [
  { label: "등록·발급", icon: QrCode },
  { label: "배송·설치", icon: PackageCheck },
  { label: "A/S", icon: Wrench },
  { label: "점검·관리", icon: ShieldCheck },
];
</script>

<style scoped>
.case-reconstruction {
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(49, 130, 246, 0.12);
  border-radius: 1.35rem;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 50px rgba(38, 69, 111, 0.1);
  color: var(--text-primary);
}
.case-window-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.65rem;
  padding: 0.6rem 0.85rem;
  border-bottom: 1px solid rgba(49, 130, 246, 0.09);
  background: rgba(248, 251, 255, 0.92);
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--text-muted);
}
.case-window-dots { display: flex; gap: 0.28rem; }
.case-window-dots span { width: 0.45rem; height: 0.45rem; border-radius: 50%; background: rgba(49, 130, 246, 0.22); }
.case-window-dots span:nth-child(2) { background: rgba(83, 199, 245, 0.34); }
.case-window-dots span:nth-child(3) { background: rgba(36, 192, 111, 0.3); }
.case-public-note { border-radius: 999px; background: var(--fresh-blue-soft); padding: 0.25rem 0.55rem; color: var(--fresh-blue-strong); white-space: nowrap; }
.pps-layout { display: grid; grid-template-columns: 7.5rem 1fr; min-height: 15.5rem; }
.mock-sidebar { display: grid; align-content: start; gap: 0.35rem; padding: 1rem 0.8rem; border-right: 1px solid rgba(49, 130, 246, 0.08); background: rgba(245, 249, 255, 0.8); }
.mock-brand { margin-bottom: 0.45rem; color: var(--fresh-blue-strong); font-size: 0.8rem; font-weight: 900; letter-spacing: 0.08em; }
.mock-sidebar span { border-radius: 0.55rem; padding: 0.5rem 0.6rem; color: var(--text-muted); font-size: 0.63rem; font-weight: 700; }
.mock-sidebar span.is-active { background: white; color: var(--fresh-blue-strong); box-shadow: 0 5px 16px rgba(38, 69, 111, 0.07); }
.mock-workspace { display: grid; align-content: start; gap: 0.75rem; padding: 1rem; min-width: 0; }
.mock-heading-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.mock-eyebrow { margin: 0 0 0.15rem; color: var(--text-muted); font-size: 0.62rem; font-weight: 800; }
.mock-heading-row h3 { margin: 0; font-size: 0.92rem; font-weight: 900; }
.status-chip { border-radius: 999px; padding: 0.32rem 0.6rem; font-size: 0.58rem; font-weight: 900; white-space: nowrap; }
.status-chip.is-running { background: rgba(49, 130, 246, 0.1); color: var(--fresh-blue-strong); }
.download-job-card { display: flex; gap: 0.75rem; border: 1px solid rgba(49, 130, 246, 0.09); border-radius: 0.9rem; background: white; padding: 0.8rem; }
.job-icon { display: grid; place-items: center; width: 2.35rem; height: 2.35rem; flex: 0 0 auto; border-radius: 0.75rem; background: var(--fresh-blue-soft); color: var(--fresh-blue); }
.download-job-card strong { font-size: 0.68rem; }
.download-job-card span, .download-job-card p { color: var(--text-muted); font-size: 0.55rem; font-weight: 700; }
.download-job-card p { margin: 0.45rem 0 0; line-height: 1.45; }
.job-progress { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.25rem; margin-top: 0.45rem; }
.job-progress i { height: 0.28rem; border-radius: 999px; background: var(--fresh-blue); }
.job-progress i.is-muted { background: rgba(49, 130, 246, 0.12); }
.mock-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
.mock-bottom-grid article, .tsms-feature-card { border: 1px solid rgba(49, 130, 246, 0.08); border-radius: 0.85rem; background: rgba(248, 251, 255, 0.78); padding: 0.7rem; min-width: 0; }
.mock-card-title { display: flex; align-items: center; gap: 0.4rem; font-size: 0.63rem; font-weight: 900; color: var(--text-secondary); }
.mock-pills { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.6rem; }
.mock-pills span, .deploy-flow span { border-radius: 999px; background: white; padding: 0.25rem 0.4rem; color: var(--text-muted); font-size: 0.5rem; font-weight: 800; }
.deploy-flow, .process-line { display: flex; align-items: center; gap: 0.25rem; margin-top: 0.6rem; color: var(--fresh-blue); }
.tsms-layout { display: grid; gap: 0.8rem; padding: 1rem; min-height: 15.5rem; align-content: center; }
.device-lifecycle { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.15rem; padding: 0.2rem 0.25rem 0.5rem; }
.lifecycle-step { position: relative; display: grid; justify-items: center; gap: 0.35rem; color: var(--text-secondary); font-size: 0.6rem; font-weight: 900; text-align: center; }
.lifecycle-icon { display: grid; place-items: center; width: 2.25rem; height: 2.25rem; border-radius: 0.75rem; background: var(--fresh-blue-soft); color: var(--fresh-blue); }
.lifecycle-arrow { position: absolute; right: -0.8rem; top: 0.58rem; color: rgba(49, 130, 246, 0.4); }
.tsms-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
.tsms-feature-card p { margin: 0.5rem 0 0; color: var(--text-muted); font-size: 0.54rem; font-weight: 650; line-height: 1.5; }
.process-line span { border-radius: 999px; background: white; padding: 0.25rem 0.35rem; color: var(--text-muted); font-size: 0.48rem; font-weight: 800; white-space: nowrap; }
.inspection-stages { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.3rem; margin-top: 0.65rem; }
.inspection-stages span { border-radius: 0.45rem; background: white; padding: 0.35rem 0.15rem; color: var(--fresh-blue-strong); font-size: 0.5rem; font-weight: 900; text-align: center; }
.tsms-footer-line { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.45rem; }
.tsms-footer-line span { display: inline-flex; align-items: center; gap: 0.3rem; border-radius: 999px; border: 1px solid rgba(49, 130, 246, 0.09); background: white; padding: 0.35rem 0.55rem; color: var(--text-secondary); font-size: 0.52rem; font-weight: 800; }
@media (max-width: 640px) {
  .pps-layout { grid-template-columns: 1fr; }
  .mock-sidebar { display: none; }
  .mock-bottom-grid, .tsms-feature-grid { grid-template-columns: 1fr; }
  .device-lifecycle { gap: 0.45rem; }
  .lifecycle-arrow { display: none; }
  .case-public-note { display: none; }
}
</style>
