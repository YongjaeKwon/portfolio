# 권용재

웹/모바일 플랫폼 프론트엔드 개발자

- Email: koj185364@naver.com
- Phone: 010-9470-1704
- GitHub: https://github.com/YongjaeKwon
- Location: 경기도 용인시 수지구

## 지원 포지션

프론트엔드 개발자

## Summary

B2B·B2G 운영 시스템에서 관리자 화면, 모바일 업무 화면, REST API 연동, 권한별 조회 조건, MyBatis SQL, 메일·파일·인증 연동을 함께 다뤄온 프론트엔드 중심 웹 개발자입니다.

실무에서는 Vue 기반 협력사 포탈, WebSquare/JSP 기반 AS 업무 화면, JSP/Spring MVC 기반 자산관리 화면, Nexacro 기반 물류 운영 화면을 개발했습니다. 화면만 따로 보지 않고 실제 사용자가 처리하는 등록, 업로드, 발송, 조회, 이력 확인 흐름이 끊기지 않도록 API 응답, 권한 조건, SQL 조회 흐름을 함께 확인하며 구현합니다.

개인·팀 프로젝트에서는 React, TypeScript, Next.js, Redux, Zustand, React Query, Canvas, FastAPI, WebSocket, Docker Compose를 활용해 실시간 데이터 대시보드, 개발자 도구형 UI, AI 연동 학습 화면을 만들었습니다. 실무의 운영 화면 경험을 기반으로 최신 프론트엔드 구조와 테스트 역량을 계속 보강하고 있습니다.

## Core Strengths

- 운영 업무 화면 개발: 등록, 업로드, 발송, 조회, 이력 확인이 이어지는 관리자 화면 구현
- Vue.js 실무 경험: Spring Boot API와 연동되는 협력사 포탈 관리자 화면 개발
- 모바일/태블릿 업무 흐름: AS 접수, 개인정보 동의, QR 확인, 전자서명 화면 구현
- REST API 연동: 메일, 파일, 알림톡/BizTalk, 인증 결과를 화면 상태와 연결
- 데이터 흐름 이해: 권한, 조직, 기간, 상태값에 따른 MyBatis 동적 SQL과 조회 조건 점검
- 모던 프론트엔드 확장: React, TypeScript, Next.js, Redux, Zustand, React Query, Canvas 기반 프로젝트 진행

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

#### 개요

협력사, CE, 교육, 계약, 공지, 설문 데이터를 관리하는 Spring Boot 3 기반 운영 포탈입니다. 교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회처럼 여러 단계가 이어지는 관리자 업무를 Vue 화면, Spring Boot API, MyBatis SQL로 구현했습니다.

#### 주요 수행 내용

- 교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회 흐름 구현
- 교육 대상자 저장, 업로드 양식 다운로드, 제출 현황 엑셀 다운로드 기능 개선
- 게시판·제안하기·설문에서 쓰이는 댓글·대댓글 UI와 처리 흐름 공통화
- CE 현황 메일 발송, 발송 이력 저장, 검증 상태별 조회 조건 개선
- 협력사/센터 검색, 담당자 정보, 정산 유형, 입력 검증 흐름 개선
- Google OTP 2단계 인증, IP 기반 인증 예외, 공지 읽음 이력 처리 개선

#### 성과 및 학습

- Git 이력 기준 개인 커밋 268건, merge 제외 216건 규모의 기능 개선과 운영 이슈 대응
- Vue 화면, Tabulator 그리드, Spring Boot API, MyBatis SQL이 연결되는 관리자 화면 개발 경험 축적
- 메일 발송, 엑셀 업로드, OTP 인증처럼 실패 케이스가 생기기 쉬운 기능에서 화면 상태와 서버 처리 흐름을 함께 점검

#### 면접 답변 포인트

운영자가 수기와 엑셀로 처리하던 교육관리 흐름을 교육 등록, 대상자 업로드, 메일 발송, 제출 현황 조회로 연결했습니다. 저는 화면 상태와 API 파라미터, MyBatis SQL 조건이 같은 대상자 기준으로 동작하는지 확인하며 개발했습니다.

#### 사용 기술

Vue.js, JavaScript, Tabulator, Java, Spring Boot, Spring Security, MyBatis, MariaDB, Oracle

### TSMS / IDCMS AS 업무 시스템

2025.09 ~ 현재 · 2인 팀 · 프론트엔드 주담당

#### 개요

AS 접수, 상담, 이관, 배정, 배송, 개인정보 동의, QR 확인, 태블릿 전자서명 업무를 처리하는 WebSquare/JSP 기반 운영 시스템입니다. 데스크톱, 모바일, 태블릿 화면이 같은 업무 데이터를 기준으로 이어지는 것이 중요했습니다.

#### 주요 수행 내용

- AS 접수·이관·배정, 상담, 진행상태 조회 화면 개선
- 모바일 AS 접수, 개인정보 동의, QR 확인, 무인보관함 접수 화면 구현
- 태블릿 전자서명 화면과 서명 저장/재시도/완료 상태 처리
- 배송 일정, 학생 일괄 처리, QR 라벨, 엑셀 다운로드 및 업로드 흐름 개선
- 알림톡/BizTalk, 메일 발송 조건과 결과 상태를 화면에 반영
- 권한 또는 센터 조건 변경 후 목록과 상세 화면의 조회 범위 점검

#### 성과 및 학습

- 현장 업무에서 사용되는 모바일/태블릿 화면의 접수, 동의, 첨부, 서명, 조회 단계를 사용 순서에 맞게 구현
- 외부 발송, QR, 전자서명처럼 실패 케이스가 생기기 쉬운 기능에서 화면 상태를 세분화하는 경험 축적
- 모바일과 데스크톱 화면이 같은 업무 번호와 상태를 기준으로 연결되는지 검증하는 습관 형성

#### 면접 답변 포인트

이 프로젝트에서는 화면 하나보다 단계 간 연결이 중요했습니다. 접수 이후 개인정보 동의, QR 확인, 전자서명, 알림 발송, 진행상태 조회가 같은 업무 번호와 상태를 기준으로 이어지도록 화면과 조회 조건을 함께 확인했습니다.

#### 사용 기술

JavaScript, WebSquare, JSP, jQuery, Java, Spring MVC, MyBatis, MariaDB, REST API

### 교육청 IT 자산관리 솔루션

2025.09 ~ 2026.03 · 2인 팀 · 백엔드 및 화면 개발

#### 개요

교육청과 학교의 IT 자산을 등록, 현황 조회, 상태 관리, 이력 확인, 유상처리 현황, 대시보드 집계로 관리하는 Spring MVC 기반 업무 시스템입니다. 교육청, 학교, 부서, 사업 차수, 자산 상태에 따라 조회 범위가 달라지는 조건 처리가 중요했습니다.

#### 주요 수행 내용

- 자산관리 대시보드, 자산현황, 유상처리 현황 화면 개발 및 개선
- 교육청·학교·부서 권한에 따른 데이터 조회 범위와 검색 조건 반영
- 사업 차수, 기관, 자산 상태 기준의 집계와 목록 조회 SQL 개선
- 대시보드 클릭 라우팅, 배치 이력, 메뉴 개편, 숫자·일자 포맷 등 운영 이슈 대응

#### 성과 및 학습

- 권한 조건이 화면 필터뿐 아니라 MyBatis SQL 조회 조건까지 함께 맞아야 한다는 점을 체감
- 대시보드 집계 수치와 상세 목록 조회 결과가 같은 기준으로 산출되는지 확인하는 경험 축적
- B2G 업무 시스템에서 조직, 권한, 상태값 기준이 화면 품질의 핵심이라는 점을 학습

#### 면접 답변 포인트

권한별로 보이는 데이터가 달라지는 시스템이라 화면 필터와 SQL 조건을 함께 확인했습니다. 특히 대시보드 집계와 클릭 이후 목록 조회 결과가 같은 기준으로 나오는지 중점적으로 점검했습니다.

#### 사용 기술

Java, Spring MVC, JSP, MyBatis, MariaDB, Tabulator, REST API

### SR30 물류관리시스템

2024.07 ~ 2025.07 · 3인 팀 · 운영 기능 개선 및 신규 기능 개발

#### 개요

Nexacro와 Spring MVC 기반 물류·서비스 운영 시스템입니다. 일정, 설문, 물류, 재고, 서비스 리포트, KPI, 엑셀 다운로드, 관리자 이력 조회처럼 운영자가 반복적으로 확인하는 화면을 개발하고 개선했습니다.

#### 주요 수행 내용

- 일정 공유, 근무 일정, 서비스 리포트, KPI 조회 화면 개선
- 설문 등록·응답·통계, 운영 설문 데이터 수집 흐름 구현
- 물류·재고·자재·입출고 및 설치/철거 리포트 화면 개선
- 개인정보 다운로드, 데이터 삭제, 접근 이력 등 관리자 이력 조회 기능 대응
- 화면 필터, SQL 조건, 엑셀 다운로드 결과가 같은 기준으로 동작하는지 점검

#### 성과 및 학습

- SVN 로그 기준 100건 이상의 운영 개선 리비전에 참여
- 화면 조회, 통계 집계, 엑셀 다운로드 결과가 같은 기준으로 산출되는지 검증하는 경험 축적
- 레거시 환경에서도 화면, SQL, 이력 조회, 다운로드 결과를 함께 확인해야 한다는 점을 체감

#### 면접 답변 포인트

SR30에서는 최신 UI 기술보다 운영 기준의 일관성이 중요했습니다. 화면에서 선택한 센터, 기간, 상태 조건이 SQL 집계와 엑셀 다운로드 결과에 동일하게 적용되는지 확인하며 개선했습니다.

#### 사용 기술

Nexacro, Java, Spring MVC, MyBatis, PL/SQL, Oracle

### 또잉 영어 학습 서비스 (ddoing)

2023.02 ~ 2023.04 · 6인 팀 · PM 및 프론트엔드·AI 연동

#### 개요

영어가 어려운 아이들을 위한 애니메이션 shadowing 및 Drawing 기반 영어 학습 서비스입니다. 사용자가 제시 단어를 그림으로 표현하면 AI 추론 결과를 바탕으로 정답 여부를 확인하고, 점수와 경험치가 반영되는 게임형 학습 흐름을 만들었습니다.

#### 주요 수행 내용

- PM 역할로 기능 범위, 화면 흐름, AI 연동 방식 조율
- AI 학습 데이터 전처리 업무 참여
- React/TypeScript 기반 Main Page와 Drawing Page 구현
- Canvas 입력 이미지를 AI 추론 API로 전달하고 예측 결과를 게임 상태로 반영
- 정답, 오답, 패스, 타이머 종료, 게임 완료 화면 이동 조건 처리
- Drawing 결과 저장, 점수 요청, 경험치 반영, Hall of Fame 화면 개선

#### 성과 및 학습

- GitHub author 필터 기준 개인 커밋 61건 규모의 화면 구현 및 기능 개선 참여
- AI 모델 결과를 사용자가 이해할 수 있는 제품 경험으로 연결하는 프론트엔드 역할 학습
- Canvas 입력, API 요청, Redux 상태, 라우팅, 결과 화면이 이어지는 게임형 UI 상태 관리 경험 축적

#### 면접 답변 포인트

이 프로젝트에서 저는 AI 모델 자체를 과장해 말하기보다, 모델의 추론 결과를 사용자가 학습 과정에서 이해할 수 있는 화면 흐름으로 연결한 점을 강조할 수 있습니다. Canvas 입력, 추론 요청, 정답 판정, 점수 반영, 게임 완료 화면이 끊기지 않도록 상태 전환을 설계했습니다.

#### 사용 기술

React, TypeScript, Redux, Vite, TailwindCSS, Canvas, FastAPI, TensorFlow

### 퀀트 트레이딩 시스템 (quant-core)

2026.03 ~ 현재 · 개인 학습 프로젝트

#### 개요

시장 데이터 수집, 전략 백테스트, 실거래 실행 구조를 학습하기 위해 진행 중인 개인 프로젝트입니다. FastAPI 백엔드와 React/TypeScript 대시보드를 6개 컨테이너로 분리해 서비스 구조를 익히고 있습니다.

#### 주요 수행 내용

- JWT 인증과 Redis 블랙리스트 기반 로그아웃, IP별 로그인 실패 제한 구현
- WebSocket으로 포지션·체결 결과를 프론트에 실시간 브로드캐스트
- Walk-Forward 검증과 백테스트 실행 화면 구현, 실거래 정산은 수수료·펀딩비 포함 net PnL 기록
- PostgreSQL·Redis·API·UI·Collector·Backup의 6개 컨테이너 Docker Compose 구성

#### 사용 기술

React, TypeScript, Zustand, Recharts, Python, FastAPI, PostgreSQL, Redis, Docker, Docker Compose, Nginx, WebSocket, JWT

### API 설계·테스트 협업 플랫폼 (SSAFAST)

2023.04 ~ 2023.05 · 6인 팀 · 프론트엔드 개발

#### 개요

Figma, API 명세, 요청 테스트, 유스케이스 테스트, 성능 테스트를 한 공간에서 연결한 개발자 협업 플랫폼입니다. Next.js와 TypeScript 기반으로 성능 테스트 UI, BaseURL 인증 가드, 공통 Modal 컴포넌트를 구현했고 SSAFY 2학기 심화 프로젝트 우수상을 수상했습니다.

#### 주요 수행 내용

- 성능 테스트 UI 전체 구현: API 선택, 파라미터 입력, 실행, p50/p95/p99·throughput 결과 표시
- BaseURL 소유권 인증 가드 구현: Java/Flask/Django 환경별 인증 코드 안내와 다중 URL 코드 검증
- React Hook Form·FormProvider 기반 중첩 요청 DTO 입력과 상태 동기화 처리
- ReactDOM.createPortal 기반 공통 Modal 구현으로 SSR 안전성과 z-index 충돌 해결
- 로그아웃 플로우에서 Redux 토큰 초기화와 React Query 캐시 무효화 처리

#### 사용 기술

Next.js, React, TypeScript, React Query, React Hook Form, Redux Toolkit, TailwindCSS, Axios, Docker, Nginx

## Skills

### Frontend

HTML5, CSS3, SASS/SCSS, JavaScript, TypeScript, Vue.js, React, Next.js, Zustand, Pinia, Redux, React Query, React Hook Form, Canvas, JSP, WebSquare, Nexacro, jQuery

### Backend

Java, Spring Boot, Spring MVC, Spring Security, MyBatis, FastAPI, Python, REST API, JWT, WebSocket

### Database

MariaDB, Oracle, PostgreSQL, Redis, SQLite, PL/SQL

### Tools

Git, SVN, Maven, Gradle, Docker, Docker Compose, Nginx, Node.js, Vite, TailwindCSS, Chart.js, Tabulator

## Education

### 아주대학교

2018.03 ~ 2020.08  
e-비즈니스학과 · 학사 편입 졸업 · 학점 3.67 / 4.5

### 삼성 청년 SW 아카데미 (SSAFY)

2022.07 ~ 2023.06
1년 과정 수료

## Certificates & Awards

- SQLD (SQL 개발자) · 2024.09 취득
- SSAFY 2학기 심화 프로젝트 우수상 · Next.js 기반 API 협업 플랫폼 · 2023.06

## 공고 연관 키워드

- Vue.js 실무 개발 경험
- React / TypeScript / Next.js / Zustand 프로젝트 경험
- RESTful API 연동 경험
- 관리자 화면과 모바일 업무 화면 개발 경험
- 권한별 조회 조건과 MyBatis SQL 흐름 이해
- 메일, 파일, 알림 발송 결과와 화면 상태 연결 경험
- Docker Compose 기반 컨테이너 분리 경험
- WebSocket 기반 실시간 화면 연동 경험
- JWT 인증 및 Redis 활용 경험
