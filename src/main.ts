import { createApp } from "vue";
import { LUCIDE_CONTEXT } from "@lucide/vue";
import App from "./App.vue";
import "./assets/index.css";

const app = createApp(App);

// @lucide/vue 아이콘은 useLucideProps() → inject(LUCIDE_CONTEXT, {}) 로 기본 props를 읽는다.
// Vite(esbuild)의 dep 최적화가 간헐적으로 inject 기본값({})을 누락시켜 런타임 크래시가 나므로
// 앱 루트에서 빈 컨텍스트를 명시적으로 provide 해 항상 안전하게 만든다.
app.provide(LUCIDE_CONTEXT, {});

app.mount("#app");
