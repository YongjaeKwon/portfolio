# Yongjae Kwon Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/Vue%203-42b883?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

운영 시스템과 관리자 도구 경험을 프론트엔드 중심으로 보여주는 Vue 3 + TypeScript + Vite 포트폴리오입니다.

> Vue 기반 운영/관리자 화면을 구현하고 API 응답, 권한 조건, SQL 조회 흐름까지 직접 확인하는 프론트엔드 개발자 포트폴리오

운영 중인 B2B·B2G 시스템에서 Vue 기반 관리자·모바일 화면을 개발하고, REST API 연동, 권한·조회 조건 처리, 화면 값과 SQL 결과의 정합성 검증까지 담당한 경험을 프론트엔드 관점으로 정리했습니다. 개인·팀 프로젝트에서는 React·TypeScript·Next.js로 실시간 데이터 대시보드와 개발자 도구형 UI를 만들었고, TanStack Query, WebSocket, Sentry 모니터링, Vitest 테스트, Docker, GitHub Actions CI를 직접 구성해 봤습니다.

## Quick Links

| Link | URL |
| --- | --- |
| Live Portfolio | [portfolio-six-inky-14.vercel.app](https://portfolio-six-inky-14.vercel.app/) |
| Resume | [resume.pdf](https://portfolio-six-inky-14.vercel.app/resume.pdf) |

## Recruiter Snapshot

| Item | Detail |
| --- | --- |
| Positioning | 운영자가 반복해서 쓰는 업무 흐름을 화면, API, SQL, 외부 연동까지 연결해 구현하는 프론트엔드 개발자. |
| Core Stack | Production: Vue, WebSquare, JavaScript, Spring, MyBatis / Project: React, TypeScript, Next.js |
| Best-fit Roles | Frontend Developer, Admin/Operations Tool Frontend, Vue·React Frontend |
| Project Signals | 실무 운영 시스템 3개, 개인·팀 프로젝트 4개 |
| Privacy | 본 포트폴리오는 채용 제출용 직접 링크로 운영하며, 실무 보안상 검색 노출은 제한했습니다. |

## Preview

![Portfolio social preview](public/og-image.png)

## Project Visuals

| ddoing | MODAC |
| --- | --- |
| <img src="public/projects/ddoing.png" width="360" alt="또잉 Drawing 영어 학습 게임 화면" /> | <img src="public/projects/modac.png" width="360" alt="MODAC 학습방 화면" /> |

| quant-lab (quant-core 공개용) | SSAFAST |
| --- | --- |
| <img src="public/projects/quant-core.png" width="360" alt="quant-core 개인 프로젝트 화면" /> | <img src="public/projects/ssafast.png" width="360" alt="SSAFAST 성능 테스트 결과 화면" /> |

## Design Direction

현재 UI는 `platform dashboard`를 컨셉으로 구성했습니다. 일반적인 포트폴리오보다 운영 콘솔, 관리자 도구, 데이터 대시보드에 가까운 인상을 주기 위해 다음 기준을 적용했습니다.

- CSS 디자인 토큰 기반 테마 시스템 — 기본/메이플/오버워치 3종 스킨을 `data-skin` 속성과 스코프 격리된 토큰으로 전환
- 다크/라이트 모드 지원
- 모바일 화면에서 버튼, 카드, 텍스트가 좁은 폭에서도 읽히도록 반응형 구성
- 단일 액센트 철학 — 액센트 컬러는 CTA 버튼과 활성 내비게이션에만 사용, 나머지는 뉴트럴
- 프로젝트를 단순 카드 나열이 아니라 case study 패널로 구성
- 그리드 배경과 콘솔형 카드, 칩 UI로 플랫폼/운영툴 분위기 표현
- 커서 spotlight, 스크롤 reveal 애니메이션, 타이핑 효과로 생동감 부여

## Positioning

**업무 흐름을 잘 이해하는 프론트엔드 개발자**

- 운영자가 반복해서 쓰는 관리자 화면과 업무 단계형 화면 개발 경험
- 등록, 업로드, 발송, 조회, 이력 확인이 이어지는 업무 흐름 구현 경험
- Vue.js, WebSquare, JSP 기반 실무 화면 개발 경험
- REST API, 인증, 메일, 파일, 알림 발송 결과와 화면 상태 연결 경험
- 권한, 조직, 기간, 상태값에 따른 조회 조건과 MyBatis SQL 흐름 이해
- React / TypeScript / Next.js 기반 실시간 데이터 대시보드와 개발자 도구형 UI 구현
- Sentry 에러 모니터링, Vitest 테스트, GitHub Actions CI를 개인 프로젝트에서 직접 구성한 경험

## Featured Projects

### B2B 협력사 운영 포탈 (PPS)

Vue.js 기반 관리자 화면과 Spring Boot API를 연동해 협력사 교육 운영, 고객사 담당자 현황, 공지/설문/댓글, 인증 예외 처리 기능을 개발했습니다.

- 교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회 흐름 구현
- 게시판·제안하기·설문에서 쓰이는 댓글·대댓글 UI와 처리 흐름 공통화
- 고객사 담당자 현황 메일 발송, 발송 이력 저장, 검증 상태별 조회 조건 개선
- 2단계 인증, 접근 예외, 공지 읽음 이력 처리 개선
- MariaDB / MySQL 기반 데이터 조회 및 통계 SQL 작성

### AS·현장 서비스 운영 시스템 (TSMS)

협력사·A/S·자산·물류 등 다수 모듈로 구성된 대규모 운영 시스템에서, 데스크톱·모바일·태블릿으로 이어지는 AS 접수·상담·동의·서명 업무 화면을 개발했습니다.

- WebSquare / JSP 기반 화면 신규 개발 및 운영 오류 수정
- AS 접수·이관·배정, 진행상태 조회, 모바일 접수 화면 개선
- 개인정보 동의, QR 확인, 무인보관함 접수, 태블릿 전자서명 흐름 구현
- 협력사 포탈(PPS) API 연동, 알림톡 등 외부 메시지·메일 발송 결과를 화면 상태로 반영
- 권한별 조회 조건과 배송 일정, 라벨/엑셀, 파일 조회·업로드 화면 개선

### 교육청 IT 자산관리 솔루션 (asstMng)

교육청과 학교의 IT 자산을 등록, 현황 조회, 상태 관리, 이력 확인, 대시보드 집계로 관리하는 업무 화면을 개발했습니다.

- 자산 대시보드, 자산현황, 유상처리 현황 화면 개발 및 개선
- 교육청·학교·부서 권한에 따른 데이터 조회 범위와 검색 조건 반영
- 사업 차수, 기관, 자산 상태 기준의 집계와 목록 조회 SQL 개선
- TSMS와 API 연동으로 자산 데이터를 연계, 배치 이력·숫자/일자 포맷 등 운영 이슈 대응

### 또잉 영어 학습 서비스 (ddoing)

영어가 어려운 아이들을 위한 애니메이션 shadowing 및 Drawing 기반 영어 학습 서비스입니다. 기획을 겸하며 React/TypeScript 기반 Main Page, Drawing Page, AI 추론 API 연동 흐름을 담당했습니다.

- Canvas 입력, 타이머, 정답·오답·패스, 게임 완료 화면 흐름 구현
- 분류 모델 추론 결과를 Drawing Page에 연결해 사용자 그림을 게임 상태로 반영
- Drawing 결과 저장, 점수 요청, 경험치 반영, Hall of Fame 화면 개선
- AI 학습 데이터 전처리와 프론트엔드 연동 범위 조율

### Quant Core (quant-core)

시뮬레이션 기반 백테스트와 실시간 대시보드 구조를 직접 설계한 개인 풀스택 프로젝트입니다. FastAPI 백엔드와 React/TypeScript 대시보드를 컨테이너로 분리해 서비스 구조를 익혔습니다.

- React 19 / TypeScript / Zustand / Recharts 실시간 대시보드 구현, 포지션 화면을 TanStack Query로 마이그레이션
- WebSocket으로 포지션·체결 결과를 프론트에 실시간 브로드캐스트(자동 재연결)
- JWT 인증과 Redis 블랙리스트 기반 로그아웃, IP별 로그인 실패 제한 구현
- Sentry ErrorBoundary와 Vitest·React Testing Library 테스트, GitHub Actions CI 구성
- PostgreSQL·Redis·API·UI·Collector·Backup의 6개 컨테이너 Docker Compose 구성

### SSAFAST

Figma, API 명세, 요청 테스트, 유스케이스 테스트, 성능 테스트를 한 공간에서 연결한 SSAFY 자율 프로젝트입니다.

- Next.js / TypeScript 기반 성능 테스트 UI 전체 구현
- BaseURL 소유권 인증 가드와 다중 URL 인증 코드 검증 화면 구현
- React Hook Form 기반 중첩 DTO 입력, 요청 파라미터 조립, 상태 동기화 처리
- ReactDOM.createPortal 기반 공통 Modal로 SSR 안전성과 z-index 충돌 해결
- SSAFY 2학기 자율 프로젝트 우수상 수상

## Additional SSAFY Projects

### MODAC

개발자를 위한 학습 내용 기록 및 공유 플랫폼입니다. Vue 3와 Pinia 기반 프론트엔드에서 학습방, Feed, Markdown 학습일지, GitHub commit 연동, 실시간 room 기능 일부를 구현했습니다.

- Vue 3 / Vite / Pinia 기반 화면과 상태 관리 구현
- 공개방·비공개방 입장, 학습방 설정, 퇴장, 참여자 상태 흐름 개선
- WebSocket 기반 group chat, room store, subscription 흐름 구현
- Feed, article, like, follow, 알림, mypage 등 학습 기록 공유 화면 개선

## Tech Stack

### Frontend

HTML5, CSS3, SASS/SCSS, JavaScript, TypeScript, Vue.js, React, Next.js, Zustand, Pinia, Redux, React Query, React Hook Form, Canvas, JSP, WebSquare, jQuery

### Backend

Java, Spring Boot, Spring MVC, Spring Security, MyBatis, FastAPI, Python, REST API, JWT, WebSocket

### Database

MariaDB, MySQL, PostgreSQL, Redis

### Tools

Git, SVN, Maven, Gradle, Docker, Docker Compose, Nginx, Node.js, Vite, TailwindCSS, GitHub Actions, Vitest, Figma 시안 확인, Photoshop 시안 확인

## Project Structure

```text
src/
  components/        공통 UI 컴포넌트
  composables/       skin/track 등 공통 상태 훅
  data/portfolio.ts  포트폴리오 프로필, 프로젝트, 기술 데이터
  views/             섹션 단위 화면
public/
  case-studies/      프로젝트 case study 마크다운
  resume.pdf         공개 이력서
docs/
  resume-general.html  공개 이력서 HTML 소스 (→ public/resume.pdf 생성)
scripts/
  generate-resumes.mjs HTML/Markdown → PDF 자동 생성 스크립트
```

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Resume

```bash
npm run resumes:pdf   # docs/resume-general.html → public/resume.pdf 재생성
```

## Deployment

Vite 기반 정적 사이트이므로 Vercel 또는 Netlify에 배포할 수 있습니다.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20 이상 권장
