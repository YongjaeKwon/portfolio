import type { FeaturedProject, FocusTrackId, RoleFocusId } from "@/data/portfolio";

export type PresentedProject = {
  project: FeaturedProject;
  card: FeaturedProject["card"];
  detail: FeaturedProject["detail"];
};

export const presentProject = (project: FeaturedProject, focus: FocusTrackId): PresentedProject => {
  const perspective = focus === "all" ? undefined : project.perspectives?.[focus as RoleFocusId];

  return {
    project,
    card: { ...project.card, ...perspective?.card },
    detail: { ...project.detail, ...perspective?.detail },
  };
};
