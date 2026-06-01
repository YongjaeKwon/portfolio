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
import { computed } from "vue";
import {
  siApachemaven,
  siAxios,
  siChartdotjs,
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
  siNextdotjs,
  siNodedotjs,
  siPinia,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siReacthookform,
  siReactquery,
  siRedis,
  siRedux,
  siSass,
  siNginx,
  siSpring,
  siSpringboot,
  siSpringsecurity,
  siSqlite,
  siSubversion,
  siTailwindcss,
  siThymeleaf,
  siJsonwebtokens,
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
  Axios: siAxios,
  "Chart.js": siChartdotjs,
  Docker: siDocker,
  "Docker Compose": siDocker,
  FastAPI: siFastapi,
  Figma: siFigma,
  Git: siGit,
  Gradle: siGradle,
  CSS3: siCss,
  HTML5: siHtml5,
  Java: siOpenjdk,
  JavaScript: siJavascript,
  jQuery: siJquery,
  MariaDB: siMariadb,
  Maven: siApachemaven,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  Pinia: siPinia,
  PostgreSQL: siPostgresql,
  Python: siPython,
  React: siReact,
  "React Hook Form": siReacthookform,
  "React Query": siReactquery,
  Redis: siRedis,
  Redux: siRedux,
  "Redux Toolkit": siRedux,
  "REST API": siSpring,
  "SASS/SCSS": siSass,
  Nginx: siNginx,
  SQLite: siSqlite,
  Spring: siSpring,
  "Spring Boot": siSpringboot,
  "Spring MVC": siSpring,
  "Spring Security": siSpringsecurity,
  SVN: siSubversion,
  TailwindCSS: siTailwindcss,
  Thymeleaf: siThymeleaf,
  JWT: siJsonwebtokens,
  TypeScript: siTypescript,
  Vite: siVite,
  "Vue.js": siVuedotjs,
};

const icon = computed(() => iconMap[props.name]);
const fallback = computed(() =>
  props.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()
);
</script>
