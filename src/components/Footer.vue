<template>
  <footer class="border-t border-[var(--border)] px-6 py-6">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2.5">
        <span
          class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--fresh-border)] bg-white"
          aria-hidden="true"
        >
          <img src="/brand/yongjae-mark.svg" alt="" width="22" height="22" />
        </span>
        <p class="text-muted text-sm">© 2026 {{ profile.name }} · Web Developer</p>
      </div>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
        <a
          class="focus-ring text-muted inline-flex min-h-11 items-center text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          :href="profile.github"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span class="text-muted/50 text-xs select-none" aria-hidden="true">·</span>
        <a
          class="focus-ring text-muted inline-flex min-h-11 items-center text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          href="#contact"
        >
          {{ t("이메일", "Email") }}
        </a>
        <span class="text-muted/50 text-xs select-none" aria-hidden="true">·</span>
        <a
          class="focus-ring text-muted inline-flex min-h-11 items-center text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          :href="profile.resume"
          download="Yongjae-Kwon-Resume.pdf"
        >
          {{ t("이력서 PDF", "Resume PDF (Korean)") }}
        </a>
        <span class="text-muted/50 text-xs select-none" aria-hidden="true">·</span>
        <a
          class="focus-ring text-muted inline-flex min-h-11 items-center text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          :href="profile.career"
          download="Yongjae-Kwon-Career.pdf"
        >
          {{ t("경력기술서 PDF", "Career Details PDF (Korean)") }}
        </a>
        <span class="text-muted/50 text-xs select-none" aria-hidden="true">·</span>
        <a
          class="focus-ring text-muted inline-flex min-h-11 items-center text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          :href="profile.portfolio"
          download="Yongjae-Kwon-Portfolio.pdf"
        >
          {{ t("포트폴리오 PDF", "Portfolio PDF (Korean)") }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { profile } from "@/data/portfolio";
import { t } from "@/i18n/locale";

</script>
