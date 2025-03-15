<template>
  <div class="bg-black text-white min-h-screen flex flex-col relative">
    <Navbar @scroll-to-section="scrollToSection" />
    <HomeView @scroll-to-section="scrollToSection" />
    <ProfileCard />
    <ProjectsView />
    <ExperienceView />
    <EducationView />
    <TechStackView />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
import HomeView from "@/views/HomeView.vue";
import ProfileCard from "@/components/ProfileCard.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import ExperienceView from "@/views/ExperienceView.vue";
import TechStackView from "@/views/TechStackView.vue";
// import EducationView from "./views/EducationView.vue";
import EducationView from "@/views/EducationView.vue";
import Footer from "@/components/Footer.vue";

defineComponent({
  name: "App",
});

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
</script>
