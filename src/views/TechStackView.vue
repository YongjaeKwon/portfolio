<template>
  <section id="techstack" class="py-20 text-center bg-gray-900 text-white">
    <h2
      class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent mb-10"
    >
      기술 스택
    </h2>
    <div class="flex flex-wrap justify-center gap-10 px-8">
      <div
        v-for="stack in techStacks"
        :key="stack.name"
        class="group relative flex flex-col items-center"
      >
        <font-awesome-icon
          :icon="stack.icon"
          class="text-6xl text-gray-400 group-hover:text-green-400 transition-colors duration-300"
        />
        <div
          class="absolute bottom-0 transform translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 transition-all duration-300 bg-gray-800 text-white text-sm py-2 px-4 rounded-md shadow-lg"
        >
          {{ stack.name }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface TechStack {
  name: string;
  icon: string[] | string;
}

const techStacks = ref<TechStack[]>([
  { name: "Vue.js", icon: ["fab", "vuejs"] },
  { name: "React", icon: ["fab", "react"] },
  { name: "Node.js", icon: ["fab", "node-js"] },
  { name: "Python", icon: ["fab", "python"] },
  { name: "Java", icon: ["fab", "java"] },
  { name: "Database", icon: ["fas", "database"] },
]);
</script>

<style scoped>
.group:hover .group-hover\:translate-y-2 {
  transform: translateY(-10px);
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
