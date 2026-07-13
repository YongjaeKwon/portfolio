export const profile = {
  name: "권용재",
  role: "웹 개발자",
  headline:
    "업무 시스템의 흐름을 이해하고, 요구사항을 기능으로 구현하며\n기존 처리와 어긋나지 않게 개선해 왔습니다.",
  summary:
    "웹 서비스의 기능을 개발하고 운영해 왔습니다. 화면부터 서버와 데이터 처리까지 필요한 영역을 함께 맡았습니다.",
  target:
    "프로젝트에서는 직접 기여한 화면과 공개 가능한 범위만 담았습니다.",
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
    "화면, 서버, 데이터 영역을 함께 다루며\n웹 기능을 개발하고 운영해 왔습니다.",
  ctas: [
    { label: "프로젝트 보기", href: "#projects", type: "primary" },
    { label: "GitHub", href: profile.github, type: "github" },
    { label: "이력서", href: profile.resume, type: "resume" },
    { label: "Contact", href: "#contact", type: "contact" },
  ],
};

export const coreStrengths = [
  {
    label: "업무 흐름 이해",
    title: "사용자 역할과 처리 과정을 바탕으로 기능을 구체화합니다",
    description:
      "업무 흐름과 이용 상황을 파악해 필요한 화면과 기능을 정리합니다.",
  },
  {
    label: "기능 구현 범위",
    title: "화면부터 서버 로직까지 구현합니다",
    description:
      "프론트엔드 화면, API 연동, 데이터 처리까지 하나의 기능 흐름으로 개발합니다.",
  },
  {
    label: "운영을 고려한 개발",
    title: "변경 이후의 영향까지 함께 살핍니다",
    description:
      "기존 기능과 예외 상황을 확인하며 운영 환경에서 안정적으로 동작하도록 개선합니다.",
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
    meta: {
      workRange: string;
      environment: string;
    };
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
    title: "협력사 업무 포털",
    shortTitle: "협력사 포털",
    period: "2025.01 ~ 2026.07",
    category: "Partner Portal",
    stack: ["Vue", "Spring Boot", "MyBatis", "MariaDB", "Tabulator"],
    image: {
      src: "/projects/pps-flow.svg",
      alt: "협력사 업무 포탈의 비식별화된 화면과 데이터 처리 구조 다이어그램",
    },
    card: {
      summary: "교육, 계약, 공지, 설문, 게시판 등 협력사와 내부 담당자가 사용하는 주요 업무 기능을 제공하는 포털입니다.",
      description: [
        "교육·공지·설문 등 주요 업무 화면을 개발하고, 사용자 권한과 진행 상태에 따른 화면 처리를 적용했습니다.",
        "여러 게시판에 반복된 댓글 기능을 공통화하고, 조회 결과가 화면별로 다르게 표시되던 부분을 개선했습니다.",
      ],
      keywords: ["교육 관리", "공지·설문", "게시판"],
      visibility: "비공개 실무 프로젝트",
      meta: {
        workRange: "화면 개발 · API 연동 · 공통 기능",
        environment: "Vue · Spring Boot · MyBatis",
      },
    },
    detail: {
      overview:
        "협력사와 내부 담당자가 교육, 계약 현황, 공지, 설문, 게시판 업무를 처리하는 운영 포탈입니다.",
      scope: [
        "교육 등록, 대상자 관리, 엑셀 업로드, 메일 발송 화면",
        "제출 현황 조회와 엑셀 다운로드",
        "게시판·제안하기 댓글·대댓글 화면",
        "설문 문항 입력, 응답 확인, 상태별 버튼 처리",
      ],
      workPoints: [
        "교육 등록 이후 대상자 업로드, 메일 발송, 제출 현황 조회가 같은 교육과 대상자 기준으로 이어지도록 화면 상태와 API 요청값을 맞췄습니다. 목록과 엑셀 결과가 다를 때는 화면 필터와 MyBatis 조회 조건을 비교해 수정했습니다.",
        "게시판과 제안하기의 댓글·대댓글 처리를 공통 컴포넌트로 묶고, 설문은 문항 유형별 입력과 결과 화면을 구현했습니다.",
        "기존 시스템의 계정 생성 기능을 새 포탈로 옮긴 뒤 기존 사용자 유형에서 오류가 발생했습니다. 신규 계정과 기존 계정을 각각 재현해 공통 로직의 영향을 확인하고, 유형별 처리 로직을 분리한 뒤 두 유형을 함께 테스트했습니다.",
      ],
      techUsage: [
        "Vue와 Tabulator는 대상자 목록, 선택 상태, 업로드 결과를 한 화면에서 확인하는 데 사용했습니다.",
        "Spring Boot API는 교육과 대상자 기준을 요청값으로 전달하고 화면 응답을 매핑하는 데 사용했습니다.",
        "MyBatis SQL은 제출 현황과 엑셀 다운로드 조회 범위를 맞추는 데 사용했습니다.",
      ],
      disclosure:
        "비공개 실무 프로젝트라 고객사명과 실제 화면은 공개하지 않고, 직접 기여한 운영 화면을 중심으로만 설명합니다.",
      resources: [
        { label: "비식별화 다이어그램", href: "/projects/pps-flow.svg", type: "diagram" },
      ],
    },
  },
  {
    id: "field-as",
    title: "현장 A/S 운영 시스템",
    shortTitle: "A/S",
    period: "2024.06 ~ 2026.07",
    category: "Field Service",
    stack: ["WebSquare", "JSP", "Spring MVC", "MyBatis", "MariaDB"],
    image: {
      src: "/projects/tsms-flow.svg",
      alt: "현장 A/S 접수와 처리 단계의 비식별화된 다이어그램",
    },
    card: {
      summary: "현장 A/S 접수부터 처리 상태와 알림 결과를 관리하는 업무 시스템입니다.",
      description: [
        "접수 현황과 알림 발송 결과를 확인하는 화면을 개발하고 운영 중 필요한 기능을 개선했습니다.",
        "모바일 동의와 전자서명 기능을 개발 중이며, 접수 정보와 처리 상태가 일관되게 조회되도록 화면과 조회 로직을 수정했습니다.",
      ],
      keywords: ["A/S 접수", "동의·서명", "처리 상태"],
      visibility: "비공개 실무 프로젝트",
      meta: {
        workRange: "화면 개발 · 조회 로직 · 운영 개선",
        environment: "WebSquare · JSP · Spring MVC",
      },
    },
    detail: {
      overview:
        "현장 A/S 접수와 알림 발송 결과를 여러 담당자가 확인하는 업무이며, 모바일 동의와 전자서명 기능은 개발 중입니다.",
      scope: [
        "A/S 접수와 접수 상태 표시 화면",
        "접수 상태와 진행상태 표시 화면",
        "알림 발송 결과와 재처리 상태 확인",
        "모바일 동의와 전자서명 기능 개발 중",
      ],
      workPoints: [
        "완료된 범위에서는 접수 번호를 기준으로 접수 정보와 알림 상태가 조회되도록 화면 상태와 조회 조건을 맞췄습니다.",
        "연계 포탈의 조회 조건과 상태값을 확인해 화면 표시가 맞지 않는 부분을 보완했습니다.",
        "알림 발송 결과를 성공, 실패, 대기 등 상태별로 구분해 운영자가 후속 조치를 확인할 수 있게 했습니다.",
      ],
      techUsage: [
        "WebSquare와 JSP 화면에서 접수 입력, 상세 조회, 상태 표시 UI를 수정했습니다.",
        "Spring MVC Controller와 MyBatis SQL을 보며 화면에 필요한 값이 누락되거나 다른 범위로 조회되는 부분을 보완했습니다.",
        "MariaDB 상태값을 화면 문구와 버튼 노출 조건에 사용해 접수 정보와 알림 상태가 어긋나지 않게 했습니다.",
      ],
      disclosure:
        "비공개 실무 프로젝트라 내부 시스템명과 세부 처리 방식은 공개하지 않습니다.",
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
      alt: "교육청 단말 자산 현황의 비식별화된 조회와 집계 구조 다이어그램",
    },
    card: {
      summary: "교육청 단말 자산과 A/S 현황을 권한별로 조회할 수 있는 자산관리 화면을 제공합니다.",
      description: [
        "권한별 자산 현황과 대시보드 조회 화면을 개선하고, 집계와 상세 목록이 같은 범위를 보여주도록 조회 조건을 보완했습니다.",
        "자산 정보를 매일 동기화하는 배치와 실행 이력 화면을 개발하고, 실패 상태와 재처리 결과를 확인할 수 있게 했습니다.",
      ],
      keywords: ["자산 현황", "권한별 조회", "동기화 배치"],
      visibility: "비공개 실무 프로젝트",
      meta: {
        workRange: "현황 조회 · 대시보드 · 동기화",
        environment: "JSP · Spring MVC · MyBatis",
      },
    },
    detail: {
      overview:
        "교육청 단말 자산과 A/S 관련 현황을 확인하는 업무 시스템입니다. 연계 시스템의 자산 정보를 자산관리 시스템으로 매일 동기화하는 배치와 실행 이력, 실패 상태 및 재처리 결과 확인 화면을 개발했습니다.",
      scope: [
        "단말 자산 현황과 검색 조건",
        "교육청/학교/부서 권한별 조회 화면",
        "대시보드 집계와 상세 목록 이동 과정",
        "연계 시스템 자산 정보 일일 동기화 배치와 실행 이력·재처리 결과 확인",
      ],
      workPoints: [
        "권한 필터가 화면에는 적용됐지만 집계 SQL에는 빠진 문제를 재현하고, 대시보드 수치와 상세 목록이 같은 범위로 조회되도록 MyBatis 조건을 보완했습니다.",
        "대시보드 카드에서 상세 목록으로 이동할 때 필터가 유지되고 같은 범위의 결과가 보이도록 이동 방식을 조정했습니다.",
        "자산 상태, 일자, 수량 포맷을 화면마다 다르게 읽히지 않도록 표시 방식을 통일했습니다.",
        "@Scheduled 기반 동기화 배치, Service 처리 흐름, MyBatis 집계 SQL을 작성해 자산 정보가 매일 반영되도록 구현했습니다.",
        "배치 이력 테이블에 성공·실패 상태를 저장하고 재처리 결과를 화면에서 확인할 수 있게 한 뒤, 배포 후 실행 결과를 검증했습니다.",
      ],
      techUsage: [
        "JSP와 Tabulator로 자산 목록, 현황 표, 검색 조건 UI를 만들었습니다.",
        "Chart.js 대시보드는 집계 수치를 먼저 보여주고 상세 목록으로 자연스럽게 넘어가도록 조정했습니다.",
        "MyBatis SQL은 권한, 기관, 사업 차수, 자산 상태 조건이 집계와 목록에 누락되지 않도록 수정하는 데 사용했습니다.",
        "Spring MVC 구조 안에서 배치 Service와 이력 조회 화면이 같은 처리 결과를 보도록 연결했습니다.",
      ],
      disclosure:
        "비공개 실무 프로젝트라 교육청명과 실제 화면, 자산 데이터는 공개하지 않습니다.",
      resources: [
        { label: "비식별화 다이어그램", href: "/projects/it-asset-flow.svg", type: "diagram" },
      ],
    },
  },
  {
    id: "ssafast",
    title: "API 명세·테스트 협업 도구(SSAFAST)",
    shortTitle: "SSAFAST",
    period: "2023.04 ~ 2023.05",
    category: "Developer Tool",
    stack: ["Next.js", "React", "TypeScript", "React Hook Form", "TanStack Query"],
    image: {
      src: "/projects/ssafast.png",
      alt: "API 명세와 테스트 진행 현황을 보여주는 SSAFAST 화면",
    },
    card: {
      summary: "API 명세 작성과 테스트 과정을 한곳에서 확인하는 팀 프로젝트입니다.",
      description: [
        "프론트엔드와 UI·UX 역할로 중첩 입력 폼, 테스트 결과·부하 테스트 결과 화면을 만들었습니다.",
      ],
      keywords: ["API 명세", "중첩 폼", "테스트 결과"],
      visibility: "공개 GitHub 프로젝트",
      meta: {
        workRange: "프론트엔드 · UI·UX · 입력 화면",
        environment: "Next.js · React · TypeScript",
      },
    },
    detail: {
      overview:
        "API 명세 작성, 요청 테스트, 결과 확인을 한곳에서 할 수 있게 만든 팀 프로젝트입니다.",
      scope: [
        "프론트엔드와 UI·UX 역할",
        "API 명세 입력·편집 화면",
        "DTO·Request·Response 중첩 입력 폼",
        "테스트 결과 화면",
        "부하 테스트 결과 화면",
      ],
      workPoints: [
        "API 명세 입력·편집 화면을 만들었습니다.",
        "DTO, Request, Response처럼 중첩 구조가 있는 입력 폼을 만들었습니다.",
        "테스트 결과와 부하 테스트 결과 화면을 담았습니다.",
      ],
      techUsage: [
        "Next.js와 React로 여러 화면 상태가 필요한 협업 도구 UI를 만들었습니다.",
        "TypeScript는 명세 입력값과 화면 상태를 다룰 때 사용했습니다.",
        "React Hook Form은 중첩 폼 입력과 검증 상태를 다루는 데 사용했습니다.",
      ],
      disclosure:
        "SSAFY 교육 과정에서 6명이 만든 팀 프로젝트이고, 코드는 GitHub에서 볼 수 있습니다.",
      resources: [
        { label: "GitHub 저장소", href: "https://github.com/SSAFAST/ssafast", type: "github" },
        { label: "화면 이미지", href: "/projects/ssafast.png", type: "image" },
      ],
    },
  },
  {
    id: "quant-lab",
    title: "매매 전략 실행·모니터링 개인 프로젝트(quant-lab)",
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
        "실제 투자 정보는 제외하고, 인증과 실행 요청, 실시간 이벤트 전달, 테스트 환경을 중심으로 만들었습니다.",
      ],
      keywords: ["실행 요청", "이벤트 전달", "테스트 환경"],
      visibility: "공개 GitHub 프로젝트",
      meta: {
        workRange: "API · 인증 · 이벤트",
        environment: "FastAPI · PostgreSQL · Docker",
      },
    },
    detail: {
      overview:
        "전략 실행 요청, 이벤트 전달, 결과 확인 구조를 실험하기 위한 개인 프로젝트입니다.",
      scope: [
        "FastAPI 라우터 구성",
        "데모 인증 과정",
        "WebSocket 이벤트 전달",
        "정적 대시보드",
        "pytest와 Docker 실행 구조",
      ],
      workPoints: [
        "실제 투자 성과가 아니라 요청, 검증, 실행 이벤트, 결과 표시가 어떻게 이어지는지 보여주는 데 초점을 뒀습니다.",
        "공개 저장소에서는 전략 로직, 수익률, 실거래 정보가 드러나지 않도록 범위를 분리했습니다.",
        "백엔드 구조와 테스트 가능한 실행 환경을 README에 담았습니다.",
      ],
      techUsage: [
        "FastAPI는 요청 처리와 라우터 구조에 사용했습니다.",
        "WebSocket은 실행 이벤트를 대시보드에 전달하는 데 사용했습니다.",
        "Docker와 pytest는 실행과 검증 환경을 맞추는 데 사용했습니다.",
      ],
      disclosure:
        "공개용 개인 프로젝트라 실제 전략, 수익률, 거래 정보는 담지 않았습니다.",
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
    summary: "개발자의 학습 기록을 작성·공유하는 팀 프로젝트입니다.",
    tech: ["Vue", "Pinia", "Spring Boot"],
    role: "프론트엔드(Vue) — 스터디룸·게시글·마이페이지 화면",
    github: "https://github.com/YongjaeKwon/MODAC",
    reason: "Vue로 스터디룸, 게시글, 마이페이지 화면을 만들었습니다.",
  },
  {
    id: "ddoing",
    title: "ddoing",
    summary: "단어 드로잉으로 영어를 학습하는 팀 프로젝트입니다.",
    tech: ["React", "TypeScript", "Spring Boot"],
    role: "기획 겸임 · 프론트엔드(React/TypeScript) — 단어 드로잉 학습 화면",
    github: "https://github.com/GomGom-Team/ddoing",
    reason: "React와 TypeScript로 단어 드로잉 학습 화면 일부와 학습 진행 UI를 구현했습니다.",
  },
];

export const techGroups = [
  {
    title: "프론트엔드",
    items: [
      "JavaScript",
      "TypeScript",
      "Vue",
      "WebSquare",
      "JSP",
      "React",
      "Next.js",
      "Tabulator",
      "Chart.js",
    ],
  },
  {
    title: "백엔드",
    items: ["Java", "Spring MVC", "Spring Boot", "MyBatis", "FastAPI"],
  },
  {
    title: "데이터베이스",
    items: ["MariaDB", "MySQL", "Oracle"],
  },
  {
    title: "도구 및 배포",
    items: ["Git", "GitHub", "SVN", "Tomcat", "Jenkins", "Linux", "Docker"],
  },
];

export const experience = {
  title: "웹 개발자",
  company: "유한책임회사 티지나래",
  period: "2024.06 ~ 재직 중",
  description:
    "협력사 포탈, 현장 A/S, 교육청 자산관리 등 업무 시스템에서 요구사항을 기능으로 구현하고, 화면 결과와 조회 기준, 처리 결과가 일관되게 이어지도록 개선해 왔습니다.",
  bullets: [
    "요구사항을 화면 조건, 권한, 상태값, 조회 기준으로 구체화해 기능에 반영",
    "Vue, WebSquare, JSP 기반 업무 화면에서 입력·조회·상세 화면 개선 및 신규 기능 구현",
    "서버 응답과 화면 표시 값이 맞지 않는 부분을 추적해 데이터 매핑 수정",
    "목록·엑셀·집계 결과가 같은 기준으로 나오도록 조회 조건 비교·보완",
    "자산 정보 동기화 처리와 이력 화면을 구현하고 실패 상태 확인·재처리 흐름 반영",
    "배포 후 화면 동작과 로그를 확인해 반영 결과 검증",
    "빌드·배포 과정에서 콘솔 로그와 화면 반영 결과 확인 경험",
  ],
};

export const education = [
  {
    title: "삼성 청년 SW 아카데미(SSAFY)",
    period: "2022.07 ~ 2023.06",
    description:
      "웹 개발 과정 수료. SSAFAST 팀 프로젝트에서 프론트엔드와 UI·UX 역할을 담당했습니다.",
    icon: "Award",
  },
  {
    title: "아주대학교 e-비즈니스학과",
    period: "2018.03 ~ 2020.08",
    description: "학사 졸업",
    icon: "GraduationCap",
  },
  {
    title: "SQLD",
    period: "2024.09",
    description: "SQL 기본과 데이터 모델링 이해를 검증한 자격증입니다.",
    icon: "Database",
  },
];

export type FocusTrackId = "frontend";

export const focusTracks = [
  {
    id: "frontend" as const,
    label: "Web",
    role: profile.role,
    headline: hero.headline,
    target: hero.supportText,
    resume: profile.resume,
    resumeLabel: "이력서 다운로드",
    workStyleNote:
      "화면에 보이는 값이 저장, 조회, 엑셀, 집계로 이어질 때 같은 값을 쓰는지 먼저 따라갑니다.",
    contactTitle: "채용 관련 연락",
    contactDescription:
      "포트폴리오와 이력서를 확인하신 뒤 궁금한 점이 있으면 이메일로 연락 주세요.",
    projectIntro:
      "실무와 팀 프로젝트에서 맡은 역할과 구현 내용을 정리했습니다.",
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
  { label: "실무 환경", value: "포탈 · A/S · 자산관리", unit: "" },
  { label: "화면 기술", value: "Vue · WebSquare · JSP", unit: "" },
  { label: "연결 범위", value: "화면 · API · SQL · 배치", unit: "" },
];

export const projects = featuredProjects;
