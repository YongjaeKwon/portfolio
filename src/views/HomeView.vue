<template>
  <section
    id="home"
    class="relative flex flex-col items-center justify-center text-center min-h-screen bg-gray-900 text-white overflow-hidden transition-opacity duration-1000 entrance-animation"
  >
    <!-- 배경 애니메이션 추가 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="neon-thorns"></div>
    </div>

    <div class="relative z-10">
      <h1 class="text-6xl font-extrabold text-white mb-4">
        <span class="typewriter">CREATE YOUR JOURNEY</span>
      </h1>
      <h2 class="text-4xl font-bold text-white animate-glow">
        BUILD YOUR FUTURE
      </h2>

      <p class="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
        창의적인 사고와 과감한 도전으로 새로운 가능성을 탐구합니다.<br />
        기술로 세상을 더 나은 방향으로 변화시키는 것을 목표로 합니다.
      </p>

      <div class="flex space-x-4 justify-center">
        <button
          class="px-6 py-3 bg-green-400 text-black font-bold rounded-lg shadow-lg hover:scale-105 transition-transform entrance-button"
          @click="$emit('scroll-to-section', 'techstack')"
        >
          Stacks
        </button>
        <button
          class="px-6 py-3 bg-purple-400 text-black font-bold rounded-lg shadow-lg hover:scale-105 transition-transform entrance-button"
          @click="$emit('scroll-to-section', 'projects')"
        >
          Projects
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// const fullText = "하이";
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

  document.body.classList.add("fade-in");
});
</script>

<style scoped>
@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.typewriter {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid white;
  animation: typewriter 3s steps(30, end) forwards;
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

@keyframes entranceEffect {
  0% {
    opacity: 0;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.entrance-animation {
  animation: entranceEffect 1.5s ease-in-out;
}

@keyframes entranceButtonEffect {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.entrance-button {
  animation: entranceButtonEffect 1.2s ease-in-out forwards;
}
</style>
