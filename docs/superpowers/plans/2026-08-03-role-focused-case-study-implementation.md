# Role-Focused Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the current portfolio layout while presenting PPS and TSMS as role-specific `문제 -> 판단 -> 구현 -> 결과` case studies.

**Architecture:** Extend the existing project data with an optional `caseStudy` narrative and keep the current perspective merge path. Move the merge function into a small utility so the data selection can be checked independently, then render compact problem/result evidence on cards and the full four-step narrative in the existing modal. Projects without the new data retain the current fallback UI.

**Tech Stack:** Vue 3, TypeScript, Tailwind CSS, Vite, vue-tsc

---

## File Map

- Modify `src/data/portfolio.ts`: define the case-study type and add base, frontend, and backend narratives for PPS and TSMS.
- Create `src/utils/projectPresentation.ts`: merge base project data with the active role perspective.
- Create `scripts/verify-project-presentation.mjs`: runtime checks for role merging and fallback behavior.
- Modify `src/views/ProjectsView.vue`: render compact card evidence and detailed four-step narratives while preserving existing modal behavior.

### Task 1: Add a typed project-presentation boundary

**Files:**
- Create: `scripts/verify-project-presentation.mjs`
- Create: `src/utils/projectPresentation.ts`
- Modify: `src/data/portfolio.ts`

- [ ] **Step 1: Write the failing compile-time check**

Create a Vite-powered runtime verification script that loads the portfolio data and presentation utility, then asserts that PPS and TSMS expose different Frontend and Backend narratives.

```ts
import { featuredProjects, type CaseStudyNarrative } from "@/data/portfolio";
import { presentProject } from "@/utils/projectPresentation";

const pps = featuredProjects.find((project) => project.id === "pps");
if (!pps) throw new Error("PPS project fixture is missing");

const frontend = presentProject(pps, "frontend");
const fallback = presentProject(pps, "all");

export const frontendCaseStudy: CaseStudyNarrative | undefined = frontend.detail.caseStudy;
export const fallbackCaseStudy: CaseStudyNarrative | undefined = fallback.detail.caseStudy;
```

- [ ] **Step 2: Run the type check and verify it fails**

Run: `npm run build`

Expected: FAIL because `projectPresentation` and `detail.caseStudy` do not exist yet.

- [ ] **Step 3: Add the case-study type**

Add to `src/data/portfolio.ts`:

```ts
export type CaseStudyNarrative = {
  problem: string;
  decision: string;
  implementation: string[];
  outcome: string[];
};
```

Extend `ProjectDetailCopy`:

```ts
type ProjectDetailCopy = {
  scope: string[];
  workPoints: string[];
  techUsage: string[];
  caseStudy?: CaseStudyNarrative;
};
```

- [ ] **Step 4: Extract the existing perspective merge**

Create `src/utils/projectPresentation.ts`:

```ts
import type { FeaturedProject, FocusTrackId, RoleFocusId } from "@/data/portfolio";

export type PresentedProject = {
  project: FeaturedProject;
  card: FeaturedProject["card"];
  detail: FeaturedProject["detail"];
};

export const presentProject = (project: FeaturedProject, focus: FocusTrackId): PresentedProject => {
  const perspective = focus === "all" ? undefined : project.perspectives?.[focus as RoleFocusId];

  return {
    project,
    card: { ...project.card, ...perspective?.card },
    detail: { ...project.detail, ...perspective?.detail },
  };
};
```

- [ ] **Step 5: Run the runtime verification and build**

Run: `npm test && npm run build`

Expected: PASS with a generated `dist` directory.

### Task 2: Add verified PPS and TSMS narratives

**Files:**
- Modify: `src/data/portfolio.ts`

- [ ] **Step 1: Add the PPS base narrative**

Add `caseStudy` inside the PPS `detail` object:

```ts
caseStudy: {
  problem: "300~400명 규모의 첨부파일을 한 번에 압축하면 요청이 오래 대기했고, 사용자는 진행 중인지 실패했는지 알기 어려웠습니다.",
  decision: "화면 요청과 압축 실행을 분리하고, 작업 ID를 기준으로 서버 상태와 사용자 화면을 연결하기로 했습니다.",
  implementation: [
    "전용 실행기에서 압축을 처리하고 대기·진행·완료·실패 상태를 저장했습니다.",
    "Vue 화면에서 2초 간격으로 상태를 조회하고 새로고침 뒤에도 기존 작업을 다시 찾아 이어서 보여주었습니다.",
    "완료 파일은 스트리밍으로 내려받고 만료된 결과 파일은 자동으로 정리했습니다.",
  ],
  outcome: [
    "300~400명 규모 대량 다운로드를 비동기 작업으로 운영하고 있습니다.",
    "사용자가 진행 상태와 실패 여부를 확인하고 완료 파일을 이어서 내려받을 수 있게 됐습니다.",
  ],
},
```

- [ ] **Step 2: Add PPS frontend and backend narratives**

Add `caseStudy` to each PPS perspective `detail` object:

```ts
// frontend
caseStudy: {
  problem: "대량 압축 중에는 화면이 오래 대기해 사용자가 진행, 완료, 실패 여부를 구분하기 어려웠습니다.",
  decision: "오래 걸리는 요청을 대기·진행·완료·실패의 명시적인 화면 상태로 관리하기로 했습니다.",
  implementation: [
    "Vue 화면에 작업 요청과 2초 간격 상태 조회를 연결했습니다.",
    "새로고침 뒤에도 작업 ID로 기존 작업을 찾아 진행 상황을 이어서 보여주었습니다.",
    "완료, 실패와 만료 상태에 맞춰 다운로드와 오류 안내를 분리했습니다.",
  ],
  outcome: [
    "300~400명 규모 작업의 진행과 실패 여부를 화면에서 확인할 수 있게 됐습니다.",
    "완료된 파일은 새로고침 이후에도 이어서 내려받을 수 있습니다.",
  ],
},

// backend
caseStudy: {
  problem: "압축 완료까지 HTTP 요청이 계속 대기했고 작업 상태, 결과 파일 수명과 실패를 관리하기 어려웠습니다.",
  decision: "요청 처리와 압축 실행을 분리하고 작업 ID를 중심으로 상태를 관리하기로 했습니다.",
  implementation: [
    "전용 실행기에서 압축을 처리하고 작업 상태를 저장했습니다.",
    "완료 파일을 스트리밍으로 내려받도록 하고 오래된 결과 파일은 자동으로 정리했습니다.",
    "Spring Boot와 MyBatis로 작업 상태 조회와 다운로드 흐름을 구현했습니다.",
  ],
  outcome: [
    "300~400명 규모 대량 다운로드를 비동기 작업으로 운영하고 있습니다.",
    "진행, 완료, 실패 상태를 화면에 전달할 수 있는 서버 흐름을 만들었습니다.",
  ],
},
```

- [ ] **Step 3: Add the TSMS base narrative**

Add `caseStudy` inside the TSMS `detail` object:

```ts
caseStudy: {
  problem: "교육청별 점검, QR 발급, 안내와 외부 연계가 서로 다른 업무 흐름으로 운영돼 진행 상태와 이력을 함께 관리하기 어려웠습니다.",
  decision: "현장 절차를 공통 상태와 데이터 흐름으로 나누고 화면·서버·DB에서 같은 기준을 사용하기로 했습니다.",
  implementation: [
    "점검 일정, 대상, 재점검과 결과 파일을 회차별 이력으로 연결했습니다.",
    "게시글 URL 분석과 중복 검사, QR 발급과 안내 메시지 기능을 기존 자산 데이터에 연결했습니다.",
    "화면마다 달랐던 카카오 주소 검색과 NEIS 연계를 공통 서버 경로로 옮겼습니다.",
  ],
  outcome: [
    "2026년 7월 기준 119개 학교 중 56개 학교의 일정이 확정됐고 21개 학교, 약 3,800대의 점검이 완료됐습니다.",
    "총 111,593대 중 108,237대의 QR을 발급했고 안내 메시지 2,931건을 발송했습니다.",
    "공통 외부 연계 경로를 25개 화면에서 사용합니다.",
  ],
},
```

- [ ] **Step 4: Add TSMS frontend and backend narratives**

Add `caseStudy` to each TSMS perspective `detail` object:

```ts
// frontend
caseStudy: {
  problem: "종이 중심 점검 업무는 일정, 미완료 대상과 재점검 이력이 분리돼 담당자가 다음 작업을 파악하기 어려웠습니다.",
  decision: "현장 절차를 일정, 대상, 회차와 결과 상태로 나누고 다음 행동이 보이는 화면 흐름으로 구성했습니다.",
  implementation: [
    "WebSquare로 일정, 대상과 점검 결과 화면을 구현했습니다.",
    "분실·미지참 대상이 2차와 3차 재점검으로 이어지도록 회차별 상태를 연결했습니다.",
    "QR 발급 여부와 안내 메시지 결과를 목록과 상세 화면에서 확인하도록 조회 조건과 상태 표시를 맞췄습니다.",
  ],
  outcome: [
    "2026년 7월 기준 119개 학교 중 56개 학교의 일정이 확정됐습니다.",
    "21개 학교에서 약 3,800대의 점검을 완료했습니다.",
  ],
},

// backend
caseStudy: {
  problem: "중고거래 확인에는 외부 사이트 접속과 반복 입력이 필요했고, 화면별 외부 연계 구현도 중복됐습니다.",
  decision: "URL 문자열을 규칙 기반으로 분석하고 반복되는 외부 연계를 공통 서버 경로로 모으기로 했습니다.",
  implementation: [
    "사이트별 주소 규칙으로 게시글 번호를 추출하고 번호가 없을 때는 전체 주소로 중복을 확인했습니다.",
    "카카오 주소 검색과 NEIS 연계를 공통 서버 기능으로 옮겼습니다.",
    "QR 발급과 안내 메시지 발송 결과를 기존 자산·설치 데이터 흐름에 연결했습니다.",
  ],
  outcome: [
    "중고거래 모니터링 기능을 약 1주 만에 개발해 배포했습니다.",
    "공통 연계 경로를 25개 화면에서 사용합니다.",
    "총 111,593대 중 108,237대의 QR을 발급했고 안내 메시지 2,931건을 발송했습니다.",
  ],
},
```

- [ ] **Step 5: Verify the data compiles**

Run: `npm run build`

Expected: PASS with no TypeScript errors.

### Task 3: Render the problem-solving narrative

**Files:**
- Modify: `src/views/ProjectsView.vue`

- [ ] **Step 1: Replace the local merge function with the typed utility**

Import the utility:

```ts
import { presentProject, type PresentedProject } from "@/utils/projectPresentation";
```

Remove the local `PresentedProject` type and `presentProject` function. Keep the existing `presentedProjects` computed value unchanged.

- [ ] **Step 2: Render card problem and outcome with fallback**

Replace the current `case-result` block with:

```vue
<div v-if="item.detail.caseStudy" class="case-result mt-5 rounded-2xl p-4">
  <div>
    <p class="case-step-label">문제</p>
    <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.detail.caseStudy.problem }}</p>
  </div>
  <div class="case-result-divider mt-4 pt-4">
    <p class="case-step-label">확인된 결과</p>
    <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.detail.caseStudy.outcome[0] }}</p>
  </div>
</div>
<div v-else class="case-result mt-5 rounded-2xl p-4">
  <p class="case-step-label">실제 운영</p>
  <p class="text-secondary mt-2 text-sm font-semibold leading-6">{{ item.card.result }}</p>
</div>
```

- [ ] **Step 3: Make role sections follow the active tab**

Replace `roleSections` with a computed value that shows both roles for `all` and the selected role otherwise:

```ts
const roleSections = computed(() => {
  const project = activeProject.value?.project;
  if (!project?.perspectives) return [];

  const ids: RoleFocusId[] = activeTrack.value === "all"
    ? ["frontend", "backend"]
    : [activeTrack.value];

  return ids.flatMap((id) => {
    const detail = project.perspectives?.[id]?.detail;
    if (!detail?.scope?.length || !detail.workPoints?.length) return [];

    return [{
      id,
      label: id === "frontend" ? "Frontend" : "Backend",
      scope: detail.scope,
      workPoints: detail.workPoints,
    }];
  });
});
```

- [ ] **Step 4: Add the full four-step modal section**

Add after the role sections and before the fallback detail blocks:

```vue
<section v-if="activeProject.detail.caseStudy">
  <h4 class="text-primary mb-3 font-black">문제 해결 과정</h4>
  <div class="case-process-grid grid gap-3 md:grid-cols-2">
    <article class="case-process-step rounded-xl p-5">
      <p class="case-step-label">01 · 문제</p>
      <p class="text-secondary mt-3 text-sm leading-6">{{ activeProject.detail.caseStudy.problem }}</p>
    </article>
    <article class="case-process-step rounded-xl p-5">
      <p class="case-step-label">02 · 판단</p>
      <p class="text-secondary mt-3 text-sm leading-6">{{ activeProject.detail.caseStudy.decision }}</p>
    </article>
    <article class="case-process-step rounded-xl p-5">
      <p class="case-step-label">03 · 구현</p>
      <ul class="mt-3 grid gap-2">
        <li v-for="item in activeProject.detail.caseStudy.implementation" :key="item" class="role-detail-item text-secondary text-sm leading-6">{{ item }}</li>
      </ul>
    </article>
    <article class="case-process-step rounded-xl p-5">
      <p class="case-step-label">04 · 결과</p>
      <ul class="mt-3 grid gap-2">
        <li v-for="item in activeProject.detail.caseStudy.outcome" :key="item" class="role-detail-item text-secondary text-sm leading-6">{{ item }}</li>
      </ul>
    </article>
  </div>
</section>
```

Only render the existing `<DetailBlock title="결과">` when `!activeProject.detail.caseStudy` to avoid duplicate outcomes.

- [ ] **Step 5: Add restrained styles without changing the visual system**

Add to the scoped style:

```css
.case-step-label {
  color: var(--fresh-blue-strong);
  font-size: 0.6875rem;
  font-weight: 900;
  letter-spacing: 0;
}
.case-result-divider {
  border-top: 1px solid rgba(49, 130, 246, 0.12);
}
.case-process-step {
  border: 1px solid rgba(49, 130, 246, 0.12);
  background: rgba(255, 255, 255, 0.72);
}
```

- [ ] **Step 6: Run the production build**

Run: `npm run build`

Expected: PASS with no TypeScript or Vite errors.

### Task 4: Browser verification

**Files:**
- Verify: `src/views/ProjectsView.vue`
- Verify: `src/data/portfolio.ts`

- [ ] **Step 1: Start or reuse a local preview server**

Run: `npm run preview -- --host 127.0.0.1 --port 4173`

Expected: Vite preview URL is available. If port 4173 is occupied, reuse the existing preview only after rebuilding or start the next available port.

- [ ] **Step 2: Verify all three tracks**

Check `/`, `/?focus=frontend`, and `/?focus=backend`.

Expected: PPS and TSMS cards show different role-specific problem and outcome copy; public projects retain the current fallback card.

- [ ] **Step 3: Verify both representative-project modals**

Expected: Each modal shows `문제`, `판단`, `구현`, and `결과` in order. Frontend and Backend tracks show only their matching role section; the All track shows both.

- [ ] **Step 4: Verify responsive layout and accessibility**

Check desktop at 1280x720 and mobile at 390x844.

Expected: No text overlap or clipping, all controls remain at least 44px tall on mobile, Escape closes the modal, and focus returns to the triggering button.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check` and `git status --short`

Expected: No whitespace errors. Only the planned case-study files and the pre-existing resume PDF changes are present.
