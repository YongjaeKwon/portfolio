# 권용재 · 웹 개발자 포트폴리오

B2B·공공 업무 시스템에서 요구사항 협의부터 화면·API·SQL 개발, 검수와 배포까지 담당합니다. **업무의 여러 단계를 연결하고, 화면 전환이나 반복 실행에서도 상태가 어긋나지 않게 만드는 일**에 관심이 있습니다.

이 사이트는 제가 맡은 일과 구현 과정에서의 판단을 소개하기 위해 Vue 3와 TypeScript로 만들었습니다. 실무 경험은 문제와 해결 과정으로 정리하고, 공개 프로젝트는 코드와 주요 기능 흐름을 함께 살펴볼 수 있도록 구성했습니다.

[포트폴리오 보기](https://www.yongjaekwon.com/) · [프론트엔드 이력서](https://www.yongjaekwon.com/resume.pdf) · [백엔드 이력서](https://www.yongjaekwon.com/resume-backend.pdf)

## 사이트를 만들며 중요하게 본 것

### 콘텐츠와 화면을 따로 관리합니다

프로젝트 소개와 상세 사례는 데이터 파일로 분리했습니다. 설명을 고칠 때는 콘텐츠 파일을 수정하고, 화면 배치는 컴포넌트에서 다룹니다. 같은 프로젝트도 프론트엔드·백엔드에서 맡은 범위를 나누어 보여주며, 한국어와 영어 내용은 같은 화면 컴포넌트로 표시합니다.

소개 내용은 [portfolio.ko.ts](src/data/portfolio.ko.ts), 문제·제약·판단·구현·결과로 이어지는 상세 사례는 [caseStudies.ko.ts](src/data/caseStudies.ko.ts)에서 확인할 수 있습니다.

### 상세 설명과 데모는 필요할 때 불러옵니다

경력과 프로젝트 개요를 먼저 읽고, 관심 있는 프로젝트를 열면 상세 설명을 볼 수 있도록 구성했습니다. 상세 사례와 인터랙티브 데모는 비동기 컴포넌트로 나누어 해당 기능을 열 때 불러옵니다. 데모를 닫으면 컴포넌트를 해제하고 타이머도 정리합니다.

### 이동과 종료 이후의 상태를 관리합니다

메뉴를 빠르게 연속으로 눌렀을 때는 이전 이동 예약을 취소하고 마지막 요청을 반영합니다. 스크롤 처리에서도 한 프레임에 최신 값만 반영하도록 했습니다.

상세 모달은 열려 있는 동안 키보드 포커스를 내부에 유지하고 배경 조작을 막습니다. 닫을 때는 배경 상태와 스크롤을 복원하고, 모달을 열었던 버튼으로 포커스를 돌려줍니다. 기능을 여는 동작부터 닫은 뒤 이어서 사용하는 흐름까지 함께 구현했습니다.

### 관련 코드 살펴보기

| 내용 | 구현 | 테스트 |
| --- | --- | --- |
| 연속 메뉴 이동과 취소 | [sectionNavigation.ts](src/utils/sectionNavigation.ts) | [sectionNavigation.test.ts](tests/sectionNavigation.test.ts) |
| 프레임당 최신 값 반영 | [frameScheduler.ts](src/utils/frameScheduler.ts) | [frameScheduler.test.ts](tests/frameScheduler.test.ts) |
| 모달의 포커스와 배경 상태 복원 | [ProjectDetailModal.vue](src/components/ProjectDetailModal.vue) | [accessibilityContracts.test.ts](tests/accessibilityContracts.test.ts) |
| 데모 로딩과 종료 처리 | [ProjectDemoPanel.vue](src/components/demos/ProjectDemoPanel.vue) · [개별 데모](src/components/demos) | [projectDemos.test.ts](tests/projectDemos.test.ts) |

## 실무 경험과 다른 프로젝트

### 실무에서 해결한 문제

- **[PPS · B2B 협력사 포털](docs/case-studies/pps.md)** — 오래 걸리는 파일 압축을 비동기 작업으로 분리하고, 새로고침 후에도 작업 상태와 결과를 확인할 수 있게 했습니다. [여러 Vue 화면이 같은 중첩 상태를 공유하던 문제](docs/case-studies/pps.md#2-vue-화면-사이에-남던-공통-상태-분리)는 화면별 초기 상태 팩토리로 수정했습니다.
- **[TSMS · 교육용 단말 운영 시스템](docs/case-studies/tsms.md)** — 외부 API 호출을 서버로 옮겨 키와 연계 설정을 공통화했습니다. 단말 등록 전 검증과 QR 발급, 현장 점검부터 재점검 이력까지 이어지는 업무도 구현했습니다.

실무 문서는 담당 범위와 설계 판단을 설명하기 위한 공개 자료입니다. 사내 소스 코드·운영 화면·고객 데이터는 제외했으며, 코드 예시는 처리 흐름을 축약해 작성했습니다.

### 공개 코드로 살펴볼 프로젝트

- **[ticket-rush](https://github.com/YongjaeKwon/ticket-rush)** — 진행 중인 개인 예매 시스템입니다. Java/Spring 기반 좌석 선점·예약 확정과 웹 화면을 구현하고, 동시 요청·홀드 만료·중복 확정을 테스트합니다.
- **[데이터 검증·조회 데모](https://github.com/YongjaeKwon/quant-lab)** — 합성 데이터를 저장·검증하고 FastAPI·React로 조회하는 개인 프로젝트입니다. 재실행 시 데이터 정합성, 오류 처리와 화면 상태를 테스트합니다.
- **[SSAFAST](https://github.com/SSAFAST/ssafast)** — SSAFY 팀 프로젝트에서 React·TypeScript 기반 동적 API 명세 입력 폼과 테스트 결과 화면을 담당했습니다.
- **[ddoing](https://github.com/GomGom-Team/ddoing)** — SSAFY 팀 프로젝트에서 React·Canvas 기반 그림 학습 화면, 타이머와 판정 서버 연동을 담당했습니다.
- **[MODAC](https://github.com/YongjaeKwon/MODAC)** — SSAFY 팀 프로젝트에서 Vue 기반 스터디룸 입장 흐름, 학습 기록 화면과 채팅 UI 연동을 담당했습니다.

포트폴리오 안의 ticket-rush·SSAFAST·ddoing·MODAC 데모는 **샘플 데이터로 기능 흐름을 재구성한 브라우저 시뮬레이션**입니다. 외부 서버·DB에 연결하지 않으며, 성능 수치·동시 요청·AI 판정·채팅 결과도 시뮬레이션으로 제공합니다. 원본 구현과 테스트는 위 공개 저장소에서 확인할 수 있습니다.

## 로컬 실행과 검증

Node.js 20.9 이상과 npm이 필요합니다.

```bash
npm ci
npm run dev
```

```bash
npm test
npm run build
npm run preview
```

`npm test`는 프로젝트의 직무별 표시와 로직 단위 테스트, UI·콘텐츠 관련 소스 검사를 실행합니다. 검증 대상은 이 포트폴리오이며, 실제 브라우저의 전체 사용자 흐름이나 소개된 다른 시스템을 검증하는 테스트는 아닙니다.

`npm run build`는 타입 검사 후 `dist/`에 정적 배포 파일을 생성합니다. 빌드 결과는 `npm run preview`로 확인할 수 있습니다.
