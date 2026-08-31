/**
 * 로케일 파사드 — 실제 콘텐츠는 caseStudies.ko.ts / caseStudies.en.ts 에 있다.
 */
import { isEn } from "@/i18n/locale";
import { projectCaseStudies as koStudies } from "./caseStudies.ko";
import { enProjectCaseStudies } from "./caseStudies.en";

export type { CaseStudyCode, ProjectCaseStudy, CaseStudyProjectId } from "./caseStudies.ko";

export const projectCaseStudies = isEn ? enProjectCaseStudies : koStudies;

export const hasProjectCaseStudies = (projectId: string): projectId is keyof typeof projectCaseStudies =>
  Object.prototype.hasOwnProperty.call(projectCaseStudies, projectId);
