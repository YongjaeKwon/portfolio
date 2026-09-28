/**
 * 로케일 파사드 — 실제 콘텐츠는 caseStudies.ko.ts / caseStudies.en.ts 에 있다.
 */
import { isEn } from "@/i18n/locale";
import { projectCaseStudies as koStudies } from "./caseStudies.ko";

export type { CaseStudyCode, ProjectCaseStudy, CaseStudyProjectId } from "./caseStudies.ko";

// 한국어는 같은 청크에 두고, 영어는 ?lang=en일 때만 따로 불러온다.
export const projectCaseStudies = isEn ? (await import("./caseStudies.en")).enProjectCaseStudies : koStudies;

export const hasProjectCaseStudies = (projectId: string): projectId is keyof typeof projectCaseStudies =>
  Object.prototype.hasOwnProperty.call(projectCaseStudies, projectId);
