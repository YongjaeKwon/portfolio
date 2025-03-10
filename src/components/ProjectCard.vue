<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  image: String,
});
</script>

<template>
  <div
    class="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
  >
    <img :src="image" class="w-full h-48 object-cover rounded-md mb-4" />
    <h3 class="text-xl font-bold text-white">{{ title }}</h3>
    <p class="text-gray-400">{{ description }}</p>
  </div>
</template>
