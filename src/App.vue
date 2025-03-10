<template>
  <div class="bg-black text-white min-h-screen flex flex-col relative">
    <Navbar @scroll-to-section="scrollToSection" />
    <HomeView @scroll-to-section="scrollToSection" />
    <TechStackView />
    <ProjectsView />
    <ExperienceView />
    <EducationView />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import Navbar from "./components/Navbar.vue";
import HomeView from "./views/HomeView.vue";
import ProjectsView from "./views/ProjectsView.vue";
import ExperienceView from "./views/ExperienceView.vue";
import TechStackView from "./views/TechStackView.vue";
import EducationView from "./views/EducationView.vue";
import Footer from "./components/Footer.vue";

defineComponent({
  name: "App",
});

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
// onMounted(() => {
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           activeSection.value = entry.target.id;
//         }
//       });
//     },
//     { threshold: 0.6 }
//   );

//   document.querySelectorAll("section").forEach((section) => {
//     observer.observe(section);
//   });
// });
</script>
