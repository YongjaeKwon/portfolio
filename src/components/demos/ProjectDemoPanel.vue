<template>
  <section class="project-demo" aria-labelledby="project-demo-title">
    <div class="project-demo-heading">
      <div>
        <p class="section-kicker">Interactive Demo</p>
        <h4 id="project-demo-title">기능 흐름 직접 보기</h4>
        <p>{{ copy }}</p>
        <small v-if="expanded" class="project-demo-reset-hint">데모를 종료하면 현재 진행 화면이 초기화됩니다.</small>
      </div>
      <button
        type="button"
        class="focus-ring project-demo-toggle"
        :aria-expanded="expanded"
        aria-controls="project-demo-content"
        @click="toggleDemo"
      >
        <Play v-if="!expanded" class="h-4 w-4" aria-hidden="true" />
        <ChevronUp v-else class="h-4 w-4" aria-hidden="true" />
        {{ expanded ? "데모 종료" : "데모 실행" }}
      </button>
    </div>

    <div v-if="!expanded" class="project-demo-notice">
      당시 담당한 화면과 기능 흐름을 포트폴리오용으로 재구성했습니다. 외부 계정·서버·DB에는 연결되지 않습니다.
    </div>

    <div v-if="expanded" id="project-demo-content" class="project-demo-content">
      <component :is="demoComponent" @dialog-state-change="handleDialogStateChange" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { ChevronUp, Play } from "@lucide/vue";

const props = defineProps<{ projectId: string }>();
const emit = defineEmits<{ (event: "dialog-state-change", open: boolean): void }>();

const demos = {
  ssafast: defineAsyncComponent(() => import("@/components/demos/SsafastDemo.vue")),
  ddoing: defineAsyncComponent(() => import("@/components/demos/DdoingDemo.vue")),
  modac: defineAsyncComponent(() => import("@/components/demos/ModacDemo.vue")),
} as const;

const copyByProject = {
  ssafast: "API 명세를 작성하고 저장한 뒤, 입력 조건에 따른 예시 성능 결과 화면까지 확인할 수 있습니다.",
  ddoing: "Canvas에 그림을 그리고 제한 시간과 데모 판정이 이어지는 학습 흐름을 체험할 수 있습니다.",
  modac: "공개·비공개 스터디룸 입장 조건과 채팅·방 이동 상태를 확인할 수 있습니다.",
} as const;

const expanded = ref(false);

const demoComponent = computed(() => demos[props.projectId as keyof typeof demos]);
const copy = computed(() => copyByProject[props.projectId as keyof typeof copyByProject] ?? "프로젝트의 주요 기능 흐름을 체험할 수 있습니다.");

const toggleDemo = () => {
  expanded.value = !expanded.value;
  if (!expanded.value) emit("dialog-state-change", false);
};

const handleDialogStateChange = (open: boolean) => emit("dialog-state-change", open);
</script>

<style scoped>
.project-demo {
  display: grid;
  gap: 1rem;
  border: 1px solid rgba(49, 130, 246, 0.16);
  border-radius: 1.15rem;
  padding: 1.1rem;
  background: linear-gradient(145deg, rgba(239, 246, 255, 0.88), rgba(255, 255, 255, 0.8));
  box-shadow: 0 16px 44px rgba(38, 69, 111, 0.08);
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

.project-demo-heading p:not(.section-kicker) {
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
  border-top: 1px solid rgba(49, 130, 246, 0.12);
  padding-top: 1rem;
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
