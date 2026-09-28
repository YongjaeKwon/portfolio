<template>
  <section :class="['project-demo', { 'project-demo-embedded': embedded }]" :aria-labelledby="embedded ? undefined : titleId">
    <div v-if="!embedded" class="project-demo-heading">
      <div>
        <h4 :id="titleId">{{ t("전체 흐름 직접 체험", "Try the full flow") }}</h4>
        <p>{{ copy }}</p>
        <small v-if="expanded" class="project-demo-reset-hint">{{ t("데모를 종료하면 진행하던 화면이 처음 상태로 돌아갑니다.", "Closing the demo resets the current screen.") }}</small>
      </div>
      <button
        type="button"
        class="focus-ring project-demo-toggle"
        :aria-expanded="expanded"
        :aria-controls="contentId"
        @click="toggleDemo"
      >
        <Play v-if="!expanded" class="h-4 w-4" aria-hidden="true" />
        <ChevronUp v-else class="h-4 w-4" aria-hidden="true" />
        {{ expanded ? t("데모 종료", "Close demo") : t("데모 실행", "Run demo") }}
      </button>
    </div>

    <div v-if="!embedded && !expanded" class="project-demo-notice">
      {{ t("당시 서비스의 핵심 사용자 흐름을 샘플 데이터로 다시 만들었습니다. 외부 계정, 서버, DB에는 연결하지 않습니다. 단계마다 실제로 구현한 부분과 데모로 재현한 부분을 나눠 적었습니다.", "The service's core user flow is rebuilt with sample data. Nothing connects to external accounts, servers, or databases, and each step marks what was actually built versus the public simulation.") }}
    </div>

    <div v-if="expanded" :id="contentId" class="project-demo-content">
      <component :is="demoComponent" @dialog-state-change="handleDialogStateChange" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { ChevronUp, Play } from "@lucide/vue";
import { t } from "@/i18n/locale";

const props = withDefaults(defineProps<{ projectId: string; startExpanded?: boolean; embedded?: boolean }>(), {
  startExpanded: false,
  embedded: false,
});
const emit = defineEmits<{ (event: "dialog-state-change", open: boolean): void }>();

const demos = {
  ssafast: defineAsyncComponent(() => import("@/components/demos/SsafastDemo.vue")),
  ddoing: defineAsyncComponent(() => import("@/components/demos/DdoingDemo.vue")),
  modac: defineAsyncComponent(() => import("@/components/demos/ModacDemo.vue")),
  ticketrush: defineAsyncComponent(() => import("@/components/demos/TicketRushDemo.vue")),
} as const;

const copyByProject = {
  ssafast: t(
    "Figma 화면 선택부터 API 명세 작성, 요청 확인, 테스트 결과까지 차례로 따라갑니다.",
    "Follow the collaboration tool's core flow step by step — from writing an API spec to previewing requests and checking simulated results.",
  ),
  ddoing: t(
    "단어를 보고 Canvas에 그림을 그린 뒤, 데모용 판정 응답을 받고 다음 문제로 넘어가는 흐름을 차례로 따라갑니다.",
    "Follow the learning flow step by step — from checking the word to Canvas drawing, the public judgement response, and the next question.",
  ),
  modac: t(
    "스터디를 찾아 참여하고, 스터디룸에서 활동한 뒤 기록을 확인하는 흐름을 차례로 따라갑니다.",
    "Follow the service flow step by step — from browsing and joining a study group to room activity and study logs.",
  ),
  ticketrush: t(
    "대기열 입장부터 좌석 선점, 한 좌석에 몰린 동시 요청 100건, 결제 확정까지 3겹 방어 설계를 차례로 확인합니다.",
    "Experience the three-layer defense step by step — queue admission, seat holds, a 100-request race, and payment confirmation.",
  ),
} as const;

const expanded = ref(props.startExpanded);

const demoComponent = computed(() => demos[props.projectId as keyof typeof demos]);
const copy = computed(() => copyByProject[props.projectId as keyof typeof copyByProject] ?? t("프로젝트의 주요 기능 흐름을 체험할 수 있습니다.", "Try the project's main feature flow."));
const titleId = computed(() => `project-demo-title-${props.projectId}`);
const contentId = computed(() => `project-demo-content-${props.projectId}`);

watch(
  () => props.projectId,
  () => {
    expanded.value = props.startExpanded;
    emit("dialog-state-change", false);
  },
);

const toggleDemo = () => {
  expanded.value = !expanded.value;
  if (!expanded.value) emit("dialog-state-change", false);
};

const handleDialogStateChange = (open: boolean) => emit("dialog-state-change", open);
</script>

<style scoped>
.project-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  gap: 1rem;
  border: 1px solid rgba(49, 130, 246, 0.16);
  border-radius: 1.15rem;
  padding: 1.1rem;
  background: linear-gradient(145deg, rgba(239, 246, 255, 0.88), rgba(255, 255, 255, 0.8));
  box-shadow: 0 16px 44px rgba(38, 69, 111, 0.08);
}

.project-demo > * {
  min-width: 0;
}

.project-demo-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.25rem;
}

.project-demo-heading h4 {
  margin-top: 0.45rem;
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 900;
}

.project-demo-heading p {
  max-width: 38rem;
  margin: 0.45rem 0 0;
  color: var(--text-muted);
  font-size: 0.82rem;
  line-height: 1.65;
}

.project-demo-reset-hint {
  display: block;
  margin-top: 0.35rem;
  color: var(--text-muted);
  font-size: 0.68rem;
  line-height: 1.45;
}

.project-demo-toggle {
  display: inline-flex;
  min-height: 2.65rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  color: #fff;
  background: linear-gradient(135deg, var(--fresh-blue-strong), var(--fresh-blue));
  box-shadow: 0 10px 24px rgba(49, 130, 246, 0.22);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 900;
}

.project-demo-notice {
  border-radius: 0.75rem;
  padding: 0.7rem 0.8rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.7);
  font-size: 0.74rem;
  font-weight: 650;
  line-height: 1.55;
}

.project-demo-content {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  border-top: 1px solid rgba(49, 130, 246, 0.12);
  padding-top: 1rem;
}

.project-demo-embedded {
  border: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

.project-demo-embedded .project-demo-content {
  border-top: 0;
  padding-top: 0;
}

@media (max-width: 700px) {
  .project-demo-heading {
    align-items: stretch;
    flex-direction: column;
  }

  .project-demo-toggle {
    align-self: flex-start;
  }
}
</style>
