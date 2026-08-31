/**
 * 로케일 파사드 — 실제 콘텐츠는 portfolio.ko.ts / portfolio.en.ts 에 있고,
 * 이 모듈은 로드 시점 로케일에 맞는 쪽을 그대로 재수출한다.
 * 소비자는 기존처럼 "@/data/portfolio" 만 import 하면 된다.
 */
import { isEn } from "@/i18n/locale";
import * as ko from "./portfolio.ko";
import * as en from "./portfolio.en";

export type {
  FocusTrackId,
  RoleFocusId,
  ProjectVisibility,
  CaseStudyNarrative,
  ProjectPerspective,
  FeaturedProject,
} from "./portfolio.ko";

const data = isEn ? en : ko;

export const profile = data.profile;
export const focusTracks = data.focusTracks;
export const hero = data.hero;
export const coreStrengths = data.coreStrengths;
export const featuredProjects = data.featuredProjects;
export const techGroups = data.techGroups;
export const experience = data.experience;
export const education = data.education;
export const heroStats = data.heroStats;
export const projects = data.projects;
