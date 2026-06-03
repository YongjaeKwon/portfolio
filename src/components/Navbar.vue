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
          <span class="text-muted font-display mt-1 hidden text-xs sm:block">{{ activeTrackData.role }}</span>
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

        <!-- 스킨 순환 토글: 현재 아이콘 유지 + 다음 스킨 코너 피크 + 3단계 위치 점 -->
        <button
          type="button"
          class="skin-toggle focus-ring nav-panel relative inline-flex h-10 w-10 items-center justify-center rounded-md transition hover:-translate-y-0.5"
          :class="{ 'ow-skin-toggle': skin === 'overwatch' }"
          :aria-label="`현재 스킨: ${skinName}. 클릭하면 ${nextSkinName} 스킨으로 전환합니다`"
          :title="`스킨: ${skinName} · 클릭하면 ${nextSkinName}(으)로 전환`"
          @click="emit('toggle-skin')"
        >
          <component
            v-if="skinMeta[skin].comp"
            :is="skinMeta[skin].comp"
            class="skin-ico skin-ico--current h-5 w-5"
          />
          <span v-else class="skin-ico skin-ico--current text-lg leading-none">{{ skinMeta[skin].emoji }}</span>
          <!-- 다음 스킨 미리보기 (hover/focus 시 노출) -->
          <span class="skin-peek" aria-hidden="true">
            <component v-if="skinMeta[nextSkin].comp" :is="skinMeta[nextSkin].comp" class="h-3 w-3" />
            <span v-else class="text-[11px] leading-none">{{ skinMeta[nextSkin].emoji }}</span>
          </span>
          <!-- 3단계 위치 인디케이터 (터치 포함 항상 노출) -->
          <span class="skin-dots" aria-hidden="true">
            <span
              v-for="s in SKIN_ORDER"
              :key="s"
              class="skin-dot"
              :class="{ 'is-active': s === skin }"
            ></span>
          </span>
        </button>

        <!-- 다크/라이트 토글은 기본 테마에서만 의미가 있어 default 스킨에서만 노출 -->
        <button
          v-if="skin === 'default'"
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
import { Crosshair, Menu, Moon, Sparkles, Sun } from "@lucide/vue";
import { computed, onBeforeUnmount, onMounted, ref, type Component } from "vue";
import { focusTracks, profile } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";
import { SKIN_ORDER, type Skin } from "@/composables/useSkin";

const props = defineProps<{
  theme: "dark" | "light";
  skin: Skin;
}>();

const emit = defineEmits<{
  "scroll-to-section": [id: string];
  "toggle-theme": [origin?: { x: number; y: number }];
  "toggle-skin": [];
}>();

// 스킨별 메타: 기본=Sparkles, 메이플=단풍잎 이모지, 오버워치=Crosshair (이모지/컴포넌트 혼용)
type SkinMetaEntry = { name: string; comp?: Component; emoji?: string };
const skinMeta: Record<Skin, SkinMetaEntry> = {
  default: { comp: Sparkles, name: "기본" },
  maple: { emoji: "🍁", name: "메이플" },
  overwatch: { comp: Crosshair, name: "오버워치" },
};
const skinName = computed(() => skinMeta[props.skin].name);
// 다음 스킨은 항상 실제 상태에서 계산 — hover 미리보기·aria-label과 절대 어긋나지 않음
const nextSkin = computed<Skin>(
  () => SKIN_ORDER[(SKIN_ORDER.indexOf(props.skin) + 1) % SKIN_ORDER.length]
);
const nextSkinName = computed(() => skinMeta[nextSkin.value].name);

const onToggleTheme = (e: MouseEvent) => {
  emit("toggle-theme", { x: e.clientX, y: e.clientY });
};

const isMenuOpen = ref(false);
const activeSection = ref("hero");
const { activeTrack } = useFocusTrack();
const activeTrackData = computed(
  () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0]
);

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
/* ── 스킨 순환 토글 ── */
.skin-toggle {
  overflow: visible;
}
.skin-ico--current {
  color: var(--accent);
  margin-bottom: 4px; /* 하단 위치 점과 균형 */
  transition: opacity 0.18s ease;
}
/* 다음 스킨 코너 피크 — hover/focus에서만, 레이아웃 시프트 0 */
.skin-peek {
  position: absolute;
  top: 1px;
  right: 1px;
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  color: var(--text-primary);
  background: var(--surface-strong);
  border: 1px solid var(--border-strong);
  opacity: 0;
  transform: scale(0.6);
  transform-origin: top right;
  transition: opacity 0.16s ease, transform 0.16s ease;
  pointer-events: none;
}
.skin-toggle:hover .skin-peek,
.skin-toggle:focus-visible .skin-peek {
  opacity: 1;
  transform: scale(1);
}
/* 3단계 위치 인디케이터 */
.skin-dots {
  position: absolute;
  bottom: 5px;
  left: 50%;
  display: flex;
  gap: 3px;
  transform: translateX(-50%);
  pointer-events: none;
}
.skin-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
  opacity: 0.45;
  transition: background 0.18s ease, opacity 0.18s ease, transform 0.18s ease;
}
.skin-dot.is-active {
  background: var(--accent);
  opacity: 1;
  transform: scale(1.25);
}
@media (prefers-reduced-motion: reduce) {
  .skin-ico--current,
  .skin-peek {
    transition: none;
  }
}

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
