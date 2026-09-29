<template>
  <div class="inline-flex max-w-full rounded-full border-2 border-[var(--fresh-ink)] p-1" role="group" :aria-label="t('직무별 내용 보기', 'View by role')">
    <button
      v-for="track in focusTracks"
      :key="track.id"
      type="button"
      :aria-pressed="activeTrack === track.id"
      :class="[
        'focus-ring rounded-full px-4 py-2 text-sm font-bold transition sm:px-5',
        activeTrack === track.id
          ? 'bg-[var(--fresh-ink)] text-[var(--fresh-bg)]'
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
