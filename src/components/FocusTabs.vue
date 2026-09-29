<template>
  <div class="inline-flex max-w-full gap-1" role="group" :aria-label="t('직무별 내용 보기', 'View by role')">
    <button
      v-for="track in focusTracks"
      :key="track.id"
      type="button"
      :aria-pressed="activeTrack === track.id"
      :class="[
        'focus-ring min-h-11 px-3 text-sm font-bold transition-colors sm:px-4',
        activeTrack === track.id
          ? 'text-[var(--fresh-ink)] shadow-[inset_0_-2px_0_var(--fresh-accent)]'
          : 'text-secondary hover:text-[var(--fresh-ink)]',
      ]"
      @click="setActiveTrack(track.id)"
    >
      {{ track.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { focusTracks } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { t } from "@/i18n/locale";

const { activeTrack, setActiveTrack } = useFocusTrack();
</script>
