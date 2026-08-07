export const anchorLayoutClass = "anchor-layout-ready";

export type NavigableSection = {
  classList: Pick<DOMTokenList, "add" | "remove">;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
};

export type SectionScrollBehavior = ScrollBehavior | "instant";

export const createSectionNavigator = (
  requestFrame: (callback: FrameRequestCallback) => number = requestAnimationFrame,
  cancelFrame: (handle: number) => void = cancelAnimationFrame,
) => {
  let layoutFrameId: number | null = null;
  let cleanupFrameId: number | null = null;
  let preparedSections: readonly NavigableSection[] = [];

  const clearPreparedSections = () => {
    for (const section of preparedSections) {
      section.classList.remove(anchorLayoutClass);
    }
    preparedSections = [];
  };

  const cancel = () => {
    if (layoutFrameId !== null) cancelFrame(layoutFrameId);
    if (cleanupFrameId !== null) cancelFrame(cleanupFrameId);
    layoutFrameId = null;
    cleanupFrameId = null;
    clearPreparedSections();
  };

  const navigate = (
    sections: readonly NavigableSection[],
    target: NavigableSection,
    behavior: SectionScrollBehavior,
  ): boolean => {
    cancel();

    const targetIndex = sections.indexOf(target);
    if (targetIndex < 0) return false;

    preparedSections = sections.slice(0, targetIndex + 1);
    for (const section of preparedSections) {
      section.classList.add(anchorLayoutClass);
    }

    layoutFrameId = requestFrame(() => {
      layoutFrameId = null;
      target.scrollIntoView({ behavior: behavior as ScrollBehavior });
      cleanupFrameId = requestFrame(() => {
        cleanupFrameId = null;
        clearPreparedSections();
      });
    });

    return true;
  };

  return { navigate, cancel };
};
