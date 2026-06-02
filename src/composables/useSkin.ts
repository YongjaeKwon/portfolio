/**
 * 스킨(기본/메이플) 공유 상태 — 모듈 레벨 싱글턴.
 * App.vue가 localStorage 동기화·data-skin 속성 적용을 담당하고,
 * 각 컴포넌트는 skin 값을 읽어 메이플 전용 콘텐츠를 조건부 렌더한다.
 */
import { computed, ref } from "vue";

export type Skin = "default" | "maple" | "overwatch";

/** 버튼 한 번에 순환되는 순서: 기본 → 메이플 → 오버워치 → 기본 ... */
export const SKIN_ORDER: Skin[] = ["default", "maple", "overwatch"];

const skin = ref<Skin>("default");

export function useSkin() {
  const isMaple = computed(() => skin.value === "maple");
  const toggle = () => {
    const i = SKIN_ORDER.indexOf(skin.value);
    skin.value = SKIN_ORDER[(i + 1) % SKIN_ORDER.length];
  };
  const set = (s: Skin) => {
    skin.value = s;
  };
  return { skin, isMaple, toggle, set };
}
