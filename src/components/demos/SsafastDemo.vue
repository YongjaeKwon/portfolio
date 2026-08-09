<template>
  <section class="ssafast-demo" aria-labelledby="ssafast-demo-title">
    <header class="demo-header">
      <div>
        <div class="demo-eyebrow">
          <span class="demo-dot" aria-hidden="true"></span>
          샘플 데이터 데모
        </div>
        <h3 id="ssafast-demo-title">화면 선택부터 API 테스트까지</h3>
        <p>팀의 Figma 화면을 불러오는 단계부터 API 명세 작성, 요청 확인과 테스트 결과까지 여섯 단계로 체험합니다.</p>
      </div>
      <button class="button is-quiet" type="button" @click="resetFromHeader">데모 초기화</button>
    </header>

    <div class="demo-notice" role="note">
      <span aria-hidden="true">ⓘ</span>
      <p>
        <strong>공개 데모에서는 실제 API를 호출하거나 성능을 측정하지 않습니다.</strong>
        Figma 화면과 입력 데이터는 브라우저 안의 샘플이며, 마지막 성능 수치는 입력 조건으로 생성한 시뮬레이션 예시입니다.
      </p>
    </div>
    <p v-if="storageWarning" class="storage-warning" role="alert">{{ storageWarning }}</p>
    <p v-if="stage === 'figma' && savedMessage" class="sr-only" role="status">{{ savedMessage }}</p>

    <div class="guide-progress" aria-hidden="true">
      <span :style="{ width: `${guidedProgress}%` }"></span>
    </div>
    <nav class="step-tabs" aria-label="SSAFAST 전체 기능 흐름">
      <button
        v-for="(item, index) in guidedSteps"
        :key="item.id"
        type="button"
        :class="['step-tab', { 'is-active': guidedStep === index, 'is-complete': guidedStep > index }]"
        :aria-current="guidedStep === index ? 'step' : undefined"
        :aria-label="`${item.number}. ${item.label}`"
        :disabled="isGuidedStepDisabled(index)"
        @click="activateGuidedStep(index)"
      >
        <span>{{ item.number }}</span>
        {{ item.label }}
      </button>
    </nav>

    <section ref="guideCard" class="guide-card" aria-labelledby="guide-step-title" aria-live="polite" tabindex="-1">
      <div class="guide-card-heading">
        <span class="guide-step-count">{{ activeGuidedStep.number }} / 06</span>
        <div>
          <span class="panel-kicker">{{ activeGuidedStep.eyebrow }}</span>
          <h4 id="guide-step-title">{{ activeGuidedStep.label }}</h4>
        </div>
        <span :class="['ownership-badge', { 'is-team': activeGuidedStep.scope === 'team' }]">
          {{ activeGuidedStep.scope === 'team' ? '원 프로젝트 · 팀 연동 기능' : '원 프로젝트 · Frontend 담당' }}
        </span>
      </div>
      <dl class="guide-facts">
        <div><dt>사용자 행동</dt><dd>{{ activeGuidedStep.action }}</dd></div>
        <div><dt>화면 변화</dt><dd>{{ activeGuidedStep.change }}</dd></div>
        <div><dt>원 프로젝트 구현</dt><dd>{{ activeGuidedStep.ownership }}</dd></div>
        <div><dt>공개 데모 재현</dt><dd>{{ activeGuidedStep.demo }}</dd></div>
      </dl>
    </section>

    <section v-if="stage === 'figma'" class="figma-stage" aria-labelledby="figma-import-title">
      <div class="figma-import-panel">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">Team Integration</span>
            <h4 id="figma-import-title">Figma 파일에서 사용할 화면 선택</h4>
          </div>
          <span class="team-feature-badge">팀 기능</span>
        </div>

        <p class="figma-scope-note" role="note">
          원 프로젝트에서는 Figma OAuth와 API로 파일·프레임 이미지를 조회했습니다. 이 연동은 팀원이 담당했으며,
          공개 데모에서는 외부 요청 없이 같은 선택 흐름만 재현합니다.
        </p>

        <div class="figma-url-row">
          <label class="field-label">
            Figma 공유 링크
            <input v-model="figmaDemoUrl" type="text" readonly aria-describedby="figma-url-help" />
            <small id="figma-url-help">실제 주소가 아닌 공개 데모 전용 샘플 링크입니다.</small>
          </label>
          <button
            class="button is-primary"
            type="button"
            :disabled="figmaImportState === 'loading'"
            @click="loadFigmaSample"
          >
            {{ figmaImportState === 'loading' ? '샘플 화면 불러오는 중…' : figmaReady ? '샘플 화면 다시 불러오기' : '샘플 화면 불러오기' }}
          </button>
        </div>

        <div v-if="figmaImportState === 'loading'" class="figma-loading" role="status" aria-live="polite">
          <span aria-hidden="true"></span>
          Figma 파일 구조와 프레임 목록을 불러오는 과정을 재현하고 있습니다.
        </div>

        <template v-else-if="figmaReady">
          <div class="figma-file-summary" role="status">
            <div>
              <span class="figma-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
              <span><strong>SSAFAST Team UI</strong><small>샘플 파일 · 3개 프레임</small></span>
            </div>
            <span>불러오기 완료</span>
          </div>

          <ul class="figma-frame-grid" aria-label="불러온 Figma 화면 목록">
            <li
              v-for="frame in figmaFrames"
              :key="frame.id"
            >
              <button
                type="button"
                :class="['figma-frame-card', { 'is-selected': selectedFigmaFrameId === frame.id }]"
                :aria-pressed="selectedFigmaFrameId === frame.id"
                @click="selectFigmaFrame(frame.id)"
              >
                <span :class="['frame-preview', `is-${frame.visual}`]" aria-hidden="true">
                  <span class="frame-browser-bar"><i></i><i></i><i></i></span>
                  <span class="frame-layout">
                    <span class="frame-side"></span>
                    <span class="frame-main"><i></i><i></i><i></i><i></i></span>
                    <span class="frame-aside"><i></i><i></i></span>
                  </span>
                </span>
                <span class="frame-meta">
                  <span><strong>{{ frame.name }}</strong><small>{{ frame.nodeId }}</small></span>
                  <span class="frame-check" aria-hidden="true">{{ selectedFigmaFrameId === frame.id ? '✓' : '+' }}</span>
                </span>
                <span class="frame-description">{{ frame.description }}</span>
              </button>
            </li>
          </ul>

          <div v-if="selectedFigmaFrame" class="figma-selection-summary" role="status" aria-live="polite">
            <div>
              <span class="panel-kicker">Selected Frame</span>
              <strong>{{ selectedFigmaFrame.name }}</strong>
              <small>{{ selectedFigmaFrame.description }}</small>
            </div>
            <div class="figma-api-links" aria-label="선택 화면에 연결할 API 예시">
              <span v-for="api in selectedFigmaFrame.apis" :key="api">{{ api }}</span>
            </div>
          </div>
        </template>

        <div v-else class="figma-empty-state">
          <span class="figma-mark is-large" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          <strong>아직 불러온 화면이 없습니다.</strong>
          <p>샘플 파일을 불러오면 워크스페이스에서 사용할 프레임을 선택할 수 있습니다.</p>
        </div>
      </div>

      <aside class="figma-flow-panel" aria-labelledby="figma-flow-title">
        <span class="panel-kicker">Original Flow</span>
        <h4 id="figma-flow-title">원 프로젝트의 Figma 연동</h4>
        <ol>
          <li><span>01</span><div><strong>공유 URL 입력</strong><small>OAuth file_read 권한 확인</small></div></li>
          <li><span>02</span><div><strong>파일·프레임 조회</strong><small>Figma API로 이미지와 이름 조회</small></div></li>
          <li><span>03</span><div><strong>사용 화면 선택</strong><small>워크스페이스에 프레임 저장</small></div></li>
          <li><span>04</span><div><strong>API 명세 연결</strong><small>화면별 필요한 API를 함께 확인</small></div></li>
        </ol>
        <p>Figma OAuth·API 연동은 팀원이 담당했습니다. 저는 API 명세 동적 폼과 요청·성능 테스트 화면을 주로 개발했고, 화면별 API 연결 목록 리팩터링에 참여했습니다.</p>
      </aside>
    </section>

    <div
      v-else-if="stage === 'spec'"
      :class="['stage-panel', { 'is-preview-step': guidedStep === 3, 'is-nested-step': guidedStep === 2 }]"
    >
      <div v-if="selectedFigmaFrame" class="connected-frame-banner">
        <span class="figma-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
        <span><small>연결 화면</small><strong>{{ selectedFigmaFrame.name }}</strong></span>
        <span>{{ selectedFigmaFrame.nodeId }}</span>
      </div>
      <form class="spec-form" novalidate @submit.prevent="saveSpec">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">API Specification</span>
            <h4>{{ editingId ? '저장된 명세 편집' : '새 API 명세 작성' }}</h4>
          </div>
          <button v-if="editingId" class="text-button" type="button" @click="startNewSpec">
            새 명세
          </button>
        </div>

        <div class="endpoint-grid">
          <label class="field-label">
            명세 이름
            <input v-model.trim="draft.name" type="text" maxlength="40" placeholder="예: 사용자 조회" />
          </label>
          <label class="field-label is-method">
            Method
            <select v-model="draft.method">
              <option v-for="method in methods" :key="method" :value="method">{{ method }}</option>
            </select>
          </label>
          <label class="field-label is-path">
            API Path
            <input
              v-model.trim="draft.path"
              type="text"
              maxlength="80"
              inputmode="url"
              placeholder="/api/users/{id}"
              aria-describedby="path-hint"
            />
            <small id="path-hint">외부 주소가 아닌 /로 시작하는 경로만 입력할 수 있습니다.</small>
          </label>
        </div>

        <div class="field-editor">
          <div class="field-tabs" role="tablist" aria-label="명세 필드 종류">
            <button
              v-for="group in fieldGroups"
              :id="`field-tab-${group.id}`"
              :key="group.id"
              type="button"
              role="tab"
              :aria-selected="activeGroup === group.id"
              :aria-controls="`field-panel-${group.id}`"
              :class="{ 'is-active': activeGroup === group.id }"
              @click="activeGroup = group.id"
            >
              {{ group.label }}
              <span>{{ getGroupLength(group.id) }}</span>
            </button>
          </div>

          <div
            :id="`field-panel-${activeGroup}`"
            class="field-panel"
            role="tabpanel"
            :aria-labelledby="`field-tab-${activeGroup}`"
          >
            <p v-if="guidedStep === 2 && activeGroup === 'body'" class="nested-guide-note">
              <strong>중첩 구조 예시</strong>
              점(.)으로 하위 경로를 표현하고 object·array 타입을 조합해 요청 모델을 구성합니다.
            </p>
            <template v-if="activeGroup !== 'responses'">
              <div class="row-labels" aria-hidden="true">
                <span>필드명</span><span>타입</span><span>설명</span><span>필수</span><span></span>
              </div>
              <div v-if="activeRequestRows.length" class="repeat-list">
                <div v-for="(row, index) in activeRequestRows" :key="row.id" class="repeat-row">
                  <label>
                    <span class="sr-only">{{ activeGroupLabel }} {{ index + 1 }} 필드명</span>
                    <input v-model.trim="row.name" type="text" maxlength="36" placeholder="필드명" />
                  </label>
                  <label>
                    <span class="sr-only">{{ activeGroupLabel }} {{ index + 1 }} 타입</span>
                    <select v-model="row.type">
                      <option v-for="type in fieldTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </label>
                  <label>
                    <span class="sr-only">{{ activeGroupLabel }} {{ index + 1 }} 설명</span>
                    <input v-model.trim="row.description" type="text" maxlength="60" placeholder="필드 설명" />
                  </label>
                  <label class="required-check">
                    <input v-model="row.required" type="checkbox" />
                    <span>필수</span>
                  </label>
                  <button class="icon-button" type="button" :aria-label="`${activeGroupLabel} ${index + 1} 삭제`" @click="removeRequestRow(index)">
                    ×
                  </button>
                </div>
              </div>
              <div v-else class="empty-row">아직 등록한 필드가 없습니다.</div>
              <button class="add-button" type="button" @click="addRequestRow">+ {{ activeGroupLabel }} 추가</button>
            </template>

            <template v-else>
              <div class="row-labels is-response" aria-hidden="true">
                <span>Status</span><span>설명</span><span></span>
              </div>
              <div class="repeat-list">
                <div v-for="(row, index) in draft.responses" :key="row.id" class="repeat-row is-response">
                  <label>
                    <span class="sr-only">응답 {{ index + 1 }} 상태 코드</span>
                    <input v-model.trim="row.status" type="text" inputmode="numeric" maxlength="3" placeholder="200" />
                  </label>
                  <label>
                    <span class="sr-only">응답 {{ index + 1 }} 설명</span>
                    <input v-model.trim="row.description" type="text" maxlength="60" placeholder="응답 설명" />
                  </label>
                  <button
                    class="icon-button"
                    type="button"
                    :disabled="row.status === '200'"
                    :aria-label="row.status === '200' ? '필수 성공 응답은 삭제할 수 없음' : `응답 ${index + 1} 삭제`"
                    @click="removeResponse(index)"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div class="response-help">성공 응답 200은 한 개만 등록할 수 있으며 삭제할 수 없습니다.</div>
              <button class="add-button" type="button" @click="addResponse">+ Response 추가</button>
            </template>
          </div>
        </div>

        <div v-if="formErrors.length" class="validation-box" role="alert">
          <strong>입력 내용을 확인해 주세요.</strong>
          <ul>
            <li v-for="error in formErrors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <div class="form-actions">
          <span v-if="savedMessage" class="save-message" role="status">{{ savedMessage }}</span>
          <button class="button is-primary" type="submit">
            {{ editingId ? '변경사항 저장' : '명세 저장' }}
          </button>
        </div>
      </form>

      <aside class="saved-panel" aria-labelledby="saved-specs-title">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">Local storage</span>
            <h4 id="saved-specs-title">저장된 명세</h4>
          </div>
          <span class="count-badge">{{ specs.length }}</span>
        </div>

        <div v-if="specs.length" class="saved-list">
          <article
            v-for="spec in specs"
            :key="spec.id"
            :class="['saved-card', { 'is-selected': selectedSpecId === spec.id }]"
          >
            <button class="saved-main" type="button" @click="selectSpec(spec.id)">
              <span :class="['method-badge', `is-${spec.method.toLowerCase()}`]">{{ spec.method }}</span>
              <span>
                <strong>{{ spec.name }}</strong>
                <code>{{ spec.path }}</code>
              </span>
            </button>
            <div class="saved-card-actions">
              <button type="button" @click="editSpec(spec)">편집</button>
              <button type="button" @click="removeSpec(spec.id)">삭제</button>
            </div>
          </article>
        </div>
        <div v-else class="empty-state">
          <strong>저장된 명세가 없습니다.</strong>
          <p>첫 API 명세를 저장하면 구조 요약과 예시 결과 단계가 활성화됩니다.</p>
        </div>

        <div v-if="selectedSpec" class="json-preview">
          <div class="json-header">
            <span>요청 미리보기</span>
            <span>{{ selectedSpec.method }} {{ selectedSpec.path }}</span>
          </div>
          <pre tabindex="0" aria-label="선택된 API 요청 JSON 미리보기"><code>{{ selectedSpecSummary }}</code></pre>
          <button class="button is-secondary is-full" type="button" @click="goToLoadTest">
            테스트 실행 단계로 이동 →
          </button>
        </div>
      </aside>
    </div>

    <div v-else :class="['load-stage', { 'is-result-step': guidedStep === 5 }]">
      <section class="load-config" aria-labelledby="load-config-title">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">Simulation Setup</span>
            <h4 id="load-config-title">테스트 실행 조건</h4>
          </div>
          <span class="simulation-badge">시뮬레이션 · 외부 요청 없음</span>
        </div>

        <p class="simulation-callout" role="note">
          이 버튼은 실제 서버 부하 테스트를 실행하지 않습니다. 입력한 조건으로 예시 응답 시간과 처리량을 생성합니다.
        </p>

        <div v-if="specs.length" class="spec-picker">
          <label v-for="spec in specs" :key="spec.id" :class="{ 'is-selected': selectedSpecId === spec.id }">
            <input v-model="selectedSpecId" type="radio" name="load-spec" :value="spec.id" :disabled="isRunning" />
            <span class="method-badge">{{ spec.method }}</span>
            <span><strong>{{ spec.name }}</strong><code>{{ spec.path }}</code></span>
          </label>
        </div>
        <div v-else class="empty-state is-large">
          <strong>먼저 API 명세를 저장해 주세요.</strong>
          <p>저장된 명세와 입력 조건을 바탕으로만 예시 결과를 만들 수 있습니다.</p>
          <button class="button is-secondary" type="button" @click="setGuidedStepView(1)">명세 작성하기</button>
        </div>

        <template v-if="selectedSpec">
          <div class="load-inputs">
            <label class="field-label">
              초당 요청 수
              <input v-model.number="loadConfig.rate" type="number" min="1" max="500" step="1" :disabled="isRunning" />
              <small>1–500 req/s</small>
            </label>
            <label class="field-label">
              실행 시간
              <input v-model.number="loadConfig.duration" type="number" min="5" max="60" step="5" :disabled="isRunning" />
              <small>5–60초 (화면에서는 빠르게 재생)</small>
            </label>
          </div>

          <div v-if="isRunning || progress > 0" class="progress-panel" aria-live="polite">
            <div class="progress-meta">
              <strong>{{ isRunning ? '예시 결과 생성 중' : '예시 결과 생성 완료' }}</strong>
              <span>{{ progress }}%</span>
            </div>
            <div
              class="progress-track"
              role="progressbar"
              aria-label="예시 성능 결과 생성 진행률"
              :aria-valuenow="progress"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span :style="{ width: `${progress}%` }"></span>
            </div>
            <code v-if="progressTarget">{{ progressTarget.method }} {{ progressTarget.path }}</code>
          </div>

          <button class="button is-primary is-full" type="button" :disabled="isRunning" @click="runLoadTest">
            {{ isRunning ? '시뮬레이션 실행 중…' : '시뮬레이션 실행' }}
          </button>
        </template>
      </section>

      <section class="result-panel" aria-labelledby="result-title">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">Simulated Result</span>
            <h4 id="result-title">응답·성능 예시</h4>
          </div>
          <span v-if="latestRun" class="count-badge is-success">완료</span>
        </div>

        <template v-if="latestRun">
          <div class="result-endpoint">
            <span>{{ latestRun.specName }}</span>
            <code>{{ latestRun.method }} {{ latestRun.path }}</code>
          </div>
          <div class="metric-grid">
            <div><span>p50</span><strong>{{ latestRun.result.p50 }}<small>ms</small></strong></div>
            <div><span>p95</span><strong>{{ latestRun.result.p95 }}<small>ms</small></strong></div>
            <div><span>p99</span><strong>{{ latestRun.result.p99 }}<small>ms</small></strong></div>
            <div><span>처리량</span><strong>{{ latestRun.result.throughput }}<small>req/s</small></strong></div>
          </div>
          <div class="status-summary">
            <div><span class="status-dot is-ok"></span>2xx <strong>{{ latestRun.result.success }}</strong></div>
            <div><span class="status-dot is-error"></span>5xx <strong>{{ latestRun.result.failed }}</strong></div>
            <span>총 {{ latestRun.result.total.toLocaleString() }}건</span>
          </div>
          <p class="result-caption">
            실제 측정값이 아닌 공개 데모용 시뮬레이션입니다. 같은 명세와 조건에는 동일한 예시 결과가 생성됩니다.
          </p>
        </template>
        <div v-else class="empty-state is-large">
          <strong>아직 생성한 결과가 없습니다.</strong>
          <p>저장한 API를 선택하고 예시 결과를 만들어 보세요.</p>
        </div>
      </section>

      <section v-if="runs.length" class="history-panel" aria-labelledby="history-title">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">History</span>
            <h4 id="history-title">생성 이력</h4>
          </div>
          <span class="count-badge">{{ runs.length }}</span>
        </div>
        <div class="history-table-wrap">
          <table>
            <thead><tr><th>API</th><th>조건</th><th>p95</th><th>처리량</th><th>성공률</th></tr></thead>
            <tbody>
              <tr v-for="run in runs" :key="run.id">
                <td><strong>{{ run.specName }}</strong><code>{{ run.method }} {{ run.path }}</code></td>
                <td>{{ run.rate }} req/s · {{ run.duration }}초</td>
                <td>{{ run.result.p95 }}ms</td>
                <td>{{ run.result.throughput }} req/s</td>
                <td>{{ successRate(run) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <footer class="guided-footer" aria-label="데모 단계 이동">
      <button
        class="button is-quiet"
        type="button"
        :disabled="guidedStep === 0 || isRunning"
        @click="moveToPreviousStep"
      >
        ← 이전 단계
      </button>
      <p>{{ guidedStep + 1 }} / {{ guidedSteps.length }} · {{ activeGuidedStep.label }}</p>
      <button class="button is-primary" type="button" :disabled="nextStepDisabled" @click="moveToNextStep">
        {{ nextStepLabel }}
      </button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

type Stage = "figma" | "spec" | "load";
type FieldGroupId = "headers" | "queries" | "body" | "responses";
type RequestGroupId = Exclude<FieldGroupId, "responses">;
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type FigmaImportState = "idle" | "loading" | "ready";
type FigmaFrameVisual = "workspace" | "spec" | "testing";

interface GuidedStep {
  id: "figma" | "spec" | "nested" | "preview" | "test" | "result";
  number: string;
  label: string;
  eyebrow: string;
  action: string;
  change: string;
  ownership: string;
  demo: string;
  scope: "team" | "frontend";
}

interface FigmaFrame {
  id: string;
  nodeId: string;
  name: string;
  description: string;
  visual: FigmaFrameVisual;
  apis: string[];
}

interface RequestField {
  id: string;
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface ResponseField {
  id: string;
  status: string;
  description: string;
}

interface ApiDraft {
  name: string;
  method: HttpMethod;
  path: string;
  headers: RequestField[];
  queries: RequestField[];
  body: RequestField[];
  responses: ResponseField[];
}

interface ApiSpec extends ApiDraft {
  id: string;
  updatedAt: string;
}

interface LoadResult {
  p50: number;
  p95: number;
  p99: number;
  throughput: number;
  total: number;
  success: number;
  failed: number;
}

interface LoadRun {
  id: string;
  specId: string;
  specName: string;
  method: HttpMethod;
  path: string;
  rate: number;
  duration: number;
  createdAt: string;
  result: LoadResult;
}

interface ActiveRun {
  spec: ApiSpec;
  rate: number;
  duration: number;
}

const STORAGE_KEY = "portfolio:ssafast-demo:specs:v1";
const HISTORY_KEY = "portfolio:ssafast-demo:runs:v1";
const FIGMA_SAMPLE_PATH = "sample.figma.local/file/ssafast-team-ui";
const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const fieldTypes = ["string", "number", "boolean", "object", "array"];
const figmaFrames: FigmaFrame[] = [
  {
    id: "workspace-create",
    nodeId: "12:104",
    name: "워크스페이스 생성",
    description: "프로젝트 정보와 사용할 Figma 화면을 선택하는 시작 화면",
    visual: "workspace",
    apis: ["프로젝트 생성", "선택 화면 저장"],
  },
  {
    id: "api-specification",
    nodeId: "18:207",
    name: "API 명세 작성",
    description: "요청·응답 필드를 조합해 API 명세를 만드는 작업 화면",
    visual: "spec",
    apis: ["API 명세 저장", "요청 필드 구성"],
  },
  {
    id: "api-testing",
    nodeId: "24:318",
    name: "API 테스트",
    description: "작성한 명세로 요청과 성능 테스트 결과를 확인하는 화면",
    visual: "testing",
    apis: ["API 요청", "테스트 결과 조회"],
  },
];
const guidedSteps: GuidedStep[] = [
  {
    id: "figma",
    number: "01",
    label: "Figma 화면 선택",
    eyebrow: "Team Integration",
    action: "공개용 샘플 파일을 불러온 뒤 작업에 사용할 화면을 하나 선택합니다.",
    change: "선택한 프레임의 이름과 연결될 API 예시가 다음 단계의 맥락으로 이어집니다.",
    ownership: "Figma OAuth·파일 및 프레임 조회·저장 연동은 팀원이 담당했습니다. 저는 화면별 API 연결 목록 리팩터링에 참여했습니다.",
    demo: "고정된 샘플 프레임만 브라우저 상태로 보여 주며 외부 OAuth·API·서버 저장은 연결하지 않습니다.",
    scope: "team",
  },
  {
    id: "spec",
    number: "02",
    label: "명세 작성",
    eyebrow: "Define API",
    action: "Method와 경로, Header·Query·Response 조건을 확인하고 수정합니다.",
    change: "입력값이 하나의 API 명세 상태로 즉시 반영됩니다.",
    ownership: "명세 편집 폼, 반복 필드 UI, 입력 검증과 저장 흐름을 구현했습니다.",
    demo: "샘플 명세와 브라우저 저장소로 저장·수정 흐름을 재현했습니다.",
    scope: "frontend",
  },
  {
    id: "nested",
    number: "03",
    label: "중첩 입력",
    eyebrow: "Compose Payload",
    action: "Body 탭에서 object·array 타입과 하위 경로를 조합합니다.",
    change: "중첩된 요청 모델이 명세에 포함되고 미리보기 데이터로 변환됩니다.",
    ownership: "동적 Body 필드와 중첩 DTO 입력 상태를 다루는 화면을 구현했습니다.",
    demo: "object·array 조합을 샘플 요청 모델로 즉시 변환합니다.",
    scope: "frontend",
  },
  {
    id: "preview",
    number: "04",
    label: "요청 확인",
    eyebrow: "Preview Request",
    action: "저장된 명세와 전송 직전의 요청 구조를 나란히 확인합니다.",
    change: "작성한 Header·Query·Body가 JSON 요청 미리보기로 정리됩니다.",
    ownership: "폼 상태를 요청 데이터로 변환하고 검토하는 미리보기 UI를 구현했습니다.",
    demo: "외부 API 호출 없이 입력값으로 요청 JSON 예시를 생성합니다.",
    scope: "frontend",
  },
  {
    id: "test",
    number: "05",
    label: "테스트 실행",
    eyebrow: "Run Simulation",
    action: "요청 수와 실행 시간을 정한 뒤 공개용 시뮬레이션을 실행합니다.",
    change: "진행률과 실행 대상 API가 표시되며 완료 후 결과 단계로 이동합니다.",
    ownership: "실행 조건 입력, 진행 상태와 완료 전환 UI를 구현했습니다.",
    demo: "브라우저 타이머로 실행 과정만 재현하며 실제 부하를 만들지 않습니다.",
    scope: "frontend",
  },
  {
    id: "result",
    number: "06",
    label: "응답·성능 확인",
    eyebrow: "Review Result",
    action: "응답 상태, 지연시간 분포와 처리량 예시를 비교합니다.",
    change: "최근 결과와 이전 실행 이력이 같은 화면에 누적됩니다.",
    ownership: "응답·성능 결과 요약과 실행 이력 테이블을 구현했습니다.",
    demo: "입력 조건으로 만든 예시 지표를 표시하며 측정값이 아님을 함께 안내합니다.",
    scope: "frontend",
  },
];
const fieldGroups: { id: FieldGroupId; label: string }[] = [
  { id: "headers", label: "Header" },
  { id: "queries", label: "Query" },
  { id: "body", label: "Body" },
  { id: "responses", label: "Response" },
];

let sequence = 0;
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${sequence++}`;
const makeRequestField = (values: Partial<RequestField> = {}): RequestField => ({
  id: makeId("field"),
  name: "",
  type: "string",
  description: "",
  required: false,
  ...values,
});
const makeResponseField = (status: string, description: string): ResponseField => ({
  id: makeId("response"),
  status,
  description,
});
const createDraft = (): ApiDraft => ({
  name: "프로젝트 생성",
  method: "POST",
  path: "/api/projects",
  headers: [makeRequestField({ name: "Authorization", description: "사용자 인증 토큰", required: true })],
  queries: [makeRequestField({ name: "notify", type: "boolean", description: "멤버 알림 여부" })],
  body: [
    makeRequestField({ name: "project", type: "object", description: "프로젝트 기본 정보", required: true }),
    makeRequestField({ name: "project.members", type: "array", description: "참여 멤버 목록", required: true }),
    makeRequestField({ name: "project.settings", type: "object", description: "실행 환경 설정" }),
  ],
  responses: [
    makeResponseField("200", "프로젝트 생성 성공"),
    makeResponseField("400", "요청 형식 오류"),
  ],
});
const copyDraft = (source: ApiDraft): ApiDraft => JSON.parse(JSON.stringify(source)) as ApiDraft;

const stage = ref<Stage>("figma");
const guidedStep = ref(0);
const guideCard = ref<HTMLElement | null>(null);
const figmaDemoUrl = ref(FIGMA_SAMPLE_PATH);
const figmaImportState = ref<FigmaImportState>("idle");
const selectedFigmaFrameId = ref("");
const activeGroup = ref<FieldGroupId>("headers");
const draft = reactive<ApiDraft>(createDraft());
const editingId = ref<string | null>(null);
const specs = ref<ApiSpec[]>([]);
const selectedSpecId = ref("");
const formErrors = ref<string[]>([]);
const savedMessage = ref("");
const runs = ref<LoadRun[]>([]);
const isRunning = ref(false);
const progress = ref(0);
const activeRun = ref<ActiveRun | null>(null);
const storageWarning = ref("");
const loadConfig = reactive({ rate: 80, duration: 10 });
let progressTimer: ReturnType<typeof setInterval> | undefined;
let figmaLoadTimer: ReturnType<typeof setTimeout> | undefined;
let messageTimer: ReturnType<typeof setTimeout> | undefined;
let storageTimer: ReturnType<typeof setTimeout> | undefined;

const activeRequestRows = computed(() =>
  activeGroup.value === "responses" ? [] : draft[activeGroup.value]
);
const activeGroupLabel = computed(
  () => fieldGroups.find((group) => group.id === activeGroup.value)?.label ?? "필드"
);
const selectedSpec = computed(() => specs.value.find((spec) => spec.id === selectedSpecId.value));
const figmaReady = computed(() => figmaImportState.value === "ready");
const selectedFigmaFrame = computed(() =>
  figmaFrames.find((frame) => frame.id === selectedFigmaFrameId.value)
);
const progressTarget = computed(() => activeRun.value?.spec ?? selectedSpec.value);
const latestRun = computed(() => runs.value[0]);
const activeGuidedStep = computed(() => guidedSteps[guidedStep.value] ?? guidedSteps[0]);
const guidedProgress = computed(() => ((guidedStep.value + 1) / guidedSteps.length) * 100);
const nextStepLabel = computed(() => {
  if (guidedStep.value === 0) return "선택한 화면으로 명세 작성 →";
  if (guidedStep.value === 2) return "명세 저장 후 요청 확인 →";
  if (guidedStep.value === 4) return latestRun.value ? "다시 실행하고 결과 보기 →" : "시뮬레이션 실행 후 결과 보기 →";
  if (guidedStep.value === guidedSteps.length - 1) return "처음부터 다시 보기";
  return "다음 단계 →";
});
const nextStepDisabled = computed(() => {
  if (isRunning.value) return true;
  if (guidedStep.value === 0) return !selectedFigmaFrame.value;
  if (guidedStep.value === 3 || guidedStep.value === 4) return !selectedSpec.value;
  if (guidedStep.value === 5) return !latestRun.value;
  return false;
});
const makeExampleValue = (field: RequestField): unknown => {
  if (field.type === "boolean") return true;
  if (field.type === "number") return 1;
  if (field.type === "array") return ["sample-item"];
  if (field.type === "object") return {};
  if (field.name.toLowerCase().includes("authorization")) return "Bearer sample-token";
  return "sample-value";
};
const createExampleRecord = (fields: RequestField[], nested = false) => {
  const result: Record<string, unknown> = {};
  fields.forEach((field) => {
    const path = nested ? field.name.split(".").filter(Boolean) : [field.name];
    if (!path.length) return;
    let cursor = result;
    path.forEach((key, index) => {
      const isLeaf = index === path.length - 1;
      if (isLeaf) {
        if (!(key in cursor) || field.type !== "object") cursor[key] = makeExampleValue(field);
        return;
      }
      if (!cursor[key] || typeof cursor[key] !== "object" || Array.isArray(cursor[key])) cursor[key] = {};
      cursor = cursor[key] as Record<string, unknown>;
    });
  });
  return result;
};
const selectedSpecSummary = computed(() => {
  const spec = selectedSpec.value;
  if (!spec) return "";
  return JSON.stringify(
    {
      method: spec.method,
      path: spec.path,
      headers: createExampleRecord(spec.headers),
      query: createExampleRecord(spec.queries),
      body: createExampleRecord(spec.body, true),
    },
    null,
    2
  );
});

const getGroupLength = (group: FieldGroupId) => draft[group].length;

const flashStorageWarning = (message: string) => {
  storageWarning.value = message;
  if (storageTimer) clearTimeout(storageTimer);
  storageTimer = setTimeout(() => (storageWarning.value = ""), 4200);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const isString = (value: unknown): value is string => typeof value === "string";
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const isRequestField = (value: unknown): value is RequestField =>
  isRecord(value)
  && isString(value.id)
  && isString(value.name)
  && isString(value.type)
  && isString(value.description)
  && typeof value.required === "boolean";
const isResponseField = (value: unknown): value is ResponseField =>
  isRecord(value)
  && isString(value.id)
  && isString(value.status)
  && isString(value.description);
const isApiSpec = (value: unknown): value is ApiSpec =>
  isRecord(value)
  && isString(value.id)
  && isString(value.name)
  && methods.includes(value.method as HttpMethod)
  && isString(value.path)
  && isString(value.updatedAt)
  && Array.isArray(value.headers) && value.headers.every(isRequestField)
  && Array.isArray(value.queries) && value.queries.every(isRequestField)
  && Array.isArray(value.body) && value.body.every(isRequestField)
  && Array.isArray(value.responses) && value.responses.every(isResponseField);
const isLoadResult = (value: unknown): value is LoadResult =>
  isRecord(value)
  && ["p50", "p95", "p99", "throughput", "total", "success", "failed"]
    .every((key) => isFiniteNumber(value[key]) && value[key] >= 0);
const isLoadRun = (value: unknown): value is LoadRun =>
  isRecord(value)
  && isString(value.id)
  && isString(value.specId)
  && isString(value.specName)
  && methods.includes(value.method as HttpMethod)
  && isString(value.path)
  && isFiniteNumber(value.rate)
  && isFiniteNumber(value.duration)
  && isString(value.createdAt)
  && isLoadResult(value.result);

const safelyPersist = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    flashStorageWarning("브라우저 저장공간을 사용할 수 없어 이번 화면에서만 변경사항을 유지합니다.");
    return false;
  }
};

const safelyRemove = (key: string) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    flashStorageWarning("브라우저 저장 데이터를 삭제하지 못했습니다. 저장공간 설정을 확인해 주세요.");
    return false;
  }
};

const safelyLoadArray = <T,>(key: string, validator: (value: unknown) => value is T): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("invalid storage shape");
    const validItems = parsed.filter(validator);
    if (validItems.length !== parsed.length) {
      flashStorageWarning("형식이 맞지 않는 이전 데모 데이터는 제외하고 불러왔습니다.");
    }
    return validItems;
  } catch {
    flashStorageWarning("저장된 데모 데이터를 읽지 못해 빈 상태로 시작합니다.");
    return [];
  }
};

const persistSpecs = () => safelyPersist(STORAGE_KEY, specs.value);
const persistRuns = () => safelyPersist(HISTORY_KEY, runs.value);

const setDraft = (source: ApiDraft) => {
  Object.assign(draft, copyDraft(source));
  formErrors.value = [];
};

const startNewSpec = () => {
  editingId.value = null;
  setDraft(createDraft());
  activeGroup.value = "headers";
};

const addRequestRow = () => {
  if (activeGroup.value === "responses") return;
  draft[activeGroup.value].push(makeRequestField());
};

const removeRequestRow = (index: number) => {
  if (activeGroup.value === "responses") return;
  draft[activeGroup.value].splice(index, 1);
};

const addResponse = () => {
  const existing = new Set(draft.responses.map((response) => response.status));
  const nextStatus = ["201", "400", "401", "403", "404", "500"].find((status) => !existing.has(status)) ?? "400";
  draft.responses.push(makeResponseField(nextStatus, ""));
};

const removeResponse = (index: number) => {
  if (draft.responses[index]?.status === "200") return;
  draft.responses.splice(index, 1);
};

const validateDraft = () => {
  const errors: string[] = [];
  if (!draft.name) errors.push("명세 이름을 입력해 주세요.");
  if (!/^\/(?!\/)[A-Za-z0-9_{}\-./]*$/.test(draft.path)) {
    errors.push("API Path는 /로 시작하고 영문, 숫자, -, _, { }만 사용할 수 있습니다.");
  }

  (["headers", "queries", "body"] as RequestGroupId[]).forEach((groupId) => {
    const label = fieldGroups.find((group) => group.id === groupId)?.label ?? groupId;
    draft[groupId].forEach((field, index) => {
      if (!field.name) errors.push(`${label} ${index + 1}의 필드명을 입력해 주세요.`);
    });
    const normalizedNames = draft[groupId].map((field) => field.name.trim().toLowerCase()).filter(Boolean);
    if (new Set(normalizedNames).size !== normalizedNames.length) errors.push(`${label}에 중복된 필드명이 있습니다.`);
  });

  draft.responses.forEach((response, index) => {
    if (!/^[1-5]\d{2}$/.test(response.status)) errors.push(`Response ${index + 1}의 상태 코드는 100–599 사이의 세 자리 숫자여야 합니다.`);
    if (!response.description) errors.push(`Response ${index + 1}의 설명을 입력해 주세요.`);
  });
  const successResponses = draft.responses.filter((response) => response.status === "200");
  if (successResponses.length === 0) errors.push("성공 응답 200을 한 개 등록해 주세요.");
  if (successResponses.length > 1) errors.push("성공 응답 200은 중복해서 등록할 수 없습니다.");

  formErrors.value = [...new Set(errors)];
  if (errors.some((error) => error.startsWith("Response") || error.includes("응답 200"))) activeGroup.value = "responses";
  return errors.length === 0;
};

const flashSavedMessage = (message: string) => {
  savedMessage.value = message;
  if (messageTimer) clearTimeout(messageTimer);
  messageTimer = setTimeout(() => (savedMessage.value = ""), 2600);
};

const saveSpec = () => {
  if (!validateDraft()) return false;
  const now = new Date().toISOString();
  const cleanDraft = copyDraft(draft);
  if (editingId.value) {
    const index = specs.value.findIndex((spec) => spec.id === editingId.value);
    if (index >= 0) specs.value[index] = { ...cleanDraft, id: editingId.value, updatedAt: now };
  } else {
    const spec: ApiSpec = { ...cleanDraft, id: makeId("spec"), updatedAt: now };
    specs.value.unshift(spec);
    editingId.value = spec.id;
  }
  selectedSpecId.value = editingId.value ?? specs.value[0]?.id ?? "";
  const persisted = persistSpecs();
  flashSavedMessage(persisted ? "브라우저에 명세를 저장했습니다." : "명세를 현재 화면에만 반영했습니다.");
  return true;
};

const stopFigmaLoadTimer = () => {
  if (figmaLoadTimer) clearTimeout(figmaLoadTimer);
  figmaLoadTimer = undefined;
};

const loadFigmaSample = () => {
  stopFigmaLoadTimer();
  figmaImportState.value = "loading";
  selectedFigmaFrameId.value = "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  figmaLoadTimer = setTimeout(() => {
    figmaImportState.value = "ready";
    figmaLoadTimer = undefined;
  }, reduceMotion ? 0 : 420);
};

const selectFigmaFrame = (id: string) => {
  if (!figmaReady.value || !figmaFrames.some((frame) => frame.id === id)) return;
  selectedFigmaFrameId.value = id;
};

const isGuidedStepDisabled = (index: number) => {
  if (isRunning.value) return true;
  if (index > 0 && !selectedFigmaFrame.value) return true;
  if (index >= 3 && !selectedSpec.value) return true;
  if (index === 5 && !latestRun.value) return true;
  return false;
};

const setGuidedStepView = (index: number, options: { moveFocus?: boolean } = {}) => {
  const nextIndex = Math.min(guidedSteps.length - 1, Math.max(0, index));
  guidedStep.value = nextIndex;
  stage.value = nextIndex === 0 ? "figma" : nextIndex >= 4 ? "load" : "spec";
  if (nextIndex === 1) activeGroup.value = "headers";
  if (nextIndex === 2) activeGroup.value = "body";
  if (options.moveFocus === false) return;
  void nextTick(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    guideCard.value?.focus({ preventScroll: true });
    guideCard.value?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
};

const activateGuidedStep = (index: number) => {
  if (isRunning.value) return;
  if (index > 0 && !selectedFigmaFrame.value) return;
  if (index >= 3 && !selectedSpec.value) return;
  if (index === 5 && !latestRun.value) return;
  setGuidedStepView(index);
};

const moveToPreviousStep = () => {
  if (guidedStep.value === 0 || isRunning.value) return;
  setGuidedStepView(guidedStep.value - 1);
};

const moveToNextStep = () => {
  if (isRunning.value) return;
  if (guidedStep.value === guidedSteps.length - 1) {
    restartFromEnd();
    return;
  }
  if (guidedStep.value === 0 && !selectedFigmaFrame.value) return;
  if (guidedStep.value === 2 && !saveSpec()) return;
  if (guidedStep.value === 4) {
    runLoadTest();
    return;
  }
  activateGuidedStep(guidedStep.value + 1);
};

const editSpec = (spec: ApiSpec) => {
  editingId.value = spec.id;
  selectedSpecId.value = spec.id;
  setDraft(spec);
  setGuidedStepView(selectedFigmaFrame.value ? 1 : 0);
};

const selectSpec = (id: string) => {
  selectedSpecId.value = id;
};

const removeSpec = (id: string) => {
  if (isRunning.value) return;
  specs.value = specs.value.filter((spec) => spec.id !== id);
  runs.value = runs.value.filter((run) => run.specId !== id);
  if (activeRun.value?.spec.id === id) {
    activeRun.value = null;
    progress.value = 0;
  }
  if (editingId.value === id) startNewSpec();
  if (selectedSpecId.value === id) selectedSpecId.value = specs.value[0]?.id ?? "";
  persistSpecs();
  persistRuns();
};

const goToLoadTest = () => {
  if (!selectedSpec.value) return;
  setGuidedStepView(4);
};

const hashText = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  return hash;
};

const createResult = (spec: ApiSpec, rate: number, duration: number): LoadResult => {
  const hash = hashText(`${spec.method}:${spec.path}:${rate}:${duration}`);
  const p50 = 34 + (hash % 37) + Math.round(rate * 0.07);
  const p95 = p50 + 38 + ((hash >>> 4) % 54);
  const p99 = p95 + 22 + ((hash >>> 8) % 68);
  const throughput = Math.max(1, Math.round(rate * (0.9 + ((hash >>> 12) % 8) / 100)));
  const total = throughput * duration;
  const failed = Math.min(total, (hash >>> 16) % Math.max(2, Math.round(total * 0.008)));
  return { p50, p95, p99, throughput, total, success: total - failed, failed };
};

const stopProgressTimer = () => {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = undefined;
};

const runLoadTest = () => {
  const spec = selectedSpec.value;
  if (!spec || isRunning.value) return;
  const rate = Math.min(500, Math.max(1, Number(loadConfig.rate) || 1));
  const duration = Math.min(60, Math.max(5, Number(loadConfig.duration) || 5));
  loadConfig.rate = rate;
  loadConfig.duration = duration;
  const runTarget: ActiveRun = {
    spec: JSON.parse(JSON.stringify(spec)) as ApiSpec,
    rate,
    duration,
  };
  activeRun.value = runTarget;
  isRunning.value = true;
  progress.value = 0;
  stopProgressTimer();
  const startedAt = Date.now();
  const displayDuration = Math.min(3000, Math.max(1500, runTarget.duration * 90));
  progressTimer = setInterval(() => {
    progress.value = Math.min(100, Math.round(((Date.now() - startedAt) / displayDuration) * 100));
    if (progress.value < 100) return;
    stopProgressTimer();
    isRunning.value = false;
    const run: LoadRun = {
      id: makeId("run"),
      specId: runTarget.spec.id,
      specName: runTarget.spec.name,
      method: runTarget.spec.method,
      path: runTarget.spec.path,
      rate: runTarget.rate,
      duration: runTarget.duration,
      createdAt: new Date().toISOString(),
      result: createResult(runTarget.spec, runTarget.rate, runTarget.duration),
    };
    runs.value = [run, ...runs.value].slice(0, 8);
    persistRuns();
    setGuidedStepView(5);
  }, 80);
};

const successRate = (run: LoadRun) =>
  run.result.total ? ((run.result.success / run.result.total) * 100).toFixed(1) : "0.0";

const resetDemo = (options: { moveFocus?: boolean } = {}) => {
  stopFigmaLoadTimer();
  stopProgressTimer();
  isRunning.value = false;
  activeRun.value = null;
  progress.value = 0;
  figmaDemoUrl.value = FIGMA_SAMPLE_PATH;
  figmaImportState.value = "idle";
  selectedFigmaFrameId.value = "";
  specs.value = [];
  runs.value = [];
  selectedSpecId.value = "";
  safelyRemove(STORAGE_KEY);
  safelyRemove(HISTORY_KEY);
  setGuidedStepView(0, options);
  startNewSpec();
  flashSavedMessage("샘플 데이터를 초기화했습니다.");
};

const resetFromHeader = () => {
  resetDemo({ moveFocus: false });
};

const restartFromEnd = () => {
  resetDemo({ moveFocus: true });
};

watch(selectedSpecId, (id) => {
  if (id && !specs.value.some((spec) => spec.id === id)) selectedSpecId.value = specs.value[0]?.id ?? "";
});

onMounted(() => {
  specs.value = safelyLoadArray(STORAGE_KEY, isApiSpec);
  runs.value = safelyLoadArray(HISTORY_KEY, isLoadRun);
  selectedSpecId.value = specs.value[0]?.id ?? "";
});

onBeforeUnmount(() => {
  stopFigmaLoadTimer();
  stopProgressTimer();
  if (messageTimer) clearTimeout(messageTimer);
  if (storageTimer) clearTimeout(storageTimer);
});
</script>

<style scoped>
.ssafast-demo {
  --demo-blue: var(--accent, #3182f6);
  --demo-blue-strong: var(--accent-strong, #1b64da);
  --demo-border: var(--border, rgba(15, 23, 42, 0.09));
  --demo-surface: var(--surface-strong, #fff);
  color: var(--text-primary, #121722);
  font-family: var(--font-body, sans-serif);
}

.demo-header,
.panel-heading,
.form-actions,
.progress-meta,
.json-header,
.status-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.demo-header { align-items: flex-start; }
.demo-header h3 { margin: 0.45rem 0 0.35rem; font-size: clamp(1.2rem, 3vw, 1.55rem); line-height: 1.35; }
.demo-header p { max-width: 42rem; margin: 0; color: var(--text-secondary, #3d4758); font-size: 0.86rem; line-height: 1.65; }

.demo-eyebrow,
.panel-kicker {
  color: var(--demo-blue-strong);
  font-size: 0.67rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-eyebrow { display: inline-flex; align-items: center; gap: 0.4rem; }
.demo-dot { width: 0.46rem; height: 0.46rem; border-radius: 50%; background: #21b87a; box-shadow: 0 0 0 0.25rem rgba(33, 184, 122, 0.12); }

.demo-notice {
  display: flex;
  gap: 0.65rem;
  margin-top: 1rem;
  border: 1px solid rgba(49, 130, 246, 0.15);
  border-radius: 0.85rem;
  padding: 0.8rem 0.9rem;
  color: var(--text-secondary, #3d4758);
  background: rgba(49, 130, 246, 0.055);
  font-size: 0.78rem;
  line-height: 1.55;
}
.demo-notice span { color: var(--demo-blue-strong); font-weight: 900; }
.demo-notice p { margin: 0; }
.demo-notice strong { color: var(--text-primary, #121722); }
.storage-warning { margin: 0.6rem 0 0; border-radius: 0.7rem; padding: 0.65rem 0.8rem; color: #92400e; background: rgba(245, 158, 11, 0.1); font-size: 0.7rem; line-height: 1.5; }

.guide-progress { height: 0.22rem; margin-top: 1rem; overflow: hidden; border-radius: 99px; background: rgba(49, 130, 246, 0.1); }
.guide-progress span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--demo-blue), #43c2ed); transition: width 0.22s ease; }
.step-tabs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0.35rem; margin: 0.45rem 0 0.75rem; border-radius: 0.85rem; padding: 0.28rem; background: rgba(49, 130, 246, 0.065); }
.step-tab { display: flex; align-items: center; justify-content: center; gap: 0.5rem; min-height: 2.7rem; border: 0; border-radius: 0.65rem; color: var(--text-secondary, #3d4758); background: transparent; font: inherit; font-size: 0.82rem; font-weight: 750; cursor: pointer; }
.step-tab span { font-family: var(--font-mono, monospace); color: var(--text-muted, #7d8797); font-size: 0.66rem; }
.step-tab.is-complete { color: var(--demo-blue-strong); }
.step-tab.is-active { color: var(--demo-blue-strong); background: var(--demo-surface); box-shadow: 0 3px 14px rgba(31, 45, 61, 0.08); }
.step-tab.is-active span { color: inherit; }
.step-tab:disabled { cursor: not-allowed; opacity: 0.58; }

.guide-card { margin-bottom: 0.85rem; scroll-margin-top: 5.5rem; border: 1px solid rgba(49, 130, 246, 0.16); border-radius: 1rem; padding: 0.95rem; background: linear-gradient(145deg, rgba(49, 130, 246, 0.07), rgba(255, 255, 255, 0.68)); }
.guide-card-heading { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.75rem; }
.guide-card-heading h4 { margin: 0.18rem 0 0; font-size: 1rem; }
.guide-step-count { display: grid; min-width: 3.3rem; min-height: 3.3rem; place-items: center; border-radius: 0.85rem; color: #fff; background: linear-gradient(135deg, var(--demo-blue), #43b8ee); font: 800 0.72rem var(--font-mono, monospace); box-shadow: 0 8px 18px rgba(49, 130, 246, 0.18); }
.ownership-badge { border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 999px; padding: 0.42rem 0.65rem; color: #087a50; background: rgba(16, 185, 129, 0.09); font-size: 0.64rem; font-weight: 800; white-space: nowrap; }
.ownership-badge.is-team { border-color: rgba(124, 94, 216, 0.2); color: #6846ba; background: rgba(124, 94, 216, 0.09); }
.guide-facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.55rem; margin: 0.85rem 0 0; }
.guide-facts > div { border: 1px solid rgba(15, 23, 42, 0.06); border-radius: 0.72rem; padding: 0.65rem; background: rgba(255, 255, 255, 0.65); }
.guide-facts dt { color: var(--demo-blue-strong); font-size: 0.68rem; font-weight: 800; }
.guide-facts dd { margin: 0.25rem 0 0; color: var(--text-secondary, #3d4758); font-size: 0.78rem; line-height: 1.55; }

.figma-stage { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(14rem, 0.72fr); gap: 0.85rem; }
.figma-import-panel,
.figma-flow-panel { min-width: 0; border: 1px solid var(--demo-border); border-radius: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.72); }
.team-feature-badge { display: inline-flex; align-items: center; min-height: 1.75rem; border-radius: 999px; padding: 0 0.62rem; color: #6846ba; background: rgba(124, 94, 216, 0.1); font-size: 0.65rem; font-weight: 800; white-space: nowrap; }
.figma-scope-note { margin: 0.8rem 0 0; border-left: 3px solid #7c5ed8; border-radius: 0 0.65rem 0.65rem 0; padding: 0.62rem 0.72rem; color: var(--text-secondary, #3d4758); background: rgba(124, 94, 216, 0.055); font-size: 0.68rem; line-height: 1.6; }
.figma-url-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 0.7rem; margin-top: 0.85rem; }
.figma-url-row input[readonly] { color: var(--text-secondary, #3d4758); background: rgba(247, 249, 252, 0.9); cursor: default; }
.figma-loading,
.figma-empty-state { display: grid; min-height: 11rem; place-content: center; justify-items: center; gap: 0.65rem; margin-top: 0.9rem; border: 1px dashed rgba(49, 130, 246, 0.22); border-radius: 0.85rem; color: var(--text-muted, #7d8797); text-align: center; font-size: 0.69rem; }
.figma-loading span { width: 1.2rem; height: 1.2rem; border: 2px solid rgba(49, 130, 246, 0.18); border-top-color: var(--demo-blue); border-radius: 50%; animation: figma-spin 0.7s linear infinite; }
.figma-file-summary { display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; margin-top: 0.9rem; border-radius: 0.75rem; padding: 0.65rem 0.72rem; color: #087a50; background: rgba(16, 185, 129, 0.07); font-size: 0.65rem; font-weight: 750; }
.figma-file-summary > div { display: flex; align-items: center; gap: 0.6rem; min-width: 0; }
.figma-file-summary > div > span:last-child,
.connected-frame-banner > span:nth-child(2) { display: grid; min-width: 0; gap: 0.08rem; }
.figma-file-summary strong,
.figma-file-summary small { display: block; }
.figma-file-summary strong { color: var(--text-primary, #121722); font-size: 0.72rem; }
.figma-file-summary small { color: var(--text-muted, #7d8797); font-size: 0.6rem; font-weight: 550; }
.figma-mark { display: inline-grid; flex: 0 0 auto; grid-template-columns: repeat(2, 0.32rem); grid-template-rows: repeat(3, 0.32rem); gap: 0.08rem; }
.figma-mark i { border-radius: 0.12rem; background: var(--demo-blue); }
.figma-mark i:nth-child(2),
.figma-mark i:nth-child(4) { opacity: 0.52; }
.figma-mark i:nth-child(5) { grid-column: 1; border-radius: 50%; background: #21b87a; }
.figma-mark.is-large { grid-template-columns: repeat(2, 0.55rem); grid-template-rows: repeat(3, 0.55rem); gap: 0.12rem; }
.figma-frame-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.55rem; margin: 0.7rem 0 0; padding: 0; list-style: none; }
.figma-frame-grid li { min-width: 0; }
.figma-frame-card { display: grid; width: 100%; height: 100%; align-content: start; gap: 0.55rem; border: 1px solid var(--demo-border); border-radius: 0.8rem; padding: 0.55rem; color: inherit; background: rgba(255, 255, 255, 0.78); text-align: left; font: inherit; cursor: pointer; transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease; }
.figma-frame-card:hover { border-color: rgba(49, 130, 246, 0.34); transform: translateY(-1px); }
.figma-frame-card.is-selected { border-color: var(--demo-blue); box-shadow: 0 8px 20px rgba(49, 130, 246, 0.12), inset 0 0 0 1px var(--demo-blue); }
.frame-preview { display: grid; min-height: 6.5rem; overflow: hidden; border-radius: 0.58rem; color: #4778b8; background: linear-gradient(145deg, #edf4ff, #f7fbff); }
.frame-preview.is-spec { color: #7158bd; background: linear-gradient(145deg, #f1efff, #faf9ff); }
.frame-preview.is-testing { color: #087a50; background: linear-gradient(145deg, #eaf9f3, #f7fdfb); }
.frame-browser-bar { display: flex; align-items: center; gap: 0.18rem; height: 1.05rem; padding: 0 0.36rem; background: rgba(255, 255, 255, 0.72); }
.frame-browser-bar i { width: 0.22rem; height: 0.22rem; border-radius: 50%; background: currentColor; opacity: 0.45; }
.frame-layout { display: grid; grid-template-columns: 1fr 2.2fr 1.15fr; gap: 0.28rem; padding: 0.48rem; }
.frame-side,
.frame-main i,
.frame-aside i { border-radius: 0.2rem; background: currentColor; opacity: 0.17; }
.frame-main,
.frame-aside { display: grid; gap: 0.22rem; }
.frame-main { grid-template-columns: repeat(2, 1fr); }
.frame-main i:first-child { grid-column: 1 / -1; }
.frame-aside { grid-template-rows: repeat(2, 1fr); }
.frame-meta { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; }
.frame-meta > span:first-child { display: grid; min-width: 0; gap: 0.12rem; }
.frame-meta strong { overflow: hidden; color: var(--text-primary, #121722); font-size: 0.71rem; text-overflow: ellipsis; white-space: nowrap; }
.frame-meta small { color: var(--text-muted, #7d8797); font: 0.57rem var(--font-mono, monospace); }
.frame-check { display: grid; width: 1.25rem; height: 1.25rem; flex: 0 0 auto; place-items: center; border-radius: 50%; color: var(--demo-blue-strong); background: rgba(49, 130, 246, 0.1); font-size: 0.72rem; font-weight: 900; }
.figma-frame-card.is-selected .frame-check { color: #fff; background: var(--demo-blue); }
.frame-description { color: var(--text-muted, #7d8797); font-size: 0.61rem; line-height: 1.5; }
.figma-selection-summary { display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; margin-top: 0.7rem; border: 1px solid rgba(49, 130, 246, 0.18); border-radius: 0.78rem; padding: 0.72rem; background: rgba(49, 130, 246, 0.05); }
.figma-selection-summary > div:first-child { display: grid; gap: 0.12rem; }
.figma-selection-summary strong { font-size: 0.77rem; }
.figma-selection-summary small { color: var(--text-muted, #7d8797); font-size: 0.61rem; line-height: 1.45; }
.figma-api-links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.3rem; }
.figma-api-links span { border-radius: 999px; padding: 0.3rem 0.5rem; color: var(--demo-blue-strong); background: rgba(49, 130, 246, 0.1); font-size: 0.59rem; font-weight: 750; white-space: nowrap; }
.figma-empty-state strong { color: var(--text-secondary, #3d4758); font-size: 0.76rem; }
.figma-empty-state p { max-width: 23rem; margin: 0; font-size: 0.65rem; line-height: 1.55; }
.figma-flow-panel h4 { margin: 0.22rem 0 0; font-size: 0.95rem; }
.figma-flow-panel ol { display: grid; gap: 0.55rem; margin: 0.85rem 0 0; padding: 0; list-style: none; }
.figma-flow-panel li { display: grid; grid-template-columns: 2rem minmax(0, 1fr); align-items: center; gap: 0.55rem; }
.figma-flow-panel li > span { display: grid; width: 2rem; height: 2rem; place-items: center; border-radius: 0.6rem; color: var(--demo-blue-strong); background: rgba(49, 130, 246, 0.08); font: 750 0.58rem var(--font-mono, monospace); }
.figma-flow-panel li div { display: grid; gap: 0.12rem; }
.figma-flow-panel li strong { font-size: 0.68rem; }
.figma-flow-panel li small { color: var(--text-muted, #7d8797); font-size: 0.59rem; line-height: 1.45; }
.figma-flow-panel > p { margin: 0.85rem 0 0; border-top: 1px solid var(--demo-border); padding-top: 0.75rem; color: var(--text-secondary, #3d4758); font-size: 0.64rem; line-height: 1.62; }
.connected-frame-banner { display: flex; grid-column: 1 / -1; align-items: center; gap: 0.55rem; border: 1px solid rgba(124, 94, 216, 0.14); border-radius: 0.78rem; padding: 0.58rem 0.7rem; color: var(--text-secondary, #3d4758); background: rgba(124, 94, 216, 0.05); }
.connected-frame-banner small { color: #6846ba; font-size: 0.57rem; font-weight: 800; }
.connected-frame-banner strong { font-size: 0.7rem; }
.connected-frame-banner > span:last-child { margin-left: auto; color: var(--text-muted, #7d8797); font: 0.58rem var(--font-mono, monospace); }

@keyframes figma-spin { to { transform: rotate(360deg); } }

.stage-panel { display: grid; grid-template-columns: minmax(0, 1.62fr) minmax(16rem, 0.88fr); gap: 0.85rem; }
.spec-form,
.saved-panel,
.load-config,
.result-panel,
.history-panel { min-width: 0; border: 1px solid var(--demo-border); border-radius: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.72); }
.panel-heading { align-items: flex-start; }
.panel-heading h4 { margin: 0.22rem 0 0; font-size: 1rem; }
.count-badge,
.simulation-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 1.75rem; min-height: 1.75rem; border-radius: 999px; padding: 0 0.55rem; color: var(--demo-blue-strong); background: rgba(49, 130, 246, 0.1); font-size: 0.68rem; font-weight: 800; }
.count-badge.is-success { color: #087a50; background: rgba(16, 185, 129, 0.11); }
.simulation-badge { color: #087a50; background: rgba(16, 185, 129, 0.1); }

.endpoint-grid { display: grid; grid-template-columns: minmax(9rem, 1fr) 7rem; gap: 0.7rem; margin-top: 1rem; }
.field-label { display: grid; align-content: start; gap: 0.38rem; color: var(--text-secondary, #3d4758); font-size: 0.72rem; font-weight: 750; }
.field-label.is-path { grid-column: 1 / -1; }
.field-label small { color: var(--text-muted, #7d8797); font-size: 0.65rem; font-weight: 500; line-height: 1.45; }
input,
select { width: 100%; min-width: 0; height: 2.55rem; border: 1px solid var(--demo-border); border-radius: 0.65rem; padding: 0 0.72rem; color: var(--text-primary, #121722); background: rgba(255, 255, 255, 0.86); font: inherit; font-size: 0.78rem; outline: none; }
input:focus,
select:focus,
button:focus-visible { border-color: var(--demo-blue); outline: 3px solid rgba(49, 130, 246, 0.16); outline-offset: 1px; }

.field-editor { margin-top: 1rem; overflow: hidden; border: 1px solid var(--demo-border); border-radius: 0.85rem; }
.field-tabs { display: flex; overflow-x: auto; border-bottom: 1px solid var(--demo-border); background: rgba(247, 249, 252, 0.76); }
.field-tabs button { flex: 1 0 auto; border: 0; border-bottom: 2px solid transparent; padding: 0.7rem 0.75rem; color: var(--text-muted, #7d8797); background: transparent; font: inherit; font-size: 0.72rem; font-weight: 750; cursor: pointer; }
.field-tabs button span { display: inline-grid; min-width: 1.15rem; height: 1.15rem; margin-left: 0.18rem; place-items: center; border-radius: 99px; background: rgba(125, 135, 151, 0.12); font-size: 0.58rem; }
.field-tabs button.is-active { border-bottom-color: var(--demo-blue); color: var(--demo-blue-strong); background: rgba(255, 255, 255, 0.82); }
.field-panel { padding: 0.8rem; background: rgba(255, 255, 255, 0.54); }
.nested-guide-note { margin: 0 0 0.7rem; border-left: 3px solid var(--demo-blue); padding: 0.5rem 0.65rem; color: var(--text-secondary, #3d4758); background: rgba(49, 130, 246, 0.05); font-size: 0.66rem; line-height: 1.5; }
.nested-guide-note strong { display: block; margin-bottom: 0.1rem; color: var(--demo-blue-strong); }
.row-labels,
.repeat-row { display: grid; grid-template-columns: 1fr 0.72fr 1.25fr 3rem 2rem; gap: 0.42rem; align-items: center; }
.row-labels { padding: 0 0.25rem 0.35rem; color: var(--text-muted, #7d8797); font-size: 0.6rem; font-weight: 700; }
.row-labels.is-response,
.repeat-row.is-response { grid-template-columns: 6rem minmax(0, 1fr) 2rem; }
.repeat-list { display: grid; gap: 0.45rem; }
.repeat-row input,
.repeat-row select { height: 2.2rem; padding-inline: 0.55rem; font-size: 0.7rem; }
.required-check { display: grid; justify-items: center; gap: 0.1rem; color: var(--text-muted, #7d8797); font-size: 0.55rem; cursor: pointer; }
.required-check input { width: 0.9rem; height: 0.9rem; accent-color: var(--demo-blue); }
.icon-button { display: grid; width: 2rem; height: 2rem; place-items: center; border: 1px solid transparent; border-radius: 0.55rem; color: var(--text-muted, #7d8797); background: transparent; font: inherit; font-size: 1.05rem; cursor: pointer; }
.icon-button:hover:not(:disabled) { color: #c14b43; background: rgba(193, 75, 67, 0.08); }
.icon-button:disabled { opacity: 0.3; cursor: not-allowed; }
.empty-row,
.response-help { padding: 0.5rem 0.25rem; color: var(--text-muted, #7d8797); font-size: 0.66rem; }
.add-button { margin-top: 0.6rem; border: 0; padding: 0.25rem; color: var(--demo-blue-strong); background: transparent; font: inherit; font-size: 0.7rem; font-weight: 750; cursor: pointer; }

.validation-box { margin-top: 0.75rem; border: 1px solid rgba(193, 75, 67, 0.18); border-radius: 0.7rem; padding: 0.7rem 0.8rem; color: #a33c35; background: rgba(193, 75, 67, 0.055); font-size: 0.7rem; line-height: 1.55; }
.validation-box ul { margin: 0.3rem 0 0; padding-left: 1rem; }
.form-actions { min-height: 2.55rem; margin-top: 0.8rem; }
.save-message { color: #087a50; font-size: 0.7rem; font-weight: 700; }
.button { min-height: 2.45rem; border: 1px solid var(--demo-border); border-radius: 0.7rem; padding: 0 0.9rem; color: var(--text-secondary, #3d4758); background: rgba(255, 255, 255, 0.8); font: inherit; font-size: 0.73rem; font-weight: 800; cursor: pointer; }
.button.is-primary { border-color: transparent; color: #fff; background: linear-gradient(135deg, var(--demo-blue), #43b8ee); box-shadow: 0 8px 18px rgba(49, 130, 246, 0.2); }
.button.is-secondary { color: var(--demo-blue-strong); background: rgba(49, 130, 246, 0.08); }
.button.is-quiet { min-height: 2.2rem; white-space: nowrap; color: var(--text-muted, #7d8797); background: transparent; }
.button.is-full { width: 100%; }
.button:disabled { opacity: 0.55; cursor: wait; }
.text-button { border: 0; padding: 0.25rem 0; color: var(--demo-blue-strong); background: transparent; font: inherit; font-size: 0.7rem; font-weight: 750; cursor: pointer; }

.saved-list { display: grid; gap: 0.5rem; margin-top: 0.9rem; }
.saved-card { overflow: hidden; border: 1px solid var(--demo-border); border-radius: 0.75rem; background: rgba(255, 255, 255, 0.7); }
.saved-card.is-selected { border-color: rgba(49, 130, 246, 0.38); box-shadow: inset 3px 0 var(--demo-blue); }
.saved-main { display: flex; width: 100%; align-items: center; gap: 0.65rem; border: 0; padding: 0.7rem; text-align: left; color: inherit; background: transparent; font: inherit; cursor: pointer; }
.saved-main > span:last-child,
.spec-picker label > span:last-child { min-width: 0; }
.saved-main strong,
.saved-main code,
.spec-picker strong,
.spec-picker code,
.history-panel td code { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.saved-main strong,
.spec-picker strong { font-size: 0.72rem; }
.saved-main code,
.spec-picker code { margin-top: 0.15rem; color: var(--text-muted, #7d8797); font: 0.64rem var(--font-mono, monospace); }
.method-badge { display: inline-flex; min-width: 3.2rem; min-height: 1.55rem; align-items: center; justify-content: center; border-radius: 0.5rem; color: var(--demo-blue-strong); background: rgba(49, 130, 246, 0.1); font: 700 0.6rem var(--font-mono, monospace); }
.method-badge.is-post { color: #087a50; background: rgba(16, 185, 129, 0.1); }
.method-badge.is-delete { color: #a33c35; background: rgba(193, 75, 67, 0.08); }
.saved-card-actions { display: flex; justify-content: flex-end; gap: 0.65rem; border-top: 1px solid var(--demo-border); padding: 0.38rem 0.65rem; }
.saved-card-actions button { border: 0; padding: 0; color: var(--text-muted, #7d8797); background: transparent; font: inherit; font-size: 0.62rem; cursor: pointer; }
.saved-card-actions button:hover { color: var(--demo-blue-strong); }
.empty-state { border: 1px dashed rgba(125, 135, 151, 0.25); border-radius: 0.75rem; margin-top: 0.9rem; padding: 1.25rem 0.9rem; text-align: center; color: var(--text-muted, #7d8797); }
.empty-state strong { color: var(--text-secondary, #3d4758); font-size: 0.75rem; }
.empty-state p { margin: 0.35rem auto 0; max-width: 22rem; font-size: 0.66rem; line-height: 1.55; }
.empty-state.is-large { display: grid; min-height: 12rem; place-content: center; justify-items: center; }
.empty-state .button { margin-top: 0.75rem; }
.json-preview { margin-top: 0.85rem; overflow: hidden; border-radius: 0.75rem; background: #111827; }
.json-header { padding: 0.6rem 0.7rem; color: #9fb3d4; background: rgba(255, 255, 255, 0.04); font-size: 0.58rem; }
.json-header span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--font-mono, monospace); }
.json-preview pre { max-height: 13rem; margin: 0; overflow: auto; padding: 0.75rem; color: #c9dcfb; font: 0.62rem/1.65 var(--font-mono, monospace); tab-size: 2; }
.json-preview .button { border-radius: 0; }

.load-stage { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(16rem, 0.88fr); gap: 0.85rem; }
.stage-panel.is-preview-step .saved-panel,
.load-stage.is-result-step .result-panel { border-color: rgba(49, 130, 246, 0.34); box-shadow: 0 12px 30px rgba(49, 130, 246, 0.08); }
.stage-panel.is-nested-step .field-editor { border-color: rgba(49, 130, 246, 0.32); box-shadow: 0 10px 24px rgba(49, 130, 246, 0.07); }
.history-panel { grid-column: 1 / -1; }
.simulation-callout { margin: 0.8rem 0 0; border: 1px solid rgba(245, 158, 11, 0.18); border-radius: 0.72rem; padding: 0.65rem 0.72rem; color: #7c4a03; background: rgba(245, 158, 11, 0.08); font-size: 0.66rem; line-height: 1.5; }
.spec-picker { display: grid; gap: 0.45rem; margin-top: 0.9rem; }
.spec-picker label { display: grid; grid-template-columns: auto auto minmax(0, 1fr); align-items: center; gap: 0.55rem; border: 1px solid var(--demo-border); border-radius: 0.72rem; padding: 0.65rem; cursor: pointer; }
.spec-picker label.is-selected { border-color: rgba(49, 130, 246, 0.4); background: rgba(49, 130, 246, 0.055); }
.spec-picker input { width: 0.9rem; height: 0.9rem; accent-color: var(--demo-blue); }
.load-inputs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.65rem; margin: 0.9rem 0; }
.progress-panel { margin: 0.8rem 0; border-radius: 0.75rem; padding: 0.75rem; background: rgba(49, 130, 246, 0.06); }
.progress-meta { color: var(--text-secondary, #3d4758); font-size: 0.69rem; }
.progress-meta span { color: var(--demo-blue-strong); font-family: var(--font-mono, monospace); }
.progress-track { height: 0.48rem; margin: 0.55rem 0; overflow: hidden; border-radius: 99px; background: rgba(49, 130, 246, 0.12); }
.progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--demo-blue), #43c2ed); transition: width 0.1s linear; }
.progress-panel code { color: var(--text-muted, #7d8797); font: 0.62rem var(--font-mono, monospace); }

.result-endpoint { margin-top: 0.9rem; border-radius: 0.7rem; padding: 0.72rem; background: rgba(49, 130, 246, 0.055); }
.result-endpoint span,
.result-endpoint code { display: block; }
.result-endpoint span { font-size: 0.72rem; font-weight: 800; }
.result-endpoint code { margin-top: 0.2rem; color: var(--text-muted, #7d8797); font: 0.63rem var(--font-mono, monospace); }
.metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.45rem; margin-top: 0.65rem; }
.metric-grid > div { border: 1px solid var(--demo-border); border-radius: 0.7rem; padding: 0.65rem; background: rgba(255, 255, 255, 0.64); }
.metric-grid span { display: block; color: var(--text-muted, #7d8797); font-size: 0.6rem; }
.metric-grid strong { display: block; margin-top: 0.15rem; font-size: 1rem; }
.metric-grid small { margin-left: 0.15rem; color: var(--text-muted, #7d8797); font-size: 0.55rem; font-weight: 600; }
.status-summary { margin-top: 0.65rem; border-top: 1px solid var(--demo-border); padding-top: 0.65rem; color: var(--text-muted, #7d8797); font-size: 0.62rem; }
.status-summary div { display: flex; align-items: center; gap: 0.3rem; }
.status-summary strong { color: var(--text-secondary, #3d4758); }
.status-dot { width: 0.45rem; height: 0.45rem; border-radius: 50%; }
.status-dot.is-ok { background: #10b981; }
.status-dot.is-error { background: #e0645c; }
.result-caption { margin: 0.7rem 0 0; color: var(--text-muted, #7d8797); font-size: 0.61rem; line-height: 1.5; }

.history-table-wrap { margin-top: 0.8rem; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.66rem; }
th { padding: 0.55rem; text-align: left; color: var(--text-muted, #7d8797); font-size: 0.58rem; font-weight: 700; }
td { border-top: 1px solid var(--demo-border); padding: 0.65rem 0.55rem; color: var(--text-secondary, #3d4758); white-space: nowrap; }
td:first-child { max-width: 13rem; white-space: normal; }
.history-panel td code { max-width: 13rem; margin-top: 0.15rem; color: var(--text-muted, #7d8797); font: 0.58rem var(--font-mono, monospace); }

.guided-footer { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.8rem; margin-top: 0.9rem; border-top: 1px solid var(--demo-border); padding-top: 0.9rem; }
.guided-footer p { margin: 0; text-align: center; color: var(--text-muted, #7d8797); font-size: 0.66rem; }

.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }

@media (max-width: 820px) {
  .step-tabs { display: flex; overflow-x: auto; scroll-snap-type: x proximity; }
  .step-tab { flex: 0 0 8.5rem; scroll-snap-align: start; }
  .guide-facts { grid-template-columns: 1fr; }
  .figma-stage,
  .stage-panel,
  .load-stage { grid-template-columns: 1fr; }
  .history-panel { grid-column: auto; }
}

@media (max-width: 580px) {
  .demo-header { display: grid; }
  .demo-header .button { justify-self: start; }
  .guide-card-heading { grid-template-columns: auto minmax(0, 1fr); }
  .ownership-badge { grid-column: 1 / -1; justify-self: start; }
  .guided-footer { grid-template-columns: 1fr 1fr; }
  .guided-footer p { grid-column: 1 / -1; grid-row: 1; }
  .guided-footer .button { width: 100%; padding-inline: 0.55rem; }
  .figma-url-row,
  .endpoint-grid,
  .load-inputs { grid-template-columns: 1fr; }
  .figma-url-row .button { width: 100%; }
  .figma-frame-grid { grid-template-columns: 1fr; }
  .figma-selection-summary { align-items: flex-start; flex-direction: column; }
  .figma-api-links { justify-content: flex-start; }
  .field-label.is-path { grid-column: auto; }
  .row-labels { display: none; }
  .repeat-row { grid-template-columns: minmax(0, 1fr) 6rem 2rem; border-bottom: 1px solid var(--demo-border); padding-bottom: 0.55rem; }
  .repeat-row > :nth-child(3) { grid-column: 1 / 3; }
  .required-check { grid-column: 1; grid-row: 2; display: flex; justify-self: start; }
  .repeat-row.is-response { grid-template-columns: 5rem minmax(0, 1fr) 2rem; }
  .status-summary { align-items: flex-start; flex-wrap: wrap; }
}

@media (prefers-reduced-motion: reduce) {
  .figma-loading span { animation: none; }
  .figma-frame-card { transition: none; }
  .progress-track span,
  .guide-progress span { transition: none; }
}
</style>
