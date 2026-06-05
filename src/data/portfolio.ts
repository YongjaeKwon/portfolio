export const profile = {
  name: "권용재",
  role: "Frontend Developer",
  headline:
    "운영자가 매일 쓰는 업무 화면을 만들고, 화면에 뜨는 값이 실제 데이터와 어긋나지 않게 챙깁니다.",
  summary:
    "B2B·B2G 운영 시스템에서 관리자·모바일 업무 화면을 만들어 온 프론트엔드 개발자입니다. 화면만 보는 게 아니라 Spring/MyBatis API와 SQL 조회 조건까지 직접 열어 보며 데이터가 맞는지 확인합니다. Vue·WebSquare·JSP로 등록·업로드·발송·조회처럼 운영자가 매일 반복하는 업무가 중간에 끊기지 않게 구현해 왔습니다.",
  target:
    "관리자 도구, B2B 포탈, 데이터 대시보드처럼 복잡한 상태·권한 조건을 사용자가 이해하기 쉬운 화면으로 정리하는 팀에서 기여하고 싶습니다.",
  email: "koj185364@naver.com",
  phone: "",
  github: "https://github.com/YongjaeKwon",
  location: "경기 용인",
  /** "이직 준비 중" | "구직 중" | "재직 중" — 상황에 따라 변경 */
  status: "이직 준비 중" as const,
  /** public/resume.pdf 경로에 PDF 이력서 배치 필요 */
  resume: "/resume.pdf",
};

export const heroStats = [
  { label: "투입 프로젝트", value: "3", unit: "개" },
  { label: "실무 경력", value: "2024.06", unit: "~" },
  { label: "운영 이슈 대응", value: "100", unit: "+건" },
];

export type FocusTrackId = "frontend";

export const focusTracks: Array<{
  id: FocusTrackId;
  label: string;
  role: string;
  badge: string;
  headline: string;
  target: string;
  resume: string;
  resumeLabel: string;
  workStyleTitle: string;
  workStyleNote: string;
  contactTitle: string;
  contactDescription: string;
  projectIntro: string;
  fitTitle: string;
  fitDescription: string;
  strengths: Array<{ title: string; description: string; icon: string }>;
  fitItems: Array<{ label: string; description: string; icon: string }>;
  projectOrder: string[];
  projectAngles: Record<string, string>;
}> = [
  {
    id: "frontend",
    label: "Front-end",
    role: "Frontend Engineer",
    badge: "Vue · React · TypeScript",
    headline:
      "복잡한 업무를 누구나 쉽게 쓰는 화면으로 풀어냅니다.",
    target:
      "API 응답과 권한 조건, SQL 조회 결과까지 직접 확인해 화면에 보이는 값과 실제 데이터를 일치시킵니다.",
    resume: "/resume.pdf",
    resumeLabel: "이력서 다운로드",
    workStyleTitle: "화면을 구현할 때 먼저 확인하는 것",
    workStyleNote: "버튼 하나가 잘못된 상태를 노출하면 운영자는 업무를 멈춥니다. 그래서 상태와 예외를 구현 전에 먼저 나열합니다.",
    contactTitle: "프론트엔드 개발자로 합류하고 싶습니다",
    contactDescription:
      "Vue로 관리자·운영 화면을 주력으로 개발해 왔고, React·Next.js·TypeScript는 팀·개인 프로젝트로 다뤘습니다. 운영 시스템의 프론트엔드를 맡아 안정적으로 끌고 갈 수 있습니다.",
    projectIntro:
      "관리자 화면을 가장 깊게 다룬 프로젝트부터 보여드립니다.",
    fitTitle: "화면에 보이는 값을 데이터로 검증합니다",
    fitDescription:
      "검색·등록·업로드·발송처럼 매일 쓰이는 화면에서, 화면 상태와 API 응답이 항상 같은 상황을 가리키도록 맞춰 왔습니다.",
    strengths: [
      {
        title: "다단계 플로우 상태 설계",
        description: "등록→업로드→발송→조회로 이어지는 화면에서 각 단계의 진입 조건과 예외 경로를 먼저 정의하고, 그에 맞춰 버튼 활성화와 다음 단계 전환을 제어합니다.",
        icon: "MonitorSmartphone",
      },
      {
        title: "API 상태별 화면 분기",
        description: "성공·실패·대기·예외를 각각 다른 화면 상태로 분기해, 운영자가 메시지와 버튼만 보고도 지금 무엇을 해야 할지 판단할 수 있게 만듭니다.",
        icon: "Workflow",
      },
      {
        title: "운영 화면 패턴 표준화",
        description: "검색·그리드·상세·모달·파일 업로드·엑셀 다운로드처럼 자주 쓰이는 화면을 loading/empty/error/disabled 상태 기준으로 정형화해, 새 화면도 같은 패턴으로 빠르게 붙입니다.",
        icon: "PanelTop",
      },
      {
        title: "화면 필터·조회 조건 정합성",
        description: "권한·상태값·기간·조직 같은 조회 조건이 화면 필터와 API 파라미터에 동일하게 반영되는지, 응답 데이터와 SQL 결과를 직접 대조해 확인합니다.",
        icon: "ShieldCheck",
      },
    ],
    fitItems: [
      {
        label: "데이터 정합성",
        description:
          "같은 조건으로 조회해도 화면마다 다르게 나오던 집계를, 화면 필터·SQL·엑셀 다운로드가 같은 값을 내도록 기준을 통일해 맞춰 왔습니다.",
        icon: "Database",
      },
      {
        label: "운영 안정 설계",
        description:
          "메일·발송처럼 API가 성공해도 실제 완료는 아닌 기능에서, 결과를 성공·실패·대기·재처리로 나눠 운영자가 직접 재처리하게 했습니다. 버튼 하나가 업무를 멈추지 않도록 예외부터 먼저 설계합니다.",
        icon: "RadioTower",
      },
      {
        label: "멀티 디바이스 대응",
        description:
          "AS·현장 서비스 운영 시스템(TSMS)에서 데스크톱·모바일·태블릿 3종 디바이스의 10여 개 화면을, 같은 업무 번호 기준으로 끊김 없이 이어지도록 WebSquare·jQuery로 구현했습니다.",
        icon: "Smartphone",
      },
      {
        label: "스택 확장력",
        description:
          "실무는 Vue·WebSquare·jQuery 중심이지만, 개인 프로젝트(quant-core)에서 FastAPI·PostgreSQL·Redis·Docker 6개 컨테이너와 실시간 대시보드를 직접 구성하며 백엔드까지 스스로 넓혔습니다.",
        icon: "Server",
      },
    ],
    projectOrder: ["PPS", "TSMS", "ddoing", "SSAFAST", "quant-core", "IT Asset", "MODAC"],
    projectAngles: {
      PPS: "교육 등록→대상자 업로드→메일 발송→제출 현황 조회로 이어지는 화면에서, 버튼 상태와 그리드 결과, API 응답을 하나의 기준으로 묶었습니다.",
      TSMS: "모바일 접수, QR 동의, 태블릿 서명처럼 사용자가 직접 진행하는 단계형 화면에서 상태 전환과 예외 처리를 구현했습니다.",
      ddoing: "Canvas 입력과 AI 추론 응답을 정답 판정, 점수, 게임 완료 화면으로 연결해 React 화면 상태를 구현했습니다.",
      SSAFAST: "Next.js와 React Hook Form으로 중첩 입력 폼, 인증 가드, 성능 테스트 결과 화면을 구성했습니다.",
      "quant-core": "React/TypeScript 대시보드와 WebSocket 상태 갱신을 학습하며 실시간 데이터 UI 구조를 보강한 프로젝트입니다.",
      "IT Asset": "권한과 상태 조건이 많은 관리자 화면에서 필터, 대시보드, 상세 목록의 조회 기준을 맞췄습니다.",
      MODAC: "Vue 3, Pinia, WebSocket 기반 팀 프로젝트에서 실시간 room 상태와 학습 기록 화면을 구현했습니다.",
    },
  },
];

export const projects = [
  {
    title: "협력사 포탈 시스템",
    shortTitle: "PPS",
    period: "2025.02 ~ 현재",
    team: "3인 팀",
    role: "백엔드 및 Vue 화면 개발",
    scope: "교육관리, 고객사 담당자 현황, 댓글 공통화, 공지 읽음 이력, 인증 예외, 메일·엑셀 처리",
    category: "Admin Platform",
    summary:
      "수십 개 협력사가 쓰는 B2B 운영 포탈로, 협력사·고객사 담당자·교육·계약·공지·설문을 관리하는 Spring Boot 3 기반 시스템입니다. Vue 화면·Tabulator 그리드·Spring Boot API·MyBatis SQL을 맡아 여러 핵심 화면을 담당했고, 교육 등록→대상자 업로드→메일 발송→제출 현황 조회로 이어지는 관리자 업무 흐름을 처음부터 끝까지 구현했습니다.",
    highlights: [
      "교육 등록→대상자 업로드(회차당 수십 명 규모)→메일 발송→제출 현황 조회에서 단계별 조회 기준이 달라 '발송 대상과 제출 명단이 다르게 보이던' 문제를, 동일 교육·대상자 키로 묶어 해결",
      "게시판·설문·제안하기 3개 화면에 흩어진 댓글·대댓글 로직을 공통 Vue 컴포넌트 1개로 통합해, 운영 중 수정 시 한 곳만 고치면 되도록 정리",
      "메일·엑셀 업로드처럼 'API 성공 ≠ 업무 완료'인 기능에서 발송 이력·실패 대상·결과 재조회까지 운영자가 확인할 수 있는 상태로 분리",
      "2단계 인증, 접근 예외, 사용자 유형별 접근 조건이 서버 판단과 화면 접근에서 어긋나지 않도록 케이스를 나눠, 로그인이 잘못 분기되던 문제 제거",
    ],
    stack: ["Vue.js", "JavaScript", "Tabulator", "Chart.js", "Java", "Spring Boot", "Spring Security", "MyBatis", "MariaDB"],
    image: {
      src: "/projects/pps-flow.svg",
      alt: "PPS 업무 흐름 다이어그램: 화면(Vue)→API(Spring Boot)→데이터(MyBatis SQL)→외부 연동(메일·엑셀·인증)을 같은 교육·대상자 키로 일치",
    },
    links: [
      { label: "케이스 스터디 보기", href: "/case-studies/pps.md", type: "case" },
    ],
  },
  {
    title: "AS·현장 서비스 운영 시스템",
    shortTitle: "TSMS",
    period: "2025.09 ~ 현재",
    team: "2인 팀",
    role: "프론트엔드 주담당",
    scope: "모바일 AS 접수, 개인정보 동의, QR 확인, 태블릿 전자서명, 알림톡 결과 처리",
    category: "Mobile Workflow",
    summary:
      "하루 수십 건의 AS(수리·점검) 업무가 접수부터 상담·배정·서명까지 데스크톱·모바일·태블릿을 오가며 이어지는, WebSquare/JSP(기업용 UI 프레임워크) 기반 운영 시스템입니다. 현장 사용자의 QR 확인·전자서명부터 내부 담당자의 상태 조회·알림 발송까지, 디바이스가 바뀌어도 흐름이 끊기지 않도록 프론트엔드를 주담당했습니다.",
    highlights: [
      "접수→상담→배정→배송→동의→서명 5~6단계가 데스크톱·모바일·태블릿 3종 디바이스의 10여 개 화면으로 이어질 때, 같은 업무 번호 기준으로 상태가 끊기지 않도록 조회 흐름 설계·점검",
      "모바일·태블릿에서 필수값 누락·동의 미완료·첨부/서명 실패 등 사용자가 직접 복구 가능한 오류와 시스템 연동 실패를 구분해 화면 상태 정리",
      "알림톡처럼 요청이 성공해도 실제 발송은 별개인 채널에서, 발송 결과를 성공·실패·대기·재처리 등 4가지 이상 상태로 나눠 운영자가 확인·재처리할 수 있게 반영",
      "QR 확인·태블릿 전자서명처럼 실패가 잦은 현장 입력 화면을 구현하고 저장·재시도·완료 상태까지 처리",
    ],
    stack: ["JavaScript", "WebSquare", "JSP", "jQuery", "Java", "Spring MVC", "MyBatis", "MariaDB", "REST API", "Messaging API"],
    image: {
      src: "/projects/tsms-flow.svg",
      alt: "TSMS 업무 흐름 다이어그램: 화면(WebSquare·JSP)→API(Spring MVC)→데이터(MyBatis·SQL)→외부 연동(메시지 발송·전자서명)을 같은 업무 번호로 연결",
    },
    links: [
      { label: "케이스 스터디 보기", href: "/case-studies/tsms.md", type: "case" },
    ],
  },
  {
    title: "교육청 자산관리 시스템",
    shortTitle: "IT Asset",
    period: "2025.09 ~ 2026.03",
    team: "2인 팀",
    role: "백엔드 및 화면 개발",
    scope: "자산 현황·대시보드, 권한별 조회 범위, 상태 집계, 정기 집계 배치, 유상 수리 처리 화면 개선",
    category: "Asset Management",
    summary:
      "교육청 단위 대규모 IT 자산을 등록·대여·반납·폐기·이력 관리 단계로 운영하는 Spring MVC 기반 업무 시스템입니다. 교육청→학교→부서 3단계 권한 계층에 따라 조회 범위·대시보드 집계·상태 분기가 달라지는 복잡한 조건을 화면과 SQL에 일관되게 반영했습니다.",
    highlights: [
      "교육청>학교>부서 3단계 권한이 영향을 주는 3~5개 조회·집계 화면에서, 화면 필터엔 권한이 걸렸으나 대시보드 집계 SQL엔 빠져 상위기관 수치가 부풀던 정합성 문제를 재현·수정",
      "대시보드 3~5개 지표 카드의 클릭→목록 이동에서 필터·SQL 조건이 어긋나지 않도록, 집계 수치와 상세 목록이 같은 값을 내도록 정리",
      "자산 상태·일자·수량 포맷이 화면마다 달라 같은 데이터를 다르게 해석하던 문제를, 표시 기준을 통일해 해결",
      "유상 수리(유상처리) 현황 메뉴 분리·정기 집계(배치) 이력 화면 등 운영 중 발견된 검색 조건 누락·메뉴 구조 이슈 대응",
    ],
    stack: ["Java", "Spring MVC", "Spring Security", "JSP", "MyBatis", "MariaDB", "Tabulator", "REST API"],
    image: {
      src: "/projects/it-asset-flow.svg",
      alt: "IT 자산관리 업무 흐름 다이어그램: 권한 계층(교육청>학교>부서)이 화면 필터(JSP)·집계 SQL(MyBatis)·대시보드 현황까지 한 기준으로 연결",
    },
    links: [
      { label: "케이스 스터디 보기", href: "/case-studies/it-asset.md", type: "case" },
    ],
  },
  {
    title: "또잉 영어 학습 서비스",
    shortTitle: "ddoing",
    period: "2023.02 ~ 2023.04",
    team: "6인 팀",
    role: "PM 및 프론트엔드·AI 연동",
    scope: "메인 화면, 그림 그리기 화면, 그림 입력(Canvas), AI 판별 API 연동, 점수·경험치 흐름",
    category: "Interactive Learning",
    summary:
      "영어가 어려운 아이들이 애니메이션 따라 말하기(shadowing)와 그림 그리기 게임으로 영어 표현과 단어를 학습하는 SSAFY 팀 프로젝트입니다. React/TypeScript 기반 메인 화면과 그림 그리기 화면을 담당하며, 그림 입력(Canvas)→AI 판별 요청→정답/오답/점수/경험치 흐름을 게임 경험으로 연결했습니다.",
    highlights: [
      "그림 그리기 화면, 그림 입력(Canvas), 타이머, 정답·오답·패스, 게임 완료까지 화면 흐름 구현",
      "이미지 분류 AI 모델의 판별 API를 프론트엔드에 연결해, 사용자가 그린 그림 결과를 학습 게임 상태로 반영",
      "명예의 전당, 마이페이지 등 학습 결과와 진행 상태를 보여주는 화면 개선",
      "PM 역할로 화면 흐름과 AI 연동 범위를 조율하고 학습 데이터 전처리 업무에 참여",
    ],
    stack: ["React", "TypeScript", "Redux", "Vite", "TailwindCSS", "Canvas", "FastAPI", "TensorFlow"],
    image: {
      src: "/projects/ddoing.png",
      alt: "또잉 - Canvas에 영어 단어 그림을 그리는 학습 게임 화면",
    },
    links: [
      { label: "GitHub 저장소 보기", href: "https://github.com/GomGom-Team/ddoing", type: "github" },
    ],
  },
  {
    title: "MODAC 개발자 학습 기록 플랫폼",
    shortTitle: "MODAC",
    period: "2023.01 ~ 2023.02",
    team: "6인 팀",
    role: "프론트엔드 및 일정 관리",
    scope: "학습방, 피드, 마크다운 학습일지, GitHub 커밋 연동, 실시간 학습방 상태",
    category: "Study Platform",
    summary:
      "개발자가 학습 내용을 기록하고 공유할 수 있도록 만든 SSAFY 팀 프로젝트입니다. Vue 3/Pinia 기반 화면에서 Todo, Markdown 학습일지, Feed, 학습방, GitHub commit 연동 흐름을 구현했고, WebSocket 기반 실시간 room 기능 일부를 담당했습니다.",
    highlights: [
      "Vue 3, Vite, Pinia 기반 학습 기록·공유 화면과 상태 관리 구현",
      "공개방·비공개방 입장, 학습방 설정, 퇴장, 참여자 상태 흐름 개선",
      "WebSocket 기반 실시간 그룹 채팅과 학습방 입·퇴장 구독 흐름 구현",
      "피드, 글, 좋아요, 팔로우, 알림, 마이페이지 등 학습 기록 공유 화면 개선",
    ],
    stack: ["Vue.js", "JavaScript", "Pinia", "Vite", "TailwindCSS", "WebSocket", "Spring Boot", "MySQL", "Redis"],
    image: {
      src: "/projects/modac.png",
      alt: "MODAC - 학습 기록이 카드 형태로 정리된 학습 기록 피드 화면",
    },
    links: [
      { label: "GitHub 저장소 보기", href: "https://github.com/YongjaeKwon/MODAC", type: "github" },
    ],
  },
  {
    title: "퀀트 트레이딩 시스템",
    shortTitle: "quant-core",
    period: "2026.03 ~ 현재",
    team: "개인 프로젝트",
    role: "개인 학습 프로젝트",
    scope: "React 대시보드, FastAPI API, WebSocket, JWT 인증, Docker Compose 서비스 구성",
    category: "Trading Platform",
    summary:
      "시뮬레이션 기반 백테스트와 실시간 대시보드 구조를 직접 만들어 보는 개인 학습 프로젝트입니다. FastAPI 백엔드와 React/TypeScript 대시보드를 6개 컨테이너로 분리해 서비스 구조와 백엔드 설계를 직접 체험하고 있습니다.",
    highlights: [
      "access/refresh 토큰 분리와 Redis 블랙리스트로 로그아웃 시 access 토큰을 무효화하는 인증 구조를 직접 구현하며 학습",
      "WebSocket으로 보유 종목(포지션)·체결 결과를 대시보드에 실시간 반영하는 구조 구성",
      "과거 데이터를 학습/검증 구간으로 나눠(Walk-Forward) 과최적화를 줄이는 백테스트 방식을 적용하고, 시뮬레이션 기준 손익(PnL)을 산출",
      "PostgreSQL·Redis·API·UI·Collector·Backup 6개 컨테이너를 Docker Compose로 직접 구성",
    ],
    stack: ["React", "TypeScript", "Zustand", "Recharts", "FastAPI", "Python", "PostgreSQL", "Redis", "Docker", "Nginx", "WebSocket", "JWT"],
    image: {
      src: "/projects/quant-core.png",
      alt: "quant-core - 암호화폐 시세 국면 감지 리포트 차트 화면",
    },
    links: [
      { label: "quant-lab 공개 저장소 보기", href: "https://github.com/YongjaeKwon/quant-lab", type: "github" },
    ],
  },
  {
    title: "API 설계·테스트 협업 플랫폼",
    shortTitle: "SSAFAST",
    period: "2023.04 ~ 2023.05",
    team: "6인 팀",
    role: "프론트엔드 개발",
    scope: "성능 테스트 UI, 테스트 대상 서버 URL 소유권 인증, 중첩 입력 폼, 공통 모달 컴포넌트",
    category: "Next.js Tooling",
    summary:
      "Figma, API 명세, 요청 테스트, 유스케이스 테스트, 성능 테스트를 한 공간에서 연결한 SSAFY 팀 프로젝트입니다. Next.js와 TypeScript 기반으로 성능 테스트 UI, BaseURL 인증 가드, 공통 Modal 컴포넌트를 구현했고 심화 프로젝트 우수상을 수상했습니다.",
    highlights: [
      "성능 테스트 UI 전체 구현: API 선택, 값 입력, 실행, 응답 시간 분포(p50/p95/p99)와 처리량(throughput) 결과 표시",
      "테스트 대상 서버 URL이 본인 소유인지 확인하는 인증 단계 구현: 프레임워크별 인증 코드 안내와 여러 URL 검증",
      "React Hook Form으로 여러 단계가 중첩된 요청 입력 폼과 상태 동기화 처리",
      "공통 모달을 React Portal로 구현해, 서버 렌더링(SSR) 환경 안전성과 다른 요소에 가려지는(z-index) 문제 해결",
    ],
    stack: ["Next.js", "React", "TypeScript", "React Query", "React Hook Form", "Redux Toolkit", "TailwindCSS", "Axios", "Docker", "Nginx"],
    image: {
      src: "/projects/ssafast.png",
      alt: "SSAFAST - API 명세 목록과 진행률을 보여주는 워크스페이스 메인 화면",
    },
    links: [
      { label: "GitHub 저장소 보기", href: "https://github.com/SSAFAST/ssafast", type: "github" },
    ],
  },
];

export const experience = {
  title: "프론트엔드 중심 웹 개발자",
  company: "유한책임회사 티지나래",
  period: "2024.06 ~ 재직 중",
  description:
    "2024.06부터 솔루션사업부에서 B2B·B2G 운영 시스템 여러 프로젝트에 투입돼 관리자 화면, API 연동, 권한·조회 조건, 메일·파일·인증 흐름을 개발했습니다. 운영 이슈 100건 이상을 대응하며 실제 사용자가 반복 처리하는 업무 화면을 안정화했습니다.",
  bullets: [
    "Vue·WebSquare·JSP 기반 관리자·모바일 업무 화면 신규 개발 및 운영 오류 수정",
    "Spring Boot 3·Spring MVC 환경에서 API·MyBatis SQL·메일·파일·인증 연동 구현",
    "조회 조건·권한 반영·상태값 불일치 문제를 재현하고, 유사 화면까지 범위를 넓혀 점검",
  ],
};

export const education = [
  {
    title: "삼성 청년 SW 아카데미 (SSAFY)",
    period: "2022.07 ~ 2023.06",
    description: "1년 과정 수료, Next.js 기반 API 협업 플랫폼으로 2학기 심화 프로젝트 우수상 수상",
    icon: "Award",
  },
  {
    title: "아주대학교 e-비즈니스학과",
    period: "2018.03 ~ 2020.08",
    description: "학사 졸업, 학점 3.67 / 4.5",
    icon: "GraduationCap",
  },
  {
    title: "SQLD (SQL 개발자)",
    period: "2024.09",
    description: "화면 필터·API 파라미터·MyBatis SQL이 어긋나지 않는지 점검하는 작업을 뒷받침하는 자격",
    icon: "Database",
  },
];

export const techGroups = [
  {
    title: "Frontend",
    icon: "Code",
    items: ["HTML5", "CSS3", "SASS/SCSS", "JavaScript", "jQuery", "TypeScript", "Vue.js", "React", "Next.js", "WebSquare", "JSP", "Zustand", "Pinia", "Redux", "React Query", "React Hook Form", "Canvas"],
  },
  {
    title: "Backend",
    icon: "Server",
    items: ["Java", "Spring Boot", "Spring MVC", "Spring Security", "MyBatis", "FastAPI", "Python", "REST API", "JWT", "WebSocket"],
  },
  {
    title: "Database",
    icon: "Database",
    items: ["MySQL", "MariaDB", "PostgreSQL", "Redis", "SQLite"],
  },
  {
    title: "Tools & Libraries",
    icon: "Boxes",
    items: ["Git", "SVN", "Maven", "Gradle", "Docker", "Docker Compose", "Nginx", "Node.js", "Vite", "TailwindCSS", "Chart.js", "Tabulator", "Figma"],
  },
];
