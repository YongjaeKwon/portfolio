import { createLatestFrameScheduler } from "@/utils/frameScheduler";

type TiltHandlers = {
  destroy: () => void;
};

const tiltHandlers = new WeakMap<HTMLElement, TiltHandlers>();

export const vTilt = {
  mounted(el: HTMLElement) {
    const hoverPointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const passiveOptions = { passive: true } as const;
    const activeScrollOptions = { passive: true, capture: true } as const;
    let pointerListenersActive = false;
    let hoverActive = false;
    let rect: DOMRect | null = null;
    let latestPoint: { x: number; y: number } | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const resetTilt = () => {
      el.style.transition = "transform 0.35s ease";
      el.style.transform = "";
    };

    const scheduler = createLatestFrameScheduler((point: { x: number; y: number }) => {
      if (!hoverActive) {
        if (el.matches(":hover")) activateHover(point);
        else {
          stopActiveHover();
          resetTilt();
          return;
        }
      }
      if (!el.matches(":hover")) {
        stopActiveHover();
        resetTilt();
        return;
      }

      latestPoint = point;
      if (!rect) rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        resetTilt();
        return;
      }

      const px = (point.x - rect.left) / rect.width - 0.5;
      const py = (point.y - rect.top) / rect.height - 0.5;
      el.style.transition = "transform 0s";
      el.style.transform = `perspective(1100px) rotateY(${px * 2}deg) rotateX(${-py * 2}deg)`;
    });

    const invalidateGeometry = () => {
      rect = null;
      if (latestPoint) scheduler.schedule(latestPoint);
    };
    const detachActiveHoverObservation = () => {
      window.removeEventListener("scroll", invalidateGeometry, activeScrollOptions);
      window.removeEventListener("resize", invalidateGeometry);
      resizeObserver?.disconnect();
      resizeObserver = null;
    };
    const stopActiveHover = () => {
      scheduler.cancel();
      detachActiveHoverObservation();
      hoverActive = false;
      rect = null;
      latestPoint = null;
    };
    const activateHover = (point: { x: number; y: number }) => {
      if (hoverActive) return;
      hoverActive = true;
      latestPoint = point;
      rect = null;
      window.addEventListener("scroll", invalidateGeometry, activeScrollOptions);
      window.addEventListener("resize", invalidateGeometry, passiveOptions);
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(invalidateGeometry);
        resizeObserver.observe(el);
      }
    };
    const onEnter = (event: PointerEvent) => {
      const point = { x: event.clientX, y: event.clientY };
      activateHover(point);
      scheduler.schedule(point);
    };
    const onMove = (event: PointerEvent) => {
      const point = { x: event.clientX, y: event.clientY };
      latestPoint = point;
      scheduler.schedule(point);
    };
    const onLeave = () => {
      stopActiveHover();
      resetTilt();
    };
    const attachPointerListeners = () => {
      if (pointerListenersActive) return;
      el.addEventListener("pointerenter", onEnter, passiveOptions);
      el.addEventListener("pointermove", onMove, passiveOptions);
      el.addEventListener("pointerleave", onLeave, passiveOptions);
      pointerListenersActive = true;
    };
    const detachPointerListeners = () => {
      if (!pointerListenersActive) return;
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      pointerListenersActive = false;
    };
    const reconcilePointerEffects = () => {
      const pointerEffectsEnabled = hoverPointerQuery.matches && !reducedMotionQuery.matches;
      if (pointerEffectsEnabled) attachPointerListeners();
      else {
        detachPointerListeners();
        stopActiveHover();
        resetTilt();
      }
    };

    hoverPointerQuery.addEventListener("change", reconcilePointerEffects);
    reducedMotionQuery.addEventListener("change", reconcilePointerEffects);
    reconcilePointerEffects();
    tiltHandlers.set(el, {
      destroy: () => {
        hoverPointerQuery.removeEventListener("change", reconcilePointerEffects);
        reducedMotionQuery.removeEventListener("change", reconcilePointerEffects);
        detachPointerListeners();
        stopActiveHover();
        resetTilt();
      },
    });
  },
  unmounted(el: HTMLElement) {
    const handlers = tiltHandlers.get(el);
    if (!handlers) return;
    handlers.destroy();
    tiltHandlers.delete(el);
  },
};
