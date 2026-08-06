<template>
  <div class="app-root">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-black accent-bg focus:outline-none"
    >
      본문으로 건너뛰기
    </a>

    <ScrollProgress />
    <div class="cursor-spotlight" aria-hidden="true" />
    <Navbar @scroll-to-section="scrollToSection" />
    <main id="main" class="portfolio-flow">
      <HomeView @scroll-to-section="scrollToSection" />
      <ProfileCard />
      <ProjectsView />
      <ExperienceView />
      <EducationView />
      <TechStackView />
      <ContactView />
    </main>
    <Footer />
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import Navbar from "@/components/Navbar.vue";
import HomeView from "@/views/HomeView.vue";
import ProfileCard from "@/components/ProfileCard.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import ExperienceView from "@/views/ExperienceView.vue";
import EducationView from "@/views/EducationView.vue";
import TechStackView from "@/views/TechStackView.vue";
import ContactView from "@/views/ContactView.vue";
import Footer from "@/components/Footer.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import ScrollProgress from "@/components/ScrollProgress.vue";

let cleanup: (() => void) | undefined;

onMounted(() => {
  document.documentElement.dataset.theme = "light";
  document.documentElement.dataset.skin = "default";
  document.documentElement.style.colorScheme = "light";
  localStorage.removeItem("portfolio-theme");
  localStorage.removeItem("portfolio-skin");

  const handleMouseMove = (event: MouseEvent) => {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
  };
  window.addEventListener("mousemove", handleMouseMove, { passive: true });

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

  const initialHash = window.location.hash.slice(1);
  if (initialHash) {
    const target = document.getElementById(initialHash);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "instant" as ScrollBehavior }), 80);
    }
  }

  cleanup = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    observer.disconnect();
  };
});

onBeforeUnmount(() => cleanup?.());

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    const hash = id === "hero" ? "" : `#${id}`;
    history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
  }
};
</script>
