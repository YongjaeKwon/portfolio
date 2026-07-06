# portfolio

개인 포트폴리오 사이트입니다. 템플릿을 쓰지 않고 Vue 3 + TypeScript + Vite로 처음부터 만들었습니다.

- 사이트: https://portfolio-six-inky-14.vercel.app/
- 이력서 PDF: https://portfolio-six-inky-14.vercel.app/resume.pdf

채용 제출용 직접 링크로만 운영하고 있어서 검색 노출은 robots.txt로 막아 두었습니다.

![포트폴리오 미리보기](public/og-image.png)

## 어떤 내용을 담았나

운영 중인 B2B·B2G 시스템에서 Vue 기반 관리자·모바일 화면을 개발해 온 경험을 프론트엔드 관점으로 정리했습니다. 화면을 만들고 끝내는 게 아니라 API 응답, 권한 조건, SQL 조회 결과까지 확인하면서 일해 온 흐름을 보여주는 게 목표입니다.

실무 프로젝트 세 개를 case study로 담았습니다.

- **PPS (협력사 운영 포탈)** — 교육/계약/정산 업무를 처리하는 포탈. 교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회, 설문·게시판 댓글, 승인 처리 흐름을 구현했습니다.
- **TSMS (AS/현장 서비스 운영 시스템)** — AS 접수, 현장 처리, 협력사 포탈 연동, 학생 단말 AS 접수 링크, 알림톡·무인보관함 흐름을 구현했습니다.
- **교육청 스마트기기 자산관리 시스템** — 학생 단말 자산 현황, 교육청별 대시보드, 일 집계 배치, AS 시스템 자산 연동 배치를 구현했습니다.

보조 프로젝트는 두 개만 남겼습니다. SSAFAST는 API 명세/테스트 도구로, 중첩 입력 폼과 인증 가드, 성능 테스트 결과 화면을 구현한 프로젝트입니다. quant-core는 매매 전략 실행과 모니터링을 위한 개인 백엔드/대시보드 프로젝트이며 공개용 레포는 [quant-lab](https://github.com/YongjaeKwon/quant-lab)입니다.

각 프로젝트의 자세한 내용은 사이트의 case study 패널에서 볼 수 있습니다.

| ddoing | MODAC |
| --- | --- |
| <img src="public/projects/ddoing.png" width="360" alt="또잉 Drawing 영어 학습 게임 화면" /> | <img src="public/projects/modac.png" width="360" alt="MODAC 학습방 화면" /> |

## 제출용 정리 방향

현재 사이트는 채용 제출용으로 한 가지 디자인만 보이도록 정리했습니다. 여러 디자인 실험보다 내용의 신뢰도와 읽기 흐름을 우선합니다.

- 실무 프로젝트를 먼저 보여주고, 팀·개인 프로젝트는 보조 경험으로 배치했습니다.
- 기술명은 많이 나열하기보다 각 프로젝트에서 실제로 만든 기능과 함께 보이도록 줄였습니다.
- “성과처럼 보이는 숫자”보다 어떤 기준으로 문제를 재현하고 맞췄는지 설명하는 문장을 우선했습니다.
- 디자인 전환 버튼은 제출 화면에서 숨기고, Fresh UI Kit 기반 대표 디자인으로 고정했습니다.
- 최신 대표 디자인은 `src/ui-kit`의 Fresh UI Kit을 사용합니다. 밝은 배경, 파란 CTA, 둥근 카드, 메쉬 그라디언트를 재사용 가능한 CSS 유틸리티로 분리했습니다.

자세한 사용법은 [docs/ui-kit.md](docs/ui-kit.md)에 정리했습니다.

## 구조

```text
src/
  components/          Navbar, Footer, ProfileCard 등 공통 컴포넌트
  composables/         useSkin, useProjectFilter 등 공통 상태 훅
  data/portfolio.ts    프로필·프로젝트·기술 데이터 (내용 수정은 대부분 이 파일)
  views/               Home / Experience / Projects / TechStack / Education / Contact 섹션
public/
  case-studies/        프로젝트 case study 마크다운
  resume.pdf           공개 이력서
docs/
  resume-general.html  이력서 HTML 원본
scripts/
  generate-resumes.mjs HTML → PDF 변환 스크립트
```

라우터 없이 App.vue가 섹션 뷰를 이어 붙이는 단일 페이지 구성입니다. case study 마크다운은 marked로 렌더링하고 DOMPurify로 정리해서 붙입니다.

## 실행

```bash
npm install
npm run dev
```

빌드는 `npm run build`. vue-tsc 타입 체크가 먼저 돌고 Vite 빌드가 이어집니다.

## 이력서 PDF 만들기

이력서 원본은 `docs/resume-general.html`입니다. 수정한 뒤 아래 명령으로 `public/resume.pdf`를 다시 만듭니다.

```bash
npm run resumes:pdf
```

사이트와 이력서를 한 레포에서 관리하니 둘의 문구가 어긋나는 일을 줄일 수 있습니다.

## 배포

Vercel에 올려져 있습니다. 정적 사이트라 특별한 설정은 없습니다.

- Build command: `npm run build`
- Output directory: `dist`
- Node 20 이상
