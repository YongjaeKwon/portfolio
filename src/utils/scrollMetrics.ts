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
