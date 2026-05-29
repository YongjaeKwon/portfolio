<template>
  <Transition name="scroll-top">
    <button
      v-if="visible"
      type="button"
      class="focus-ring nav-panel text-primary fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full transition hover:-translate-y-0.5 hover:text-[var(--accent-strong)]"
      aria-label="맨 위로 이동"
      @click="scrollToTop"
    >
      <ChevronUp class="h-5 w-5" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronUp } from "@lucide/vue";

const visible = ref(false);

const handleScroll = () => {
  visible.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", location.pathname);
};

onMounted(() => window.addEventListener("scroll", handleScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));
</script>

<style scoped>
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(0.6rem);
}
</style>
