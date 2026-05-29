<template>
  <header class="site-header fixed top-0 z-50 w-full px-4 py-3 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <button
        type="button"
        class="focus-ring group flex items-center gap-3 rounded-md text-left"
        aria-label="첫 화면으로 이동"
        @click="moveToSection('hero')"
      >
        <span class="font-display accent-bg grid h-9 w-9 place-items-center rounded-md text-sm font-bold transition group-hover:brightness-110">
          K
        </span>
        <span>
          <span class="text-primary block text-sm font-bold leading-none">{{ profile.name }}</span>
          <span class="text-muted font-display mt-1 hidden text-xs sm:block">Frontend Engineer</span>
        </span>
      </button>

      <div class="flex items-center gap-2">
        <nav class="nav-panel hidden items-center gap-1 rounded-md p-1 md:flex" aria-label="주요 섹션">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            :class="[
              'focus-ring font-display rounded px-3 py-2 text-sm font-medium transition',
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
          class="focus-ring nav-panel text-primary inline-flex h-10 w-10 items-center justify-center rounded-md"
          :aria-label="theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'"
          @click="onToggleTheme"
        >
          <Sun v-if="theme === 'dark'" class="h-4 w-4" />
          <Moon v-else class="h-4 w-4" />
        </button>

        <button
          type="button"
          class="focus-ring nav-panel text-primary rounded-md px-3 py-2 text-sm font-semibold md:hidden"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-navigation"
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
        class="surface mx-auto mt-3 grid max-w-6xl gap-1 rounded-lg p-2 md:hidden"
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
import { Menu, Moon, Sun } from "@lucide/vue";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { profile } from "@/data/portfolio";

defineProps<{
  theme: "dark" | "light";
}>();

const emit = defineEmits<{
  "scroll-to-section": [id: string];
  "toggle-theme": [origin?: { x: number; y: number }];
}>();

const onToggleTheme = (e: MouseEvent) => {
  emit("toggle-theme", { x: e.clientX, y: e.clientY });
};

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

const sectionIds = ["hero", ...navItems.map((n) => n.id)];

// 스크롤 위치 기반 활성 섹션 추적 — 헤더 아래 기준선을 지난 마지막 섹션을 활성화
let ticking = false;

const updateActive = () => {
  ticking = false;
  const line = 110; // 고정 헤더 높이 + 여유
  let current = sectionIds[0];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) current = id;
  }
  // 페이지 맨 아래에 도달하면 마지막 섹션을 강제 활성화
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) current = sectionIds[sectionIds.length - 1];

  activeSection.value = current;
};

const onScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateActive);
  }
};

onMounted(() => {
  updateActive();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
});

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
