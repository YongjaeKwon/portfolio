# 권용재

풀스택 웹 개발자 / Fullstack Web Developer

- Email: koj185364@naver.com
- GitHub: https://github.com/YongjaeKwon
- Location: 경기 용인

## Summary

Vue·jQuery로 화면을 만들고 Java·Spring MVC·MyBatis로 API와 SQL까지 구현해온 풀스택 성향의 웹 개발자입니다. 화면 요구사항에서 출발해 API·Service·SQL·외부 연동까지 한 사람이 끝까지 책임지며, 화면 결과와 서버 데이터가 맞아떨어지는지 직접 확인합니다. 개인 프로젝트(quant-core)에서는 FastAPI·Docker로 백엔드를 직접 구성했습니다.

## Core Skills

- Production Frontend: Vue.js, JavaScript, WebSquare, JSP, Nexacro, jQuery, HTML5, CSS3
- Project Frontend: React, TypeScript, Next.js
- Backend: Java, Spring Boot, Spring MVC, Spring Security, MyBatis, REST API, JWT, WebSocket
- Personal Project Backend: FastAPI (개인 프로젝트(quant-core)), Python, Docker, Docker Compose, Nginx
- Database: MariaDB, Oracle, PostgreSQL, Redis, SQLite, PL/SQL
- Tools: Git, SVN, Maven, Gradle, Vite, TailwindCSS, Tabulator
- Strength: 화면/API/SQL 연계 구현, 권한·조회 조건, 파일·메일·인증 연동, 운영 이슈 대응

## Experience

### 유한책임회사 티지나래

웹 개발자  
2024.06 ~ 재직 중

- 솔루션사업부에서 B2B·B2G 운영 시스템의 화면, API, SQL, 외부 연동 기능 개발
- Vue, WebSquare, JSP, Nexacro 기반 관리자·모바일 화면 신규 개발 및 운영 오류 수정
- Spring Boot 3 신규 환경과 Spring MVC 환경에서 API, MyBatis SQL, 메일·파일·인증 연동 흐름 구현
- 조회 조건, 권한 반영, 입력 검증, 상태값 불일치 문제를 재현하고 화면·응답·SQL 결과를 직접 추적

## Projects

### B2B 협력사 운영 포탈 (PPS)

2025.02 ~ 현재 · 3인 팀 · 백엔드 및 Vue 화면 개발

협력사, 고객사 담당자, 교육, 계약, 공지, 설문 데이터를 관리하는 Spring Boot 3 기반 운영 포탈입니다. Vue 화면부터 Spring Boot Controller/Service, MyBatis SQL, 메일·엑셀·인증 연동까지 직접 다룬 대표 프로젝트입니다.

- Vue 화면, Tabulator 그리드, Spring Boot API, MyBatis SQL 연동
- 교육 등록→대상자 업로드→메일 발송→제출 현황 조회를 하나의 업무 단위로 연결
- 댓글/대댓글 공통 컴포넌트와 서버 처리 흐름 공통화
- 고객사 담당자 현황 메일 발송, 발송 이력 저장, 검증 상태별 조회 조건 개선
- 2단계 인증, 접근 예외, 공지 읽음 이력 처리 개선

사용 기술: Vue.js, JavaScript, Tabulator, Java, Spring Boot, Spring Security, MyBatis, MariaDB, Oracle

### 교육청 IT 자산관리 솔루션

2025.09 ~ 2026.03 · 2인 팀 · 백엔드 및 화면 개발

교육청과 학교의 IT 자산을 등록, 현황 조회, 상태 관리, 이력 확인, 유상처리 현황, 대시보드 집계로 관리하는 Spring MVC 기반 업무 시스템입니다.

- 자산관리 대시보드, 자산현황, 유상처리 현황 화면 개발 및 개선
- 교육청·학교·부서 권한에 따른 데이터 조회 범위와 검색 조건 반영
- 사업 차수, 기관, 자산 상태 기준의 집계와 목록 조회 SQL 개선
- 대시보드 클릭 라우팅, 배치 이력, 메뉴 개편, 숫자·일자 포맷 등 운영 이슈 대응

사용 기술: Java, Spring MVC, JSP, MyBatis, MariaDB, Tabulator, REST API

### AS 접수·전자서명 업무 시스템

2025.09 ~ 현재 · 2인 팀 · 프론트엔드 주담당

AS 접수, 상담, 이관, 배정, 배송, 개인정보 동의, QR 확인, 태블릿 전자서명 업무를 처리하는 WebSquare/JSP 기반 운영 시스템입니다. 모바일·태블릿 화면과 Java/Spring MVC API, 알림톡·파일·서명 흐름을 직접 확인했습니다.

- AS 접수·이관·배정, 진행상태 조회, 모바일 접수 화면 개선
- 개인정보 동의, QR 확인, 무인보관함 접수, 태블릿 전자서명 흐름 구현
- 배송 일정, 학생 일괄 처리, 라벨/엑셀, 파일 조회·업로드 화면 개선
- 알림톡 등 외부 메시지·메일 발송 결과와 권한별 조회 조건을 화면 상태로 반영

사용 기술: JavaScript, WebSquare, JSP, jQuery, Java, Spring MVC, MyBatis, MariaDB, REST API

### 퀀트 트레이딩 시스템 (quant-core)

2026.03 ~ 현재 · 개인 학습 프로젝트

개인 프로젝트(quant-core)에서 FastAPI 백엔드와 React/TypeScript 대시보드를 6개 컨테이너로 분리해 시뮬레이션 기반 백테스트와 실시간 대시보드 구조를 학습하고 있습니다.

- JWT 인증과 Redis 블랙리스트 기반 로그아웃, IP별 로그인 실패 제한 구현
- WebSocket으로 포지션·체결 결과를 프론트에 실시간 브로드캐스트
- Walk-Forward 검증과 백테스트 실행 화면 구현
- PostgreSQL·Redis·API·UI·Collector·Backup의 6개 컨테이너 Docker Compose 구성

사용 기술: React, TypeScript, Zustand, FastAPI, Python, PostgreSQL, Redis, Docker, Nginx, WebSocket, JWT

### 물류·서비스 운영 시스템

2024.07 ~ 2025.07 · 3인 팀 · 운영 기능 개선 및 신규 기능 개발

Nexacro와 Spring MVC 기반 물류·서비스 운영 시스템에서 일정, 설문, 재고, 리포트, KPI, 엑셀 다운로드, 관리자 이력 조회 화면을 개선했습니다.

- 설문 등록·응답·통계, 운영 설문 데이터 수집 흐름 구현
- 물류·재고·자재·입출고 및 설치/철거 리포트 화면 개선
- 화면 필터, SQL 조건, 엑셀 다운로드 결과를 직접 대조해 데이터 불일치 원인을 좁힘

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
