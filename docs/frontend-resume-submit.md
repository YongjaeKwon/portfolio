# 권용재

프론트엔드 개발자

- Email: koj185364@naver.com
- Phone: 010-9470-1704
- GitHub: https://github.com/YongjaeKwon
- Location: 경기도 용인시 수지구

## Summary

운영 중인 B2B·B2G 시스템에서 WebSquare, JSP, Vue.js 기반 화면 개발과 REST API 연동, 권한 조건 반영, 데이터 조회 흐름 개선을 경험했습니다.

모바일 AS 접수, 진행상태 조회, 태블릿 전자서명, 개인정보 동의 화면, Vue 기반 관리자 화면처럼 사용자가 실제로 거치는 업무 화면을 개발해왔습니다. 화면만 따로 보지 않고 API 응답, 권한 조건, SQL 조회 흐름이 실제 사용 흐름과 맞는지 함께 확인하며 구현합니다.

개인·팀 프로젝트에서는 React, TypeScript, Next.js, Zustand, React Query, FastAPI, WebSocket, Docker Compose를 활용해 실시간 데이터 대시보드와 개발자 도구형 UI를 만들었습니다. 웹/모바일 플랫폼, 관리자 도구, 데이터 대시보드처럼 운영과 사용자 행동이 맞닿는 화면을 안정적으로 만드는 일에 집중하고 있습니다.

## Core Skills

- Frontend: HTML5, CSS3, SASS/SCSS, JavaScript, TypeScript, Vue.js, React, Next.js, Zustand, Pinia, React Query, React Hook Form, JSP, WebSquare, Nexacro, jQuery
- Backend: Java, Spring Boot, Spring MVC, Spring Security, MyBatis, FastAPI, Python, REST API, JWT, WebSocket
- Database: MariaDB, Oracle, PostgreSQL, Redis, SQLite, PL/SQL
- Tools: Git, SVN, Maven, Gradle, Docker, Docker Compose, Nginx, Node.js, Vite, TailwindCSS, Chart.js, Tabulator
- Design Handoff: Figma / Photoshop 시안 확인 및 구현 기준 해석
- Learning: React / TypeScript 실시간 대시보드 개발, 컨테이너 기반 서비스 분리

## Experience

### 유한책임회사 티지나래

Java/Spring 기반 웹 시스템 개발자  
2024.06 ~ 재직 중

- 솔루션사업부에서 사수와 2인 체제로 B2B·B2G 운영 시스템 4건의 화면, API, SQL, 외부 연동 기능 개발
- WebSquare, JSP, Vue.js, Nexacro 기반 화면 개발과 Java/Spring 기반 API 및 데이터 처리 로직 구현
- 운영 중 발생하는 화면 오류, 데이터 조회 조건 오류, 권한 반영 이슈 대응
- Spring Boot 3 신규 환경부터 Spring MVC 레거시 환경까지 다양한 기술 환경에서 업무 수행

## Projects

### AS / 설치 / 상담 업무관리 시스템 (TSMS)

2025.12 ~ 현재 · 2인 팀 · 프론트엔드 주담당

데스크톱, 모바일, 태블릿에서 사용되는 AS·설치·상담 업무 화면을 개발하며 접수, 동의, 첨부, 전자서명, 진행상태 조회 단계가 끊기지 않도록 구현했습니다.

- WebSquare / JSP 기반 업무 처리 화면 신규 개발 및 운영 오류 수정
- 모바일 AS 접수, 진행상태 조회, 태블릿 전자서명, 개인정보 동의 화면 구현
- 입력값 검증, 단계별 선택 흐름, 파일 조회·업로드 UI 개선
- 외부 REST API 연계 화면 개발 및 메일·문자·알림톡 발송 결과 화면 상태 연동
- 데이터 조회 조건 오류 및 권한 반영 이슈 수정

사용 기술: JavaScript, WebSquare, JSP, jQuery, Java, Spring, REST API

### TGS 협력사 포탈 시스템 (PPS)

2025.01 ~ 현재 · 3인 팀 · 백엔드 및 Vue 화면 개발

Vue.js 기반 관리자 화면과 Spring Boot API를 연동해 협력사 교육 운영에 필요한 등록, 대상자 관리, 파일 업로드, 메일 발송, 제출 현황 조회 화면을 개발했습니다.

- Spring Boot 3 기반 백엔드와 Vue.js 기반 관리자 화면 개발
- 교육 등록, 대상자 엑셀 업로드, 대상자별 메일 발송, 제출 현황 조회 흐름 구현
- 게시판·제안하기·설문에서 쓰이는 댓글·대댓글 UI와 처리 흐름 공통화
- 파일 업로드·조회 기능과 연계된 화면 및 데이터 처리 로직 개발
- Google OTP 2단계 인증, IP 기반 인증 예외, 인증 상태별 분기 처리 개선
- 협력사·CE·교육 데이터의 조회 조건과 화면 상태를 운영 정책에 맞게 개선
- MariaDB / Oracle 연동 환경에서 데이터 조회 및 통계 SQL 작성

사용 기술: Vue.js, Java, Spring Boot, MyBatis, MariaDB, Oracle, 인증·보안, 통계 SQL

### 퀀트 트레이딩 시스템 (quant-core)

2026.03 ~ 현재 · 개인 학습 프로젝트

시장 데이터 수집, 전략 백테스트, 실거래 실행 구조를 학습하기 위해 진행 중인 개인 프로젝트입니다. FastAPI 백엔드와 React/TypeScript 대시보드를 6개 컨테이너로 분리해 서비스 구조를 익히고 있습니다.

- JWT 인증과 Redis 블랙리스트 기반 로그아웃, IP별 로그인 실패 제한 구현
- WebSocket으로 포지션·체결 결과를 프론트에 실시간 브로드캐스트
- Walk-Forward 검증과 백테스트 실행 화면 구현, 실거래 정산은 수수료·펀딩비 포함 net PnL 기록
- PostgreSQL·Redis·API·UI·Collector·Backup의 6개 컨테이너 Docker Compose 구성

사용 기술: React, TypeScript, Zustand, Recharts, FastAPI, Python, PostgreSQL, Redis, Docker, Nginx, WebSocket, JWT

### API 설계·테스트 협업 플랫폼 (SSAFAST)

2023.04 ~ 2023.05 · 6인 팀 · 프론트엔드 개발

Figma, API 명세, 요청 테스트, 유스케이스 테스트, 성능 테스트를 한 공간에서 연결한 SSAFY 팀 프로젝트입니다. Next.js와 TypeScript 기반으로 성능 테스트 UI와 BaseURL 인증 가드, 공통 Modal 컴포넌트를 구현했습니다.

- 성능 테스트 UI 전체 구현: API 선택, 파라미터 입력, 실행, p50/p95/p99·throughput 결과 표시
- BaseURL 소유권 인증 가드: 프레임워크별 인증 코드 안내와 다중 URL 코드 검증
- React Hook Form·FormProvider로 중첩 요청 DTO 입력과 상태 동기화 처리
- ReactDOM.createPortal 기반 공통 Modal로 SSR 안전성과 z-index 충돌 해결

사용 기술: Next.js, React, TypeScript, React Query, React Hook Form, Redux Toolkit, TailwindCSS, Axios

### 기타 운영 시스템 경험

- SR30 물류관리시스템: Nexacro / Spring MVC 기반 설문조사 기능, 통계 조회 화면, PL/SQL 작성. 3인 팀에서 업무를 분담했으며 설문 응답률 5%에서 20%로 개선
- 교육청 IT 자산관리 솔루션: Spring MVC / MyBatis 기반 자산 등록·대여·반납·폐기, P2P 이동/승인 화면 및 권한별 조회 조건, 외부 API 연계 기능 개선

## Education

### 아주대학교

2018.03 ~ 2020.08  
e-비즈니스학과 · 학사 편입 졸업 · 학점 3.67 / 4.5

### 삼성 청년 SW 아카데미 (SSAFY)

2022.07 ~ 2023.06  
1년 과정 수료 · Next.js 기반 API 협업 플랫폼으로 2학기 심화 프로젝트 우수상

## Certificates

- SQLD (SQL 개발자) · 2024.09 취득
