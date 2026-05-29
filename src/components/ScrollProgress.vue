<template>
  <div
    class="scroll-progress"
    :style="{ width: '100%', transform: `scaleX(${progress})` }"
    role="presentation"
    aria-hidden="true"
  ></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const progress = ref(0);
let ticking = false;

const update = () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  progress.value = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
  ticking = false;
};

const onScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
};

onMounted(() => {
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
});
</script>
