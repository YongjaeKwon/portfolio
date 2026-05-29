# Yongjae Kwon Portfolio

웹 프론트엔드 개발자로서 실무 경험과 개인 프로젝트를 정리한 포트폴리오입니다.

운영 중인 B2B·B2G 시스템에서 쌓은 웹/모바일 업무 화면 개발, REST API 연동, Vue.js 관리자 화면 개발, 권한·조회 조건 처리 경험을 프론트엔드 직무 관점으로 보여주는 것을 목표로 합니다. 개인·팀 프로젝트에서는 React, TypeScript, Next.js, Zustand, React Query, FastAPI, WebSocket, Docker Compose를 활용해 실시간 데이터 대시보드와 개발자 도구형 UI를 다뤘습니다.

## Design Direction

현재 UI는 `platform dashboard`를 컨셉으로 구성했습니다. 일반적인 포트폴리오보다 운영 콘솔, 관리자 도구, 데이터 대시보드에 가까운 인상을 주기 위해 다음 기준을 적용했습니다.

- 다크/라이트 모드 지원
- 그리드 배경과 콘솔형 카드로 플랫폼/운영툴 분위기 표현
- 단일 액센트 철학 — cyan은 CTA 버튼과 활성 내비게이션에만 사용, 나머지는 white-opacity 계열 뉴트럴
- 프로젝트를 단순 카드 나열이 아니라 case study 패널로 구성
- 기술스택과 직무 적합성 영역에 아이콘과 칩 UI 적용
- 커서 spotlight, 스크롤 reveal 애니메이션, 타이핑 효과로 생동감 부여
- 모바일 화면에서 버튼, 카드, 텍스트가 좁은 폭에서도 읽히도록 반응형 구성

## Positioning

**웹 프론트엔드 개발자**

- 실제 사용자가 반복해서 쓰는 업무 화면 개발 경험
- 모바일·태블릿 환경의 접수, 동의, 첨부, 전자서명 화면 구현 경험
- REST API, 인증, 외부 API 응답과 화면 상태 연결 경험
- Vue.js 기반 관리자 화면 실무 경험
- React / TypeScript / Next.js 기반 실시간 데이터 대시보드와 개발자 도구형 UI 경험
- 백엔드와 SQL 흐름을 이해한 프론트엔드 구현

## Featured Projects

### AS / 설치 / 상담 업무관리 시스템 (TSMS)

데스크톱, 모바일, 태블릿에서 사용되는 AS·설치·상담 업무 화면을 개발했습니다.

- WebSquare / JSP 기반 화면 신규 개발 및 오류 수정
- 모바일 AS 접수, 진행상태 조회, 태블릿 전자서명, 개인정보 동의 화면 구현
- 입력값 검증, 단계별 선택 흐름, 파일 조회·업로드 UI 개선
- 외부 REST API, 메일, 문자, 알림톡 발송 결과를 화면 상태와 연결

### TGS 협력사 포탈 시스템 (PPS)

Vue.js 기반 관리자 화면과 Spring Boot API를 연동해 협력사 교육 운영 기능을 개발했습니다.

- 교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회 흐름 구현
- 게시판·제안하기·설문에서 쓰이는 댓글·대댓글 UI와 처리 흐름 공통화
- Google OTP 2단계 인증, IP 기반 인증 예외, 인증 상태별 분기 처리 개선
- 협력사·CE·교육 데이터의 조회 조건과 화면 상태를 운영 정책에 맞게 개선
- MariaDB / Oracle 기반 데이터 조회 및 통계 SQL 작성

### 교육청 IT 자산관리 솔루션

교육청과 학교의 IT 자산을 등록, 대여, 반납, 폐기 단계로 관리하는 업무 화면을 개발했습니다.

- 자산 등록·대여·반납·폐기 흐름에 따른 화면 및 SQL 작성
- 교육청·학교·행사·제품 기준의 검색 조건과 현황 조회 화면 개선
- 교육청·학교 권한에 따른 데이터 조회 조건 반영
- SMS, 메일, 알림톡, 우편번호 등 외부 API 연계 기능 개선

### Quant Core

시장 데이터 수집, 전략 백테스트, 실거래 실행 구조를 학습하기 위해 진행 중인 개인 프로젝트입니다. FastAPI 백엔드와 React/TypeScript 대시보드를 6개 컨테이너로 분리해 서비스 구조를 익히고 있습니다.

- JWT 인증과 Redis 블랙리스트 기반 로그아웃, IP별 로그인 실패 제한 구현
- WebSocket으로 포지션·체결 결과를 프론트에 실시간 브로드캐스트
- Walk-Forward 검증과 백테스트 실행 화면 구현, 실거래 정산은 수수료·펀딩비 포함 net PnL 기록
- PostgreSQL·Redis·API·UI·Collector·Backup의 6개 컨테이너 Docker Compose 구성

### SSAFAST

Figma, API 명세, 요청 테스트, 유스케이스 테스트, 성능 테스트를 한 공간에서 연결한 SSAFY 팀 프로젝트입니다.

- Next.js / TypeScript 기반 성능 테스트 UI 전체 구현
- BaseURL 소유권 인증 가드와 다중 URL 인증 코드 검증 화면 구현
- React Hook Form 기반 중첩 DTO 입력, 요청 파라미터 조립, 상태 동기화 처리
- ReactDOM.createPortal 기반 공통 Modal로 SSR 안전성과 z-index 충돌 해결
- SSAFY 2학기 심화 프로젝트 우수상 수상

## Tech Stack

### Frontend

HTML5, CSS3, SASS/SCSS, JavaScript, TypeScript, Vue.js, React, Next.js, Zustand, Pinia, React Query, React Hook Form, JSP, WebSquare, Nexacro, jQuery

### Backend

Java, Spring Boot, Spring MVC, Spring Security, MyBatis, FastAPI, Python, REST API, JWT, WebSocket

### Database

MariaDB, Oracle, PostgreSQL, Redis, SQLite, PL/SQL

### Tools

Git, SVN, Maven, Gradle, Docker, Docker Compose, Nginx, Node.js, Vite, TailwindCSS, Chart.js, Tabulator, Figma 시안 확인, Photoshop 시안 확인

## Project Structure

```text
src/
  components/        공통 UI 컴포넌트
  data/portfolio.ts  포트폴리오 프로필, 프로젝트, 기술 데이터
  views/             섹션 단위 화면
docs/
  frontend-resume-draft.md   이력서 상세 초안
  frontend-resume-submit.md  제출용 간결 이력서
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

## Deployment

Vite 기반 정적 사이트이므로 Vercel 또는 Netlify에 배포할 수 있습니다.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20 이상 권장

## Resume

제출용 이력서 초안은 [docs/frontend-resume-submit.md](docs/frontend-resume-submit.md)에 정리되어 있습니다.
