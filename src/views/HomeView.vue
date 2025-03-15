<template>
  <section
    id="hero"
    class="relative flex flex-col items-center justify-center text-center min-h-screen bg-gray-950 text-white overflow-hidden font-normal"
  >
    <div
      class="relative flex flex-col items-center transition-all duration-1000 ease-in-out transform"
      :class="{ 'translate-y-[-16.18%] scale-[90%]': showImage }"
    >
      <h1
        class="text-5xl md:text-7xl font-extrabold text-white bg-clip-text mb-6 transition-all duration-1000"
        :class="{ 'text-3xl md:text-5xl': showImage }"
      >
        권용재
      </h1>
      <h1
        class="text-xl md:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent mb-6 transition-all duration-1000"
        :class="{ 'text-lg md:text-2xl': showImage }"
      >
        / Front-End Developer /
      </h1>

      <h2
        class="flex text-md md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 transition-all duration-1000 font-medium"
        :class="{ 'text-sm md:text-lg': showImage }"
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
    <div class="relative flex justify-center items-center w-full">
      <img
        src="../public/my-photo.jpg"
        alt="Profile Photo"
        class="w-48 md:w-72 h-auto object-cover rounded-full border-4 border-gray-300 shadow-lg opacity-0 transition-all duration-1000 ease-in-out transform"
        :class="{ 'opacity-100 translate-y-0': showImage }"
      />
    </div>
    <div
      class="absolute bottom-[3rem] left-[90%] md:left-[95%] translate-x-[-50%] z-[20] flex flex-col items-center animate-bounce"
      style="opacity: 1; transform: none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="18"
        viewBox="0 0 28 17"
        fill="none"
      >
        <path
          d="M26 2L14 14L2 2"
          stroke="#fff"
          stroke-width="3"
          stroke-linecap="round"
        ></path></svg
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="18"
        viewBox="0 0 28 17"
        fill="none"
      >
        <path
          d="M26 2L14 14L2 2"
          stroke="#fff"
          stroke-width="3"
          stroke-linecap="round"
        ></path>
      </svg>
      scroll
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const fullText: string =
  "사용자 중심의 직관적이고 인터랙티브한 웹 개발을 추구합니다.";
const displayText = ref<string>("");
const showImage = ref<boolean>(false);
let index: number = 0;

onMounted(() => {
  const target = document.getElementById("typing-text");
  const cursor = document.getElementById("blinking-cursor");
  if (!target) return;
  if (!cursor) return;
  const typingEffect: ReturnType<typeof setInterval> = setInterval(() => {
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
