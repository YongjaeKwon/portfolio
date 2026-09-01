import { computed } from "vue";
import { focusTracks } from "@/data/portfolio";
import { useFocusTrack } from "@/composables/useFocusTrack";

/**
 * 활성 직무 트랙에 맞는 이력서 링크 — Backend 트랙은 백엔드 기준본을,
 * 나머지 트랙은 기본(프론트엔드) 기준본을 내려받는다.
 */
export function useActiveResume() {
  const { activeTrack } = useFocusTrack();
  const activeTrackData = computed(
    () => focusTracks.find((track) => track.id === activeTrack.value) ?? focusTracks[0],
  );
  const resumeHref = computed(() => activeTrackData.value.resume);
  const resumeFileName = computed(() =>
    activeTrack.value === "backend" ? "Yongjae-Kwon-Backend-Resume.pdf" : "Yongjae-Kwon-Resume.pdf",
  );

  return { resumeHref, resumeFileName };
}
