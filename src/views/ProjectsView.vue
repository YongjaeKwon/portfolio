<template>
  <section id="projects" class="py-20 min-h-screen text-center">
    <h2 class="text-4xl font-bold text-green-400 mb-6">Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="index"
        :title="project.title"
        :description="project.description"
        :image="project.image"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProjectCard from "../components/ProjectCard.vue";

const projects = ref([
  {
    title: "Project 1",
    description: "A cool web app",
    image: "https://via.placeholder.com/300",
  },
  {
    title: "Project 2",
    description: "Another amazing project",
    image: "https://via.placeholder.com/300",
  },
  {
    title: "Project 3",
    description: "Yet another project",
    image: "https://via.placeholder.com/300",
  },
]);
</script>
