export const profile = {
  name: "권용재",
  role: "Frontend Engineer",
  headline:
    "운영 업무의 등록, 업로드, 발송, 조회, 이력 확인 흐름을 화면과 데이터로 연결합니다.",
  summary:
    "B2B·B2G 운영 시스템에서 관리자 화면, API 연동, 권한별 조회 조건, MyBatis SQL, 메일·파일·인증 연동까지 함께 다뤄왔습니다. 단순 화면 구현보다 실제 사용자가 반복적으로 처리하는 업무 흐름을 이해하고, 등록, 업로드, 발송, 조회, 이력 확인이 끊기지 않도록 구현하는 데 강점이 있습니다.",
  target:
    "관리자 도구, B2B 포탈, 데이터 대시보드처럼 복잡한 상태와 권한 조건을 사용자가 이해하기 쉬운 웹 화면으로 정리하는 프론트엔드 업무에 강점을 두고 있습니다.",
  email: "koj185364@naver.com",
  phone: "010-9470-1704",
  github: "https://github.com/YongjaeKwon",
  location: "경기도 용인시 수지구",
  /** "구직 중" | "재직 중" — 상황에 따라 변경 */
  status: "구직 중" as const,
  /** public/resume.pdf 경로에 PDF 이력서 배치 필요 */
  resume: "/resume.pdf",
};

export const heroStats = [
  { label: "실무 시스템", value: "4", unit: "건" },
  { label: "실무 시작", value: "2024.06", unit: "" },
  { label: "PPS 개인 커밋", value: "268", unit: "건" },
];

export const strengths = [
  {
    title: "업무 단계 화면 구현",
    description: "교육 등록, AS 접수, 개인정보 동의, 전자서명처럼 사용자가 단계별로 진행하는 화면을 구현했습니다.",
    icon: "MonitorSmartphone",
  },
  {
    title: "운영 데이터 UI",
    description: "Vue, WebSquare, JSP 화면에서 등록, 업로드, 발송, 조회, 통계, 이력 확인이 이어지는 관리자 기능을 개발했습니다.",
    icon: "PanelTop",
  },
  {
    title: "상태와 예외 처리",
    description: "파일, 메일, 문자, 알림톡, WebSocket 응답을 성공·실패·예외 상태에 맞춰 화면에 반영했습니다.",
    icon: "Workflow",
  },
  {
    title: "데이터 조건 이해",
    description: "권한, 상태값, 기간, 조직 조건에 따른 MyBatis SQL 문제를 재현하고 화면/API/데이터 흐름을 함께 점검합니다.",
    icon: "ShieldCheck",
  },
];

export const jobFit = [
  {
    label: "Vue 관리자 화면 경험",
    description:
      "PPS 협력사 포탈에서 Vue 기반 관리자 화면, Tabulator 그리드, Spring Boot API 연동 기능을 개발했습니다.",
    icon: "Layers",
  },
  {
    label: "API와 SQL 흐름 이해",
    description:
      "권한 조건, MyBatis 동적 SQL, 데이터 조회 흐름을 함께 보며 API 응답과 화면 요구사항 사이의 간극을 줄입니다.",
    icon: "Database",
  },
  {
    label: "업무 흐름 end-to-end 이해",
    description:
      "등록, 업로드, 발송, 조회, 이력 확인으로 이어지는 운영 흐름을 화면, API, SQL 관점에서 함께 확인합니다.",
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
    title: "TGS 협력사 포탈 시스템",
    shortTitle: "PPS",
    period: "2025.02 ~ 현재",
    team: "3인 팀",
    role: "백엔드 및 Vue 화면 개발",
    category: "Admin Platform",
    accent: "emerald",
    summary:
      "협력사, CE, 교육, 계약, 공지, 설문 데이터를 관리하는 Spring Boot 3 기반 운영 포탈입니다. Vue 화면, Tabulator 그리드, Spring Boot API, MyBatis SQL을 연결해 교육 등록부터 대상자 업로드, 메일 발송, 제출 현황 조회까지 이어지는 관리자 업무 흐름을 구현했습니다.",
    highlights: [
      "교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회 흐름 구현",
      "게시판·제안하기·설문에서 쓰이는 댓글·대댓글 UI와 처리 흐름 공통화",
      "CE 현황 메일 발송, 발송 이력 저장, 검증 상태별 조회 조건 개선",
      "Google OTP 2단계 인증, IP 기반 예외, 공지 읽음 이력, 협력사 검색 흐름 개선",
    ],
    stack: ["Vue.js", "JavaScript", "Tabulator", "Chart.js", "Java", "Spring Boot", "Spring Security", "MyBatis", "MariaDB", "Oracle"],
    links: [
      { label: "공개 README", href: "/case-studies/pps.md", type: "case" },
    ],
  },
  {
    title: "TSMS / IDCMS AS 업무 시스템",
    shortTitle: "TSMS",
    period: "2025.09 ~ 현재",
    team: "2인 팀",
    role: "프론트엔드 주담당",
    category: "Mobile Workflow",
    accent: "cyan",
    summary:
      "AS 접수, 상담, 이관, 배정, 배송, 동의, 서명 업무가 데스크톱·모바일·태블릿에서 이어지는 WebSquare/JSP 기반 운영 시스템입니다. 현장 사용자가 접수, 개인정보 동의, QR 확인, 전자서명을 진행하고 내부 담당자가 상태와 후속 처리를 확인할 수 있도록 화면 흐름을 구현했습니다.",
    highlights: [
      "AS 접수·이관·배정, 진행상태 조회, 모바일 접수 화면 개선",
      "개인정보 동의, QR 확인, 무인보관함 접수, 태블릿 전자서명 흐름 구현",
      "배송 일정, 학생 일괄 처리, 라벨/엑셀, 파일 조회·업로드 화면 개선",
      "알림톡·BizTalk·메일 발송 결과와 권한별 조회 조건을 화면 상태로 반영",
    ],
    stack: ["JavaScript", "WebSquare", "JSP", "jQuery", "Java", "Spring MVC", "MyBatis", "MariaDB", "REST API", "BizTalk"],
    links: [
      { label: "공개 README", href: "/case-studies/tsms.md", type: "case" },
    ],
  },
  {
    title: "교육청 IT 자산관리 솔루션",
    shortTitle: "IT Asset",
    period: "2025.09 ~ 2026.03",
    team: "2인 팀",
    role: "백엔드 및 화면 개발",
    category: "Asset Management",
    accent: "blue",
    summary:
      "교육청과 학교의 IT 자산을 등록, 대여, 반납, 폐기, 이력 관리 단계로 관리하는 Spring MVC 기반 업무 시스템입니다. 교육청·학교·부서 권한에 따라 달라지는 조회 범위, 상태별 현황, 대시보드 집계, 배치 이력 흐름을 화면과 SQL 조건에 반영했습니다.",
    highlights: [
      "자산 등록, 자산 현황, 상태 변경, 이력 조회 화면과 SQL 개선",
      "교육청 > 학교 > 부서 권한 계층에 따라 조회 범위와 검색 조건 분기",
      "세종·제주 대시보드, 유상처리 현황, 상태별 집계 화면 개선",
      "자산 메뉴 개편, 배치 이력, 숫자·일자 포맷 등 운영 이슈 대응",
    ],
    stack: ["Java", "Spring MVC", "Spring Security", "JSP", "MyBatis", "MariaDB", "Tabulator", "REST API"],
    links: [
      { label: "공개 README", href: "/case-studies/it-asset.md", type: "case" },
    ],
  },
  {
    title: "SR30 물류관리시스템",
    shortTitle: "SR30",
    period: "2024.07 ~ 2025.07",
    team: "3인 팀",
    role: "운영 기능 개선 및 신규 기능 개발",
    category: "Internal Operations",
    accent: "amber",
    summary:
      "Nexacro와 Spring MVC 기반 물류·서비스 운영 시스템의 일정, 설문, 재고, 리포트, KPI, 이력 조회 화면을 개선했습니다. 운영자가 반복적으로 확인하는 업무 상태와 통계 결과가 화면 필터, SQL 조건, 엑셀 다운로드 결과에서 어긋나지 않도록 구현했습니다.",
    highlights: [
      "일정 공유, 근무 일정, 서비스 리포트, KPI 조회 화면 개선",
      "설문 등록·응답·통계, Roborock 설문 등 운영 데이터 수집 흐름 구현",
      "물류·재고·자재·입출고 및 설치/철거 리포트 화면 개선",
      "개인정보 다운로드, 데이터 삭제, 접근 이력 등 관리자 이력 조회 기능 대응",
    ],
    stack: ["Nexacro", "Java", "Spring MVC", "MyBatis", "PL/SQL", "Oracle", "Excel"],
    links: [
      { label: "공개 README", href: "/case-studies/sr30.md", type: "case" },
    ],
  },
  {
    title: "또잉 영어 학습 서비스",
    shortTitle: "ddoing",
    period: "2023.02 ~ 2023.04",
    team: "6인 팀",
    role: "PM 및 프론트엔드·AI 연동",
    category: "Interactive Learning",
    accent: "cyan",
    summary:
      "영어가 어려운 아이들이 애니메이션 shadowing과 그림 그리기 게임으로 영어 표현과 단어를 학습하는 SSAFY 팀 프로젝트입니다. React/TypeScript 기반 메인 화면과 Drawing Page를 담당하며 Canvas 입력, AI 추론 요청, 정답/오답/점수/경험치 흐름을 사용자 게임 경험으로 연결했습니다.",
    highlights: [
      "Drawing Page, Canvas 입력, 타이머, 정답·오답·패스, 게임 완료 화면 흐름 구현",
      "분류 모델 추론 API를 프론트엔드에 연결해 사용자의 그림 결과를 학습 게임 상태로 반영",
      "Hall of Fame, My Page 등 학습 결과와 사용자 진행 상태를 보여주는 화면 개선",
      "PM 역할로 화면 흐름과 AI 연동 범위를 조율하고 학습 데이터 전처리 업무에 참여",
    ],
    stack: ["React", "TypeScript", "Redux", "Vite", "TailwindCSS", "Canvas", "FastAPI", "TensorFlow"],
    links: [
      { label: "GitHub", href: "https://github.com/GomGom-Team/ddoing", type: "github" },
    ],
  },
  {
    title: "MODAC 개발자 학습 기록 플랫폼",
    shortTitle: "MODAC",
    period: "2023.01 ~ 2023.02",
    team: "6인 팀",
    role: "프론트엔드 및 일정 관리",
    category: "Study Platform",
    accent: "violet",
    summary:
      "개발자가 학습 내용을 기록하고 공유할 수 있도록 만든 SSAFY 팀 프로젝트입니다. Vue 3/Pinia 기반 화면에서 Todo, Markdown 학습일지, Feed, 학습방, GitHub commit 연동 흐름을 구현했고, WebSocket 기반 실시간 room 기능 일부를 담당했습니다.",
    highlights: [
      "Vue 3, Vite, Pinia 기반 학습 기록·공유 화면과 상태 관리 구현",
      "공개방·비공개방 입장, 학습방 설정, 퇴장, 참여자 상태 흐름 개선",
      "WebSocket 기반 group chat, room store, subscription 흐름 구현",
      "Feed, article, like, follow, 알림, mypage 등 학습 기록 공유 화면 개선",
    ],
    stack: ["Vue.js", "JavaScript", "Pinia", "Vite", "TailwindCSS", "WebSocket", "Spring Boot", "MySQL", "Redis"],
    links: [
      { label: "GitHub", href: "https://github.com/YongjaeKwon/MODAC", type: "github" },
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
];

export const experience = {
  title: "Java/Spring 기반 웹 시스템 개발자",
  company: "유한책임회사 티지나래",
  period: "2024.06 ~ 재직 중",
  description:
    "솔루션사업부에서 B2B·B2G 운영 시스템의 화면, API, SQL, 외부 연동 기능을 개발하고 있습니다. 신규 화면 개발과 운영 이슈 대응을 함께 맡으며 사용자의 업무 단계, 권한 조건, 조회 결과가 실제 사용 순서와 맞는지 확인합니다.",
  bullets: [
    "Vue·WebSquare·JSP·Nexacro 기반 관리자/모바일 업무 화면 신규 개발 및 운영 오류 수정",
    "Spring Boot 3 신규 환경과 Spring MVC 환경에서 API, MyBatis SQL, 메일·파일·인증 연동 흐름 구현",
    "조회 조건, 권한 반영, 입력 검증, 상태값 불일치 문제를 재현하고 유사 화면까지 함께 점검",
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
    items: ["HTML5", "CSS3", "SASS/SCSS", "JavaScript", "TypeScript", "Vue.js", "React", "Next.js", "Zustand", "Pinia", "Redux", "React Query", "React Hook Form", "Canvas", "JSP", "WebSquare", "Nexacro", "jQuery"],
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
