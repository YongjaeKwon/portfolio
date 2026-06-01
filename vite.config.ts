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
  base: "/",
});
