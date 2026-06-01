/**
 * 프로젝트 스택 필터 — ProjectsView와 TechStackView가 공유하는 모듈 레벨 싱글턴 상태
 * TechStackView에서 칩을 클릭하면 여기에 기록되고, ProjectsView가 구독한다.
 */
import { ref } from "vue";

const activeFilter = ref<string | null>(null);

export function useProjectFilter() {
  return { activeFilter };
}
