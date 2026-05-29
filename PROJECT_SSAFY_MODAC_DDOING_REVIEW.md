# SSAFY 프로젝트 추가 검토: MODAC / ddoing

> 기준: GitHub README, 저장소 구조, package.json, author 필터 커밋 화면, 주요 커밋 diff, Raw 파일 일부를 확인해 포트폴리오 반영 가치를 정리했습니다. 로컬 `git clone`은 GitHub DNS 문제로 실패해 전체 라인 수/파일별 기여도까지는 산출하지 못했습니다.

## 결론

두 프로젝트 모두 포트폴리오에 넣을 가치가 있습니다. 다만 현재 포트폴리오의 핵심은 실무 프로젝트이므로, `PPS`, `TSMS/IDCMS`, `IT 자산관리`, `SR30` 앞에 두기보다는 `SSAFY 팀 프로젝트` 또는 `초기 팀 프로젝트` 영역에서 보조 프로젝트로 쓰는 편이 좋습니다.

우선순위는 다음과 같습니다.

1. ddoing
   - React, TypeScript, Redux, Canvas, AI 모델 연동, 게임형 학습 흐름이 있어 최신 프론트엔드 보강용으로 좋습니다.
   - "AI를 직접 만들었다"보다 "AI 추론 결과를 사용자 화면과 게임 흐름에 연결했다"로 표현하는 것이 안전합니다.
2. MODAC
   - Vue 3, Pinia, WebSocket, GitHub 연동, Markdown 작성, Feed, Study Room이 있어 팀 프로젝트 완성도를 보여주기 좋습니다.
   - 현재 실무 PPS도 Vue 계열이라 중복될 수 있으므로, "실시간 협업/학습 기록 플랫폼" 성격으로 보조 카드화하는 것이 좋습니다.

## MODAC

GitHub: https://github.com/YongjaeKwon/MODAC

### 프로젝트 요약

개발자를 위한 학습 내용 기록 및 공유 플랫폼입니다. Todo 리스트로 학습 목표를 정하고, Markdown으로 학습 내용을 작성하며, 작성 결과를 GitHub에 commit하고 Feed로 공유하는 서비스입니다.

README 기준 프로젝트 기간은 2023.01.09 ~ 2023.02.17, SSAFY 8기 2학기 공통 프로젝트입니다. 저장소 전체 커밋은 546건이며, GitHub author 필터 기준 권용재 커밋은 74건까지 확인했습니다.

### 기술 스택

- Frontend: Vue 3, Vite, Pinia, TailwindCSS, JavaScript
- Backend: Java, Spring Boot, Spring Security, Hibernate, MySQL
- Realtime/Infra: WebSocket, Redis, Docker, Nginx, AWS EC2, AWS S3

### README 기준 담당 역할

- Frontend 개발
- 일정 관리

### 커밋 기준으로 보이는 담당 범위

- 로그인/회원가입 화면 레이아웃
- Navbar 및 라우터 구조
- Article 작성/목록/상세 관련 화면
- Feed 화면, 좋아요/팔로우 버튼
- 알림 아이콘, 알림 리스트, DM 리스트와 채팅창
- 스터디룸 레이아웃, 설정, 입장/퇴장, 공개/비공개방 처리
- Room API 연결, 라우터 가드, 스터디룸 목록 조회
- 통계 기능
- 마이페이지 유저 정보 수정, 프로필 사진 교체
- 즐겨찾기 기능

### 코드에서 확인한 특징

`room.js`에서 Pinia store를 중심으로 스터디룸 상태, 참여자 입장/퇴장, 채팅, 사이드바 상태를 관리합니다. SockJS와 STOMP를 사용해 그룹 채팅과 참가자 입장/퇴장 이벤트를 구독하고, 방 입장 시 방 정보와 즐겨찾기 목록을 조회하는 흐름이 있습니다.

`router/index.js`에는 로그인 여부에 따른 라우터 가드가 적용되어 있습니다. 로그인한 사용자가 로그인/회원가입 페이지로 접근하면 room으로 보내고, 로그인하지 않은 사용자가 room, article, feed, myPage에 접근하면 login으로 보내는 구조입니다.

### 포트폴리오에서 살릴 포인트

이 프로젝트는 "협업형 학습 플랫폼"과 "실시간 스터디룸"을 강조하는 것이 좋습니다.

추천 문장:

> Vue 3와 Pinia 기반으로 학습 기록 공유 플랫폼의 스터디룸, Feed, Article, 알림, 즐겨찾기 화면을 개발했습니다. 특히 SockJS/STOMP 기반 실시간 채팅과 참가자 입장/퇴장 상태를 Pinia store와 연결해 협업형 학습 공간의 화면 상태를 구현했습니다.

추천 하이라이트:

- Vue 3 + Pinia 기반 학습 기록 공유 플랫폼 개발
- 스터디룸 입장/퇴장, 공개/비공개방, 즐겨찾기, 목록 조회 흐름 구현
- SockJS/STOMP 기반 실시간 채팅 및 참가자 상태 화면 연결
- Article 작성, Feed, Follow/Like, 알림/DM 화면 구현
- 로그인 여부에 따른 라우터 가드 적용

### 주의할 점

- 수상 이력이 없으므로 대표 프로젝트로 과하게 앞세우기보다 보조 프로젝트로 두는 것이 좋습니다.
- README에 담당 역할이 "Frontend 개발 + 일정관리"로 되어 있어, 구체적인 기능 담당은 커밋 근거와 함께 설명하는 편이 안전합니다.
- 실무 Vue 경험은 PPS가 더 강하므로, MODAC은 "Vue 3/Pinia/WebSocket 팀 프로젝트 경험"으로 포지셔닝하는 것이 좋습니다.

## ddoing

GitHub: https://github.com/GomGom-Team/ddoing

### 프로젝트 요약

어린이를 위한 영어 학습 서비스입니다. 애니메이션 shadowing으로 영어 표현을 학습하고, 영어 단어 drawing 게임을 통해 단어를 익히는 플랫폼입니다.

README 기준 프로젝트 기간은 2023.02.27 ~ 2023.04.07, 6주 프로젝트입니다. 저장소 전체 커밋은 462건이며, GitHub author 필터 기준 권용재 커밋은 61건까지 확인했습니다.

### 기술 스택

- Frontend: React 18, Redux, TypeScript, Vite, TailwindCSS, styled-components, MUI, Three.js
- Backend: Java 11, Spring Boot 2.7.9, Hibernate, MySQL
- AI: Python, FastAPI, TensorFlow
- Infra: Nginx, Docker, Jenkins

### README 기준 담당 역할

- PM & AI
- AI 학습 데이터 전처리
- 분류 모델을 Frontend에 연결
- MainPage, Drawing Page 구성 및 관리

### 커밋 기준으로 보이는 담당 범위

- 프론트엔드 프로젝트 초기 세팅과 라우터 설정
- Navbar, MainPage, Banner 구성
- Drawing Page, Drawing Canvas, 모달, Drawer, 게임 완료/다시하기 화면
- 타이머 UI와 게임 진행 단계 처리
- AI 추론 요청, 예측 결과 화면 표시
- 정답 처리, 이미지 저장 요청, 점수 요청
- 명예의 전당 API 및 UI 수정
- 마이페이지 일부 레이아웃/프로필 UI 수정
- 로그인 네비게이션, 빌드 오류, 스크롤바 등 마감 전 품질 이슈 대응

### 코드에서 확인한 특징

`DrawingCanvas.tsx`는 canvas 위에 마우스 좌표를 기반으로 선을 그리고, 마우스 입력이 끝나면 canvas 이미지를 base64로 변환해 AI inference API로 전송합니다. 응답 결과를 `predictList` 상태로 올리고, 예측 결과를 "어떤 단어로 보이는지" 사용자에게 보여주는 구조입니다.

`DrawingPage.tsx`는 게임 진행 전체를 관리합니다. 단어 목록 요청, 60초 타이머, 스테이지 전환, 정답 여부, 모달/Drawer 상태, 예측 결과 판정, 정답 이미지 저장, 경험치/점수 요청까지 한 화면 흐름 안에서 처리합니다.

주요 커밋에서는 drawing 점수 요청, 이미지 저장 위치 변경, 타이머 자동 진행, 재시작/게임 완료 페이지, prediction 요청, stage 오류 수정 등이 확인됩니다.

### 포트폴리오에서 살릴 포인트

이 프로젝트는 "React/TypeScript 기반 AI 연동 인터랙티브 학습 화면"으로 잡는 것이 가장 좋습니다.

추천 문장:

> React와 TypeScript 기반 영어 학습 서비스에서 Drawing Page와 MainPage를 담당했습니다. Canvas에 그린 이미지를 AI inference API로 전송하고, 예측 결과를 게임 진행 상태, 정답 판정, 이미지 저장, 점수/경험치 반영 흐름으로 연결했습니다.

추천 하이라이트:

- React + TypeScript + Redux 기반 영어 학습 서비스 개발
- Canvas drawing 입력, base64 변환, AI inference API 연동 구현
- 단어 목록, 60초 타이머, 스테이지 전환, 정답 판정, 결과 모달 흐름 구현
- 정답 이미지 저장, 점수/경험치 요청, 게임 완료/다시하기 흐름 연결
- MainPage, Banner, 명예의 전당 API/UI, 마이페이지 일부 UI 개선

### 주의할 점

- "AI 모델 전체 개발"로 말하면 과해 보일 수 있습니다. README상 담당은 AI 데이터 전처리와 모델을 프론트엔드에 연결한 역할이므로, 포트폴리오에서는 "AI 추론 API 연동과 게임 흐름 연결"을 중심으로 쓰는 편이 좋습니다.
- 코드상 DrawingPage가 많은 상태를 한 컴포넌트에 들고 있어 현재 기준으로는 리팩토링 여지가 있습니다. 대신 당시 프로젝트 맥락에서는 복잡한 인터랙션을 끝까지 구현했다는 점을 강조하는 것이 좋습니다.
- 최신 FE 역량 보강 프로젝트로는 좋지만, 실무 프로젝트보다 앞에 두면 경력 포트폴리오의 중심이 흐려질 수 있습니다.

## 포트폴리오 반영 추천

### 프로젝트 목록에 넣는다면

현재 프로젝트 구조가 실무 중심으로 정리되어 있으므로, 두 프로젝트는 SSAFY 팀 프로젝트 카드로 추가하되 GitHub 링크로 바로 연결하는 방향이 좋습니다.

1. `ddoing`은 React/TypeScript/Canvas/AI 연동 경험을 보여주는 카드로 추가
2. `MODAC`은 Vue 3/Pinia/WebSocket 팀 프로젝트 경험을 보여주는 카드로 추가
3. 두 프로젝트 모두 사용자가 제공한 GitHub 링크로 바로 연결

가장 좋은 선택:

- 메인 포트폴리오 카드: `ddoing`, `MODAC` 모두 추가
- 링크 동작: 공개 case study 모달이 아니라 GitHub 저장소로 이동
- 장기적으로는 `SSAFY Projects` 섹션을 따로 만들기

### 노출 순서 추천

1. PPS 협력사 포탈
2. TSMS / IDCMS AS 업무 시스템
3. 교육청 IT 자산관리
4. SR30 물류관리시스템
5. ddoing
6. SSAFAST
7. MODAC
8. quant-core

단, 최신 프론트엔드 역량을 더 강하게 보이고 싶으면 `ddoing`, `SSAFAST`, `quant-core`를 별도 `Frontend Projects` 영역으로 묶는 것이 더 좋습니다. 서비스명 한글 표기는 `또잉`으로 사용합니다.

## 이력서용 짧은 문장

### ddoing

React/TypeScript 기반 어린이 영어 학습 서비스에서 Drawing Page와 MainPage를 담당했습니다. Canvas 입력 이미지를 AI 추론 API로 전송하고, 예측 결과를 정답 판정, 이미지 저장, 점수/경험치 반영, 게임 완료/다시하기 흐름으로 연결했습니다.

### MODAC

Vue 3/Pinia 기반 학습 기록 공유 플랫폼에서 스터디룸, Feed, Article, 알림, 즐겨찾기 화면을 개발했습니다. SockJS/STOMP 기반 실시간 채팅과 참가자 입장/퇴장 상태를 Pinia store와 연결해 협업형 학습 공간의 화면 상태를 구현했습니다.

## 면접 답변 포인트

### ddoing 질문 대응

질문: AI를 직접 개발했나요?

답변:

> AI 모델 전체를 혼자 개발했다고 말하기보다는, AI 학습 데이터 전처리와 모델 결과를 프론트엔드 게임 흐름에 연결하는 역할을 했다고 설명하는 것이 정확합니다. Canvas 이미지를 API로 보내고, 예측 결과를 받아 정답 판정, 결과 모달, 이미지 저장, 점수 반영까지 이어지게 구현했습니다.

질문: 가장 어려웠던 점은 무엇인가요?

답변:

> drawing 기능은 단순 API 호출이 아니라 타이머, 스테이지, 정답 여부, 모달, 이미지 저장, 점수 반영이 같이 움직여야 했습니다. 상태가 어긋나면 다음 문제로 넘어가거나 게임 완료 화면이 잘못 나올 수 있어, 사용자 입력과 API 결과를 게임 진행 상태에 맞춰 연결하는 점이 어려웠습니다.

### MODAC 질문 대응

질문: 이 프로젝트에서 무엇을 맡았나요?

답변:

> Vue 3 기반 프론트엔드에서 스터디룸, Article, Feed, 알림, 즐겨찾기, 라우터 가드 같은 화면과 상태 흐름을 맡았습니다. 특히 스터디룸에서는 방 입장/퇴장, 공개/비공개방, 즐겨찾기 목록, 실시간 채팅과 참가자 상태를 Pinia store와 WebSocket으로 연결했습니다.

질문: 실시간 기능은 어떻게 구현했나요?

답변:

> SockJS와 STOMP를 사용해 채팅 메시지와 참가자 입장/퇴장 이벤트를 구독했습니다. Pinia store에서 방 정보, 채팅 로그, 사이드바 상태, 입장 여부를 관리하고, 메시지 수신 시 채팅 로그를 갱신하거나 참가자 목록을 다시 조회하는 방식으로 화면 상태를 맞췄습니다.
