<template>
  <header class="site-header fresh-nav fixed top-0 z-50 w-full px-4 py-3 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <button
        type="button"
        class="focus-ring group flex items-center gap-3 rounded-full text-left"
        aria-label="첫 화면으로 이동"
        @click="moveToSection('hero')"
      >
        <span>
          <span class="text-primary block text-sm font-bold leading-none">{{ profile.name }}</span>
          <span class="text-muted font-display mt-1 hidden text-xs sm:block">Web Developer</span>
        </span>
      </button>

      <div class="flex items-center gap-2">
        <nav class="nav-panel fresh-card hidden items-center gap-1 rounded-full p-1 md:flex" aria-label="주요 섹션">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            :class="[
              'focus-ring font-display rounded-full px-3 py-2 text-sm font-medium transition',
              activeSection === item.id
                ? 'nav-active'
                : 'text-muted hover:bg-black/5 hover:text-[var(--accent-strong)]',
            ]"
            @click="moveToSection(item.id)"
          >
            {{ item.label }}
          </button>
        </nav>

        <button
          type="button"
          class="focus-ring nav-panel fresh-card text-primary rounded-full px-3 py-2 text-sm font-semibold md:hidden"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-navigation"
          aria-label="메뉴 열기"
          @click="toggleMenu"
        >
          <Menu class="h-4 w-4" />
        </button>
      </div>
    </div>

    <Transition name="menu-down">
      <nav
        v-if="isMenuOpen"
        id="mobile-navigation"
        class="surface fresh-card mx-auto mt-3 grid max-w-6xl gap-1 rounded-3xl p-2 md:hidden"
        aria-label="모바일 주요 섹션"
      >
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          :class="[
            'rounded-md px-3 py-3 text-left text-sm font-semibold',
            activeSection === item.id
              ? 'nav-active'
              : 'text-secondary hover:bg-black/5',
          ]"
          @click="mobileMoveToSection(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { Menu } from "@lucide/vue";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useScrollMetrics } from "@/composables/useScrollMetrics";
import { profile } from "@/data/portfolio";
import { resolveActiveSectionFromEntries } from "@/utils/scrollMetrics";

const emit = defineEmits<{
  "scroll-to-section": [id: string];
}>();

const isMenuOpen = ref(false);
const activeSection = ref("hero");
const navItems = [
  { id: "profile", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "techstack", label: "Tech" },
  { id: "contact", label: "Contact" },
];

const sectionIds = ["hero", ...navItems.map((item) => item.id)];
const { isAtBottom } = useScrollMetrics();
const observerActiveSection = ref("hero");
let sectionObserver: IntersectionObserver | null = null;

onMounted(() => {
  if (!("IntersectionObserver" in window)) return;

  sectionObserver = new IntersectionObserver(
    (entries) => {
      observerActiveSection.value = resolveActiveSectionFromEntries(
        sectionIds,
        entries.map((entry) => ({
          id: entry.target.id,
          top: entry.boundingClientRect.top,
          bottom: entry.boundingClientRect.bottom,
          isIntersecting: entry.isIntersecting,
        })),
        observerActiveSection.value,
        110,
      );
      if (!isAtBottom.value) activeSection.value = observerActiveSection.value;
    },
    { rootMargin: "-110px 0px 0px 0px", threshold: 0 },
  );

  for (const id of sectionIds) {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  }
});

watch(isAtBottom, (atBottom) => {
  activeSection.value = atBottom
    ? sectionIds[sectionIds.length - 1]
    : observerActiveSection.value;
});

onBeforeUnmount(() => sectionObserver?.disconnect());

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const moveToSection = (section: string) => {
  emit("scroll-to-section", section);
};

const mobileMoveToSection = (section: string) => {
  isMenuOpen.value = false;
  moveToSection(section);
};
</script>

<style scoped>
.menu-down-enter-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.menu-down-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.menu-down-enter-from,
.menu-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
