<template>
  <section id="techstack" class="py-20 min-h-screen text-center">
    <h2
      class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-6"
    >
      기술 스택
    </h2>
    <div class="flex flex-wrap justify-center gap-8 px-8">
      <div
        v-for="stack in techStacks"
        :key="stack.title"
        class="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform w-52"
      >
        <font-awesome-icon
          :icon="stack.icon"
          class="text-6xl mb-4"
          :class="gradientClass(stack.title)"
        />
        <h3 class="text-xl font-bold" :class="gradientClass(stack.title)">
          {{ stack.title }}
        </h3>
        <ul class="text-gray-400 text-sm space-y-2">
          <li v-for="skill in stack.skills" :key="skill">{{ skill }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faVuejs, faReact, faNodeJs } from "@fortawesome/free-brands-svg-icons";

const techStacks = ref([
  {
    title: "프론트엔드",
    icon: ["fab", "vuejs"],
    skills: [
      "Vue.js",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Next.js",
      "SASS",
      "Vite",
    ],
  },
  {
    title: "백엔드",
    icon: ["fab", "node-js"],
    skills: [
      "Node.js",
      "Express",
      "Spring Boot",
      "Java",
      "NestJS",
      "Django",
      "FastAPI",
    ],
  },
  {
    title: "데이터베이스",
    icon: "database",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase"],
  },
]);

const gradientClass = (title) => {
  return title === "프론트엔드" || title === "데이터베이스"
    ? "bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent"
    : "bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent";
};
</script>

<style scoped>
.bg-clip-text {
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
