export const profile = {
  name: "권용재",
  role: "Frontend Developer",
  headline: "복잡한 운영 업무를 한눈에 이해되는 화면으로 만듭니다.",
  summary:
    "B2B·B2G 운영 시스템에서 협력사 포탈, AS/현장 서비스, 교육청 자산관리 화면을 개발했습니다. 업무 단계와 데이터 기준을 먼저 정리하고, 사용자가 화면에서 해야 할 일을 분명하게 알 수 있도록 구현합니다. Vue·WebSquare·JSP 실무 경험이 있고, 팀·개인 프로젝트에서는 React·Next.js·TypeScript로 화면 상태와 데이터 흐름을 다뤘습니다.",
  target:
    "관리자 도구와 운영 포탈처럼 조건이 많은 화면을 명료하고 안정적으로 만드는 일을 잘합니다.",
  email: "koj185364@naver.com",
  phone: "",
  github: "https://github.com/YongjaeKwon",
  location: "경기 용인",
  resume: "/resume.pdf",
};

export const heroStats = [
  { label: "주요 경험", value: "운영 포탈", unit: "" },
  { label: "화면 환경", value: "Vue/WebSquare", unit: "" },
  { label: "함께 본 범위", value: "API·SQL", unit: "" },
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
    badge: "운영 포탈 · 관리자 화면 · 데이터 흐름",
    headline:
      "업무 흐름이 복잡한 화면을 사용자가 이해하기 쉬운 순서로 정리합니다.",
    target:
      "화면에 보이는 값, API 응답, 조회 조건이 같은 기준으로 움직이는지 확인하며 개발합니다.",
    resume: "/resume.pdf",
    resumeLabel: "이력서 다운로드",
    workStyleTitle: "화면을 만들기 전에 먼저 정리하는 것",
    workStyleNote:
      "좋은 운영 화면은 사용자가 다음에 무엇을 해야 하는지 바로 알려줍니다. 그래서 버튼, 안내 문구, 빈 화면, 실패 상태를 업무 순서에 맞춰 먼저 정리합니다.",
    contactTitle: "업무 화면을 차분히 개선하는 웹 개발자입니다",
    contactDescription:
      "협력사 포탈, AS/현장 서비스, 교육청 자산관리 시스템에서 화면·API·조회 조건을 함께 다뤘습니다. 첫 화면부터 상세 업무까지 사용자가 다음 행동을 알 수 있는 UI를 만듭니다.",
    projectIntro:
      "무엇을 만들었는지가 바로 보이도록, 실무 프로젝트를 먼저 정리했습니다.",
    fitTitle: "화면과 데이터 기준을 함께 맞춥니다",
    fitDescription:
      "등록, 업로드, 발송, 조회처럼 매일 쓰는 업무 화면에서 사용자가 보는 값과 실제 조회 결과가 어긋나지 않도록 확인합니다.",
    strengths: [
      {
        title: "업무 순서에 맞춘 화면 구성",
        description:
          "등록→업로드→발송→조회처럼 이어지는 기능을 한 화면씩 따로 보지 않고, 사용자가 실제로 처리하는 순서대로 화면 상태를 나눕니다.",
        icon: "MonitorSmartphone",
      },
      {
        title: "성공과 완료를 구분하는 상태 처리",
        description:
          "메일, 알림, 파일처럼 요청 성공과 실제 업무 완료가 다른 기능에서는 성공·실패·대기·재처리 상태를 분리해 운영자가 바로 판단할 수 있게 합니다.",
        icon: "Workflow",
      },
      {
        title: "반복 업무 화면의 패턴 정리",
        description:
          "검색, 목록, 상세, 모달, 업로드, 다운로드처럼 자주 쓰는 화면을 같은 규칙으로 구성해 새 기능도 빠르게 이해되도록 만듭니다.",
        icon: "PanelTop",
      },
      {
        title: "조회 조건과 권한 기준 확인",
        description:
          "권한, 기관, 상태, 기간 조건이 화면 필터와 API 파라미터, SQL 조회 조건에 같은 기준으로 들어가는지 확인합니다.",
        icon: "ShieldCheck",
      },
    ],
    fitItems: [
      {
        label: "업무 흐름 정리",
        description:
          "화면을 만들기 전에 사용자가 어떤 순서로 등록하고 확인하는지 먼저 적어 두고, 각 단계의 버튼과 안내 문구를 맞춥니다.",
        icon: "Workflow",
      },
      {
        label: "데이터 기준 확인",
        description:
          "대시보드 숫자와 상세 목록이 다르게 보일 때 화면 필터, API 요청, MyBatis 조건을 함께 확인해 같은 값을 보도록 맞춥니다.",
        icon: "Database",
      },
      {
        label: "현장 화면 대응",
        description:
          "AS/현장 서비스 화면에서 데스크톱, 모바일, 태블릿이 같은 업무 번호를 기준으로 이어지도록 화면 흐름을 구현했습니다.",
        icon: "Smartphone",
      },
      {
        label: "백엔드 흐름 이해",
        description:
          "프론트엔드가 주력이지만 API 응답, 인증, 파일, 메일, SQL 조건까지 함께 보며 화면 오류의 원인을 끝까지 좁혀 왔습니다.",
        icon: "Server",
      },
    ],
    projectOrder: ["PPS", "TSMS", "IT Asset", "SSAFAST", "quant-core"],
    projectAngles: {
      PPS: "교육 등록, 대상자 업로드, 메일 발송, 제출 현황 조회가 한 흐름으로 이어지는 협력사 운영 포탈을 만들었습니다.",
      TSMS: "AS 접수부터 동의, 서명, 알림 결과까지 여러 화면을 같은 업무 번호로 연결했습니다.",
      "IT Asset": "학생 단말 자산 현황과 교육청별 대시보드가 같은 기준으로 보이도록 화면과 집계 조건을 맞췄습니다.",
      SSAFAST: "API 명세 작성과 테스트를 돕는 도구에서 중첩 입력 폼, 인증 가드, 결과 화면을 구현했습니다.",
      "quant-core": "매매 전략을 실행하고 모니터링하는 개인 백엔드와 대시보드를 설계부터 운영 흐름까지 직접 만들었습니다.",
    },
  },
];

export const projects = [
  {
    title: "협력사 운영 포탈",
    shortTitle: "PPS",
    period: "2025.01 ~ 2026.07",
    scope: "교육/계약/정산 업무, 대상자 엑셀 업로드, 메일 발송, 설문·게시판, 승인 처리",
    category: "Partner Portal",
    summary:
      "협력사 교육/계약/정산 업무를 처리하는 그룹사 운영 포탈입니다. 교육 등록, 대상자 엑셀 업로드, 메일 발송, 제출 현황 조회가 한 흐름으로 이어지도록 Vue 화면과 Spring Boot API를 구현했습니다.",
    highlights: [
      "교육관리 화면에서 대상자 엑셀 업로드, 업로드 결과 확인, 메일 발송, 제출 현황 조회가 같은 교육 기준으로 이어지도록 구현",
      "설문, 게시판, 제안하기 화면의 댓글·대댓글 기능을 공통 컴포넌트로 정리해 반복 구현을 줄이고 수정 지점을 단순화",
      "본사 계정 생성, 로그인 후처리, 비밀번호 정책, 접근 예외처럼 사용자 상태가 달라지는 흐름을 화면과 서버 조건에 맞춰 처리",
      "압축 다운로드처럼 시간이 걸리는 작업을 비동기로 처리하고, 완료·실패 상태를 운영자가 다시 확인할 수 있게 구성",
    ],
    stack: ["Vue.js", "Spring Boot", "MyBatis", "MariaDB", "Tabulator"],
    image: {
      src: "/projects/pps-flow.svg",
      alt: "PPS 업무 흐름 다이어그램: 화면(Vue)→API(Spring Boot)→데이터(MyBatis SQL)→외부 연동(메일·엑셀·인증)을 같은 교육·대상자 키로 일치",
    },
    links: [
      { label: "케이스 스터디 보기", href: "/case-studies/pps.md", type: "case" },
    ],
  },
  {
    title: "AS/현장 서비스 운영 시스템",
    shortTitle: "TSMS",
    period: "2024.06 ~ 2026.07",
    scope: "AS 접수, 현장 처리, 협력사 포탈 연동, 학생 단말 접수 링크, 알림톡·무인보관함",
    category: "Service Workflow",
    summary:
      "협력사, AS, 자산, 물류 업무를 다루는 현장 서비스 운영 시스템입니다. 접수, 상담, 동의, 서명, 알림 결과가 여러 화면을 거쳐도 같은 업무 번호로 이어지도록 화면과 API 흐름을 구현했습니다.",
    highlights: [
      "AS/현장 서비스 화면에서 접수, 상담, 배정, 동의, 서명 단계가 데스크톱·모바일·태블릿에서 끊기지 않도록 상태 흐름을 정리",
      "협력사 포탈과 주고받는 연동 API를 화면, 서버, DB 조회 조건까지 연결해 구현",
      "학생 단말 AS 접수 링크에서 학생과 단말 식별자가 그대로 노출되지 않도록 암호화 토큰을 적용",
      "알림톡 발송과 무인보관함 AS 접수 기능을 만들고, 실패·대기·재처리 상태를 운영자가 확인할 수 있게 반영",
    ],
    stack: ["WebSquare", "JavaScript", "Spring MVC", "MyBatis", "MariaDB"],
    image: {
      src: "/projects/tsms-flow.svg",
      alt: "TSMS 업무 흐름 다이어그램: 화면(WebSquare·JSP)→API(Spring MVC)→데이터(MyBatis·SQL)→외부 연동(메시지 발송·전자서명)을 같은 업무 번호로 연결",
    },
    links: [
      { label: "케이스 스터디 보기", href: "/case-studies/tsms.md", type: "case" },
    ],
  },
  {
    title: "교육청 스마트기기 자산관리 시스템",
    shortTitle: "IT Asset",
    period: "2024.09 ~ 2026.07",
    scope: "학생 단말 자산 현황, 교육청별 대시보드, 일 집계 배치, AS 시스템 자산 연동",
    category: "Asset Management",
    summary:
      "시도교육청 학생 단말과 스마트기기 자산을 등록, 조회, 집계하는 시스템입니다. 자산 현황 화면, 교육청별 대시보드, 일 집계 배치, AS 시스템 연동 배치를 구현하며 권한별 조회 기준을 맞췄습니다.",
    highlights: [
      "자산 현황과 교육청별 대시보드를 개발하고, 학교·부서·상태 조건에 따라 조회 범위가 달라지는 화면을 정리",
      "매일 자산 수량을 집계하는 배치와 AS 시스템으로 자산 정보를 연동하는 배치를 구현",
      "대시보드 수치와 상세 목록이 다르게 보이지 않도록 화면 필터와 MyBatis 조회 조건을 함께 점검",
      "운영 중 SQL 확인이 쉽도록 MyBatis SQL 로깅 인터셉터를 직접 구현해 문제 재현과 확인 시간을 줄임",
    ],
    stack: ["JSP", "JavaScript", "Spring MVC", "MyBatis", "MySQL"],
    image: {
      src: "/projects/it-asset-flow.svg",
      alt: "IT 자산관리 업무 흐름 다이어그램: 권한 계층(교육청>학교>부서)이 화면 필터(JSP)·집계 SQL(MyBatis)·대시보드 현황까지 한 기준으로 연결",
    },
    links: [
      { label: "케이스 스터디 보기", href: "/case-studies/it-asset.md", type: "case" },
    ],
  },
  {
    title: "API 명세/테스트 도구",
    shortTitle: "SSAFAST",
    period: "2023.05 ~ 2023.06",
    scope: "API 명세 작성, 요청 입력 폼, 인증 가드, 성능 테스트 결과 화면",
    category: "Developer Tool",
    summary:
      "API 명세 작성과 테스트를 돕는 개발 도구입니다. Next.js와 TypeScript 기반으로 중첩 입력 폼, 인증 가드, 성능 테스트 결과 화면을 구현하고 기획부터 배포까지 팀과 함께 진행했습니다.",
    highlights: [
      "여러 단계가 중첩된 API 요청 입력 폼을 React Hook Form으로 구현하고 입력 상태를 안정적으로 관리",
      "테스트 대상 서버 URL이 본인 소유인지 확인하는 인증 가드를 만들어 잘못된 테스트 실행을 방지",
      "성능 테스트 결과를 응답 시간, 처리량, 요청 상태별로 나눠 한눈에 확인할 수 있는 화면으로 구성",
      "공통 모달과 결과 화면을 정리해 명세 작성, 요청 테스트, 성능 테스트가 한 흐름으로 이어지게 구현",
    ],
    stack: ["Next.js", "React", "TypeScript", "React Hook Form", "TanStack Query"],
    image: {
      src: "/projects/ssafast.png",
      alt: "SSAFAST - API 명세 목록과 진행률을 보여주는 워크스페이스 메인 화면",
    },
    links: [
      { label: "GitHub 저장소 보기", href: "https://github.com/SSAFAST/ssafast", type: "github" },
    ],
  },
  {
    title: "퀀트 트레이딩 백엔드",
    shortTitle: "quant-core",
    period: "2026.03 ~ 2026.07",
    scope: "매매 전략 실행, 실시간 모니터링, 인증, WebSocket, 테스트와 배포 흐름",
    category: "Backend Dashboard",
    summary:
      "퀀트 매매 전략을 실행하고 결과를 모니터링하는 개인 백엔드/대시보드입니다. FastAPI API, PostgreSQL, Redis, React 대시보드를 직접 구성하며 인증, 실시간 갱신, 테스트와 실행 환경을 함께 정리했습니다.",
    highlights: [
      "JWT 기반 로그인과 로그아웃 흐름을 구현하고, Redis를 활용해 토큰 무효화 기준을 정리",
      "WebSocket으로 전략 실행 상태와 체결 결과를 대시보드에 실시간으로 반영",
      "pytest로 핵심 API 테스트를 작성하고, Docker Compose로 API·DB·Redis 실행 환경을 구성",
      "GitHub Actions로 기본 검증 흐름을 만들며 설계, 구현, 실행, 확인 과정을 단독으로 경험",
    ],
    stack: ["FastAPI", "PostgreSQL", "Redis", "React", "Docker"],
    image: {
      src: "/projects/quant-core.png",
      alt: "quant-core - 암호화폐 시세 국면 감지 리포트 차트 화면",
    },
    links: [
      { label: "quant-lab 공개 저장소 보기", href: "https://github.com/YongjaeKwon/quant-lab", type: "github" },
    ],
  },
];

export const experience = {
  title: "프론트엔드 중심 웹 개발자",
  company: "유한책임회사 티지나래",
  period: "2024.06 ~ 재직 중",
  description:
    "B2B·B2G 운영 시스템에서 관리자 화면, 모바일 업무 화면, API 연동, 조회 조건, 파일·메일·인증 흐름을 개발했습니다. 운영자가 매일 쓰는 화면에서 값이 다르게 보이거나 다음 단계로 넘어가지 못하는 문제를 재현하고, 화면과 조회 기준을 함께 맞춰 개선했습니다.",
  bullets: [
    "Vue·WebSquare·JSP 기반 관리자·모바일 업무 화면 신규 개발 및 운영 오류 수정",
    "Spring Boot·Spring MVC 환경에서 API, MyBatis SQL, 메일, 파일, 인증 연동 구현",
    "조회 조건, 권한, 상태값 불일치 문제를 재현하고 관련 화면까지 함께 점검",
  ],
};

export const education = [
  {
    title: "삼성 청년 SW 아카데미 (SSAFY)",
    period: "2022.07 ~ 2023.06",
    description: "1년 과정 수료, Next.js 기반 API 협업 플랫폼으로 2학기 자율 프로젝트 우수상 수상",
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
    description: "화면 필터, API 파라미터, SQL 조회 조건을 함께 점검하는 업무에 활용",
    icon: "Database",
  },
];

export const techGroups = [
  {
    title: "Frontend",
    icon: "Code",
    items: ["JavaScript", "TypeScript", "Vue.js", "React", "Next.js", "WebSquare", "JSP"],
  },
  {
    title: "Backend",
    icon: "Server",
    items: ["Spring Boot", "Spring MVC", "MyBatis", "REST API", "FastAPI"],
  },
  {
    title: "Database",
    icon: "Database",
    items: ["MariaDB", "MySQL", "PostgreSQL", "Redis"],
  },
  {
    title: "Tools",
    icon: "Boxes",
    items: ["Git", "SVN", "Docker", "Vite", "GitHub Actions", "Tabulator"],
  },
];
