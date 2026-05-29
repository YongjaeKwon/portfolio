<template>
  <div class="app-root">
    <!-- 접근성: 키보드 사용자를 위한 본문 건너뛰기 -->
    <a
      href="#projects"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-black accent-bg focus:outline-none"
    >
      본문으로 건너뛰기
    </a>

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
    <ContactView />
    <Footer />
    <ScrollToTop />
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
import ContactView from "@/views/ContactView.vue";
import Footer from "@/components/Footer.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";

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

  // Initial hash navigation
  const initialHash = window.location.hash.slice(1);
  if (initialHash) {
    const target = document.getElementById(initialHash);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "instant" as ScrollBehavior }), 80);
    }
  }

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
    history.replaceState(null, "", id === "hero" ? location.pathname : `#${id}`);
  }
};
</script>
