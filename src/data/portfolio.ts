export const profile = {
  name: "권용재",
  role: "Frontend Engineer",
  headline:
    "웹과 모바일 업무 화면에서 접수, 동의, 첨부, 조회, 발송 같은 단계를 사용자가 이해할 수 있는 UI로 연결합니다.",
  summary:
    "B2B·B2G 운영 시스템에서 WebSquare, JSP, Vue.js 기반 화면과 Java/Spring API, MyBatis SQL, 외부 API 연동 흐름을 함께 다뤄왔습니다. 실무에서는 모바일 접수, 태블릿 전자서명, 협력사 포탈, 교육청 자산관리처럼 반복 사용되는 업무 화면을 맡았고, 개인 프로젝트로 React/TypeScript 기반 실시간 데이터 대시보드를 확장하고 있습니다.",
  target:
    "게임 서비스의 기록실, 거래소, 운영 도구처럼 데이터와 사용자 행동이 빠르게 맞물리는 웹/모바일 플랫폼 프론트엔드에 강점을 두고 있습니다.",
  email: "koj185364@naver.com",
  phone: "010-9470-1704",
  github: "https://github.com/YongjaeKwon",
  location: "경기도 용인시 수지구",
};

export const heroStats = [
  { label: "실무 시스템", value: "4", unit: "건" },
  { label: "실무 시작", value: "2024.06", unit: "" },
  { label: "React/TS 프로젝트", value: "2+", unit: "건" },
];

export const strengths = [
  {
    title: "업무 단계 화면 구현",
    description: "모바일 접수, 태블릿 전자서명, 개인정보 동의처럼 사용자가 단계별로 진행하는 화면을 구현했습니다.",
    icon: "MonitorSmartphone",
  },
  {
    title: "운영 데이터 UI",
    description: "Vue, WebSquare, JSP 화면에서 등록, 업로드, 발송, 조회, 통계가 이어지는 관리자 기능을 개발했습니다.",
    icon: "PanelTop",
  },
  {
    title: "상태와 예외 처리",
    description: "파일, 메일, 문자, 알림톡, WebSocket 응답을 성공·실패·예외 상태에 맞춰 화면에 반영했습니다.",
    icon: "Workflow",
  },
  {
    title: "데이터 조건 이해",
    description: "권한, 조회 조건, MyBatis SQL 문제를 재현하고 화면/API/데이터 흐름을 함께 점검합니다.",
    icon: "ShieldCheck",
  },
];

export const jobFit = [
  {
    label: "Vue와 React 모두 경험",
    description:
      "실무에서는 Vue 기반 관리자 화면을 개발했고, 개인·팀 프로젝트에서는 React, TypeScript, Next.js, Zustand를 활용했습니다.",
    icon: "Layers",
  },
  {
    label: "API와 SQL 흐름 이해",
    description:
      "권한 조건, MyBatis 동적 SQL, 데이터 조회 흐름을 함께 보며 API 응답과 화면 요구사항 사이의 간극을 줄입니다.",
    icon: "Database",
  },
  {
    label: "모바일 업무 흐름",
    description:
      "데스크톱, 모바일, 태블릿에서 쓰이는 접수, 전자서명, 동의, 진행상태 조회 화면을 구현했습니다.",
    icon: "Smartphone",
  },
  {
    label: "상태 중심 화면 구현",
    description:
      "외부 API, 인증, WebSocket, 파일 처리 결과를 화면 상태로 연결해 사용자가 현재 상태를 놓치지 않도록 구현합니다.",
    icon: "RadioTower",
  },
];

export const projects = [
  {
    title: "AS / 설치 / 상담 업무관리 시스템",
    shortTitle: "TSMS",
    period: "2025.12 ~ 현재",
    team: "2인 팀",
    role: "프론트엔드 주담당",
    category: "Mobile Workflow",
    accent: "cyan",
    summary:
      "AS 접수, 설치, 상담 업무가 데스크톱·모바일·태블릿에서 이어지는 WebSquare 기반 운영 시스템입니다. 모바일 AS 접수, 진행상태 조회, 태블릿 전자서명, 개인정보 동의처럼 기기별 화면이 같은 업무 데이터와 자연스럽게 연결되도록 구현했습니다.",
    highlights: [
      "모바일 AS 접수·진행상태 조회·태블릿 전자서명 화면 구현",
      "개인정보 동의, 파일 조회·업로드, 단계별 선택/검증 흐름 개선",
      "REST API와 메일·문자·알림톡 발송 결과를 사용자 피드백으로 연결",
      "권한·조회 조건 이슈를 재현해 화면, API, SQL 흐름을 함께 점검",
    ],
    stack: ["JavaScript", "WebSquare", "JSP", "jQuery", "Java", "Spring MVC", "MyBatis", "MariaDB", "REST API"],
    links: [
      { label: "공개 README", href: "/case-studies/tsms.md", type: "case" },
    ],
  },
  {
    title: "TGS 협력사 포탈 시스템",
    shortTitle: "PPS",
    period: "2025.01 ~ 현재",
    team: "3인 팀",
    role: "백엔드 및 Vue 화면 개발",
    category: "Admin Platform",
    accent: "emerald",
    summary:
      "협력사, CE, 교육, 계약, 공지, 설문 데이터를 관리하는 Spring Boot 3 기반 포탈 시스템입니다. Vue 화면과 Tabulator 그리드, Spring Boot API, MyBatis SQL을 연결해 운영자가 반복해서 쓰는 관리 흐름을 정리했습니다.",
    highlights: [
      "교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회 흐름 구현",
      "게시판·제안하기·설문에서 쓰이는 댓글·대댓글 UI와 처리 흐름 공통화",
      "Google OTP 2단계 인증, IP 기반 예외, 인증 상태별 분기 처리 개선",
      "협력사·CE·교육 데이터의 조회 조건과 화면 상태를 운영 정책에 맞게 개선",
    ],
    stack: ["Vue.js", "JavaScript", "Tabulator", "Chart.js", "Java", "Spring Boot", "Spring Security", "MyBatis", "MariaDB", "Oracle"],
    links: [
      { label: "공개 README", href: "/case-studies/pps.md", type: "case" },
    ],
  },
  {
    title: "교육청 IT 자산관리 솔루션",
    shortTitle: "IT Asset",
    period: "2025.12 ~ 현재",
    team: "2인 팀",
    role: "백엔드 및 화면 개발",
    category: "Asset Management",
    accent: "blue",
    summary:
      "교육청과 학교의 IT 자산을 등록, 배포, 대여, 반납, 폐기, P2P 이동 단계로 관리하는 Spring MVC 기반 업무 시스템입니다. 교육청·학교·부서 권한에 따라 달라지는 조회 범위와 외부 API 연계 흐름을 화면과 SQL 조건에 반영했습니다.",
    highlights: [
      "자산 등록·대여·반납·폐기 및 P2P 이동/승인 흐름의 화면·SQL 개선",
      "교육청 > 학교 > 부서 권한 계층에 따라 조회 범위와 검색 조건 분기",
      "대시보드·통계 화면에서 상태별 집계와 동적 컬럼 조회 개선",
      "SMS, 메일, 우편번호, 외부 AS 연동 결과를 화면 흐름에 반영",
    ],
    stack: ["Java", "Spring MVC", "Spring Security", "JSP", "MyBatis", "MariaDB", "Tabulator", "REST API"],
    links: [
      { label: "공개 README", href: "/case-studies/it-asset.md", type: "case" },
    ],
  },
  {
    title: "퀀트 트레이딩 시스템",
    shortTitle: "quant-core",
    period: "2026.03 ~ 현재",
    team: "개인 프로젝트",
    role: "개인 학습 프로젝트",
    category: "Trading Platform",
    accent: "amber",
    summary:
      "시장 데이터 수집, 전략 백테스트, 실거래 실행 구조를 학습하기 위해 진행 중인 개인 프로젝트입니다. FastAPI 백엔드와 React/TypeScript 대시보드를 6개 컨테이너로 분리해 서비스 구조를 익히고 있습니다.",
    highlights: [
      "JWT 인증과 Redis 블랙리스트 기반 로그아웃, IP별 로그인 실패 제한 구현",
      "WebSocket으로 포지션·체결 결과를 프론트에 실시간 브로드캐스트",
      "Walk-Forward 검증과 백테스트 실행 화면 구현, 실거래 정산은 수수료·펀딩비 포함 net PnL 기록",
      "PostgreSQL·Redis·API·UI·Collector·Backup의 6개 컨테이너 Docker Compose 구성",
    ],
    stack: ["React", "TypeScript", "Zustand", "Recharts", "FastAPI", "Python", "PostgreSQL", "Redis", "Docker", "Nginx", "WebSocket", "JWT"],
    links: [
      { label: "GitHub", href: "https://github.com/YongjaeKwon/quant-core", type: "github" },
    ],
  },
  {
    title: "API 설계·테스트 협업 플랫폼",
    shortTitle: "SSAFAST",
    period: "2023.04 ~ 2023.05",
    team: "6인 팀",
    role: "프론트엔드 개발",
    category: "Next.js Tooling",
    accent: "violet",
    summary:
      "Figma, API 명세, 요청 테스트, 유스케이스 테스트, 성능 테스트를 한 공간에서 연결한 SSAFY 팀 프로젝트입니다. Next.js와 TypeScript 기반으로 성능 테스트 UI, BaseURL 인증 가드, 공통 Modal 컴포넌트를 구현했고 심화 프로젝트 우수상을 수상했습니다.",
    highlights: [
      "성능 테스트 UI 전체 구현: API 선택, 파라미터 입력, 실행, p50/p95/p99·throughput 결과 표시",
      "BaseURL 소유권 인증 가드: 프레임워크별 인증 코드 안내와 다중 URL 코드 검증",
      "React Hook Form·FormProvider로 중첩 요청 DTO 입력과 상태 동기화 처리",
      "ReactDOM.createPortal 기반 공통 Modal로 SSR 안전성과 z-index 충돌 해결",
    ],
    stack: ["Next.js", "React", "TypeScript", "React Query", "React Hook Form", "Redux Toolkit", "TailwindCSS", "Axios", "Docker", "Nginx"],
    links: [
      { label: "GitHub", href: "https://github.com/SSAFAST/ssafast", type: "github" },
    ],
  },
  {
    title: "SR30 물류관리시스템",
    shortTitle: "SR30",
    period: "2024.06 ~ 2024.12",
    team: "3인 팀",
    role: "운영 기능 개선 및 신규 기능 개발",
    category: "Internal Operations",
    accent: "amber",
    summary:
      "Nexacro와 Spring MVC 기반 물류 시스템의 운영 기능을 개선했습니다. 설문조사 기능과 통계 조회 화면을 개발하며 데이터 수집, 응답 저장, 통계 산출 흐름을 정리했습니다.",
    highlights: [
      "설문 대상자 관리, 응답 데이터 저장, 통계 조회 화면 구현",
      "SQL 쿼리 개선 및 PL/SQL 작성으로 통계 데이터 산출 지원",
      "설문 참여 상태와 통계 조회 흐름을 개선해 운영자가 응답 현황을 더 쉽게 확인하도록 보완",
    ],
    stack: ["Nexacro", "Java", "Spring MVC", "PL/SQL", "Oracle"],
    links: [
      { label: "공개 README", href: "/case-studies/sr30.md", type: "case" },
    ],
  },
];

export const experience = {
  title: "Java/Spring 기반 웹 시스템 개발자",
  company: "유한책임회사 티지나래",
  period: "2024.06 ~ 재직 중",
  description:
    "솔루션사업부에서 B2B·B2G 운영 시스템 4건의 화면, API, SQL, 외부 연동 기능을 개발하고 있습니다. 신규 화면 개발과 운영 이슈 대응을 함께 맡으며 사용자의 업무 단계, 권한 조건, 조회 결과가 실제 사용 순서와 맞는지 확인합니다.",
  bullets: [
    "WebSquare·JSP·Vue·Nexacro 기반 업무 화면 신규 개발 및 운영 오류 수정",
    "Spring Boot 3 신규 환경과 Spring MVC 레거시 환경에서 API·SQL 흐름 구현",
    "조회 조건, 권한 반영, 입력 검증 문제를 재현하고 유사 화면까지 함께 점검",
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
    title: "SQLD",
    period: "2024.09",
    description: "SQL 개발자 자격 취득",
    icon: "Database",
  },
];

export const techGroups = [
  {
    title: "Frontend",
    icon: "Code",
    tone: "cyan",
    items: ["HTML5", "CSS3", "SASS/SCSS", "JavaScript", "TypeScript", "Vue.js", "React", "Next.js", "Zustand", "Pinia", "React Query", "React Hook Form", "JSP", "WebSquare", "Nexacro", "jQuery"],
  },
  {
    title: "Backend",
    icon: "Server",
    tone: "emerald",
    items: ["Java", "Spring Boot", "Spring MVC", "Spring Security", "MyBatis", "FastAPI", "Python", "REST API", "JWT", "WebSocket"],
  },
  {
    title: "Database",
    icon: "Database",
    tone: "amber",
    items: ["MariaDB", "Oracle", "PostgreSQL", "Redis", "SQLite", "PL/SQL"],
  },
  {
    title: "Tools & Libraries",
    icon: "Boxes",
    tone: "violet",
    items: ["Git", "SVN", "Maven", "Gradle", "Docker", "Docker Compose", "Nginx", "Node.js", "Vite", "TailwindCSS", "Chart.js", "Tabulator", "Figma 시안 확인", "Photoshop 시안 확인"],
  },
];
