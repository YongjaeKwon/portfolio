export const profile = {
  name: "권용재",
  role: "Web Frontend Engineer",
  headline:
    "운영 환경에서 실제로 쓰이는 웹 화면을 만들며, 사용자가 거치는 단계와 화면 상태를 함께 살핍니다.",
  summary:
    "B2B·B2G 운영 시스템에서 WebSquare, JSP, Vue.js 화면 개발을 맡아왔습니다. 화면을 그리는 것에서 끝내지 않고 입력 단계, API 응답, 권한 조건, SQL 조회 조건이 실제 사용 흐름과 맞는지 함께 확인하며 개발합니다.",
  target:
    "웹/모바일 플랫폼, 관리자 도구, 데이터 대시보드처럼 반복적으로 사용되는 화면을 안정적으로 만드는 일에 관심이 있습니다.",
  email: "koj185364@naver.com",
  phone: "010-9470-1704",
  github: "https://github.com/YongjaeKwon",
  location: "경기도 용인시 수지구",
};

export const heroStats = [
  { label: "운영 시스템", value: "4", unit: "건" },
  { label: "실무 시작", value: "2024.06", unit: "" },
  { label: "주요 영역", value: "Web/Mobile", unit: "" },
];

export const strengths = [
  {
    title: "현장 업무 화면 구현",
    description: "모바일 접수, 태블릿 전자서명, 동의 화면처럼 현장에서 바로 쓰이는 입력 흐름을 구현했습니다.",
    icon: "MonitorSmartphone",
  },
  {
    title: "관리자 화면 개발",
    description: "Vue 화면과 Spring Boot API를 연결해 등록, 업로드, 메일 발송, 제출 현황 조회 기능을 개발했습니다.",
    icon: "PanelTop",
  },
  {
    title: "API와 화면 상태 연결",
    description: "파일, 메일, 문자, 알림톡 연동 결과가 화면 상태와 사용자 안내에 맞게 반영되도록 다뤘습니다.",
    icon: "Workflow",
  },
  {
    title: "운영 이슈 대응",
    description: "권한, 조회 조건, 입력 검증 문제를 재현하고 비슷한 화면까지 함께 점검했습니다.",
    icon: "ShieldCheck",
  },
];

export const jobFit = [
  {
    label: "모던 프론트엔드 스택",
    description:
      "Vue로 운영 환경의 관리자 화면을 구현하고, React·TypeScript로 데이터 대시보드를 직접 만들며 두 스택을 모두 사용해왔습니다.",
    icon: "Layers",
  },
  {
    label: "API · SQL 흐름 이해",
    description:
      "권한 조건, MyBatis SQL, 데이터 조회 흐름을 함께 이해해 API 응답과 화면 요구사항 사이의 간극을 줄입니다.",
    icon: "Database",
  },
  {
    label: "반응형 · 모바일 업무 흐름",
    description:
      "데스크톱, 모바일, 태블릿에서 쓰이는 접수·전자서명·동의 화면을 구현하며 기기별 입력 흐름을 다뤘습니다.",
    icon: "Smartphone",
  },
  {
    label: "API 상태와 화면 연결",
    description:
      "외부 API 응답과 파일·발송 결과를 화면 상태로 연결해 사용자에게 진행 상황을 명확히 보여줍니다.",
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
      "AS 접수, 설치, 상담 업무 화면을 개발했습니다. 데스크톱뿐 아니라 모바일과 태블릿에서도 입력 흐름이 끊기지 않도록 검증, 파일 처리, 외부 API 연동 상태를 화면에 반영했습니다.",
    highlights: [
      "모바일 AS 접수, 태블릿 전자서명, 개인정보 동의 화면 구현",
      "REST API 응답과 메일·문자·알림톡 발송 결과를 화면 상태와 연결",
      "단계별 선택 흐름, 입력값 검증, 파일 조회·업로드 UI 개선",
    ],
    stack: ["JavaScript", "WebSquare", "JSP", "jQuery", "Java", "Spring", "REST API"],
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
      "협력사 교육 운영에 필요한 관리자 기능을 개발했습니다. Vue 화면과 Spring Boot API를 연결해 등록, 대상자 관리, 엑셀 업로드, 메일 발송, 제출 현황 조회를 하나의 흐름으로 구성했습니다.",
    highlights: [
      "교육 등록, 대상자 관리, 참석 여부 관리, 엑셀 일괄 업로드 UI/API 개발",
      "대상자별 메일 발송과 제출 현황 조회 화면 구현",
      "Google OTP 2단계 인증과 IP 기반 인증 예외 처리 개선",
    ],
    stack: ["Vue.js", "Java", "Spring Boot", "MyBatis", "MariaDB", "Oracle"],
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
      "전국 교육청과 학교의 IT 자산을 등록, 대여, 반납, 폐기 단계로 관리하는 업무 화면을 개발했습니다. 교육청·학교 권한에 따라 달라지는 조회 범위와 외부 API 연계 흐름을 화면과 SQL 조건에 반영했습니다.",
    highlights: [
      "자산 등록·대여·반납·폐기 흐름에 따른 화면 및 SQL 작성",
      "교육청·학교·행사·제품 기준의 검색 조건과 현황 조회 화면 개선",
      "SMS, 메일, 알림톡, 우편번호 등 외부 API 연계 기능 개선",
    ],
    stack: ["Java", "Spring MVC", "MyBatis", "MariaDB", "REST API"],
  },
  {
    title: "퀀트 트레이딩 시스템",
    shortTitle: "quant-core",
    period: "2026.03 ~ 현재",
    team: "개인 프로젝트",
    role: "1인 설계 및 개발",
    category: "Data Dashboard",
    accent: "amber",
    summary:
      "시장 데이터 수집부터 백테스트 결과 확인까지 직접 경험해보기 위해 시작한 개인 프로젝트입니다. React와 TypeScript로 전략 성과 지표를 탐색하는 대시보드를 만들고 있습니다.",
    highlights: [
      "FastAPI 응답 데이터를 React / TypeScript 대시보드와 연결",
      "수익률, MDD, 승률, 거래 횟수 등 지표를 카드와 표로 표현",
      "Docker 기반 개발 환경 구성과 서비스 분리 시도",
    ],
    stack: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Docker"],
  },
  {
    title: "SR30 물류관리시스템",
    shortTitle: "SR30",
    period: "2024.06 ~ 2024.12",
    team: "3인 팀",
    role: "운영 기능 개선 및 신규 기능 개발",
    category: "Internal Operations",
    accent: "violet",
    summary:
      "Nexacro와 Spring MVC 기반 물류 시스템의 운영 기능을 개선했습니다. 설문조사 기능과 통계 조회 화면을 개발하며 데이터 수집과 조회 흐름을 정리했습니다.",
    highlights: [
      "설문 대상자 관리, 응답 데이터 저장, 통계 조회 화면 구현",
      "SQL 쿼리 개선 및 PL/SQL 작성으로 통계 데이터 산출 지원",
      "설문 참여 프로세스 개선으로 응답률을 5%에서 20%로 향상",
    ],
    stack: ["Nexacro", "Java", "Spring MVC", "PL/SQL", "Oracle"],
  },
];

export const experience = {
  title: "Java/Spring 웹 시스템 개발자",
  company: "유한책임회사 티지나래",
  period: "2024.06 ~ 재직 중",
  description:
    "솔루션사업부에서 B2B·B2G 운영 시스템 4건의 화면, API, SQL, 외부 연동 기능을 개발하고 있습니다. 신규 기능 개발과 운영 이슈 대응을 함께 맡으며 화면과 데이터 흐름을 끝까지 확인하며 일하고 있습니다.",
  bullets: [
    "업무 화면 신규 개발, 화면 오류 수정, 외부 API 연계, 통계 조회 SQL 작성",
    "Spring Boot 3 신규 환경과 Spring MVC 레거시 환경을 모두 경험",
    "조회 조건, 권한 반영, 입력 흐름 문제를 재현하고 사용자 관점에서 개선",
  ],
};

export const education = [
  {
    title: "삼성 청년 SW 아카데미 (SSAFY)",
    period: "2022.07 ~ 2023.06",
    description: "1년 과정 수료, 2학기 심화 프로젝트 우수상 수상",
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
    items: ["HTML5", "CSS3", "SASS/SCSS", "JavaScript", "Vue.js", "React", "TypeScript", "JSP", "WebSquare", "Nexacro", "jQuery"],
  },
  {
    title: "Backend",
    icon: "Server",
    tone: "emerald",
    items: ["Java", "Spring Boot", "Spring MVC", "Spring Security", "MyBatis", "REST API"],
  },
  {
    title: "Database",
    icon: "Database",
    tone: "amber",
    items: ["MariaDB", "Oracle", "PostgreSQL", "SQLite", "PL/SQL"],
  },
  {
    title: "Tools",
    icon: "Boxes",
    tone: "violet",
    items: ["Git", "SVN", "Maven", "Gradle", "Docker", "Node.js", "Vite", "Figma 시안 확인", "Photoshop 시안 확인"],
  },
];
