<template>
  <div class="app-root">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-black accent-bg focus:outline-none"
    >
      {{ t("본문으로 건너뛰기", "Skip to main content") }}
    </a>

    <ScrollProgress />
    <Navbar @scroll-to-section="scrollToSection" />
    <main id="main" class="portfolio-flow">
      <HomeView @scroll-to-section="scrollToSection" />
      <TechStackView />
      <ExperienceView />
      <ProjectsView />
      <EducationView />
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
import TechStackView from "@/views/TechStackView.vue";
import ExperienceView from "@/views/ExperienceView.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import EducationView from "@/views/EducationView.vue";
import ContactView from "@/views/ContactView.vue";
import Footer from "@/components/Footer.vue";
import ScrollToTop from "@/components/ScrollToTop.vue";
import ScrollProgress from "@/components/ScrollProgress.vue";
import {
  createSectionNavigator,
  type SectionScrollBehavior,
} from "@/utils/sectionNavigation";
import { locale, t } from "@/i18n/locale";

if (typeof document !== "undefined") {
  document.documentElement.lang = locale;
  document.title = t("권용재 | Web Developer Portfolio", "Yongjae Kwon | Web Developer Portfolio");
}

let cleanup: (() => void) | undefined;
let initialHashTimer: number | null = null;
const sectionNavigator = createSectionNavigator();

const cancelInitialHashNavigation = () => {
  if (initialHashTimer === null) return;
  clearTimeout(initialHashTimer);
  initialHashTimer = null;
};

const scrollSectionIntoView = (section: HTMLElement, behavior: SectionScrollBehavior) => {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>(".portfolio-flow > section"),
  );
  sectionNavigator.navigate(sections, section, behavior);
};

onMounted(() => {
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
      initialHashTimer = window.setTimeout(() => {
        initialHashTimer = null;
        scrollSectionIntoView(target, "instant");
      }, 80);
    }
  }

  cleanup = () => {
    cancelInitialHashNavigation();
    sectionNavigator.cancel();
    observer.disconnect();
  };
});

onBeforeUnmount(() => cleanup?.());

const scrollToSection = (id: string) => {
  cancelInitialHashNavigation();
  const section = document.getElementById(id);
  if (section) {
    scrollSectionIntoView(section, "smooth");
    const hash = id === "hero" ? "" : `#${id}`;
    history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
  }
};
</script>
