# 권용재

프론트엔드 개발자

- Email: koj185364@naver.com
- Phone: Available on request
- GitHub: https://github.com/YongjaeKwon
- Location: 경기도 용인시 수지구

## Summary

B2B·B2G 운영 시스템에서 관리자 화면, 모바일 업무 화면, REST API 연동, 권한별 조회 조건, MyBatis SQL, 메일·파일·인증 연동을 함께 다뤄온 프론트엔드 중심 웹 개발자입니다.

실무에서는 Vue 기반 협력사 포탈, WebSquare/JSP 기반 AS 업무 화면, JSP/Spring MVC 기반 자산관리 화면, Nexacro 기반 물류 운영 화면을 개발했습니다. 단순 화면 구현보다 사용자가 실제로 처리하는 등록, 업로드, 발송, 조회, 이력 확인 흐름이 끊기지 않도록 화면 상태와 서버 데이터 흐름을 함께 확인하며 개발합니다.

개인·팀 프로젝트에서는 React, TypeScript, Next.js, Redux, Zustand, React Query, Canvas, FastAPI, WebSocket, Docker Compose를 활용해 실시간 데이터 대시보드, 개발자 도구형 UI, AI 연동 학습 화면을 만들었습니다.

## Core Skills

- Frontend: HTML5, CSS3, SASS/SCSS, JavaScript, TypeScript, Vue.js, React, Next.js, Zustand, Pinia, Redux, React Query, React Hook Form, Canvas, JSP, WebSquare, Nexacro, jQuery
- Backend: Java, Spring Boot, Spring MVC, Spring Security, MyBatis, FastAPI, Python, REST API, JWT, WebSocket
- Database: MariaDB, Oracle, PostgreSQL, Redis, SQLite, PL/SQL
- Tools: Git, SVN, Maven, Gradle, Docker, Docker Compose, Nginx, Node.js, Vite, TailwindCSS, Chart.js, Tabulator
- Strength: 관리자 화면, 업무 단계형 화면, 권한/조회 조건, 파일 업로드, 메일/알림 발송, 엑셀 다운로드, 운영 이슈 대응

## Experience

### 유한책임회사 티지나래

Java/Spring 기반 웹 시스템 개발자  
2024.06 ~ 재직 중

- 솔루션사업부에서 B2B·B2G 운영 시스템의 화면, API, SQL, 외부 연동 기능 개발
- Vue, WebSquare, JSP, Nexacro 기반 관리자/모바일 업무 화면 신규 개발 및 운영 오류 수정
- Spring Boot 3 신규 환경과 Spring MVC 환경에서 API, MyBatis SQL, 메일·파일·인증 연동 흐름 구현
- 조회 조건, 권한 반영, 입력 검증, 상태값 불일치 문제를 재현하고 유사 화면까지 함께 점검

## Projects

### TGS 협력사 포탈 시스템 (PPS)

2025.02 ~ 현재 · 3인 팀 · 백엔드 및 Vue 화면 개발

협력사, CE, 교육, 계약, 공지, 설문 데이터를 관리하는 Spring Boot 3 기반 운영 포탈입니다. Vue 화면과 Tabulator 그리드, Spring Boot API, MyBatis SQL을 연결해 운영자가 반복해서 사용하는 교육관리와 협력사 관리 흐름을 개발했습니다.

- 교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회 흐름 구현
- 게시판·제안하기·설문에서 쓰이는 댓글·대댓글 UI와 처리 흐름 공통화
- CE 현황 메일 발송, 발송 이력 저장, 검증 상태별 조회 조건 개선
- Google OTP 2단계 인증, IP 기반 인증 예외, 공지 읽음 이력 처리 개선
- MariaDB / Oracle 연동 환경에서 데이터 조회 및 통계 SQL 작성

사용 기술: Vue.js, JavaScript, Tabulator, Java, Spring Boot, Spring Security, MyBatis, MariaDB, Oracle

### TSMS / IDCMS AS 업무 시스템

2025.09 ~ 현재 · 2인 팀 · 프론트엔드 주담당

AS 접수, 상담, 이관, 배정, 배송, 개인정보 동의, QR 확인, 태블릿 전자서명 업무를 처리하는 WebSquare/JSP 기반 운영 시스템입니다. 데스크톱, 모바일, 태블릿 화면이 같은 업무 데이터를 기준으로 이어지도록 구현했습니다.

- AS 접수·이관·배정, 진행상태 조회, 모바일 접수 화면 개선
- 개인정보 동의, QR 확인, 무인보관함 접수, 태블릿 전자서명 흐름 구현
- 배송 일정, 학생 일괄 처리, 라벨/엑셀, 파일 조회·업로드 화면 개선
- 알림톡·BizTalk·메일 발송 결과와 권한별 조회 조건을 화면 상태로 반영
- 권한 또는 센터 조건 변경 후 목록과 상세 화면의 조회 범위 점검

사용 기술: JavaScript, WebSquare, JSP, jQuery, Java, Spring MVC, MyBatis, MariaDB, REST API

### 교육청 IT 자산관리 솔루션

2025.09 ~ 2026.03 · 2인 팀 · 백엔드 및 화면 개발

교육청과 학교의 IT 자산을 등록, 현황 조회, 상태 관리, 이력 확인, 유상처리 현황, 대시보드 집계로 관리하는 Spring MVC 기반 업무 시스템입니다.

- 자산관리 대시보드, 자산현황, 유상처리 현황 화면 개발 및 개선
- 교육청·학교·부서 권한에 따른 데이터 조회 범위와 검색 조건 반영
- 사업 차수, 기관, 자산 상태 기준의 집계와 목록 조회 SQL 개선
- 대시보드 클릭 라우팅, 배치 이력, 메뉴 개편, 숫자·일자 포맷 등 운영 이슈 대응

사용 기술: Java, Spring MVC, JSP, MyBatis, MariaDB, Tabulator, REST API

### SR30 물류관리시스템

2024.07 ~ 2025.07 · 3인 팀 · 운영 기능 개선 및 신규 기능 개발

Nexacro와 Spring MVC 기반 물류·서비스 운영 시스템에서 일정, 설문, 재고, 리포트, KPI, 엑셀 다운로드, 관리자 이력 조회 화면을 개선했습니다.

- 일정 공유, 근무 일정, 서비스 리포트, KPI 조회 화면 개선
- 설문 등록·응답·통계, 운영 설문 데이터 수집 흐름 구현
- 물류·재고·자재·입출고 및 설치/철거 리포트 화면 개선
- 개인정보 다운로드, 데이터 삭제, 접근 이력 등 관리자 이력 조회 기능 대응
- 화면 필터, SQL 조건, 엑셀 다운로드 결과가 같은 기준으로 동작하는지 점검

사용 기술: Nexacro, Java, Spring MVC, MyBatis, PL/SQL, Oracle

### 또잉 영어 학습 서비스 (ddoing)

2023.02 ~ 2023.04 · 6인 팀 · PM 및 프론트엔드·AI 연동

영어가 어려운 아이들을 위한 애니메이션 shadowing 및 Drawing 기반 영어 학습 서비스입니다. React/TypeScript 기반 Drawing Page에서 Canvas 입력, AI 추론 요청, 정답/오답/점수 흐름을 게임 경험으로 연결했습니다.

- Canvas 입력, 타이머, 정답·오답·패스, 게임 완료 화면 흐름 구현
- 분류 모델 추론 API를 프론트엔드에 연결해 사용자 그림 결과를 학습 상태로 반영
- Drawing 결과 저장, 점수 요청, 경험치 반영, Hall of Fame 화면 개선
- PM 역할로 화면 흐름, AI 연동 범위, 학습 데이터 전처리 업무 조율

사용 기술: React, TypeScript, Redux, Vite, TailwindCSS, Canvas, FastAPI, TensorFlow

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

## Education

### 아주대학교

2018.03 ~ 2020.08  
e-비즈니스학과 · 학사 편입 졸업 · 학점 3.67 / 4.5

### 삼성 청년 SW 아카데미 (SSAFY)

2022.07 ~ 2023.06  
1년 과정 수료 · Next.js 기반 API 협업 플랫폼으로 2학기 심화 프로젝트 우수상

## Certificates

- SQLD (SQL 개발자) · 2024.09 취득
