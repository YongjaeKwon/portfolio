export const profile = {
  name: "권용재",
  role: "웹 개발자",
  headline:
    "기존 시스템의 구조와 업무 맥락을 이해하고, 필요한 화면과 데이터 기준을 차분히 맞춰가는 개발자입니다.",
  summary:
    "협력사 포탈, 현장 A/S, 교육청 자산관리처럼 이미 운영 중인 업무 시스템을 다뤄왔습니다. 새 기능을 붙일 때는 화면에 보이는 값과 실제 조회 기준이 어긋나지 않는지 먼저 확인하려고 합니다.",
  target:
    "복잡한 업무를 멋있게 포장하기보다, 담당자가 실제로 확인하고 처리하는 기준을 화면에 잘 드러내는 일을 중요하게 봅니다.",
  email: "koj185364@naver.com",
  phone: "",
  github: "https://github.com/YongjaeKwon",
  location: "경기 용인",
  resume: "/resume.pdf",
};

export const hero = {
  name: profile.name,
  role: profile.role,
  headline: profile.headline,
  supportText:
    "협력사 포탈, 현장 A/S, 교육청 자산관리처럼 운영 중인 업무 시스템에서 기능 추가와 수정, 조회 기준 정리를 경험했습니다.",
  ctas: [
    { label: "프로젝트 보기", href: "#projects", type: "primary" },
    { label: "GitHub", href: profile.github, type: "github" },
    { label: "이력서", href: profile.resume, type: "resume" },
    { label: "Contact", href: `mailto:${profile.email}`, type: "contact" },
  ],
};

export const coreStrengths = [
  {
    title: "운영 중인 구조를 먼저 읽습니다",
    description:
      "새로 만드는 일보다 기존 화면, 서버 처리, 권한 조건이 어떻게 이어져 있는지 파악하는 시간이 중요했습니다. 그 위에서 필요한 기능을 추가하거나 수정했습니다.",
  },
  {
    title: "화면과 조회 기준을 맞춥니다",
    description:
      "목록, 상세, 엑셀, 대시보드가 서로 다른 숫자를 보여주지 않도록 같은 조건이 어디까지 적용되는지 확인했습니다.",
  },
  {
    title: "반복되는 기능은 기준을 나눠 봅니다",
    description:
      "댓글, 입력 폼, 상태 표시처럼 여러 화면에 반복되는 기능은 공통 규칙과 화면별 예외를 나눠 보려고 했습니다.",
  },
];

export type ProjectVisibility = "비공개 실무 프로젝트" | "공개 GitHub 프로젝트";

export type FeaturedProject = {
  id: string;
  title: string;
  shortTitle: string;
  period: string;
  category: string;
  stack: string[];
  image?: {
    src: string;
    alt: string;
  };
  card: {
    summary: string;
    description: string[];
    keywords: string[];
    visibility: ProjectVisibility;
  };
  detail: {
    overview: string;
    scope: string[];
    workPoints: string[];
    techUsage: string[];
    disclosure: string;
    resources: Array<{ label: string; href?: string; type: "case" | "github" | "diagram" | "image" }>;
  };
};

export const featuredProjects: FeaturedProject[] = [
  {
    id: "pps",
    title: "협력사 업무 포탈(PPS)",
    shortTitle: "PPS",
    period: "2025.01 ~ 2026.07",
    category: "Partner Portal",
    stack: ["Vue", "Spring Boot", "MyBatis", "MariaDB", "Tabulator"],
    image: {
      src: "/projects/pps-flow.svg",
      alt: "협력사 업무 포탈의 비식별화된 화면과 데이터 처리 흐름 다이어그램",
    },
    card: {
      summary: "협력사와 내부 담당자가 함께 쓰는 업무 처리 포탈입니다.",
      description: [
        "교육 등록, 대상자 관리, 공지와 설문처럼 여러 사람이 확인해야 하는 화면을 다뤘습니다.",
        "목록과 엑셀 중심의 운영 화면은 담당자가 반복해서 보는 정보의 기준이 섞이지 않도록 정리했습니다.",
      ],
      keywords: ["교육·대상자 관리", "공지·설문", "목록·엑셀"],
      visibility: "비공개 실무 프로젝트",
    },
    detail: {
      overview:
        "협력사와 내부 담당자가 교육, 공지, 게시판, 설문, 파트너 관련 정보를 확인하고 처리하는 업무 포탈입니다.",
      scope: [
        "교육 등록과 대상자 관리 화면",
        "공지·게시판·댓글·대댓글 관련 화면",
        "설문 작성과 응답 확인 화면",
        "파트너 관련 일부 화면",
        "목록과 엑셀 중심의 운영 화면",
      ],
      workPoints: [
        "같은 대상자와 상태를 여러 화면에서 다루기 때문에 목록, 상세, 엑셀에서 기준이 달라지지 않는지 확인했습니다.",
        "댓글과 입력 폼처럼 반복되는 기능은 공통 규칙과 화면별 예외를 나눠 보려고 했습니다.",
        "계약 관련 영역은 시스템 범위에 포함되지만, 포트폴리오에서는 직접 담당한 운영 화면 중심으로만 설명합니다.",
      ],
      techUsage: [
        "Vue로 입력, 목록, 상세처럼 상태가 많은 업무 화면을 다뤘습니다.",
        "Spring Boot와 MyBatis 구조에서 화면에 필요한 응답과 조회 조건이 어떻게 이어지는지 확인했습니다.",
        "Tabulator는 목록과 엑셀 중심 화면에서 반복 조회 데이터를 정리하는 데 사용했습니다.",
      ],
      disclosure:
        "비공개 실무 프로젝트입니다. 고객사명, 실제 화면, 계약 전체·CE 승인 전체·본사 계정 전체·압축 다운로드 같은 직접 담당으로 단정하기 어려운 범위는 노출하지 않습니다.",
      resources: [
        { label: "비식별화 다이어그램", href: "/projects/pps-flow.svg", type: "diagram" },
      ],
    },
  },
  {
    id: "field-as",
    title: "현장 A/S 접수·처리 시스템",
    shortTitle: "A/S",
    period: "2024.06 ~ 2026.07",
    category: "Field Service",
    stack: ["WebSquare", "JSP", "Spring MVC", "MyBatis", "MariaDB"],
    image: {
      src: "/projects/tsms-flow.svg",
      alt: "현장 A/S 접수와 처리 단계의 비식별화된 흐름 다이어그램",
    },
    card: {
      summary: "현장 A/S 접수부터 처리 단계까지 이어지는 업무 시스템입니다.",
      description: [
        "접수, 동의, 서명, 알림, 보관함처럼 외부 접점이 있는 기능을 다뤘습니다.",
        "단계별 상태와 예외가 섞이지 않도록 화면에서 보여줄 값과 처리 기준을 나눠 봤습니다.",
      ],
      keywords: ["A/S 접수", "외부 접점", "상태 처리"],
      visibility: "비공개 실무 프로젝트",
    },
    detail: {
      overview:
        "현장 A/S 접수와 처리 상태를 여러 담당자가 이어서 확인하는 업무 시스템입니다.",
      scope: [
        "접수와 동의 단계 일부 화면",
        "서명과 알림 관련 처리 화면",
        "보관함처럼 외부 접점이 있는 기능 일부",
        "모바일·태블릿에서 확인하는 처리 단계",
      ],
      workPoints: [
        "외부 접점이 있는 화면에서는 성공, 실패, 중단, 재시도 같은 상태가 섞이기 쉬워 단계별 표시 기준을 나눠 봤습니다.",
        "내부 담당자와 외부 사용자가 보는 값이 달라질 수 있어 공개 화면에 필요한 정보만 드러나도록 살폈습니다.",
        "보안 처리 방식과 식별 방식은 외부 제출용 포트폴리오에서 자세히 설명하지 않습니다.",
      ],
      techUsage: [
        "WebSquare와 JSP 기반 화면에서 입력, 조회, 상태 표시가 많은 화면을 다뤘습니다.",
        "Spring MVC와 MyBatis 구조에서 화면 값이 어떤 조회 조건으로 내려오는지 확인했습니다.",
        "MariaDB 기반 운영 데이터의 상태값과 화면 표시 기준을 함께 봤습니다.",
      ],
      disclosure:
        "비공개 실무 프로젝트입니다. 내부 시스템명과 외부 접점의 세부 보안 처리는 노출하지 않습니다.",
      resources: [
        { label: "비식별화 다이어그램", href: "/projects/tsms-flow.svg", type: "diagram" },
      ],
    },
  },
  {
    id: "education-device",
    title: "교육청 단말 자산 현황 관리",
    shortTitle: "자산 현황",
    period: "2024.09 ~ 2026.07",
    category: "Asset Status",
    stack: ["JSP", "Spring MVC", "MyBatis", "SQL", "Chart.js", "Tabulator"],
    image: {
      src: "/projects/it-asset-flow.svg",
      alt: "교육청 단말 자산 현황의 비식별화된 조회와 집계 흐름 다이어그램",
    },
    card: {
      summary: "교육청 단말의 자산 현황과 처리 상태를 확인하는 시스템입니다.",
      description: [
        "단말 현황, 대시보드, A/S 관련 조회 화면에서 담당자가 필요한 기준으로 상태를 볼 수 있게 다뤘습니다.",
        "집계 결과와 화면 조건이 다르게 읽히지 않도록 조회 기준을 맞춰보는 일이 많았습니다.",
      ],
      keywords: ["자산 현황", "대시보드", "A/S 조회"],
      visibility: "비공개 실무 프로젝트",
    },
    detail: {
      overview:
        "교육청 단말 자산과 A/S 관련 현황을 확인하는 업무 시스템입니다.",
      scope: [
        "자산 현황 조회 화면",
        "교육청 단위의 현황 대시보드",
        "A/S 관련 조회 화면 일부",
        "집계 결과와 화면 조건 확인",
      ],
      workPoints: [
        "화면 필터와 집계 결과가 서로 다르게 읽히지 않도록 조건을 맞추는 데 신경 썼습니다.",
        "대시보드 숫자와 목록 데이터가 같은 기준으로 보이는지 확인했습니다.",
        "집계·배치 영역은 직접 구현 여부를 과하게 내세우지 않고, 화면 기준과 결과를 맞춰 확인한 경험으로 설명합니다.",
      ],
      techUsage: [
        "JSP와 Tabulator로 목록과 현황 조회 화면을 다뤘습니다.",
        "Chart.js는 현황 데이터를 빠르게 파악하는 대시보드 화면에 사용했습니다.",
        "MyBatis와 SQL은 필터와 실제 조회 조건이 같은 기준으로 움직이는지 확인하는 데 사용했습니다.",
      ],
      disclosure:
        "비공개 실무 프로젝트입니다. 교육청명과 실제 화면은 노출하지 않고, A/S 연동은 설명에서만 다룹니다.",
      resources: [
        { label: "비식별화 다이어그램", href: "/projects/it-asset-flow.svg", type: "diagram" },
      ],
    },
  },
  {
    id: "ssafast",
    title: "API 명세·테스트 협업 도구",
    shortTitle: "SSAFAST",
    period: "2023.04 ~ 2023.05",
    category: "Developer Tool",
    stack: ["Next.js", "React", "TypeScript", "React Hook Form", "TanStack Query"],
    image: {
      src: "/projects/ssafast.png",
      alt: "API 명세와 테스트 진행 현황을 보여주는 SSAFAST 화면",
    },
    card: {
      summary: "팀이 API 명세를 작성하고 테스트 과정을 함께 확인하는 도구입니다.",
      description: [
        "6명 팀 프로젝트에서 프론트엔드와 UI·UX를 맡았습니다.",
        "중첩 입력 폼, 인증이 필요한 화면, 테스트 결과를 확인하는 화면처럼 입력과 상태가 많은 구간을 다뤘습니다.",
      ],
      keywords: ["API 명세", "중첩 폼", "테스트 결과"],
      visibility: "공개 GitHub 프로젝트",
    },
    detail: {
      overview:
        "API 명세 작성, 요청 테스트, 결과 확인을 한곳에서 할 수 있게 만든 팀 프로젝트입니다.",
      scope: [
        "프론트엔드와 UI·UX 역할",
        "API 명세 입력 화면",
        "중첩 입력 폼",
        "인증이 필요한 화면",
        "테스트 결과 확인 화면",
      ],
      workPoints: [
        "요청값이 깊게 중첩되는 입력 화면에서 사용자가 어떤 값을 넣고 있는지 잃지 않게 하는 구조가 중요했습니다.",
        "팀원이 함께 쓰는 도구라 입력, 저장, 결과 확인 단계가 자연스럽게 이어지도록 화면 단계를 나눴습니다.",
        "수상 문구는 공개 가능 여부가 확인될 때만 별도로 사용할 수 있도록 남겨둡니다.",
      ],
      techUsage: [
        "Next.js와 React로 화면 단위 상태가 많은 협업 도구 UI를 만들었습니다.",
        "TypeScript는 명세 입력값과 화면 상태를 다룰 때 사용했습니다.",
        "React Hook Form은 중첩 폼 입력과 검증 상태를 다루는 데 사용했습니다.",
      ],
      disclosure:
        "공개 GitHub 프로젝트입니다. SSAFAST는 보조명으로 사용하고, 프로젝트명은 외부인이 이해하기 쉬운 이름을 앞세웁니다.",
      resources: [
        { label: "GitHub 저장소", href: "https://github.com/SSAFAST/ssafast", type: "github" },
        { label: "화면 이미지", href: "/projects/ssafast.png", type: "image" },
      ],
    },
  },
  {
    id: "quant-lab",
    title: "매매 전략 실행·모니터링 개인 프로젝트",
    shortTitle: "quant-lab",
    period: "2026.03 ~ 2026.07",
    category: "Personal Backend",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Docker", "WebSocket"],
    image: {
      src: "/projects/quant-core.png",
      alt: "매매 전략 실행과 모니터링 구조를 보여주는 공개용 대시보드 화면",
    },
    card: {
      summary: "매매 전략 실행 과정을 실험하기 위해 만든 개인 백엔드 프로젝트입니다.",
      description: [
        "투자 성과를 보여주기보다 인증, 실행 요청, 실시간 이벤트, 테스트 환경을 직접 구성해본 프로젝트입니다.",
        "민감한 전략과 실제 거래 정보는 제외하고 공개 가능한 구조만 분리했습니다.",
      ],
      keywords: ["FastAPI", "WebSocket", "테스트 환경"],
      visibility: "공개 GitHub 프로젝트",
    },
    detail: {
      overview:
        "전략 실행 요청, 이벤트 전달, 결과 확인 구조를 실험하기 위한 개인 프로젝트입니다.",
      scope: [
        "FastAPI 라우터 구성",
        "데모 인증 흐름",
        "WebSocket 이벤트 전달",
        "정적 대시보드",
        "pytest와 Docker 실행 구조",
      ],
      workPoints: [
        "실제 투자 성과가 아니라 요청, 검증, 실행 이벤트, 결과 표시가 어떻게 이어지는지 보여주는 데 초점을 뒀습니다.",
        "공개 저장소에서는 전략 로직, 수익률, 실거래 정보가 드러나지 않도록 범위를 분리했습니다.",
        "백엔드 구조와 테스트 가능한 실행 환경을 함께 보여줄 수 있도록 README를 정리했습니다.",
      ],
      techUsage: [
        "FastAPI는 요청 처리와 라우터 구조에 사용했습니다.",
        "WebSocket은 실행 이벤트를 대시보드에 전달하는 데 사용했습니다.",
        "Docker와 pytest는 실행과 검증 환경을 맞추는 데 사용했습니다.",
      ],
      disclosure:
        "공개용 저장소입니다. 투자 성과, 수익률, 실제 전략명, 실거래 정보는 포트폴리오에 쓰지 않습니다.",
      resources: [
        { label: "quant-lab 공개 저장소", href: "https://github.com/YongjaeKwon/quant-lab", type: "github" },
      ],
    },
  },
];

export const publicArchive = [
  {
    id: "modac",
    title: "MODAC",
    summary: "개발자의 학습 기록을 작성하고 공유하는 팀 프로젝트입니다.",
    tech: ["Vue", "Pinia", "Spring Boot"],
    role: "프론트엔드 개발, 일정 관리 일부",
    github: "https://github.com/YongjaeKwon/MODAC",
    reason: "실무 전 Vue 기반 화면 경험을 보여주는 보조 사례로 둡니다.",
    image: "/projects/modac.png",
  },
  {
    id: "ddoing",
    title: "ddoing",
    summary: "애니메이션 쉐도잉과 단어 드로잉을 활용한 영어 학습 프로젝트입니다.",
    tech: ["React", "TypeScript", "Spring Boot"],
    role: "PM 일부, 프론트엔드와 AI 기능 연결 일부",
    github: "https://github.com/GomGom-Team/ddoing",
    reason: "팀 프로젝트와 인터랙션 많은 화면 경험을 짧게 보여줍니다.",
    image: "/projects/ddoing.png",
  },
];

export const techGroups = [
  {
    title: "업무 화면",
    icon: "MonitorSmartphone",
    items: ["Vue", "WebSquare", "JSP"],
    description:
      "입력, 목록, 상세, 상태 표시가 많은 업무 화면을 다룰 때 사용했습니다.",
  },
  {
    title: "서버 처리",
    icon: "Server",
    items: ["Spring Boot", "Spring MVC"],
    description:
      "화면에서 필요한 값이 어떤 처리 과정을 거쳐 내려오는지 이해하고 맞추는 데 사용했습니다.",
  },
  {
    title: "조회 기준",
    icon: "Database",
    items: ["MyBatis", "SQL"],
    description:
      "필터, 상태, 기간 조건이 실제 조회 기준과 다르게 적용되지 않는지 확인할 때 사용했습니다.",
  },
  {
    title: "목록·현황",
    icon: "Layers",
    items: ["Tabulator", "Chart.js"],
    description:
      "담당자가 반복해서 보는 목록과 현황 데이터를 정리해 보여줄 때 사용했습니다.",
  },
  {
    title: "팀·개인 프로젝트",
    icon: "Code",
    items: ["React", "Next.js", "TypeScript"],
    description:
      "상태가 많은 입력 폼, 인증이 필요한 화면, 결과 화면을 만들 때 사용했습니다.",
  },
  {
    title: "개인 백엔드",
    icon: "Boxes",
    items: ["FastAPI", "PostgreSQL", "Redis", "Docker"],
    description:
      "인증, 실행 요청, 실시간 이벤트, 테스트 가능한 실행 환경을 구성하는 데 사용했습니다.",
  },
];

export const interviewNotes = [
  {
    projectId: "pps",
    riskLevel: "private",
    possibleQuestions: [
      "PPS에서 직접 담당한 화면 범위는 어디까지인가요?",
      "목록과 엑셀 기준이 달라질 때 어떻게 확인했나요?",
    ],
    answerPoints: [
      "교육 등록/대상자 관리, 공지·게시판·댓글, 설문, 파트너 관련 일부 화면 중심으로 설명",
      "계약 전체, CE 승인 전체, 본사 계정 전체, 압축 다운로드는 직접 담당 범위처럼 말하지 않기",
    ],
    doNotMention: ["고객사명", "실제 계정 정보", "내부 승인 전체 범위"],
    needsConfirmation: ["계약 관련 조회/현황을 어느 정도까지 공개할 수 있는지"],
  },
  {
    projectId: "field-as",
    riskLevel: "sensitive",
    possibleQuestions: ["외부 접점이 있는 기능에서 예외 처리는 어떻게 나눴나요?"],
    answerPoints: ["접수, 동의, 서명, 알림, 보관함의 단계와 상태 기준 중심으로 설명"],
    doNotMention: ["세부 보안 처리", "외부 접점 식별 방식", "내부 시스템명"],
    needsConfirmation: ["공개 가능한 화면 흐름 범위"],
  },
  {
    projectId: "education-device",
    riskLevel: "private",
    possibleQuestions: ["대시보드 숫자와 목록 기준은 어떻게 맞췄나요?"],
    answerPoints: ["화면 필터와 조회 조건, 집계 결과 확인 중심으로 설명"],
    doNotMention: ["교육청명", "실제 자산 데이터"],
    needsConfirmation: ["배치 직접 구현 여부를 어디까지 말할 수 있는지"],
  },
];

export const githubCleanupPlan = {
  keepPublic: ["portfolio", "quant-lab", "MODAC", "SSAFAST/ssafast", "ddoing"],
  improveReadme: ["quant-lab", "MODAC", "ddoing"],
  makePrivateCandidates: ["agent-bridge", "HoRyong"],
  deleteCandidates: ["git_practice", "word-relay", "오래된 실습성 repo"],
  pinned: ["portfolio", "quant-lab", "SSAFAST", "MODAC", "ddoing"],
};

export const experience = {
  title: "웹 개발자",
  company: "주식회사 티지나래",
  period: "2024.06 ~ 재직 중",
  description:
    "협력사 포탈, 현장 A/S, 교육청 자산관리처럼 운영 중인 업무 시스템에서 화면 수정과 기능 추가를 맡았습니다. 담당자가 보는 값과 실제 조회 기준이 달라지지 않도록 목록, 상세, 엑셀, 대시보드의 조건을 함께 확인했습니다.",
  bullets: [
    "Vue, WebSquare, JSP 기반 업무 화면 개발과 운영 중 수정",
    "Spring Boot, Spring MVC, MyBatis 구조에서 화면 응답과 조회 조건 확인",
    "공지, 설문, 댓글, 접수 상태, 자산 현황처럼 반복 확인되는 정보 정리",
  ],
};

export const education = [
  {
    title: "삼성 청년 SW 아카데미(SSAFY)",
    period: "2022.07 ~ 2023.06",
    description:
      "웹 개발 과정 수료. SSAFAST 팀 프로젝트에서 프론트엔드와 UI·UX 역할을 맡았습니다.",
    icon: "Award",
  },
  {
    title: "아주대학교 e-비즈니스학과",
    period: "2018.03 ~ 2020.08",
    description: "학사 졸업",
    icon: "GraduationCap",
  },
  {
    title: "SQLD(SQL 개발자)",
    period: "2024.09",
    description:
      "화면 필터, 조회 조건, SQL 기준을 함께 확인하는 업무에 활용하고 있습니다.",
    icon: "Database",
  },
];

export type FocusTrackId = "frontend";

export const focusTracks = [
  {
    id: "frontend" as const,
    label: "Web",
    role: profile.role,
    badge: "운영 시스템 · 업무 화면 · 조회 기준",
    headline: hero.headline,
    target: hero.supportText,
    resume: profile.resume,
    resumeLabel: "이력서 다운로드",
    workStyleTitle: "차분하게 기준을 맞추는 방식",
    workStyleNote:
      "화면을 만들기 전에 누가 어떤 기준으로 확인하고 처리하는지 먼저 보려고 합니다.",
    contactTitle: "같이 일할 때 기준을 흐리지 않는 개발자이고 싶습니다",
    contactDescription:
      "운영 중인 업무 시스템을 이해하고, 필요한 기능을 차분하게 붙이는 일을 해왔습니다. 포트폴리오와 이력서를 보고 궁금한 점이 있다면 편하게 연락 주세요.",
    projectIntro:
      "비공개 실무 프로젝트는 범위를 조심스럽게 비식별화했고, 공개 가능한 팀·개인 프로젝트는 GitHub 링크를 함께 남겼습니다.",
    fitTitle: "기술은 어디에 썼는지 중심으로 정리했습니다",
    fitDescription:
      "기술 이름을 많이 나열하기보다, 업무 화면과 조회 기준을 맞추는 과정에서 어떤 도구를 사용했는지 보여줍니다.",
    strengths: coreStrengths,
    fitItems: coreStrengths.map((item) => ({
      label: item.title,
      description: item.description,
      icon: "Workflow",
    })),
    projectOrder: featuredProjects.map((project) => project.shortTitle),
    projectAngles: Object.fromEntries(
      featuredProjects.map((project) => [project.shortTitle, project.card.summary])
    ),
  },
];

export const heroStats = [
  { label: "주요 경험", value: "운영 시스템", unit: "" },
  { label: "화면 환경", value: "Vue/WebSquare", unit: "" },
  { label: "확인 기준", value: "목록·엑셀·대시보드", unit: "" },
];

export const projects = featuredProjects;
