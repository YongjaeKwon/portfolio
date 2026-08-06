import { onBeforeUnmount, onMounted, readonly, ref } from "vue";
import { calculateScrollState } from "@/utils/scrollMetrics";

const scrollY = ref(0);
const progress = ref(0);
const isPastThreshold = ref(false);
const isAtBottom = ref(false);

let subscribers = 0;
let frameId: number | null = null;
let maxScroll = 0;
let resizeObserver: ResizeObserver | null = null;

const update = () => {
  frameId = null;
  const state = calculateScrollState(
    document.documentElement.scrollTop || window.scrollY,
    maxScroll,
    400,
  );
  scrollY.value = state.scrollY;
  progress.value = state.progress;
  isPastThreshold.value = state.isPastThreshold;
  isAtBottom.value = state.isAtBottom;
};

const schedule = () => {
  if (frameId === null) frameId = requestAnimationFrame(update);
};

const refreshDocumentHeight = () => {
  const documentElement = document.documentElement;
  maxScroll = Math.max(0, documentElement.scrollHeight - documentElement.clientHeight);
  schedule();
};

const start = () => {
  refreshDocumentHeight();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", refreshDocumentHeight, { passive: true });
  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(refreshDocumentHeight);
    resizeObserver.observe(document.documentElement);
  }
};

const stop = () => {
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", refreshDocumentHeight);
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (frameId !== null) cancelAnimationFrame(frameId);
  frameId = null;
};

export const useScrollMetrics = () => {
  onMounted(() => {
    subscribers += 1;
    if (subscribers === 1) start();
  });

  onBeforeUnmount(() => {
    subscribers = Math.max(0, subscribers - 1);
    if (subscribers === 0) stop();
  });

  return {
    scrollY: readonly(scrollY),
    progress: readonly(progress),
    isPastThreshold: readonly(isPastThreshold),
    isAtBottom: readonly(isAtBottom),
  };
};
