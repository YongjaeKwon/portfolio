<template>
  <section
    id="profile"
    class="relative flex flex-col items-center justify-center text-center min-h-screen text-white pt-32 opacity-0 transform translate-y-10 transition-all duration-1000 ease-in-out"
    :class="{ 'opacity-100 translate-y-0': isVisible }"
    ref="profileSection"
  >
    <ProfileText :showImage="showImage" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProfileText from "@/components/ProfileText.vue";

const isVisible = ref<boolean>(false);
const showImage = ref<boolean>(false);
const profileSection = ref<HTMLElement | null>(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        setTimeout(() => {
          showImage.value = true;
        }, 1000); // 1초 후 이미지 등장
      }
    },
    { threshold: 0.3 }
  );
  if (profileSection.value) {
    observer.observe(profileSection.value);
  }
});
</script>
