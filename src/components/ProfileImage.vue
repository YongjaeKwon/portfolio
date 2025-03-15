<template>
  <div
    class="relative w-40 md:w-56 h-52 md:h-72 border-4 rounded-lg overflow-hidden z-[1] transform scale-90 opacity-0 transition-all duration-1000 ease-in-out"
    :class="{ 'opacity-100 scale-100': isVisible }"
    ref="imageRef"
  >
    <img
      src="../public/my-photo.jpg"
      alt="Profile"
      class="object-cover w-full h-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const isVisible = ref(false);
const imageRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
      }
    },
    { threshold: 0.3 }
  );
  if (imageRef.value) {
    observer.observe(imageRef.value);
  }
});
</script>
