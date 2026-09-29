/**
 * 로케일 파사드 — 실제 콘텐츠는 portfolio.ko.ts / portfolio.en.ts 에 있고,
 * 이 모듈은 로드 시점 로케일에 맞는 쪽을 재수출한다. 방문자 대부분이 쓰는 한국어는 메인 번들에 두고
 * (추가 요청 없음), 영어는 ?lang=en일 때만 따로 불러온다.
 * 소비자는 기존처럼 "@/data/portfolio" 만 import 하면 된다.
 */
import { isEn } from "@/i18n/locale";
import * as ko from "./portfolio.ko";

export type {
  FocusTrackId,
  RoleFocusId,
  ProjectPerspective,
  FeaturedProject,
} from "./portfolio.ko";

const data = isEn ? await import("./portfolio.en") : ko;

export const profile = data.profile;
export const focusTracks = data.focusTracks;
export const featuredProjects = data.featuredProjects;
export const techGroups = data.techGroups;
export const experience = data.experience;
export const education = data.education;
