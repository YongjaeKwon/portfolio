<template>
  <div
    class="scroll-progress"
    :style="{ width: '100%', transform: `scaleX(${progress})` }"
    role="presentation"
    aria-hidden="true"
  ></div>
</template>

<script setup lang="ts">
import { useScrollMetrics } from "@/composables/useScrollMetrics";

const { progress } = useScrollMetrics();
</script>
