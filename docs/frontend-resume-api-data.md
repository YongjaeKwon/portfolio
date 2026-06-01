# 권용재

API & Data Web Developer / API·데이터 흐름을 함께 보는 웹 개발자

- Email: koj185364@naver.com
- Phone: Available on request
- GitHub: https://github.com/YongjaeKwon
- Location: 경기도 용인시 수지구

## Summary

B2B·B2G 운영 시스템에서 화면 개발을 중심으로 일하면서 Spring/MyBatis API, SQL 조회 조건, 권한·상태값, 메일·파일·인증·알림 연동까지 함께 확인해온 웹 개발자입니다.

단순히 화면을 붙이는 것보다 사용자가 보는 결과와 서버에서 조회·저장되는 데이터가 같은 기준으로 움직이는지에 관심이 많습니다. 관리자 화면, 모바일 업무 화면, 대시보드, 엑셀 다운로드, 발송 이력처럼 데이터 기준이 조금만 어긋나도 운영자가 혼란을 겪는 기능을 반복해서 다뤄왔습니다.

주력은 프론트엔드 구현이지만, 실무에서는 API 응답 구조, MyBatis SQL 조건, 권한별 조회 범위, 외부 연동 결과까지 내려가며 문제를 확인했습니다. 프론트엔드와 백엔드 사이의 흐름을 이해하고, 비즈니스 담당자가 확인해야 하는 데이터가 정확히 보이도록 만드는 데 강점이 있습니다.

## Core Skills

- API 연동: REST API 응답 구조 확인, 화면 상태 연결, 실패/대기/완료 결과 처리
- 데이터 조건: 권한, 조직, 기간, 상태값, 대상자 기준에 따른 MyBatis SQL과 화면 필터 점검
- 데이터 정합성: 대시보드, 목록, 상세, 엑셀, 발송 이력이 같은 기준으로 집계되는지 확인
- 외부 연동: 메일, 알림톡/BizTalk, 파일, 엑셀, QR, OTP, 전자서명 결과를 화면 상태와 연결
- Frontend: JavaScript, TypeScript, Vue.js, React, JSP, WebSquare, Nexacro, jQuery
- Backend/Data: Java, Spring Boot, Spring MVC, MyBatis, MariaDB, Oracle, FastAPI, Python, PostgreSQL, Redis

## Experience

### 유한책임회사 티지나래

Java/Spring 기반 웹 시스템 개발자  
2024.06 ~ 재직 중

- B2B·B2G 운영 시스템의 화면, API, SQL, 외부 연동 기능 개발
- Vue, WebSquare, JSP, Nexacro 기반 관리자/모바일 업무 화면 신규 개발 및 운영 오류 수정
- Spring Boot 3, Spring MVC 환경에서 Controller·Service·Mapper 흐름과 MyBatis SQL 조건 확인
- 조회 조건, 권한 반영, 입력 검증, 상태값 불일치 문제를 재현하고 유사 화면까지 함께 점검
- 발송 결과, 업로드 결과, 엑셀 다운로드, 이력 데이터가 화면에서 같은 기준으로 보이도록 개선

## Projects

### TGS 협력사 포탈 시스템 (PPS)

2025.02 ~ 현재 · 3인 팀 · 백엔드 및 Vue 화면 개발

협력사, CE, 교육, 계약, 공지, 설문 데이터를 관리하는 Spring Boot 3 기반 운영 포탈입니다. Vue 화면부터 Spring Boot API, MyBatis SQL, 메일·엑셀·OTP 연동까지 같은 교육·대상자 기준으로 맞춰야 하는 대표적인 API & Data 경험입니다.

- 교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회 흐름 구현
- 교육·대상자 키 기준으로 발송 대상, 제출 명단, 발송 이력이 어긋나지 않도록 조회 조건 개선
- CE 현황 메일 발송, 발송 이력 저장, 검증 상태별 조회 조건 개선
- Google OTP 2단계 인증, IP 기반 인증 예외, 공지 읽음 이력 처리 개선
- 게시판·제안하기·설문 댓글/대댓글 UI와 서버 처리 흐름 공통화

사용 기술: Vue.js, JavaScript, Tabulator, Java, Spring Boot, Spring Security, MyBatis, MariaDB, Oracle

### 교육청 IT 자산관리 솔루션

2025.09 ~ 2026.03 · 2인 팀 · 백엔드 및 화면 개발

교육청과 학교의 IT 자산을 등록, 현황 조회, 상태 관리, 이력 확인, 유상처리 현황, 대시보드 집계로 관리하는 Spring MVC 기반 업무 시스템입니다.

- 교육청·학교·부서 권한에 따른 데이터 조회 범위와 검색 조건 반영
- 자산관리 대시보드, 자산현황, 유상처리 현황 화면 개발 및 개선
- 사업 차수, 기관, 자산 상태 기준의 집계와 목록 조회 SQL 개선
- 대시보드 클릭 라우팅, 배치 이력, 메뉴 개편, 숫자·일자 포맷 등 운영 이슈 대응

사용 기술: Java, Spring MVC, JSP, MyBatis, MariaDB, Tabulator, REST API

### TSMS / IDCMS AS 업무 시스템

2025.09 ~ 현재 · 2인 팀 · 프론트엔드 주담당

AS 접수, 상담, 이관, 배정, 배송, 개인정보 동의, QR 확인, 태블릿 전자서명 업무를 처리하는 운영 시스템입니다. 모바일·태블릿 화면과 Spring MVC API, MyBatis SQL, 알림톡·파일·서명 흐름을 함께 확인했습니다.

- AS 접수·이관·배정, 진행상태 조회, 모바일 접수 화면 개선
- 개인정보 동의, QR 확인, 무인보관함 접수, 태블릿 전자서명 흐름 구현
- 배송 일정, 학생 일괄 처리, 라벨/엑셀, 파일 조회·업로드 화면 개선
- 알림톡·BizTalk·메일 발송 결과와 권한별 조회 조건을 화면 상태로 반영

사용 기술: JavaScript, WebSquare, JSP, jQuery, Java, Spring MVC, MyBatis, MariaDB, REST API

### 퀀트 트레이딩 시스템 (quant-core)

2026.03 ~ 현재 · 개인 학습 프로젝트

FastAPI 백엔드와 React/TypeScript 대시보드를 6개 컨테이너로 분리해 시장 데이터 수집, 백테스트, 실거래 실행 구조를 학습하는 프로젝트입니다.

- JWT 인증과 Redis 블랙리스트 기반 로그아웃, IP별 로그인 실패 제한 구현
- WebSocket으로 포지션·체결 결과를 프론트에 실시간 브로드캐스트
- Walk-Forward 검증과 백테스트 실행 화면 구현
- PostgreSQL·Redis·API·UI·Collector·Backup의 6개 컨테이너 Docker Compose 구성

사용 기술: React, TypeScript, Zustand, FastAPI, Python, PostgreSQL, Redis, Docker, Nginx, WebSocket, JWT

### SR30 물류관리시스템

2024.07 ~ 2025.07 · 3인 팀 · 운영 기능 개선 및 신규 기능 개발

Nexacro와 Spring MVC 기반 물류·서비스 운영 시스템에서 일정, 설문, 재고, 리포트, KPI, 엑셀 다운로드, 관리자 이력 조회 화면을 개선했습니다.

- 일정 공유, 근무 일정, 서비스 리포트, KPI 조회 화면 개선
- 설문 등록·응답·통계, 운영 설문 데이터 수집 흐름 구현
- 물류·재고·자재·입출고 및 설치/철거 리포트 화면 개선
- 화면 필터, SQL 조건, 엑셀 다운로드 결과가 같은 기준으로 동작하는지 점검

사용 기술: Nexacro, Java, Spring MVC, MyBatis, PL/SQL, Oracle

## Education

### 삼성 청년 SW 아카데미 (SSAFY)

2022.07 ~ 2023.06  
1년 과정 수료 · Next.js 기반 API 협업 플랫폼으로 2학기 심화 프로젝트 우수상

### 아주대학교

2018.03 ~ 2020.08  
e-비즈니스학과 · 학사 졸업 · 학점 3.67 / 4.5

## Certificates

- SQLD (SQL 개발자) · 2024.09 취득
