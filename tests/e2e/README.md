# E2E 테스트 (Playwright)

포트폴리오의 **실제 사용자 흐름**을 dev 서버에 직접 띄워 검증한다. 단위 테스트가 아니라
"사용자가 화면에서 하는 행동"을 그대로 재현해, 변경이 들어와도 핵심 동작이 깨지지 않도록
회귀(regression)를 잡는 것이 목적이다.

## 설계 원칙

- **접근성 기반 선택자**: `getByRole(... { name })`로 aria-label·텍스트를 통해 요소를 찾는다.
  `data-testid`를 새로 심지 않고, 실제 사용자/스크린리더가 인식하는 경로로 접근한다.
- **결정론적 환경**: `colorScheme`·`reducedMotion`을 고정(`playwright.config.ts`)해
  초기 테마와 View Transition 애니메이션에 의한 흔들림을 제거한다.
- **회귀 가드 중심**: 단순 "보인다" 확인을 넘어, *지속성*(새로고침 후 테마 유지),
  *조건부 렌더*(기본 스킨이 아닐 때 테마 토글 사라짐), *FOUC 방지*(첫 페인트 전 테마 반영)처럼
  과거에 깨지기 쉬운 지점을 명시적으로 검증한다.

## 커버리지

| 스펙 | 검증 대상 |
| --- | --- |
| `theme.spec.ts` | 테마 토글 → `data-theme` 반전 · localStorage 저장 · 새로고침 지속 · FOUC 방지 |
| `navigation.spec.ts` | 내비 클릭 스크롤 · URL 해시 동기화 · 로고 복귀 · 해시 딥링크 진입 |
| `skin.spec.ts` | 스킨 3단 순환·저장 · 비기본 스킨에서 테마 토글 숨김(조건부 렌더) |
| `smoke.spec.ts` | 문서 타이틀 · 7개 핵심 섹션 렌더 · 첫 Tab 스킵 링크 포커스(키보드 접근성) |

## 실행

```bash
npm run test:e2e          # 헤드리스 실행 (webServer 자동 기동)
npm run test:e2e:ui       # Playwright UI 모드로 디버깅
npm run test:e2e:report   # 마지막 HTML 리포트 열기
```

`playwright.config.ts`의 `webServer`가 `npm run dev`(:4321)를 자동으로 띄우고, 끝나면 종료한다.
로컬에서는 이미 떠 있는 서버를 재사용(`reuseExistingServer`)하고, CI에서는 매번 새로 띄운다.
