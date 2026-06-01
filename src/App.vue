<template>
  <div class="app-root">
    <!-- 접근성: 키보드 사용자를 위한 본문 건너뛰기 -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-black accent-bg focus:outline-none"
    >
      본문으로 건너뛰기
    </a>

    <ScrollProgress />
    <div class="cursor-spotlight" aria-hidden="true" />
    <Navbar
      :theme="theme"
      :skin="skin"
      @toggle-theme="toggleTheme"
      @toggle-skin="toggle"
      @scroll-to-section="scrollToSection"
    />
    <main id="main">
      <HomeView @scroll-to-section="scrollToSection" />
      <ProfileCard />
      <div class="maple-divider" aria-hidden="true" />
      <ProjectsView />
      <div class="maple-divider" aria-hidden="true" />
      <ExperienceView />
      <div class="maple-divider" aria-hidden="true" />
      <EducationView />
      <div class="maple-divider" aria-hidden="true" />
      <TechStackView />
      <div class="maple-divider" aria-hidden="true" />
      <ContactView />
    </main>
    <Footer />
    <ScrollToTop />

    <!-- 🍁 메이플 모드 전용 마스코트 (클릭 시 랜덤 대사) -->
    <button type="button" class="maple-mascot" aria-label="마스코트와 인사하기" @click="pokeMascot">
      <span class="maple-bubble">{{ mascotLine }}</span>
      <span class="maple-mob">🍄</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
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
import ScrollProgress from "@/components/ScrollProgress.vue";
import { useSkin } from "@/composables/useSkin";

type Theme = "dark" | "light";

const theme = ref<Theme>("dark");
const { skin, toggle, set: setSkin } = useSkin();

let cleanup: (() => void) | undefined;

const applyTheme = (nextTheme: Theme) => {
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
};

// ── 마스코트 랜덤 대사 ──
const mascotLines = [
  "반가워요!",
  "이력서 보고 가세요~",
  "프로젝트 구경할래요?",
  "Lv.290 도적이래요!",
  "채용 연락 기다려요 :)",
  "오늘도 좋은 하루!",
];
const mascotLine = ref(mascotLines[0]);
const pokeMascot = () => {
  let next = mascotLine.value;
  while (next === mascotLine.value && mascotLines.length > 1) {
    next = mascotLines[Math.floor(Math.random() * mascotLines.length)];
  }
  mascotLine.value = next;
};

onMounted(() => {
  const savedTheme = localStorage.getItem("portfolio-theme") as Theme | null;
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
  theme.value = savedTheme === "light" || savedTheme === "dark" ? savedTheme : preferredTheme;
  applyTheme(theme.value);

  const savedSkin = localStorage.getItem("portfolio-skin");
  setSkin(savedSkin === "maple" ? "maple" : "default");

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

  cleanup = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    observer.disconnect();
  };
});

onBeforeUnmount(() => cleanup?.());

watch(theme, (nextTheme) => {
  applyTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

watch(
  skin,
  (nextSkin) => {
    document.documentElement.dataset.skin = nextSkin;
    localStorage.setItem("portfolio-skin", nextSkin);
  },
  { immediate: false }
);

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

let themeTransitioning = false;

const toggleTheme = (origin?: { x: number; y: number }) => {
  const next: Theme = theme.value === "dark" ? "light" : "dark";
  const doc = document as ViewTransitionDoc;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 폴백·모션 비선호·이미 전환 중이면 애니메이션 없이 즉시 전환 (연타 경합 방지)
  if (typeof doc.startViewTransition !== "function" || reduced || themeTransitioning) {
    theme.value = next;
    return;
  }
  themeTransitioning = true;

  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 40;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = doc.startViewTransition(() => {
    theme.value = next;
  });

  transition.finished.finally(() => { themeTransitioning = false; });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 450,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
};

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
    const hash = id === "hero" ? "" : `#${id}`;
    history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
  }
};
</script>
