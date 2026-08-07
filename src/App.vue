<template>
  <div class="app-root">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-black accent-bg focus:outline-none"
    >
      본문으로 건너뛰기
    </a>

    <ScrollProgress />
    <div ref="cursorSpotlight" class="cursor-spotlight" aria-hidden="true" />
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
import { onBeforeUnmount, onMounted, ref } from "vue";
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
import { createLatestFrameScheduler } from "@/utils/frameScheduler";
import {
  createSectionNavigator,
  type SectionScrollBehavior,
} from "@/utils/sectionNavigation";

let cleanup: (() => void) | undefined;
let initialHashTimer: number | null = null;
const cursorSpotlight = ref<HTMLElement | null>(null);

const cursorScheduler = createLatestFrameScheduler(({ x, y }: { x: number; y: number }) => {
  cursorSpotlight.value?.style.setProperty(
    "transform",
    `translate3d(${x - 600}px, ${y - 600}px, 0)`,
  );
});
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
  document.documentElement.dataset.theme = "light";
  document.documentElement.dataset.skin = "default";
  document.documentElement.style.colorScheme = "light";
  localStorage.removeItem("portfolio-theme");
  localStorage.removeItem("portfolio-skin");

  const hoverPointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pointerListenerActive = false;
  const handlePointerMove = (event: PointerEvent) => {
    cursorScheduler.schedule({ x: event.clientX, y: event.clientY });
  };
  const reconcilePointerEffects = () => {
    const pointerEffectsEnabled = hoverPointerQuery.matches && !reducedMotionQuery.matches;
    if (pointerEffectsEnabled && !pointerListenerActive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      pointerListenerActive = true;
    } else if (!pointerEffectsEnabled) {
      window.removeEventListener("pointermove", handlePointerMove);
      pointerListenerActive = false;
      cursorScheduler.cancel();
      cursorSpotlight.value?.style.setProperty(
        "transform",
        "translate3d(-1200px, -1200px, 0)",
      );
    }
  };
  hoverPointerQuery.addEventListener("change", reconcilePointerEffects);
  reducedMotionQuery.addEventListener("change", reconcilePointerEffects);
  reconcilePointerEffects();

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
    hoverPointerQuery.removeEventListener("change", reconcilePointerEffects);
    reducedMotionQuery.removeEventListener("change", reconcilePointerEffects);
    window.removeEventListener("pointermove", handlePointerMove);
    pointerListenerActive = false;
    cursorScheduler.cancel();
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
