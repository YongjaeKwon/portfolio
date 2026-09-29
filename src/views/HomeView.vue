<template>
  <section id="hero" class="relative pb-4 pt-24 md:pt-28">
    <div class="section-shell relative z-10">
      <div class="grid items-center gap-10 py-8 lg:min-h-[34rem] lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:py-12">
        <div class="max-w-3xl">
          <div class="flex items-center gap-3">
            <img
              src="/my-photo-224.webp"
              :alt="t('권용재 프로필 사진', 'Portrait of Yongjae Kwon')"
              width="112"
              height="112"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              class="hero-photo h-12 w-12 shrink-0 rounded-full object-cover md:h-14 md:w-14"
            />
            <p class="text-primary text-base font-black leading-tight">
              {{ profile.name }}
              <span class="text-muted mt-1 block text-sm font-semibold">{{ activeTrackData.role }}</span>
            </p>
          </div>

          <h1 class="hero-title text-primary mt-8">
            {{ headline.body }}<span v-if="headline.stop" class="text-[var(--fresh-accent)]">{{ headline.stop }}</span>
          </h1>
          <p class="text-secondary mt-6 max-w-xl text-lg leading-8">
            {{ activeTrackData.target }}
          </p>

          <div class="mt-7">
            <FocusTabs />
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              class="focus-ring fresh-button inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-sm font-black transition active:scale-[0.98]"
              @click="emit('scroll-to-section', 'experience')"
            >
              {{ t("개발 경험 보기", "See my experience") }}
              <span aria-hidden="true">→</span>
            </button>
            <a
              class="focus-ring fresh-button-soft inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition active:scale-[0.98]"
              :href="resumeHref"
              :download="resumeFileName"
            >
              {{ t("이력서 PDF", "Resume PDF") }}
            </a>
          </div>
        </div>

        <img
          src="/projects/ticketrush-preview.webp"
          alt=""
          width="960"
          height="540"
          loading="lazy"
          decoding="async"
          class="hero-shot-mobile lg:hidden"
        />

        <div class="hero-stage hidden lg:block" aria-hidden="true">
          <img
            src="/projects/ssafast-preview.webp"
            alt=""
            width="960"
            height="540"
            loading="lazy"
            decoding="async"
            class="hero-shot hero-shot-back"
          />
          <img
            src="/projects/ticketrush-preview.webp"
            alt=""
            width="960"
            height="540"
            loading="lazy"
            decoding="async"
            class="hero-shot hero-shot-front"
          />
          <span class="hero-sticker">{{ t("좌석은 한 번만 팔린다 · 테스트로 확인", "One seat, one sale · verified by tests") }}</span>
        </div>
      </div>

      <aside class="hero-proof mt-6" :aria-label="t('대표 성과', 'Selected results')">
        <h2 class="sr-only">{{ t("대표 성과", "Selected results") }}</h2>
        <ul class="grid md:grid-cols-3">
          <li v-for="item in activeProof" :key="item.title" class="hero-proof-item">
            <p v-if="item.figure" class="proof-figure font-mono tnum">
              <s v-if="item.figure.before" class="proof-before">{{ item.figure.before }}</s>
              <span v-if="item.figure.before" class="proof-arrow" aria-hidden="true">→</span>
              <span>{{ item.figure.value }}<small>{{ item.figure.unit }}</small></span>
            </p>
            <p :class="['text-primary font-black leading-snug', item.figure ? 'mt-4 text-lg' : 'text-2xl md:text-[1.7rem]']">{{ item.title }}</p>
            <p class="text-secondary mt-2 text-sm leading-6">{{ item.detail }}</p>
            <p class="text-muted mt-3 text-xs font-semibold">{{ item.project }}</p>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FocusTabs from "@/components/FocusTabs.vue";
import { focusTracks, profile, type FocusTrackId } from "@/data/portfolio";
import { useActiveResume } from "@/composables/useActiveResume";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { t } from "@/i18n/locale";

const emit = defineEmits<{ "scroll-to-section": [id: string] }>();
const { activeTrack } = useFocusTrack();
const { resumeHref, resumeFileName } = useActiveResume();
const activeTrackData = computed(() => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]);

type Figure = { value: string; unit: string; before?: string };
type Proof = { title: string; detail: string; project: string; figure?: Figure };

// 제목 끝 마침표만 강조색으로 뗀다.
const headline = computed(() => {
  const text = activeTrackData.value.headline;
  return text.endsWith(".") ? { body: text.slice(0, -1), stop: "." } : { body: text, stop: "" };
});

// 이력서 핵심 성과와 같은 실측 사례만 쓴다. 테스트 개수는 성과 숫자로 앞세우지 않는다.
const proof = {
  query: {
    title: t("60초 안에 끝나지 않던 조회를 63~69ms로", "A lookup that never finished in 60 s now returns in 63–69 ms"),
    detail: t("통합 뷰를 기본 테이블 조인으로 바꾸고, 운영 DB에서 직접 측정했습니다.", "Rewrote a union view as base-table joins and re-measured on the production DB."),
    project: t("교육용 단말 운영 시스템(TSMS)", "Education device operations (TSMS)"),
    figure: { before: "60s+", value: "63~69", unit: "ms" },
  },
  download: {
    title: t("300~400건 첨부파일 압축을 진행 상태가 보이는 작업으로", "Zipping 300–400 attachments became a job with visible progress"),
    detail: t("작업 ID를 먼저 돌려주고, 새로고침 후에도 같은 작업을 이어서 확인합니다.", "The request returns a job ID first, and the same job resumes after a refresh."),
    project: t("B2B 협력사 포털(PPS)", "B2B partner portal (PPS)"),
    figure: { value: "300~400", unit: t("건", " files") },
  },
  rateLimit: {
    title: t("서버 2대에서 똑같이 걸리는 인증번호 요청 제한", "One reset-code rate limit across two servers"),
    detail: t("분산 맵의 원자적 획득으로 동시 요청 중 한 건만 보내고, 경계 조건은 단위 테스트 30건으로 고정했습니다.", "Atomic acquisition on a distributed map sends only one of concurrent requests; 30 unit tests pin the edge cases."),
    project: t("B2B 협력사 포털(PPS)", "B2B partner portal (PPS)"),
  },
  qr: {
    title: t("교육용 단말 108,237대에 QR 발급", "QR codes issued for 108,237 education devices"),
    detail: t("대량 등록 전에 생산입고 정보와 기등록 여부를 검사하고, QR에는 내부 식별자 대신 외부 노출용 ID를 넣었습니다.", "Bulk registration checks production-intake records and prior registrations first, and QR codes carry a public ID instead of internal identifiers."),
    project: t("교육용 단말 운영 시스템(TSMS)", "Education device operations (TSMS)"),
    figure: { value: "108,237", unit: t("대", " devices") },
  },
  dataFix: {
    title: t("되돌릴 수 있는 절차로 운영 DB 점검 데이터 정리", "Cleaned live inspection data with a way back"),
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
    figure: { value: "4", unit: t("개 교육청", " offices") },
  },
} satisfies Record<string, Proof>;

const proofByTrack: Record<FocusTrackId, Proof[]> = {
  all: [proof.query, proof.download, proof.qr],
  backend: [proof.query, proof.rateLimit, proof.dataFix],
  frontend: [proof.stateLeak, proof.download, proof.enrollment],
};

const activeProof = computed(() => proofByTrack[activeTrack.value]);
</script>

<style scoped>
.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 1.4rem + 4.4vw, 5.25rem);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.hero-stage {
  position: relative;
  height: 30rem;
}

.hero-shot {
  position: absolute;
  width: 88%;
  height: auto;
  border: 2px solid var(--fresh-ink);
  border-radius: var(--fresh-radius-md);
  background: var(--fresh-surface-solid);
  box-shadow: var(--fresh-shadow-lg);
}

.hero-shot-mobile {
  width: 100%;
  height: auto;
  border: 2px solid var(--fresh-ink);
  border-radius: var(--fresh-radius-md);
  box-shadow: var(--fresh-shadow-md);
  transform: rotate(-1.5deg);
}

.hero-shot-back {
  top: 0;
  right: -2rem;
  transform: rotate(4deg);
}

.hero-shot-front {
  top: 11rem;
  left: 0;
  transform: rotate(-3deg);
}

.hero-sticker {
  position: absolute;
  right: 0.5rem;
  bottom: 0;
  border-radius: 999px;
  background: var(--fresh-ink);
  padding: 0.6rem 1rem;
  color: var(--fresh-bg);
  font-size: 0.85rem;
  font-weight: 700;
  transform: rotate(-5deg);
}

.hero-proof {
  border-top: 2px solid var(--fresh-rule);
  border-bottom: 2px solid var(--fresh-rule);
}

.hero-proof-item {
  padding: 1.75rem 0;
}

.hero-proof-item + .hero-proof-item {
  border-top: 1px solid var(--fresh-border);
}

@media (min-width: 48rem) {
  .hero-proof-item {
    padding: 2rem 2rem 2.25rem;
  }

  .hero-proof-item:first-child {
    padding-left: 0;
  }

  .hero-proof-item:last-child {
    padding-right: 0;
  }

  .hero-proof-item + .hero-proof-item {
    border-top: 0;
    border-left: 1px solid var(--fresh-border);
  }
}

.proof-figure {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: 0 0.6rem;
  color: var(--fresh-ink);
  font-size: clamp(2.5rem, 1.4rem + 2.6vw, 3.75rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.035em;
}

.proof-figure small {
  margin-left: 0.15rem;
  font-family: var(--font-body);
  font-size: 0.4em;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.proof-before {
  color: var(--fresh-muted);
  font-size: 0.5em;
  font-weight: 400;
  letter-spacing: 0;
  text-decoration-color: var(--fresh-accent);
  text-decoration-thickness: 3px;
}

.proof-arrow {
  color: var(--fresh-accent);
  font-size: 0.4em;
  letter-spacing: 0;
}
</style>
