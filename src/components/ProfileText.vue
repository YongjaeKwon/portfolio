<template>
  <div
    class="absolute top-12 flex items-center flex-col mb-20 w-full mt-[calc(100vh-85vh)] max-sm:mt-[calc(100vh-90vh)] opacity-0 transition-all duration-1000 ease-in-out transform"
    :class="{ 'opacity-100 translate-y-0': isVisible }"
    ref="textRef"
  >
    <div class="relative w-full">
      <h2
        class="text-4xl md:text-6xl font-extrabold text-white transition-all duration-1000"
        :class="{
          'text-2xl md:text-3xl translate-y-[-20%] scale-75': showImage,
        }"
      >
        프론트엔드 개발자
      </h2>
      <strong
        class="text-3xl md:text-4xl font-extrabold text-white transition-all duration-1000"
        :class="{
          'text-xl md:text-xl translate-y-[-20%] scale-75': showImage,
        }"
        >권용재 입니다.</strong
      >
      <p
        class="absolute text-[4rem] md:text-[10rem] left-0 w-full font-bold text-white opacity-0 transition-all duration-1000"
        :class="{
          'opacity-20 translate-y-[-100%] md:translate-y-[-100%] scale-100':
            showImage,
        }"
      >
        Front-End
      </p>
    </div>

    <p class="text-lg text-gray-300 mt-4">
      <span id="typing-text-1"></span>
      <span id="cursor-1" class=""></span>
    </p>

    <p class="text-lg text-gray-300">
      <span id="typing-text-2"></span>
      <span id="cursor-2" class=""></span>
    </p>
    <div
      class="opacity-0 scale-90 transition-all duration-1000 ease-in-out delay-1000"
      :class="{ 'opacity-100 scale-100': showImage }"
    >
      <img
        src="../public/my-photo.png"
        alt="Profile Photo"
        class="w-72 h-auto object-cover rounded-full shadow-lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const isVisible = ref(false);
const textRef = ref<HTMLElement | null>(null);
const showImage = ref(false);

const sentence1 = "사용자를 생각하는 '역지사지' 마인드,";
const sentence2 = "포기하지 않고 '책임감' 있게 일하는 개발자입니다.";

let index1 = 0;
let index2 = 0;

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        startTypingEffect();
      }
    },
    { threshold: 0.3 }
  );

  if (textRef.value) {
    observer.observe(textRef.value);
  }
});

const startTypingEffect = () => {
  const target1 = document.getElementById("typing-text-1");
  const cursor1 = document.getElementById("cursor-1");
  const target2 = document.getElementById("typing-text-2");
  const cursor2 = document.getElementById("cursor-2");
  let quoteCnt1 = 0;
  let quoteCnt2 = 0;
  if (!target1 || !cursor1 || !target2 || !cursor2) return;

  // 첫 번째 문장
  const typingEffect1 = setInterval(() => {
    if (sentence1[index1] == "'") {
      quoteCnt1 += 1;
    }
    if (index1 < sentence1.length) {
      if (quoteCnt1 == 1) {
        target1.innerHTML += `<span class="text-green-400 font-bold">${sentence1[index1]}</span>`;
      } else {
        target1.innerHTML += sentence1[index1];
      }
      index1++;
    } else {
      clearInterval(typingEffect1);
      cursor1.classList.add("hidden");

      // 0.5초 후 두 번째 문장 시작
      setTimeout(() => {
        cursor2.classList.remove("hidden");
        const typingEffect2 = setInterval(() => {
          if (sentence2[index2] == "'") {
            quoteCnt2 += 1;
          }
          if (index2 < sentence2.length) {
            if (quoteCnt2 == 1) {
              target2.innerHTML += `<span class="text-purple-400 font-bold">${sentence2[index2]}</span>`;
            } else {
              target2.innerHTML += sentence2[index2];
            }

            index2++;
          } else {
            clearInterval(typingEffect2);
            cursor2.classList.add("hidden");

            // 1초 후 이미지 등장
            setTimeout(() => {
              showImage.value = true;
            }, 1000);
          }
        }, 100);
      }, 500);
    }
  }, 100);
};
</script>
