import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

const srcPath = decodeURIComponent(new URL("./src", import.meta.url).pathname).replace(
  /^\/([A-Za-z]:)/,
  "$1"
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": srcPath,
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
