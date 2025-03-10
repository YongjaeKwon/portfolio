<template>
  <section
    id="home"
    class="flex flex-col items-center text-center px-8 py-20 min-h-screen"
  >
    <h2 class="text-5xl font-bold text-white mb-4">
      <span v-html="displayText"></span><span class="blinking-cursor">|</span>
    </h2>
    <h3 class="text-5xl font-bold text-green-400 mb-6 animate-glow">
      BUILD YOUR FUTURE
    </h3>
    <p class="text-lg text-gray-300 max-w-2xl">
      Welcome to my portfolio. Explore my projects and skills in frontend and
      backend development.
    </p>
    <button
      class="mt-6 px-6 py-3 bg-green-500 text-black font-bold rounded-lg shadow-lg hover:bg-green-400 transition-transform transform hover:scale-110"
      @click="$emit('scroll-to-section', 'projects')"
    >
      Explore My Work
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const fullText = "CREATE YOUR JOURNEY";
const displayText = ref("");
let index = 0;

onMounted(() => {
  const typingEffect = setInterval(() => {
    if (index < fullText.length) {
      displayText.value += fullText[index];
      index++;
    } else {
      clearInterval(typingEffect);
    }
  }, 100);
});
</script>

<style scoped>
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.blinking-cursor {
  display: inline-block;
  margin-left: 5px;
  font-weight: bold;
  color: white;
  animation: blink 1s step-end infinite;
}

@keyframes textGlow {
  0% {
    text-shadow: 0 0 10px #00ff7f;
  }
  50% {
    text-shadow: 0 0 20px #00ff7f;
  }
  100% {
    text-shadow: 0 0 10px #00ff7f;
  }
}

.animate-glow {
  animation: textGlow 1.5s infinite alternate;
}
</style>
