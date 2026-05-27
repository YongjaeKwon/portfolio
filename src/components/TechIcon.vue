<template>
  <span
    class="text-muted inline-grid h-5 w-5 shrink-0 place-items-center rounded bg-[var(--surface-soft)] text-[10px] font-black"
    :title="name"
    aria-hidden="true"
  >
    <svg
      v-if="icon"
      viewBox="0 0 24 24"
      class="h-3.5 w-3.5"
      :style="{ color: `#${icon.hex}` }"
      role="img"
    >
      <path fill="currentColor" :d="icon.path" />
    </svg>
    <span v-else>{{ fallback }}</span>
  </span>
</template>

<script setup lang="ts">
import {
  siApachemaven,
  siCss,
  siDocker,
  siFastapi,
  siFigma,
  siGit,
  siGradle,
  siHtml5,
  siJavascript,
  siJquery,
  siMariadb,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siSass,
  siSpring,
  siSpringboot,
  siSpringsecurity,
  siSqlite,
  siSubversion,
  siTypescript,
  siVite,
  siVuedotjs,
} from "simple-icons";

type SimpleIcon = {
  path: string;
  hex: string;
};

const props = defineProps<{
  name: string;
}>();

const iconMap: Record<string, SimpleIcon> = {
  Docker: siDocker,
  FastAPI: siFastapi,
  "Figma 시안 확인": siFigma,
  Git: siGit,
  Gradle: siGradle,
  CSS3: siCss,
  HTML5: siHtml5,
  Java: siOpenjdk,
  JavaScript: siJavascript,
  jQuery: siJquery,
  MariaDB: siMariadb,
  Maven: siApachemaven,
  "Node.js": siNodedotjs,
  PostgreSQL: siPostgresql,
  Python: siPython,
  React: siReact,
  "REST API": siSpring,
  "SASS/SCSS": siSass,
  SQLite: siSqlite,
  Spring: siSpring,
  "Spring Boot": siSpringboot,
  "Spring MVC": siSpring,
  "Spring Security": siSpringsecurity,
  SVN: siSubversion,
  TypeScript: siTypescript,
  Vite: siVite,
  "Vue.js": siVuedotjs,
};

const icon = iconMap[props.name];
const fallback = props.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
</script>
