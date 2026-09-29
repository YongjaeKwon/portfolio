<template>
  <header ref="headerRef" class="site-header fresh-nav fixed top-0 z-50 w-full px-4 py-3">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <button
        type="button"
        class="focus-ring group flex items-center gap-3 rounded-full text-left"
        :aria-label="t('첫 화면으로 이동', 'Go to the top')"
        @click="moveToSection('hero')"
      >
        <span
          class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--fresh-border)] bg-white transition-transform duration-200 group-hover:-translate-y-0.5"
          aria-hidden="true"
        >
          <img src="/brand/yongjae-mark.svg" alt="" width="30" height="30" />
        </span>
        <span>
          <span class="text-primary block text-base font-black leading-none tracking-[-0.02em]">{{ profile.name }}</span>
          <span class="text-muted font-display mt-1 hidden text-xs sm:block">Web Developer</span>
        </span>
      </button>

      <div class="flex items-center gap-2">
        <nav class="hidden items-center gap-1 md:flex" :aria-label="t('주요 섹션', 'Main sections')">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            :class="[
              'focus-ring font-display px-3 py-2 text-sm font-semibold transition',
              activeSection === item.id
                ? 'nav-active'
                : 'text-muted hover:text-[var(--text-primary)]',
            ]"
            @click="moveToSection(item.id)"
          >
            {{ item.label }}
          </button>
        </nav>

        <button
          type="button"
          class="focus-ring nav-panel fresh-card text-muted inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 py-2 text-xs font-black tracking-wide transition hover:text-[var(--accent-strong)]"
          :aria-label="t('English 페이지로 전환', 'Switch to the Korean page')"
          @click="switchLocale(isEn ? 'ko' : 'en')"
        >
          {{ isEn ? "한국어" : "EN" }}
        </button>

        <button
          ref="mobileMenuToggle"
          type="button"
          class="focus-ring nav-panel fresh-card text-primary inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 py-2 text-sm font-semibold md:hidden"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-navigation"
          :aria-label="isMenuOpen ? t('메뉴 닫기', 'Close menu') : t('메뉴 열기', 'Open menu')"
          @click="toggleMenu"
        >
          <X v-if="isMenuOpen" class="h-4 w-4" />
          <Menu v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <Transition name="menu-down">
      <nav
        v-if="isMenuOpen"
        id="mobile-navigation"
        class="surface fresh-card mx-auto mt-3 grid max-w-6xl gap-1 rounded-lg p-2 md:hidden"
        :aria-label="t('모바일 주요 섹션', 'Main sections (mobile)')"
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
import { Menu, X } from "@lucide/vue";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useScrollMetrics } from "@/composables/useScrollMetrics";
import { profile } from "@/data/portfolio";
import { isEn, switchLocale, t } from "@/i18n/locale";
import { resolveActiveSectionFromEntries } from "@/utils/scrollMetrics";

const emit = defineEmits<{
  "scroll-to-section": [id: string];
}>();

const isMenuOpen = ref(false);
const mobileMenuToggle = ref<HTMLButtonElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);

// 열린 메뉴는 Esc나 바깥 탭으로 닫는다.
const closeMenuOnEscape = (event: KeyboardEvent) => {
  if (event.key !== "Escape") return;
  isMenuOpen.value = false;
  mobileMenuToggle.value?.focus({ preventScroll: true });
};
const closeMenuOnOutsidePointer = (event: PointerEvent) => {
  if (!headerRef.value?.contains(event.target as Node)) isMenuOpen.value = false;
};
watch(isMenuOpen, (open) => {
  if (open) {
    document.addEventListener("keydown", closeMenuOnEscape);
    document.addEventListener("pointerdown", closeMenuOnOutsidePointer);
  } else {
    document.removeEventListener("keydown", closeMenuOnEscape);
    document.removeEventListener("pointerdown", closeMenuOnOutsidePointer);
  }
});
const activeSection = ref("hero");
const navItems = [
  { id: "hero", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "techstack", label: "Tech" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const sectionIds = navItems.map((item) => item.id);
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

onBeforeUnmount(() => {
  sectionObserver?.disconnect();
  document.removeEventListener("keydown", closeMenuOnEscape);
  document.removeEventListener("pointerdown", closeMenuOnOutsidePointer);
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const moveToSection = (section: string) => {
  emit("scroll-to-section", section);
};

const mobileMoveToSection = async (section: string) => {
  isMenuOpen.value = false;
  await nextTick();
  mobileMenuToggle.value?.focus({ preventScroll: true });
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
