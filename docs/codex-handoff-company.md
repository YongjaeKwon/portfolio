# Codex Handoff: Portfolio Follow-up

작성일: 2026-05-28

## 목적

이 문서는 회사 PC의 Codex에서 포트폴리오 작업을 이어가기 위한 전달 메모입니다. 현재 포트폴리오는 프론트엔드 지원용 링크 첨부 자료로 정리 중이며, 실제 업무 범위를 과장하지 않는 방향을 우선했습니다.

## 현재 포지셔닝

- 지원 포지션: 프론트엔드 개발자
- 현재 경력 표현: Java/Spring 기반 웹 시스템 개발자
- 핵심 메시지: 화면만 구현하는 개발자가 아니라, API 응답, 권한 조건, MyBatis SQL 흐름까지 함께 이해하고 업무 화면을 완성하는 프론트엔드 후보자

## 이번 작업에서 바꾼 것

- `src/data/portfolio.ts`
  - 프로젝트 설명 전반을 프론트엔드 지원 관점으로 재정리
  - quant-core 설명을 개인 학습 프로젝트 톤으로 낮춤
  - SSAFAST를 Next.js/React 보완용 프로젝트로 추가
  - 프로젝트별 링크 데이터 추가
- `src/views/ProjectsView.vue`
  - 프로젝트 카드 하단에 `공개 README` 또는 `GitHub` 링크 버튼 추가
- `public/case-studies/*.md`
  - 회사 프로젝트 4건의 공개용 README 추가
  - 내부 코드, 운영 URL, 고객사별 상세 정책, 환경 정보는 제외
- `src/components/TechIcon.vue`
  - Next.js, React Query, React Hook Form, Redux Toolkit, TailwindCSS, Chart.js 등 아이콘 매핑 추가
- `README.md`, `docs/frontend-resume-submit.md`, `docs/frontend-resume-draft.md`
  - 포트폴리오 본문과 이력서 문구 동기화

## 프로젝트 순서 의도

1. TSMS
   - 웹/모바일/태블릿 업무 화면 경험이 있어 넥슨 슈팅본부의 웹/모바일 플랫폼 업무와 가장 가까움
2. PPS
   - Vue, Spring Boot, 관리자 화면, 인증, 파일/메일/조회 흐름이 있어 실무 FE 근거가 강함
3. 교육청 IT 자산관리
   - 권한별 조회 조건, SQL, 외부 API 연동 이해를 보여주는 실무 보조 카드
4. quant-core
   - React/TypeScript/Zustand/WebSocket/Docker 보완용. 단, AI 도구 도움을 받아 만든 학습 프로젝트라 실무 뒤에 배치
5. SSAFAST
   - Next.js, React Query, React Hook Form 보완용. 수상 이력은 좋지만 2023년 프로젝트라 뒤쪽
6. SR30
   - 첫 실무 경험과 성과 수치가 있지만 Nexacro 중심이라 현재 FE 지원 직무와 직접성은 낮음

## 링크 구조

회사 프로젝트는 외부 저장소 링크 대신 포트폴리오 내부 공개용 README로 연결합니다.

- TSMS: `/case-studies/tsms.md`
- PPS: `/case-studies/pps.md`
- IT Asset: `/case-studies/it-asset.md`
- SR30: `/case-studies/sr30.md`

개인/팀 프로젝트는 GitHub로 연결합니다.

- quant-core: `https://github.com/YongjaeKwon/quant-core`
- SSAFAST: `https://github.com/SSAFAST/ssafast`

## 과장 방지 메모

면접에서 방어하기 어려운 표현은 쓰지 않는 것이 좋습니다.

- PPS의 센터/CE 승계는 아직 구현하지 않았으므로 포트폴리오에서 제외했습니다.
- TSMS는 추상적인 "입력 흐름 설계" 대신 실제 화면 단계인 접수, 동의, 첨부, 전자서명, 진행상태 조회로 표현했습니다.
- quant-core는 AI 도구 도움을 받아 진행한 프로젝트이므로 "1인 설계 및 개발"보다 "개인 학습 프로젝트"가 안전합니다.
- 정량 성과가 없으면 임의로 숫자를 만들지 말고, 업무 범위, 복잡도, 검증 방식, 운영 리스크 감소 관점으로 설명합니다.

## 회사에서 추가하면 좋은 것

- TSMS
  - 실제 담당 화면 목록을 더 정확히 정리
  - 개인정보 동의, 태블릿 전자서명, 진행상태 조회에서 처리한 예외 케이스 추가
- PPS
  - 교육 등록, 엑셀 업로드, 메일 발송, 제출 현황 조회 중 직접 담당 범위 확인
  - 댓글·대댓글 공통화가 실제로 어디까지 적용됐는지 구체화
- IT Asset
  - 담당한 메뉴명과 권한별 조회 조건 예시를 공개 가능한 수준으로 추가
  - 외부 API 연동 결과를 화면에 어떻게 보여줬는지 사례 추가
- SR30
  - 응답률 5% -> 20% 개선 근거가 설명 가능하면 유지
  - 근거가 애매하면 수치를 낮추거나 "참여 흐름 개선" 정도로 완화

## 검증 방법

```bash
npm run build
```

현재 빌드는 통과합니다. 이 환경에서는 `git`이 PATH에 없어서 다음 실행 파일을 직접 사용했습니다.

```text
C:\Program Files\Git\cmd\git.exe
```

