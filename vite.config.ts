/// <reference types="vitest/config" />

import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // Vue가 여러 복사본으로 갈라지면 inject/provide 컨텍스트가 깨진다
    // (@lucide/vue 아이콘이 useLucideProps()→inject 사용). 단일 인스턴스 보장.
    dedupe: ["vue"],
  },
  optimizeDeps: {
    include: ["vue", "@lucide/vue"],
  },
  test: {
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
  },
  // 영어 데이터를 최상위 await로 필요할 때만 불러온다(Chrome 89 · Safari 15 · Firefox 89 이상).
  build: {
    target: "es2022",
  },
  base: "/",
});
