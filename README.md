# 권용재 · 웹 개발자 포트폴리오

B2B·공공 업무 시스템에서 요구사항 협의부터 화면·API·SQL 개발, 검수와 배포까지 담당합니다. 이 저장소는 실무에서 맡은 범위와 기술적 판단을 정리한 **Vue 3 · TypeScript 포트폴리오 사이트**의 소스 코드입니다.

[포트폴리오 보기](https://www.yongjaekwon.com/) · [프론트엔드 이력서](https://www.yongjaekwon.com/resume.pdf) · [백엔드 이력서](https://www.yongjaekwon.com/resume-backend.pdf)

## 실무에서 해결한 문제

| 프로젝트 | 문제와 구현 | 상세 설명 |
| --- | --- | --- |
| **PPS · B2B 협력사 포털** | 대량 파일 압축을 비동기 작업으로 분리하고, 작업 ID로 진행 상태와 새로고침 이후 결과를 확인하도록 구현했습니다. | [파일 처리·계정 발급·배포 사례](docs/case-studies/pps.md) |
| **PPS · Vue 상태 관리** | 공통 스크립트의 중첩 상태를 여러 화면이 공유하던 문제를 화면별 초기 상태 팩토리로 수정했습니다. | [상태 분리 사례](docs/case-studies/pps.md#2-vue-화면-사이에-남던-공통-상태-분리) |
| **TSMS · 교육용 단말 운영 시스템** | 외부 API 호출을 서버로 옮겨 키와 연계 설정을 공통화하고, 대량 단말 검증과 점검·재점검 업무를 구현했습니다. | [API 연계·단말 등록·현장 점검 사례](docs/case-studies/tsms.md) |

실무 사례는 담당 업무를 설명한 공개용 문서입니다. 실제 사내 소스 코드, 운영 화면과 고객 데이터는 포함하지 않으며, 문서의 코드는 처리 흐름을 설명하기 위한 축약 예시입니다.

## 이 저장소에서 확인할 코드

| 확인할 내용 | 구현 | 검증 |
| --- | --- | --- |
| 빠르게 연속 이동할 때 마지막 요청만 반영하고, 예약된 프레임을 취소하는 섹션 이동 | [sectionNavigation.ts](src/utils/sectionNavigation.ts) | [단위 테스트](tests/sectionNavigation.test.ts) |
| 스크롤 이벤트의 최신 값만 프레임당 한 번 반영하는 스케줄러 | [frameScheduler.ts](src/utils/frameScheduler.ts) | [단위 테스트](tests/frameScheduler.test.ts) |
| 상세 모달의 키보드 포커스 관리와 배경 접근 차단·복원 | [ProjectDetailModal.vue](src/components/ProjectDetailModal.vue) | [접근성 관련 소스 검사](tests/accessibilityContracts.test.ts) |
| 실행할 때 불러오는 데모, 종료 시 타이머와 상태 정리 | [ProjectDemoPanel.vue](src/components/demos/ProjectDemoPanel.vue) · [데모 구현](src/components/demos) | [데모 관련 소스 검사](tests/projectDemos.test.ts) |

프로젝트 소개와 상세 사례는 화면 코드에서 분리해 [portfolio.ko.ts](src/data/portfolio.ko.ts), [caseStudies.ko.ts](src/data/caseStudies.ko.ts)에서 관리하며, 각 파일의 영문판을 함께 제공합니다.

## 연결된 프로젝트

| 프로젝트 | 구분 · 담당 범위 |
| --- | --- |
| [ticket-rush](https://github.com/YongjaeKwon/ticket-rush) | 진행 중인 개인 예매 시스템. Java/Spring 기반 좌석 선점·예약 확정과 웹 화면을 구현하고, 동시 요청·홀드 만료·중복 확정을 테스트합니다. |
| [SSAFAST](https://github.com/SSAFAST/ssafast) | SSAFY 팀 프로젝트. React·TypeScript 기반 동적 API 명세 입력 폼과 테스트 결과 화면을 담당했습니다. |
| [ddoing](https://github.com/GomGom-Team/ddoing) | SSAFY 팀 프로젝트. React·Canvas 기반 그림 학습 화면, 타이머와 판정 서버 연동을 담당했습니다. |
| [MODAC](https://github.com/YongjaeKwon/MODAC) | SSAFY 팀 프로젝트. Vue 기반 스터디룸 입장 흐름, 학습 기록 화면과 채팅 UI 연동을 담당했습니다. |
| [데이터 검증·조회 데모](https://github.com/YongjaeKwon/quant-lab) | 개인 프로젝트. 합성 데이터를 저장·검증하고 FastAPI·React로 조회합니다. 재실행 시 데이터 정합성, 오류 처리와 화면 상태를 테스트합니다. |

사이트의 ticket-rush·SSAFAST·ddoing·MODAC 데모는 각 프로젝트의 기능 흐름을 **샘플 데이터로 재구성한 브라우저 시뮬레이션**입니다. 외부 서버·DB에 연결하지 않으며, 데모의 성능 수치·동시 요청·AI 판정·채팅 결과는 실제 서비스 실행 결과가 아닙니다. 원본 구현과 테스트는 연결된 공개 저장소에서 확인할 수 있습니다.

## 로컬 실행과 검증

Node.js 20.9 이상과 npm이 필요합니다.

```bash
npm ci
npm run dev
```

```bash
npm test
npm run build
```

- `npm test`: 프로젝트의 직무별 표시 검증 후 Vitest를 실행합니다. 로직 단위 테스트와 UI·콘텐츠의 소스 검사로 구성되며, 실제 브라우저의 전체 사용자 흐름을 검증하는 E2E 테스트는 아닙니다.
- `npm run build`: `vue-tsc` 타입 검사 후 Vite가 `dist/`에 정적 배포 파일을 생성합니다.
- `npm run preview`: 빌드 결과를 로컬에서 확인합니다.

이 테스트의 대상은 포트폴리오 사이트입니다. 소개된 실무 시스템이나 다른 프로젝트의 테스트 결과와는 구분합니다.
