<template>
  <footer class="border-t border-[var(--border)] px-6 py-6">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-muted text-sm">© 2026 {{ profile.name }} · {{ activeTrackData.role }}</p>
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
          :href="`mailto:${profile.email}`"
        >
          이메일
        </a>
        <span class="text-muted/50 text-xs select-none" aria-hidden="true">·</span>
        <a
          class="focus-ring text-muted text-sm font-semibold transition hover:text-[var(--accent-strong)]"
          :href="activeTrackData.resume"
          download
        >
          이력서
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { focusTracks, profile } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";

const { activeTrack } = useFocusTrack();
const activeTrackData = computed(
  () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]
);
</script>
