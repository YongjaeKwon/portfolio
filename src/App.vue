<template>
  <div class="app-root">
    <div class="cursor-spotlight" aria-hidden="true" />
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
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
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

  // Cursor spotlight
  const handleMouseMove = (e: MouseEvent) => {
    document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);
  };
  window.addEventListener("mousemove", handleMouseMove, { passive: true });

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    observer.disconnect();
  };
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
