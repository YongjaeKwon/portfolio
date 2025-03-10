import { createApp } from "vue";
//import "./style.css";
import App from "./App.vue";
// import router from "./router";
import "./assets/index.css";
// FontAwesome 라이브러리 추가
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// FontAwesome 아이콘 가져오기
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faVuejs, faReact, faNodeJs } from "@fortawesome/free-brands-svg-icons";

// 사용할 아이콘 등록
library.add(faDatabase, faVuejs, faReact, faNodeJs);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
