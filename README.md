# Yongjae Kwon Portfolio

웹 프론트엔드 개발자로서 실무 경험과 개인 프로젝트를 정리한 포트폴리오입니다.

운영 중인 B2B·B2G 시스템에서 쌓은 웹/모바일 업무 화면 개발, REST API 연동, Vue.js 관리자 화면 개발, 권한·조회 조건 처리 경험을 프론트엔드 직무 관점으로 보여주는 것을 목표로 합니다.

## Design Direction

현재 UI는 `platform dashboard`를 컨셉으로 구성했습니다. 일반적인 포트폴리오보다 운영 콘솔, 관리자 도구, 데이터 대시보드에 가까운 인상을 주기 위해 다음 기준을 적용했습니다.

- 다크/라이트 모드 지원
- 그리드 배경과 콘솔형 카드로 플랫폼/운영툴 분위기 표현
- cyan, emerald, amber, violet을 역할별 포인트 컬러로 분리
- 프로젝트를 단순 카드 나열이 아니라 case study 패널로 구성
- 기술스택과 직무 적합성 영역에 아이콘과 칩 UI 적용
- 모바일 화면에서 버튼, 카드, 텍스트가 좁은 폭에서도 읽히도록 반응형 구성

## Positioning

**웹 프론트엔드 개발자**

- 실제 사용자가 마주하는 업무 화면 개발 경험
- 모바일·태블릿 환경의 입력 흐름 구현 경험
- REST API 응답과 화면 상태 연결 경험
- Vue.js 기반 관리자 화면 실무 경험
- 백엔드와 SQL 흐름을 이해한 프론트엔드 구현

## Featured Projects

### AS / 설치 / 상담 업무관리 시스템 (TSMS)

데스크톱, 모바일, 태블릿에서 사용되는 AS·설치·상담 업무 화면을 개발했습니다.

- WebSquare / JSP 기반 화면 신규 개발 및 오류 수정
- 모바일 AS 접수, 태블릿 전자서명, 개인정보 동의 화면 구현
- 입력값 검증, 단계별 선택 흐름, 파일 조회·업로드 UI 개선
- 외부 REST API, 메일, 문자, 알림톡 발송 기능 연동

### TGS 협력사 포탈 시스템 (PPS)

Vue.js 기반 관리자 화면과 Spring Boot API를 연동해 협력사 교육 운영 기능을 개발했습니다.

- 교육 등록, 대상자 관리, 참석 여부 관리 화면 개발
- 엑셀 일괄 업로드, 대상자별 메일 발송, 제출 현황 조회 기능 구현
- Google OTP 2단계 인증 및 IP 기반 인증 예외 처리 개선
- MariaDB / Oracle 기반 데이터 조회 및 통계 SQL 작성

### 교육청 IT 자산관리 솔루션

교육청과 학교의 IT 자산을 등록, 대여, 반납, 폐기 단계로 관리하는 업무 화면을 개발했습니다.

- 자산 등록·대여·반납·폐기 흐름에 따른 화면 및 SQL 작성
- 교육청·학교·행사·제품 기준의 검색 조건과 현황 조회 화면 개선
- 교육청·학교 권한에 따른 데이터 조회 조건 반영
- SMS, 메일, 알림톡, 우편번호 등 외부 API 연계 기능 개선

### Quant Core

React, TypeScript, FastAPI 기반 개인 프로젝트입니다.

- Binance API 기반 OHLCV 데이터 수집
- FastAPI 백엔드 API 개발
- React / TypeScript 대시보드 개발
- 수익률, MDD, 승률, 거래 횟수 등 지표 화면 표시
- Docker 기반 개발 환경 구성 실험

## Tech Stack

### Frontend

HTML5, CSS3, SASS/SCSS, JavaScript, Vue.js, React, TypeScript, JSP, WebSquare, Nexacro, jQuery

### Backend

Java, Spring Boot, Spring MVC, Spring Security, MyBatis, REST API

### Database

MariaDB, Oracle, PostgreSQL, SQLite, PL/SQL

### Tools

Git, SVN, Maven, Gradle, Docker, Node.js, Vite, Figma 시안 확인, Photoshop 시안 확인

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
