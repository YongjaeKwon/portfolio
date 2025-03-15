<template>
  <section id="experience" class="py-20 min-h-screen text-center">
    <h2 class="text-4xl font-bold text-green-400 mb-6">Experience</h2>
    <div class="flex flex-col items-center space-y-8">
      <ExperienceItem
        v-for="(exp, index) in experience"
        :key="index"
        :title="exp.title"
        :time="exp.time"
        :description="exp.description"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ExperienceItem from "@/components/ExperienceItem.vue";

const experience = ref([
  {
    title: "Frontend Developer",
    time: "2023 - Present",
    description:
      "Developed interactive UI components and optimized performance.",
  },
  {
    title: "Backend Engineer",
    time: "2021 - 2023",
    description: "Built scalable APIs and managed databases efficiently.",
  },
]);
</script>
