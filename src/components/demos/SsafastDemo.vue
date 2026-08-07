<template>
  <section class="ssafast-demo" aria-labelledby="ssafast-demo-title">
    <header class="demo-header">
      <div>
        <div class="demo-eyebrow">
          <span class="demo-dot" aria-hidden="true"></span>
          샘플 데이터 데모
        </div>
        <h3 id="ssafast-demo-title">API 명세 작성부터 성능 결과 화면까지</h3>
        <p>입력한 명세를 브라우저에 저장하고, 조건에 따른 예시 성능 지표를 생성합니다.</p>
      </div>
      <button class="button is-quiet" type="button" @click="resetDemo">데모 초기화</button>
    </header>

    <div class="demo-notice" role="note">
      <span aria-hidden="true">ⓘ</span>
      <p>
        실제 서버로 요청을 보내지 않습니다. 아래 데이터는 이 브라우저에만 저장되며 성능 지표는
        입력한 조건을 바탕으로 생성한 예시입니다.
      </p>
    </div>
    <p v-if="storageWarning" class="storage-warning" role="alert">{{ storageWarning }}</p>

    <nav class="step-tabs" aria-label="데모 단계">
      <button
        v-for="item in steps"
        :key="item.id"
        type="button"
        :class="['step-tab', { 'is-active': stage === item.id }]"
        :aria-current="stage === item.id ? 'step' : undefined"
        :disabled="isRunning"
        @click="stage = item.id"
      >
        <span>{{ item.number }}</span>
        {{ item.label }}
      </button>
    </nav>

    <div v-if="stage === 'spec'" class="stage-panel">
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
            <span>구조 미리보기</span>
            <span>{{ selectedSpec.method }} {{ selectedSpec.path }}</span>
          </div>
          <pre tabindex="0" aria-label="선택된 API 명세 JSON 요약"><code>{{ selectedSpecSummary }}</code></pre>
          <button class="button is-secondary is-full" type="button" @click="goToLoadTest">
            이 명세로 예시 결과 보기 →
          </button>
        </div>
      </aside>
    </div>

    <div v-else class="load-stage">
      <section class="load-config" aria-labelledby="load-config-title">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">Illustrative Result</span>
            <h4 id="load-config-title">예시 결과 조건</h4>
          </div>
          <span class="simulation-badge">외부 요청 없음</span>
        </div>

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
          <button class="button is-secondary" type="button" @click="stage = 'spec'">명세 작성하기</button>
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
            {{ isRunning ? '결과 생성 중…' : '예시 결과 생성' }}
          </button>
        </template>
      </section>

      <section class="result-panel" aria-labelledby="result-title">
        <div class="panel-heading">
          <div>
            <span class="panel-kicker">Result</span>
            <h4 id="result-title">최근 예시 결과</h4>
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
          <p class="result-caption">같은 명세와 조건으로 실행하면 동일한 예시 결과가 생성됩니다.</p>
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
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

type Stage = "spec" | "load";
type FieldGroupId = "headers" | "queries" | "body" | "responses";
type RequestGroupId = Exclude<FieldGroupId, "responses">;
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const fieldTypes = ["string", "number", "boolean", "object", "array"];
const steps: { id: Stage; number: string; label: string }[] = [
  { id: "spec", number: "01", label: "API 명세" },
  { id: "load", number: "02", label: "예시 결과" },
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
  name: "사용자 상세 조회",
  method: "GET",
  path: "/api/users/{id}",
  headers: [makeRequestField({ name: "X-Request-Id", description: "요청 추적 ID" })],
  queries: [makeRequestField({ name: "includeProfile", type: "boolean", description: "프로필 포함 여부" })],
  body: [],
  responses: [
    makeResponseField("200", "조회 성공"),
    makeResponseField("404", "사용자를 찾을 수 없음"),
  ],
});
const copyDraft = (source: ApiDraft): ApiDraft => JSON.parse(JSON.stringify(source)) as ApiDraft;

const stage = ref<Stage>("spec");
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
let messageTimer: ReturnType<typeof setTimeout> | undefined;
let storageTimer: ReturnType<typeof setTimeout> | undefined;

const activeRequestRows = computed(() =>
  activeGroup.value === "responses" ? [] : draft[activeGroup.value]
);
const activeGroupLabel = computed(
  () => fieldGroups.find((group) => group.id === activeGroup.value)?.label ?? "필드"
);
const selectedSpec = computed(() => specs.value.find((spec) => spec.id === selectedSpecId.value));
const progressTarget = computed(() => activeRun.value?.spec ?? selectedSpec.value);
const latestRun = computed(() => runs.value[0]);
const selectedSpecSummary = computed(() => {
  const spec = selectedSpec.value;
  if (!spec) return "";
  return JSON.stringify(
    {
      method: spec.method,
      path: spec.path,
      request: {
        headers: spec.headers.map(({ name, type, required }) => ({ name, type, required })),
        query: spec.queries.map(({ name, type, required }) => ({ name, type, required })),
        body: spec.body.map(({ name, type, required }) => ({ name, type, required })),
      },
      responses: spec.responses.map(({ status, description }) => ({ status, description })),
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
  if (!validateDraft()) return;
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
};

const editSpec = (spec: ApiSpec) => {
  editingId.value = spec.id;
  selectedSpecId.value = spec.id;
  setDraft(spec);
  stage.value = "spec";
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
  stage.value = "load";
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
  }, 80);
};

const successRate = (run: LoadRun) =>
  run.result.total ? ((run.result.success / run.result.total) * 100).toFixed(1) : "0.0";

const resetDemo = () => {
  stopProgressTimer();
  isRunning.value = false;
  activeRun.value = null;
  progress.value = 0;
  specs.value = [];
  runs.value = [];
  selectedSpecId.value = "";
  safelyRemove(STORAGE_KEY);
  safelyRemove(HISTORY_KEY);
  stage.value = "spec";
  startNewSpec();
  flashSavedMessage("샘플 데이터를 초기화했습니다.");
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
.storage-warning { margin: 0.6rem 0 0; border-radius: 0.7rem; padding: 0.65rem 0.8rem; color: #92400e; background: rgba(245, 158, 11, 0.1); font-size: 0.7rem; line-height: 1.5; }

.step-tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.4rem; margin: 1rem 0; border-radius: 0.85rem; padding: 0.28rem; background: rgba(49, 130, 246, 0.065); }
.step-tab { display: flex; align-items: center; justify-content: center; gap: 0.5rem; min-height: 2.7rem; border: 0; border-radius: 0.65rem; color: var(--text-secondary, #3d4758); background: transparent; font: inherit; font-size: 0.82rem; font-weight: 750; cursor: pointer; }
.step-tab span { font-family: var(--font-mono, monospace); color: var(--text-muted, #7d8797); font-size: 0.66rem; }
.step-tab.is-active { color: var(--demo-blue-strong); background: var(--demo-surface); box-shadow: 0 3px 14px rgba(31, 45, 61, 0.08); }
.step-tab.is-active span { color: inherit; }
.step-tab:disabled { cursor: not-allowed; opacity: 0.58; }

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
.history-panel { grid-column: 1 / -1; }
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

.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }

@media (max-width: 820px) {
  .stage-panel,
  .load-stage { grid-template-columns: 1fr; }
  .history-panel { grid-column: auto; }
}

@media (max-width: 580px) {
  .demo-header { display: grid; }
  .demo-header .button { justify-self: start; }
  .endpoint-grid,
  .load-inputs { grid-template-columns: 1fr; }
  .field-label.is-path { grid-column: auto; }
  .row-labels { display: none; }
  .repeat-row { grid-template-columns: minmax(0, 1fr) 6rem 2rem; border-bottom: 1px solid var(--demo-border); padding-bottom: 0.55rem; }
  .repeat-row > :nth-child(3) { grid-column: 1 / 3; }
  .required-check { grid-column: 1; grid-row: 2; display: flex; justify-self: start; }
  .repeat-row.is-response { grid-template-columns: 5rem minmax(0, 1fr) 2rem; }
  .status-summary { align-items: flex-start; flex-wrap: wrap; }
}

@media (prefers-reduced-motion: reduce) {
  .progress-track span { transition: none; }
}
</style>
