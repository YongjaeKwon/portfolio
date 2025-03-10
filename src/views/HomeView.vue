<template>
  <section
    id="hero"
    class="relative flex flex-col items-center justify-center text-center min-h-screen bg-gray-950 text-white overflow-hidden pt-32"
  >
    <div class="relative inset-0 overflow-hidden">
      <div
        class="relative inset-0 bg-gradient-to-b from-gray-900 to-gray-950 opacity-80"
      ></div>
    </div>

    <div
      class="relative flex flex-col items-center transition-all duration-1000 ease-in-out transform"
      :class="{ 'translate-y-[-100px] scale-90': showImage }"
    >
      <h1
        class="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6 transition-all duration-1000"
        :class="{ 'text-4xl': showImage }"
      >
        권용재 | Full-stack Developer
      </h1>
      <h2
        class="flex text-2xl text-gray-400 max-w-3xl mx-auto mb-8 transition-all duration-1000"
        :class="{ 'text-lg': showImage }"
      >
        <span
          class="inline-block overflow-hidden border-r-3 border-gray-400"
          id="typing-text"
        ></span>
        <span
          class="hidden border-r-3 border-gray-400 pr-2"
          id="blinking-cursor"
        ></span>
      </h2>
    </div>

    <!-- 프로필 이미지 -->
    <div class="relative bottom-32 flex justify-center items-center w-full">
      <img
        src="../public/my-photo.jpg"
        alt="Profile Photo"
        class="w-72 h-auto object-cover rounded-full border-4 border-gray-300 shadow-lg opacity-0 transition-all duration-1000 ease-in-out transform translate-y-24"
        :class="{ 'opacity-100 translate-y-0': showImage }"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const fullText: string =
  "사용자 중심의 직관적이고 인터랙티브한 웹 개발을 추구합니다.";
const displayText = ref<string>("");
const showImage = ref<boolean>(false);
const showButtons = ref<boolean>(false);
let index: number = 0;

onMounted(() => {
  const target = document.getElementById("typing-text");
  const cursor = document.getElementById("blinking-cursor");
  if (!target) return;
  if (!cursor) return;
  const typingEffect: NodeJS.Timeout = setInterval(() => {
    if (index < fullText.length) {
      displayText.value += fullText[index];
      target.textContent = displayText.value;
      index++;
    } else {
      clearInterval(typingEffect);
      target.classList.remove("border-gray-400");
      target.classList.remove("border-r-3");
      cursor.classList.add("blinking-cursor");
      setTimeout(() => {
        showImage.value = true;
        setTimeout(() => {
          showButtons.value = true;
        }, 2000); // 2초 후 버튼 등장
      }, 1000); // 1초 후 이미지 등장
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
  animation: blink 1s step-end infinite;
}
</style>
