<template>
  <section id="hero" class="relative pb-16 pt-24 md:pt-28">

    <div class="section-shell relative z-10 grid min-h-[calc(100dvh-8rem)] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
      <div class="max-w-3xl">
        <div class="flex items-center gap-4">
          <img
            src="/my-photo-224.webp"
            :alt="t('권용재 프로필 사진', 'Portrait of Yongjae Kwon')"
            width="112"
            height="112"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            class="hero-photo h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-white/50 shadow-md md:h-20 md:w-20"
          />
          <p class="text-primary text-lg font-black leading-tight">
            {{ profile.name }}
            <span class="text-muted mt-1 block text-sm font-semibold">{{ activeTrackData.role }}</span>
          </p>
        </div>

        <h1 class="text-primary mt-8 text-3xl font-black leading-[1.25] md:text-4xl">
          {{ activeTrackData.headline }}
        </h1>
        <p class="text-secondary mt-5 max-w-2xl text-lg leading-8">
          {{ activeTrackData.target }}
        </p>

        <div class="mt-7">
          <FocusTabs />
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="focus-ring fresh-button inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition active:scale-[0.98]"
            @click="emit('scroll-to-section', 'experience')"
          >
            {{ t("개발 경험 보기", "See my experience") }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            class="focus-ring fresh-button-soft inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
            :href="resumeHref"
            :download="resumeFileName"
          >
            {{ t("이력서", "Resume") }}
            <FileDown class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <aside class="hero-proof rounded-lg p-6 md:p-8" :aria-label="t('대표 성과', 'Selected results')">
        <h2 class="text-primary text-xl font-black">{{ t("대표 성과", "Selected results") }}</h2>
        <ul class="mt-5 divide-y divide-[var(--fresh-border)]">
          <li v-for="item in activeProof" :key="item.title" class="py-4 first:pt-0 last:pb-0">
            <p class="text-primary font-bold leading-7">{{ item.title }}</p>
            <p class="text-secondary mt-1 text-sm leading-6">{{ item.detail }}</p>
            <p class="text-muted mt-2 text-xs font-semibold">{{ item.project }}</p>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowRight, FileDown } from "@lucide/vue";
import FocusTabs from "@/components/FocusTabs.vue";
import { focusTracks, profile, type FocusTrackId } from "@/data/portfolio";
import { useActiveResume } from "@/composables/useActiveResume";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { t } from "@/i18n/locale";

const emit = defineEmits<{ "scroll-to-section": [id: string] }>();
const { activeTrack } = useFocusTrack();
const { resumeHref, resumeFileName } = useActiveResume();
const activeTrackData = computed(() => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]);

type Proof = { title: string; detail: string; project: string };

// 이력서 핵심 성과와 같은 실측 사례만 쓴다(규모 숫자 제외).
const proof = {
  query: {
    title: t("60초 안에 끝나지 않던 조회를 63~69ms로", "A lookup that never finished in 60 s now returns in 63–69 ms"),
    detail: t("통합 뷰를 기본 테이블 조인으로 다시 써서 운영 DB에서 다시 쟀습니다.", "Rewrote a union view as base-table joins and re-measured on the production DB."),
    project: t("교육용 단말 운영 시스템(TSMS)", "Education device operations (TSMS)"),
  },
  download: {
    title: t("300~400건 첨부파일 압축을 진행 상태가 보이는 작업으로", "Zipping 300–400 attachments became a job with visible progress"),
    detail: t("작업 ID를 먼저 돌려주고, 새로고침 후에도 같은 작업을 이어서 확인합니다.", "The request returns a job ID first, and the same job resumes after a refresh."),
    project: t("B2B 협력사 포털(PPS)", "B2B partner portal (PPS)"),
  },
  rateLimit: {
    title: t("서버 2대에서 똑같이 걸리는 인증번호 요청 제한", "One reset-code rate limit across two servers"),
    detail: t("분산 맵의 원자적 획득으로 동시 요청 중 한 건만 보내고, 경계 조건은 단위 테스트 30건으로 고정했습니다.", "Atomic acquisition on a distributed map sends only one of concurrent requests; 30 unit tests pin the edge cases."),
    project: t("B2B 협력사 포털(PPS)", "B2B partner portal (PPS)"),
  },
  dataFix: {
    title: t("운영 DB 점검 데이터를 되돌릴 수 있게 정리", "Cleaned live inspection data with a way back"),
    detail: t("백업, 롤백, 사후 검증 SQL을 먼저 준비하고 점검 결과를 보존한 채 중복을 없앴습니다.", "Prepared backup, rollback and verification SQL first, then removed duplicates while keeping results."),
    project: t("교육용 단말 운영 시스템(TSMS)", "Education device operations (TSMS)"),
  },
  stateLeak: {
    title: t("Vue 공통 상태 누수로 생긴 첨부파일 오연결 원인 제거", "Removed the Vue shared-state leak that mislinked attachments"),
    detail: t("화면마다 새 상태를 만들고, 서버 저장 단계에서도 잘못된 연결을 한 번 더 막았습니다.", "Each screen now creates fresh state, and the server rejects a wrong link on save."),
    project: t("B2B 협력사 포털(PPS)", "B2B partner portal (PPS)"),
  },
  enrollment: {
    title: t("4개 교육청 학부모 공개 접수 화면", "Public enrollment screens for four education offices"),
    detail: t("로그인 없이 모바일에서 동의, 배송 예약, QR 배부 확인을 마치게 했습니다.", "Parents finish consent, delivery booking and QR pickup on mobile without logging in."),
    project: t("교육용 단말 운영 시스템(TSMS)", "Education device operations (TSMS)"),
  },
} satisfies Record<string, Proof>;

const proofByTrack: Record<FocusTrackId, Proof[]> = {
  all: [proof.query, proof.download, proof.rateLimit],
  backend: [proof.query, proof.rateLimit, proof.dataFix],
  frontend: [proof.stateLeak, proof.download, proof.enrollment],
};

const activeProof = computed(() => proofByTrack[activeTrack.value]);
</script>

<style scoped>
.hero-proof {
  border: 1px solid var(--fresh-border);
  background: var(--fresh-surface-solid);
}
</style>
