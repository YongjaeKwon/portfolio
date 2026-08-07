<template>
  <footer class="border-t border-[var(--border)] px-6 py-6">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2.5">
        <span
          class="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[#d7e9ff] bg-white/80"
          aria-hidden="true"
        >
          <img src="/brand/yongjae-mark.svg" alt="" width="22" height="22" />
        </span>
        <p class="text-muted text-sm">© 2026 {{ profile.name }} · Web Developer</p>
      </div>
      <div class="flex items-center gap-4">
        <a
          class="focus-ring text-muted text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          :href="profile.github"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span class="text-muted/50 text-xs select-none" aria-hidden="true">·</span>
        <a
          class="focus-ring text-muted text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          href="#contact"
        >
          이메일
        </a>
        <span class="text-muted/50 text-xs select-none" aria-hidden="true">·</span>
        <a
          class="focus-ring text-muted text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          :href="profile.resume"
          download="Yongjae-Kwon-Resume.pdf"
        >
          이력서 PDF
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { profile } from "@/data/portfolio";
</script>
