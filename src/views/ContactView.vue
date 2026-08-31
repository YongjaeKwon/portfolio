<template>
  <section id="contact" class="section-tone-blue py-24 md:py-28">
    <div class="section-shell">
      <div class="reveal flex items-center gap-3">
        <span class="section-index">05</span>
        <h2 class="section-kicker">Contact</h2>
      </div>
      <p class="reveal reveal-d2 section-copy">
        {{ t("새로운 기회에 열려 있습니다.", "I'm open to new opportunities.") }}
      </p>

      <div class="reveal reveal-d3 fresh-cta-panel mt-10 rounded-[2rem] p-8">
        <div class="fresh-aurora" aria-hidden="true"></div>

        <h3 class="text-primary text-2xl font-black">{{ t("더 궁금한 내용이 있으시면", "Want to know more?") }}</h3>
        <p class="text-secondary mt-4 max-w-2xl leading-7">
          {{ t("이메일을 보내주시면 확인하는 대로 답변드리겠습니다.", "Send me an email and I'll get back to you as soon as I can.") }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="focus-ring fresh-button inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:brightness-105"
            @click="attemptEmailContact"
          >
            <Mail class="h-4 w-4" />
            {{ t("이메일 보내기", "Send an email") }}
          </button>
          <a
            class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            :href="profile.github"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink class="h-4 w-4" />
            GitHub
          </a>
          <a
            class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            :href="profile.resume"
            download="Yongjae-Kwon-Resume.pdf"
          >
            <FileDown class="h-4 w-4" />
            {{ t("이력서 다운로드", "Download resume") }}
          </a>
        </div>

        <div
          v-if="showMailFallback || copyStatus !== 'idle'"
          class="mt-6 rounded-[1.5rem] border border-[var(--fresh-border)] bg-white/70 p-5 shadow-sm"
        >
          <p class="text-primary text-sm font-black">{{ t("메일 앱이 열리지 않나요?", "Mail app didn't open?") }}</p>
          <p class="text-secondary mt-2 text-sm leading-6">
            {{ t("Gmail로 바로 작성하거나 메일 주소를 복사해서 사용해 주세요.", "Compose directly in Gmail or copy the email address instead.") }}
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <a
              class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
              :href="gmailComposeUrl"
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink class="h-4 w-4" />
              {{ t("Gmail로 작성하기", "Compose in Gmail") }}
            </a>
            <button
              type="button"
              class="focus-ring fresh-button-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
              @click="copyEmailAddress"
            >
              <Copy class="h-4 w-4" />
              {{ copyButtonLabel }}
            </button>
          </div>
          <p class="text-muted mt-3 text-sm">{{ profile.email }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Copy, ExternalLink, FileDown, Mail } from "@lucide/vue";
import { computed, onBeforeUnmount, ref } from "vue";
import { profile } from "@/data/portfolio";
import { t } from "@/i18n/locale";
import {
  createGmailComposeUrl,
  createMailtoUrl,
  MAIL_FALLBACK_DELAY_MS,
  shouldShowMailFallback,
} from "@/utils/contactEmail";

const showMailFallback = ref(false);
const mailOpenedExternally = ref(false);
const copyStatus = ref<"idle" | "copied" | "failed">("idle");
const gmailComposeUrl = computed(() => createGmailComposeUrl(profile.email));
const copyButtonLabel = computed(() => {
  if (copyStatus.value === "copied") {
    return t("복사했습니다", "Copied");
  }

  if (copyStatus.value === "failed") {
    return t("복사 실패", "Copy failed");
  }

  return t("메일 주소 복사", "Copy email address");
});

let fallbackTimer: number | undefined;
let copyResetTimer: number | undefined;

function clearFallbackTimer() {
  if (fallbackTimer !== undefined) {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = undefined;
  }
}

function clearCopyResetTimer() {
  if (copyResetTimer !== undefined) {
    window.clearTimeout(copyResetTimer);
    copyResetTimer = undefined;
  }
}

function removeMailWatchers() {
  window.removeEventListener("blur", markMailOpened);
  window.removeEventListener("pagehide", markMailOpened);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
}

function markMailOpened() {
  mailOpenedExternally.value = true;
  clearFallbackTimer();
  removeMailWatchers();
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    markMailOpened();
  }
}

function attemptEmailContact() {
  showMailFallback.value = false;
  copyStatus.value = "idle";
  mailOpenedExternally.value = false;
  clearFallbackTimer();
  removeMailWatchers();

  window.addEventListener("blur", markMailOpened, { once: true });
  window.addEventListener("pagehide", markMailOpened, { once: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);

  window.location.href = createMailtoUrl(profile.email);

  fallbackTimer = window.setTimeout(() => {
    removeMailWatchers();
    if (shouldShowMailFallback(mailOpenedExternally.value)) {
      showMailFallback.value = true;
    }
  }, MAIL_FALLBACK_DELAY_MS);
}

async function copyEmailAddress() {
  showMailFallback.value = true;
  clearCopyResetTimer();

  const copied = await copyText(profile.email);
  copyStatus.value = copied ? "copied" : "failed";

  copyResetTimer = window.setTimeout(() => {
    copyStatus.value = "idle";
  }, 2200);
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error("Clipboard timeout")), 900)),
      ]);
      return true;
    } catch {
      // Fall back to the legacy copy path below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

onBeforeUnmount(() => {
  clearFallbackTimer();
  clearCopyResetTimer();
  removeMailWatchers();
});
</script>
