/**
 * 사이트 로케일 — 모듈 로드 시점에 한 번 결정되는 값.
 * 데이터 파일(portfolio.ts, caseStudies.ts)이 정적 상수를 export 하는 구조를
 * 유지하기 위해, 언어 전환은 URL(?lang=en)과 localStorage를 갱신한 뒤
 * 전체 새로고침으로 처리한다.
 */
export type Locale = "ko" | "en";

const STORAGE_KEY = "locale";

const readLocale = (): Locale => {
  if (typeof window === "undefined") return "ko";

  try {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "en" || param === "ko") {
      window.localStorage.setItem(STORAGE_KEY, param);
      return param;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ko") return stored;
  } catch {
    // localStorage 접근이 막힌 환경에서는 기본 언어로 렌더링한다.
  }
  return "ko";
};

export const locale: Locale = readLocale();
export const isEn = locale === "en";

/** 로케일에 맞는 문자열(또는 값)을 고른다. */
export const t = <T>(ko: T, en: T): T => (isEn ? en : ko);

/** 언어를 바꾸고 전체 새로고침한다. 같은 언어면 아무것도 하지 않는다. */
export const switchLocale = (next: Locale) => {
  if (typeof window === "undefined" || next === locale) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // 저장이 안 되면 URL 파라미터만으로도 전환된다.
  }

  const url = new URL(window.location.href);
  if (next === "ko") {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", next);
  }
  window.location.href = url.toString();
};
