export type ScrollState = {
  scrollY: number;
  progress: number;
  isPastThreshold: boolean;
  isAtBottom: boolean;
};

export type ObservedSection = {
  id: string;
  top: number;
  isIntersecting: boolean;
};

export type SectionBoundaryEntry = ObservedSection & {
  bottom: number;
};

export const calculateScrollState = (
  scrollTop: number,
  maxScroll: number,
  threshold: number,
): ScrollState => {
  const safeMax = Math.max(0, maxScroll);
  const scrollY = Math.min(Math.max(0, scrollTop), safeMax);

  return {
    scrollY,
    progress: safeMax > 0 ? scrollY / safeMax : 0,
    isPastThreshold: scrollY > threshold,
    isAtBottom: safeMax > 0 && scrollY >= safeMax - 4,
  };
};

export const pickActiveSection = (
  sections: ObservedSection[],
  current: string,
  headerLine: number,
): string => {
  const visible = sections.filter((section) => section.isIntersecting);
  if (!visible.length) return current;

  return visible.reduce((closest, section) =>
    Math.abs(section.top - headerLine) < Math.abs(closest.top - headerLine) ? section : closest,
  ).id;
};

export const resolveActiveSectionFromEntries = (
  sectionIds: string[],
  entries: SectionBoundaryEntry[],
  current: string,
  headerLine: number,
): string => {
  const reenteredSections = entries.filter(
    (entry) =>
      sectionIds.includes(entry.id) && entry.isIntersecting && entry.top <= headerLine,
  );
  if (reenteredSections.length) {
    return pickActiveSection(reenteredSections, current, headerLine);
  }

  const highestExitedIndex = entries.reduce((highest, entry) => {
    if (entry.isIntersecting || entry.bottom > headerLine) return highest;
    return Math.max(highest, sectionIds.indexOf(entry.id));
  }, -1);
  if (highestExitedIndex < 0) return current;

  return sectionIds[Math.min(highestExitedIndex + 1, sectionIds.length - 1)] ?? current;
};
