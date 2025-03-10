<script setup lang="ts">
defineProps({
  title: String,
  time: String,
  description: String,
});
</script>

<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-2/3 text-left">
    <h3 class="text-2xl font-bold text-green-400">{{ title }}</h3>
    <p class="text-gray-400 text-sm">{{ time }}</p>
    <p class="text-white mt-2">{{ description }}</p>
  </div>
</template>
