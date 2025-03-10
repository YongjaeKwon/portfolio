<!-- EducationView.vue -->
<template>
  <section id="education" class="py-20 min-h-screen text-center">
    <h2 class="text-4xl font-bold text-green-400 mb-6">Education</h2>
    <div class="relative w-2/3 mx-auto">
      <div v-for="(edu, index) in education" :key="index" class="timeline-item">
        <div
          class="timeline-content"
          :class="{ left: index % 2 === 0, right: index % 2 !== 0 }"
        >
          <h3 class="text-2xl font-bold text-green-400">{{ edu.title }}</h3>
          <p class="text-gray-400 text-sm">{{ edu.time }}</p>
          <p class="text-white mt-2">{{ edu.description }}</p>
        </div>
      </div>
      <div class="timeline-line"></div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const education = ref([
  {
    title: "Samsung SW Academy for Youth (SSAFY)",
    time: "2022 - 2023",
    description: "Learned full-stack development with Vue.js and Spring Boot.",
  },
  {
    title: "University of XYZ",
    time: "2018 - 2022",
    description:
      "Studied Computer Science focusing on algorithms and web technologies.",
  },
  {
    title: "Udemy & Coursera Certifications",
    time: "2021 - Present",
    description: "Completed courses in Advanced React, Kubernetes, and DevOps.",
  },
]);
</script>

<style scoped>
.timeline-item {
  position: relative;
  padding: 20px;
  width: 50%;
}
.timeline-item.left {
  left: 0;
  text-align: right;
}
.timeline-item.right {
  left: 50%;
  text-align: left;
}
.timeline-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 100%;
  background: #00ff7f;
  transform: translateX(-50%);
}
</style>
