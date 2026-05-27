<template>
  <div class="app-root">
    <Navbar
      :theme="theme"
      @toggle-theme="toggleTheme"
      @scroll-to-section="scrollToSection"
    />
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
import { onMounted, ref, watch } from "vue";
import Navbar from "@/components/Navbar.vue";
import HomeView from "@/views/HomeView.vue";
import ProfileCard from "@/components/ProfileCard.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import ExperienceView from "@/views/ExperienceView.vue";
import TechStackView from "@/views/TechStackView.vue";
import EducationView from "@/views/EducationView.vue";
import Footer from "@/components/Footer.vue";

type Theme = "dark" | "light";

const theme = ref<Theme>("dark");

const applyTheme = (nextTheme: Theme) => {
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
};

onMounted(() => {
  const savedTheme = localStorage.getItem("portfolio-theme") as Theme | null;
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

  theme.value = savedTheme === "light" || savedTheme === "dark" ? savedTheme : preferredTheme;
  applyTheme(theme.value);
});

watch(theme, (nextTheme) => {
  applyTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
};

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};
</script>
