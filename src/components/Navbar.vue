<template>
  <header class="site-header fixed top-0 z-50 w-full px-4 py-3 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <button
        type="button"
        class="focus-ring group flex items-center gap-3 rounded-md text-left"
        aria-label="첫 화면으로 이동"
        @click="moveToSection('hero')"
      >
        <span class="accent-soft grid h-9 w-9 place-items-center rounded-md border text-sm font-black">
          K
        </span>
        <span>
          <span class="text-primary block text-sm font-bold leading-none">{{ profile.name }}</span>
          <span class="text-muted mt-1 hidden text-xs sm:block">Frontend Engineer</span>
        </span>
      </button>

      <div class="flex items-center gap-2">
        <nav class="nav-panel hidden items-center gap-1 rounded-md p-1 md:flex" aria-label="주요 섹션">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            class="focus-ring text-muted rounded px-3 py-2 text-sm font-semibold transition hover:bg-black/5 hover:text-[var(--accent-strong)]"
            @click="moveToSection(item.id)"
          >
            {{ item.label }}
          </button>
        </nav>

        <button
          type="button"
          class="focus-ring nav-panel text-primary inline-flex h-10 w-10 items-center justify-center rounded-md"
          :aria-label="theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'"
          @click="emit('toggle-theme')"
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
          Menu
        </button>
      </div>
    </div>

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
        class="text-secondary rounded-md px-3 py-3 text-left text-sm font-semibold hover:bg-black/5"
        @click="mobileMoveToSection(item.id)"
      >
        {{ item.label }}
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { Moon, Sun } from "@lucide/vue";
import { ref } from "vue";
import { profile } from "@/data/portfolio";

defineProps<{
  theme: "dark" | "light";
}>();

const emit = defineEmits<{
  "scroll-to-section": [id: string];
  "toggle-theme": [];
}>();

const isMenuOpen = ref(false);
const navItems = [
  { id: "profile", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "techstack", label: "Tech" },
  { id: "contact", label: "Contact" },
];

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
