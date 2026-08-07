export const anchorLayoutClass = "anchor-layout-ready";

export type NavigableSection = {
  classList: Pick<DOMTokenList, "add">;
  scrollIntoView: (options?: ScrollIntoViewOptions) => void;
};

export type SectionScrollBehavior = ScrollBehavior | "instant";

export const scrollToLaidOutSection = (
  sections: readonly NavigableSection[],
  target: NavigableSection,
  behavior: SectionScrollBehavior,
  requestFrame: (callback: FrameRequestCallback) => number = requestAnimationFrame,
): boolean => {
  const targetIndex = sections.indexOf(target);
  if (targetIndex >= 0) {
    for (const section of sections.slice(0, targetIndex + 1)) {
      section.classList.add(anchorLayoutClass);
    }
  }

  requestFrame(() => target.scrollIntoView({ behavior: behavior as ScrollBehavior }));
  return targetIndex >= 0;
};
