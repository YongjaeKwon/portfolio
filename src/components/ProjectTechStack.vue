<template>
  <dl class="grid gap-2 text-sm leading-6">
    <div v-for="line in usage" :key="line" class="grid gap-x-3 sm:grid-cols-[7rem_1fr]">
      <dt class="text-muted font-semibold">{{ line.slice(0, line.indexOf(':')) }}</dt>
      <dd class="text-secondary font-medium">{{ line.slice(line.indexOf(':') + 1).trim() }}</dd>
    </div>
  </dl>
</template>

<script setup lang="ts">
defineProps<{ usage: string[] }>();
</script>
