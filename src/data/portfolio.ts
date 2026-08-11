export type FocusTrackId = "all" | "frontend" | "backend";
export type RoleFocusId = Exclude<FocusTrackId, "all">;

export const profile = {
  name: "권용재",
  role: "웹 개발자",
  summary:
    "업무 담당자와 요구사항을 정리하고, 화면부터 서버와 데이터 처리까지 필요한 범위를 직접 개발해 왔습니다. 신규 기능을 만든 뒤 배포하고 실제 사용 과정을 확인하는 일까지 맡고 있습니다.",
  email: "yongjae116@gmail.com",
  phone: "010-9470-1704",
  github: "https://github.com/YongjaeKwon",
  location: "경기도 용인시 수지구",
  resume: "/resume.pdf?v=20260810-1",
};

export const focusTracks = [
  {
    id: "all" as const,
    label: "전체",
    role: "Web Developer",
    headline: "필요한 기능을 만들고, 실제로 쓰이는 과정까지 확인합니다.",
    target:
      "업무 담당자와 요구사항을 정리한 뒤 화면, 서버, 데이터 처리, 배포까지 필요한 범위를 맡아 왔습니다.",
    resume: profile.resume,
    resumeLabel: "이력서 다운로드",
    projectIntro: "개인·팀 프로젝트에서 직접 구현한 화면과 기능 흐름을 정리했습니다.",
    projectOrder: ["pps", "tsms", "reachrich", "ssafast", "ddoing", "modac"],
  },
  {
    id: "frontend" as const,
    label: "Frontend",
    role: "Frontend Developer",
    headline: "사용자가 업무 흐름을 놓치지 않는 화면을 만듭니다.",
    target:
      "Vue·WebSquare 실무 화면과 React 개인·팀 프로젝트에서, 복잡한 입력과 상태 변화 속에서도 사용자가 다음 행동을 쉽게 이해하도록 화면을 고민하며 개발해 왔습니다.",
    resume: profile.resume,
    resumeLabel: "이력서 다운로드",
    projectIntro: "화면 구조, 입력 처리, 진행 상태와 오류 안내를 중심으로 기여 내용을 보여드립니다.",
    projectOrder: ["reachrich", "ssafast", "ddoing", "modac", "pps", "tsms"],
  },
  {
    id: "backend" as const,
    label: "Backend",
    role: "Backend Developer",
    headline: "업무 흐름에 맞는 서버 기능을 개발하고 운영합니다.",
    target:
      "Spring 기반 업무 시스템에서 서버 로직과 SQL, 외부 연계 기능을 개발하고 배포와 운영 과정까지 맡아 왔습니다.",
    resume: profile.resume,
    resumeLabel: "이력서 다운로드",
    projectIntro: "개인 프로젝트의 서버 처리, 데이터 검증과 운영 자동화 경험을 보여드립니다.",
    projectOrder: ["pps", "tsms", "reachrich"],
  },
];

export const hero = focusTracks[0];

export const coreStrengths = [
  {
    label: "요구사항 정리",
    title: "업무 담당자와 기능 범위를 구체화합니다",
    description: "회의에서 들은 요청을 화면 조건, 처리 순서, 예외 상황으로 나누어 개발 범위와 일정을 정합니다.",
  },
  {
    label: "기능 구현",
    title: "한 기능에 필요한 영역을 함께 봅니다",
    description: "화면만 따로 보지 않고 서버 로직, SQL, 외부 연계까지 실제 처리 흐름에 맞춰 개발합니다.",
  },
  {
    label: "운영 확인",
    title: "배포 이후에도 결과를 확인합니다",
    description: "운영 데이터와 사용자 피드백을 확인하고, 문제가 생기면 로그와 DB 상태를 따라가며 원인을 찾습니다.",
  },
];

export type ProjectVisibility = "비공개 실무 프로젝트" | "비공개 개인 프로젝트" | "공개 GitHub 프로젝트";

type ProjectCardCopy = {
  summary: string;
  description: string[];
  result: string;
  keywords: string[];
  workRange: string;
};

export type CaseStudyNarrative = {
  problem: string;
  decision: string;
  implementation: string[];
  outcome: [string, ...string[]];
};

type ProjectDetailCopy = {
  scope: string[];
  workPoints: string[];
  techUsage: string[];
  caseStudy?: CaseStudyNarrative;
};

export type ProjectPerspective = {
  card?: Partial<ProjectCardCopy>;
  detail?: Partial<ProjectDetailCopy>;
};

type ProjectImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
} & (
  | { previewSrc: string; previewWidth: number; previewHeight: number }
  | { previewSrc?: never; previewWidth?: never; previewHeight?: never }
);

export type FeaturedProject = {
  id: string;
  title: string;
  shortTitle: string;
  period: string;
  category: string;
  focuses: FocusTrackId[];
  stack: string[];
  image?: ProjectImage;
  card: ProjectCardCopy & {
    visibility: ProjectVisibility;
    environment: string;
  };
  detail: ProjectDetailCopy & {
    overview: string;
    results: string[];
    disclosure: string;
    resources: Array<{ label: string; href?: string; type: "case" | "github" | "diagram" | "image" }>;
  };
  perspectives?: Partial<Record<RoleFocusId, ProjectPerspective>>;
};

export const featuredProjects: FeaturedProject[] = [
  {
    id: "pps",
    title: "B2B 협력사 포털(PPS)",
    shortTitle: "협력사 포털",
    period: "2025.02 ~ 현재",
    category: "B2B Partner Portal",
    focuses: ["all", "frontend", "backend"],
    stack: ["Vue", "Java", "Spring Boot", "MyBatis", "MariaDB", "Jenkins"],
    card: {
      summary: "본사와 약 500개 협력사가 파트너 등록·계약부터 824명의 현장 엔지니어 교육·자격·증빙 업무까지 처리하는 B2B 운영 포털입니다.",
      description: [
        "파트너·현장 엔지니어 관리, 교육과 증빙 업무에 필요한 화면·API·SQL을 개발하고 배포와 운영을 담당하고 있습니다.",
        "대량 파일 다운로드, 본사 계정 발급, 알림 정책과 배포 절차처럼 반복 업무와 운영 중 불편을 개선했습니다.",
      ],
      result: "오래 걸리는 압축 요청을 작업 단위로 분리해 진행 상태를 확인하고, 새로고침 후에도 이어서 내려받을 수 있게 했습니다.",
      keywords: ["대량 파일 비동기 처리", "본사 계정·사내 시스템 연계", "배포 절차 구성"],
      visibility: "비공개 실무 프로젝트",
      workRange: "초기 구축 참여 · 기능 개발 · 검수 · 배포 · 운영",
      environment: "Vue · Spring Boot · MyBatis · Jenkins",
    },
    detail: {
      overview:
        "본사와 협력사가 파트너 등록·계약, 현장 엔지니어(CE)의 교육·자격·증빙·평가를 처리하는 B2B 운영 포털입니다. 업무 화면과 API·SQL 개발, 외부 시스템 연동, 사용자 검수, 배포와 운영을 담당하고 있습니다.",
      scope: [
        "교육 대상자·증빙과 계정 관리 기능 개발",
        "300~400건 규모 첨부파일 압축 다운로드 방식 개선",
        "본사 계정 발급과 사내 업무 시스템 연계",
        "빌드·전송·배포 절차 구성 및 운영",
      ],
      workPoints: [
        "동기식 압축 다운로드는 300~400건을 한 번에 요청하면 오래 걸렸고, 진행 중인지 실패했는지 알기 어려웠습니다. 작업 ID를 먼저 발급하고 별도 실행기에서 압축한 뒤 2초 간격으로 상태를 조회하도록 바꿨습니다. 새로고침 후에도 작업을 다시 찾고, 완료 파일은 내려받으며 만료 파일은 정리하도록 구성했습니다.",
        "본사 계정 등록 화면을 만들고 부서·직급 확인, 아이디 중복 검사와 초기 비밀번호·일회용 비밀번호(OTP) 정보 생성을 서버 처리로 연결했습니다. 사용자와 사원 정보는 함께 저장한 뒤 사내 업무 시스템으로 전달했습니다.",
        "개발 소스 가져오기, 빌드, 서버 전송, 기존 파일 백업과 두 서버의 순차 배포를 Jenkins 작업과 스크립트로 정리했습니다.",
      ],
      caseStudy: {
        problem: "첨부파일 300~400건을 한 번에 압축하면 요청이 오래 대기했고, 사용자는 진행 중인지 실패했는지 알기 어려웠습니다.",
        decision: "화면 요청과 압축 실행을 분리하고, 작업 ID를 기준으로 서버 상태와 사용자 화면을 연결하기로 했습니다.",
        implementation: [
          "전용 실행기에서 압축을 처리하고 대기·진행·완료·실패 상태를 저장했습니다.",
          "Vue 화면에서 2초 간격으로 상태를 조회하고 새로고침 뒤에도 기존 작업을 다시 찾아 이어서 보여주었습니다.",
          "완료 파일은 스트리밍으로 내려받고 만료된 결과 파일은 자동으로 정리했습니다.",
        ],
        outcome: [
          "첨부파일 300~400건 규모의 대량 다운로드를 비동기 작업으로 운영하고 있습니다.",
          "사용자가 진행 상태와 실패 여부를 확인하고 완료 파일을 이어서 내려받을 수 있게 됐습니다.",
        ],
      },
      results: [
        "대량 다운로드 중 진행 상태와 실패 여부를 화면에서 확인할 수 있게 했습니다.",
        "계정 발급과 사내 시스템 전송 기능을 실제 운영 업무에 사용하고 있습니다.",
        "반복하던 빌드·전송·배포 과정을 Jenkins 작업으로 실행하고 있습니다.",
      ],
      techUsage: [
        "Vue와 Tabulator로 관리 화면과 작업 진행 상태를 구성했습니다.",
        "Spring Boot와 MyBatis로 비동기 작업 상태, 계정 발급, 유효성 검사와 외부 전송 로직을 구현했습니다.",
        "Jenkins, Gradle, Linux 스크립트로 개발·운영 배포 순서를 정리했습니다.",
      ],
      disclosure: "사내 프로젝트로 회사와 고객사 정보, 실제 화면과 저장 데이터는 공개하지 않습니다.",
      resources: [],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "협력사 업무 화면과 대량 다운로드처럼 처리 시간이 긴 기능의 상태 UI를 개발했습니다.",
          description: [
            "Vue로 교육·대상자·설문·계정 관리 화면을 만들고 권한과 처리 상태에 맞춰 버튼과 입력 조건을 나눴습니다.",
            "압축 작업의 대기·진행·완료·실패 상태를 보여주고 새로고침 뒤에도 작업을 이어서 확인할 수 있게 했습니다.",
          ],
          keywords: ["Vue 관리 화면", "입력·상태 처리", "대량 작업 진행 안내"],
          workRange: "업무 화면 · 상태 처리 · API 연동",
        },
        detail: {
          scope: ["교육·대상자·계정 관리 화면", "권한과 진행 상태에 따른 입력·버튼 처리", "대량 다운로드 진행 상태와 오류 안내"],
          workPoints: [
            "교육 등록, 대상자 업로드와 제출 현황이 같은 기준으로 조회되도록 화면과 서버의 조회 조건을 맞췄습니다.",
            "압축 다운로드를 요청하면 진행 상태를 주기적으로 확인하고, 새로고침 뒤에도 기존 작업을 찾아 진행 상황을 이어서 보여주도록 구성했습니다.",
            "계정 등록 화면에서 부서와 직급, 아이디 중복 결과를 바로 확인하고 저장 가능 여부가 분명하게 보이도록 입력 흐름을 정리했습니다.",
          ],
          caseStudy: {
            problem: "대량 압축 중에는 화면이 오래 대기해 사용자가 진행, 완료, 실패 여부를 구분하기 어려웠습니다.",
            decision: "오래 걸리는 요청을 대기·진행·완료·실패의 명시적인 화면 상태로 관리하기로 했습니다.",
            implementation: [
              "Vue 화면에 작업 요청과 2초 간격 상태 조회를 연결했습니다.",
              "새로고침 뒤에도 작업 ID로 기존 작업을 찾아 진행 상황을 이어서 보여주었습니다.",
              "완료, 실패와 만료 상태에 맞춰 다운로드와 오류 안내를 분리했습니다.",
            ],
            outcome: [
              "첨부파일 300~400건 규모 작업의 진행과 실패 여부를 화면에서 확인할 수 있게 됐습니다.",
              "완료된 파일은 새로고침 이후에도 이어서 내려받을 수 있습니다.",
            ],
          },
        },
      },
      backend: {
        card: {
          summary: "대량 파일 압축 작업, 계정 발급과 사내 시스템 연계, Jenkins 배포 과정을 구현했습니다.",
          description: [
            "대량 파일 요청을 별도 작업으로 분리하고 진행 상태 확인, 만료 파일 정리와 다운로드까지 서버에서 처리했습니다.",
            "계정 정보 확인과 저장, 사내 시스템 전송을 연결하고 빌드부터 순차 배포까지 Jenkins 작업으로 구성했습니다.",
          ],
          keywords: ["대량 작업 분리", "데이터 일괄 저장", "Jenkins"],
          workRange: "서버 · DB · 외부 연계 · 배포",
        },
        detail: {
          scope: ["대량 파일 압축 작업 분리와 상태 관리", "계정 검증·저장과 사내 시스템 전송", "Jenkins 배포 작업 구성"],
          workPoints: [
            "압축이 끝날 때까지 한 요청이 계속 대기하던 방식을 별도 작업으로 분리했습니다. 진행 상태를 저장하고 완료된 파일은 내려받을 수 있게 했으며, 오래된 결과 파일은 자동으로 정리했습니다.",
            "부서·직급·아이디를 확인한 뒤 초기 비밀번호와 일회용 비밀번호 정보를 만들고 사용자·사원 정보를 함께 저장했습니다. 저장 결과는 사내 업무 시스템으로 전송했습니다.",
            "개발 소스 가져오기, Gradle 빌드, 서버 전송, 기존 파일 백업과 두 서버의 순차 배포를 Jenkins에서 수동 실행할 수 있게 구성했습니다.",
          ],
          caseStudy: {
            problem: "압축 완료까지 HTTP 요청이 계속 대기했고 작업 상태, 결과 파일 수명과 실패를 관리하기 어려웠습니다.",
            decision: "요청 처리와 압축 실행을 분리하고 작업 ID를 중심으로 상태를 관리하기로 했습니다.",
            implementation: [
              "전용 실행기에서 압축을 처리하고 작업 상태를 저장했습니다.",
              "완료 파일을 스트리밍으로 내려받도록 하고 오래된 결과 파일은 자동으로 정리했습니다.",
              "Spring Boot와 MyBatis로 작업 상태 조회와 다운로드 흐름을 구현했습니다.",
            ],
            outcome: [
              "첨부파일 300~400건 규모의 대량 다운로드를 비동기 작업으로 운영하고 있습니다.",
              "진행, 완료, 실패 상태를 화면에 전달할 수 있는 서버 흐름을 만들었습니다.",
            ],
          },
        },
      },
    },
  },
  {
    id: "tsms",
    title: "교육용 단말 운영 시스템(TSMS)",
    shortTitle: "TSMS",
    period: "2025.09 ~ 현재",
    category: "Device Lifecycle System",
    focuses: ["all", "frontend", "backend"],
    stack: ["WebSquare", "Java", "Spring MVC", "MyBatis", "MariaDB", "JSP"],
    card: {
      summary: "서울시교육청 디벗 사업에서 약 11만 대 교육용 단말의 등록부터 배송·설치, A/S와 점검까지 연결하는 운영 시스템입니다.",
      description: [
        "운영 담당자와 요구사항을 조율하고 화면·서버 기능 개발, 사용자 검수와 배포를 담당하고 있습니다.",
        "기존 단말·출고·설치·A/S 데이터를 바탕으로 외부 연계, 중고거래 모니터링, QR 발급과 현장 점검 기능을 확장했습니다.",
      ],
      result: "반복해서 확인하던 운영 업무와 종이 점검 절차를 시스템의 화면·서버·DB 흐름으로 옮겨 실제 사업에 적용했습니다.",
      keywords: ["운영 업무 전산화", "점검 이력 관리", "외부 연계 개선"],
      visibility: "비공개 실무 프로젝트",
      workRange: "유지보수 · 사업별 신규 개발 · 검수 · 배포",
      environment: "WebSquare · Spring MVC · MyBatis",
    },
    detail: {
      overview:
        "서울시교육청 디벗 사업의 교육용 단말 등록, 배송·설치, A/S, 점검과 사후관리 업무를 지원하는 운영 시스템입니다. 기존 업무를 유지보수하면서 사업 진행에 필요한 신규 화면과 서버 기능을 개발하고 있습니다.",
      scope: [
        "중고거래 게시글 모니터링 기능 개발",
        "프리미엄 케어 점검 업무 전산화",
        "단말 QR 발급·출력과 학교 담당자 안내 메시지 연계",
        "카카오 주소 검색과 교육행정정보시스템 연동 방식 통합",
      ],
      workPoints: [
        "중고거래 플랫폼별 키워드·지역 검색 링크를 만들고, 검수자가 붙여넣은 게시글 주소에서 사이트와 게시글 번호를 찾아 중복을 확인했습니다. 외부 사이트에 직접 접속하지 않으면서도 주소 형식이 바뀌면 관리 화면에서 판별 규칙을 수정할 수 있게 했습니다.",
        "종이로 관리하던 점검 업무를 일정·대상·체크리스트·서명·재점검 이력과 결과 파일 다운로드까지 한 흐름으로 옮겼습니다.",
        "단말 QR 발급과 전용 프린터 출력을 운영 흐름에 연결하고, 학생 명단 등록·설치 희망일·계정 방식·설치 확정 안내를 메시지로 발송할 수 있게 했습니다.",
        "화면마다 따로 구현돼 있던 카카오 주소 검색과 교육행정정보시스템(NEIS) 연동을 공통 서버 기능으로 모으고, 연결 정보와 설정을 서버에서 관리하도록 바꿨습니다.",
      ],
      caseStudy: {
        problem: "외부 API 키가 브라우저 코드에 포함돼 있었고, 연결 정보가 바뀌면 관련 화면을 각각 수정해야 했습니다.",
        decision: "외부 호출 책임을 화면에서 서버로 옮기고 키와 연결 정보를 서버 설정에서 관리하기로 했습니다.",
        implementation: [
          "외부 API 요청을 대신 처리하는 공통 Controller와 Service를 추가했습니다.",
          "키와 연동 URL은 서버 설정으로 분리하고 화면에는 필요한 응답만 전달했습니다.",
          "기존 25개 화면의 요청 경로와 오류 처리를 공통 형식에 맞췄습니다.",
        ],
        outcome: [
          "브라우저에서 확인할 수 있던 API 키를 서버로 회수했습니다.",
          "외부 연동 정보의 변경 지점을 화면별 코드가 아닌 공통 서버 경로로 모았습니다.",
        ],
      },
      results: [
        "외부 API를 직접 호출하던 25개 화면의 브라우저 키 노출을 제거하고 호출 경로를 서버로 모았습니다.",
        "대량 등록 전에 생산입고 정보와 기등록 상태를 검증하고 QR에 내부 식별자가 직접 노출되지 않게 했습니다.",
        "학교·단말별 점검과 재점검 이력을 시스템에서 관리하도록 전산화했습니다.",
      ],
      techUsage: [
        "WebSquare와 JSP로 등록·조회·점검·모니터링 화면을 구현했습니다.",
        "Spring MVC와 MyBatis로 게시글 주소 분석, 중복 검사, 이력 저장과 외부 시스템 연계 기능을 개발했습니다.",
        "MariaDB 조회와 운영 데이터를 확인하며 배포 결과와 실제 사용 상태를 검증했습니다.",
      ],
      disclosure: "사내 프로젝트로 회사와 고객사 정보, 실제 화면과 저장 데이터는 공개하지 않습니다.",
      resources: [],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "여러 운영팀이 사용하는 등록·점검·모니터링 화면을 WebSquare로 개발했습니다.",
          description: [
            "복잡한 업무를 일정, 대상, 진행 상태와 재점검 이력으로 나누고 담당자가 다음 작업을 알 수 있게 화면을 구성했습니다.",
            "중고거래 게시글 저장 시 반복 입력을 줄이고, QR 발급과 안내 메시지 발송 결과를 운영 화면에서 확인할 수 있게 했습니다.",
          ],
          keywords: ["WebSquare", "업무 화면", "상태별 UI"],
          workRange: "화면 설계 · 입력 검증 · API 연동",
        },
        detail: {
          scope: ["점검 일정·대상·재점검 화면", "중고거래 게시글 확인·저장 화면", "QR 발급·안내 메시지 운영 화면"],
          workPoints: [
            "점검을 한 번에 끝내지 못하는 현장 상황을 반영해 분실·미지참 대상은 2차, 3차 일정으로 이어서 관리할 수 있게 화면 흐름을 구성했습니다.",
            "검수자가 URL을 붙여넣으면 추출 가능한 정보를 먼저 채우고, 추가 정보만 입력해 저장할 수 있게 만들어 반복 입력을 줄였습니다.",
            "QR 발급 여부와 안내 메시지 발송 결과를 목록과 상세 화면에서 확인할 수 있게 상태 표시와 조회 조건을 맞췄습니다.",
          ],
          caseStudy: {
            problem: "종이 중심 점검 업무는 일정, 미완료 대상과 재점검 이력이 분리돼 담당자가 다음 작업을 파악하기 어려웠습니다.",
            decision: "현장 절차를 일정, 대상, 회차와 결과 상태로 나누고 다음 행동이 보이는 화면 흐름으로 구성했습니다.",
            implementation: [
              "WebSquare로 일정, 대상과 점검 결과 화면을 구현했습니다.",
              "분실·미지참 대상이 2차와 3차 재점검으로 이어지도록 회차별 상태를 연결했습니다.",
              "일정 확정, 미완료 대상, 재점검 결과와 결과 파일을 같은 흐름에서 확인하도록 상태 표시를 맞췄습니다.",
            ],
            outcome: [
              "2026년 7월 기준 119개 학교 중 56개 학교의 일정이 확정됐습니다.",
              "21개 학교에서 약 3,800대의 점검을 완료했습니다.",
            ],
          },
        },
      },
      backend: {
        card: {
          summary: "게시글 주소 분석, 점검 이력 저장, QR·안내 메시지와 외부 시스템 연계 기능을 개발했습니다.",
          description: [
            "외부 사이트에 접속하지 않고 게시글 주소만 분석해 사이트와 게시글 번호를 찾고 중복을 확인하는 구조를 만들었습니다.",
            "점검 데이터와 결과 파일, QR 발급, 안내 메시지 발송을 기존 자산·설치 데이터 흐름에 연결했습니다.",
          ],
          keywords: ["게시글 주소 분석", "점검 이력 관리", "외부 연동 공통화"],
          workRange: "서버 · SQL · 데이터 검증 · 외부 연계",
        },
        detail: {
          scope: ["게시글 주소 분석과 중복 확인", "점검과 재점검 이력 저장", "QR·안내 메시지·외부 시스템 연계"],
          workPoints: [
            "게시글 주소 뒤에 붙은 불필요한 값을 제거하고 사이트별 주소 규칙으로 게시글 번호를 찾았습니다. 번호를 찾을 수 없는 경우에는 전체 주소를 기준으로 중복을 확인했습니다.",
            "기존 자산·설치 정보를 기준으로 점검 대상과 회차별 결과를 저장하고, 서명과 PDF·Excel·압축 파일이 같은 점검 이력에 연결되도록 구현했습니다.",
            "화면별로 따로 처리하던 카카오 주소 검색과 교육행정정보시스템 연동을 공통 서버 경로로 옮겨 25개 화면이 같은 방식을 사용하도록 수정했습니다.",
          ],
          caseStudy: {
            problem: "카카오 주소 검색과 교육행정정보시스템 연동이 화면마다 따로 구현돼 연결 정보와 설정 변경을 반복해서 반영해야 했습니다.",
            decision: "반복되는 외부 연계와 설정을 공통 서버 경로로 모아 화면이 같은 처리 방식을 사용하도록 했습니다.",
            implementation: [
              "카카오 주소 검색과 NEIS 연계를 공통 서버 기능으로 옮겼습니다.",
              "외부 시스템의 연결 정보와 설정을 서버에서 관리하도록 정리했습니다.",
              "기존 화면이 공통 응답을 사용하도록 조회와 저장 흐름을 맞췄습니다.",
            ],
            outcome: [
              "공통 연계 경로를 25개 화면에서 사용합니다.",
            ],
          },
        },
      },
    },
  },
  {
    id: "ssafast",
    title: "API 명세·테스트 협업 도구(SSAFAST)",
    shortTitle: "SSAFAST",
    period: "2023.04 ~ 2023.05",
    category: "Frontend Team Project",
    focuses: ["all", "frontend"],
    stack: ["Next.js", "React", "TypeScript", "React Hook Form", "TanStack Query", "Redux Toolkit"],
    image: {
      src: "/projects/ssafast.png",
      width: 1200,
      height: 675,
      previewSrc: "/projects/ssafast-preview.webp",
      previewWidth: 960,
      previewHeight: 540,
      alt: "SSAFAST API 명세 입력과 테스트 결과 화면",
    },
    card: {
      summary: "API 명세 작성부터 요청 테스트와 성능 결과 확인까지 한 화면 흐름으로 만든 팀 프로젝트입니다.",
      description: [
        "6인 팀에서 프론트엔드와 UI·UX를 맡아 동적 명세 입력 폼, API 실행과 성능 테스트 결과 화면을 개발했습니다.",
        "요청에 필요한 헤더, 경로·검색 조건과 중첩된 본문 항목을 자유롭게 추가·삭제하고 실제 요청 형태로 조합할 수 있게 했습니다.",
      ],
      result: "요청의 성공 여부와 응답 내용, 처리 시간 분포와 초당 처리량을 화면에서 비교할 수 있게 구현했습니다.",
      keywords: ["반복·중첩 입력", "API 요청 테스트", "성능 결과 화면"],
      visibility: "공개 GitHub 프로젝트",
      workRange: "프론트엔드 · UI·UX",
      environment: "Next.js · React · TypeScript",
    },
    detail: {
      overview: "API 명세를 작성하고 실제 요청과 성능 테스트 결과까지 확인할 수 있게 만든 SSAFY 6인 팀 프로젝트입니다.",
      scope: ["프론트엔드와 UI·UX", "API 명세 동적 입력 폼", "요청 실행과 성능 테스트 결과 화면"],
      workPoints: [
        "React Hook Form을 사용해 요청에 필요한 항목과 중첩된 데이터 구조를 자유롭게 추가·삭제하도록 만들었습니다.",
        "입력한 주소, 요청 방식, 조건과 본문을 실제 요청 형식으로 조합하고 잘못 입력한 위치에서 바로 안내했습니다.",
        "API 요청의 성공 여부와 응답 내용을 보여주고, 성능 테스트 결과는 처리 시간 분포와 초당 처리량으로 나누어 표시했습니다.",
      ],
      results: ["복잡한 API 명세를 한 화면에서 작성하고 테스트 결과까지 이어서 확인할 수 있게 했습니다."],
      techUsage: [
        "Next.js와 React로 명세 작성과 결과 화면을 구현했습니다.",
        "React Hook Form으로 반복·중첩 입력과 검증 상태를 관리했습니다.",
        "TanStack Query는 서버 데이터, Redux Toolkit은 화면 전역 상태를 나누어 관리하는 데 사용했습니다.",
      ],
      disclosure: "SSAFY 교육 과정에서 진행한 팀 프로젝트이며 코드는 GitHub에 공개돼 있습니다.",
      resources: [
        { label: "GitHub 저장소", href: "https://github.com/SSAFAST/ssafast", type: "github" },
        { label: "화면 이미지", href: "/projects/ssafast.png", type: "image" },
      ],
    },
  },
  {
    id: "ddoing",
    title: "그림으로 학습하는 영어 단어 서비스(ddoing)",
    shortTitle: "ddoing",
    period: "2023.02 ~ 2023.04",
    category: "Frontend Team Project",
    focuses: ["all", "frontend"],
    stack: ["React", "TypeScript", "Redux Toolkit", "Vite", "Canvas API"],
    image: {
      src: "/projects/ddoing.png",
      width: 800,
      height: 459,
      previewSrc: "/projects/ddoing-preview.webp",
      previewWidth: 800,
      previewHeight: 459,
      alt: "ddoing 영어 단어 드로잉 학습 화면",
    },
    card: {
      summary: "제시된 영어 단어를 그림으로 그리고 AI 판정 결과로 학습을 이어가는 팀 프로젝트입니다.",
      description: [
        "프론트엔드를 맡아 메인 화면과 그림 입력 학습 화면, 점수와 경험치 반영 과정을 개발했습니다.",
        "사용자가 그린 그림을 이미지로 변환해 AI 판정 서버로 보내고, 결과에 따라 다음 문제와 학습 상태가 이어지도록 구성했습니다.",
      ],
      result: "타이머가 중복 실행돼 시간이 빨라지는 문제와 이전 단어 목록이 남는 문제를 찾아 수정했습니다.",
      keywords: ["React", "그림 입력", "상태·타이머"],
      visibility: "공개 GitHub 프로젝트",
      workRange: "프론트엔드 · 기획 참여",
      environment: "React · TypeScript · Redux Toolkit",
    },
    detail: {
      overview: "영어 단어를 그림으로 표현하고 AI 판정 결과에 따라 점수와 경험치를 얻는 학습 서비스입니다.",
      scope: ["메인·그림 학습 화면", "그림 입력과 AI 판정 서버 연동", "학습 상태·점수·타이머 처리"],
      workPoints: [
        "화면에 그린 그림을 이미지로 변환해 AI 판정 서버에 보내고 정답 판정 결과에 따라 점수와 경험치를 반영했습니다.",
        "화면에 들어올 때 타이머가 중복으로 실행되던 문제를 정리하고, 화면을 벗어날 때 타이머도 함께 종료되도록 수정했습니다.",
        "다음 문제로 넘어갈 때 이전 단어 목록이 남는 상태 갱신 시점을 수정했습니다.",
      ],
      results: ["드로잉 입력부터 판정, 점수 반영과 다음 문제 전환까지 한 화면에서 이어지도록 구현했습니다."],
      techUsage: [
        "React와 TypeScript로 학습 화면과 상태 전환을 구현했습니다.",
        "Canvas API로 드로잉 입력과 이미지 변환을 처리했습니다.",
        "Redux Toolkit으로 사용자 점수와 학습 상태를 관리했습니다.",
      ],
      disclosure: "SSAFY 교육 과정의 팀 프로젝트이며, 이미지 전처리는 팀장과 함께 했고 모델 학습은 팀장이 담당했습니다.",
      resources: [
        { label: "GitHub 저장소", href: "https://github.com/GomGom-Team/ddoing", type: "github" },
        { label: "화면 이미지", href: "/projects/ddoing.png", type: "image" },
      ],
    },
  },
  {
    id: "modac",
    title: "개발자 학습 기록 서비스(MODAC)",
    shortTitle: "MODAC",
    period: "2023.01 ~ 2023.02",
    category: "Frontend Team Project",
    focuses: ["all", "frontend"],
    stack: ["Vue", "Pinia", "SockJS", "STOMP"],
    image: {
      src: "/projects/modac.png",
      width: 600,
      height: 338,
      previewSrc: "/projects/modac-preview.webp",
      previewWidth: 600,
      previewHeight: 338,
      alt: "MODAC 학습 기록과 스터디 화면",
    },
    card: {
      summary: "개발자가 학습 기록을 남기고 스터디 활동을 함께 관리하는 팀 프로젝트입니다.",
      description: [
        "프론트엔드를 맡아 스터디룸과 게시글, 마이페이지 관련 화면을 개발했습니다.",
        "스터디룸 입장·퇴장과 초대 코드 검증, 학습 통계·알림·즐겨찾기 화면을 구현했습니다.",
      ],
      result: "스터디룸에서 바로 대화할 수 있도록 실시간 채팅을 연동했습니다.",
      keywords: ["Vue3", "상태 관리", "실시간 채팅"],
      visibility: "공개 GitHub 프로젝트",
      workRange: "프론트엔드",
      environment: "Vue3 · Pinia · SockJS/STOMP",
    },
    detail: {
      overview: "개발자가 학습 기록을 작성하고 스터디 활동을 함께 관리할 수 있도록 만든 SSAFY 팀 프로젝트입니다.",
      scope: ["스터디룸·게시글·마이페이지 화면", "학습 통계·알림·즐겨찾기", "실시간 채팅 UI 연동"],
      workPoints: [
        "Vue3와 Pinia로 스터디룸 입장·퇴장, 초대 코드 검증과 화면 상태를 관리했습니다.",
        "학습 기록과 통계, 알림, 즐겨찾기 관련 화면을 구현했습니다.",
        "실시간 연결 상태와 새로 받은 메시지를 스터디룸 채팅 화면에 반영했습니다.",
      ],
      results: ["스터디 참여부터 학습 기록과 실시간 대화까지 한 서비스 안에서 이어지도록 화면을 구성했습니다."],
      techUsage: [
        "Vue3로 스터디룸, 게시글과 마이페이지 화면을 구현했습니다.",
        "Pinia로 사용자와 스터디 관련 상태를 관리했습니다.",
        "팀에서 구성한 SockJS·STOMP 연결 결과를 스터디룸 채팅 UI에 반영했습니다.",
      ],
      disclosure: "SSAFY 교육 과정에서 6명이 진행한 팀 프로젝트이며 코드는 GitHub에 공개돼 있습니다.",
      resources: [
        { label: "GitHub 저장소", href: "https://github.com/YongjaeKwon/MODAC", type: "github" },
        { label: "화면 이미지", href: "/projects/modac.png", type: "image" },
      ],
    },
  },
  {
    id: "reachrich",
    title: "개인 투자 연구·운영 플랫폼(ReachRich)",
    shortTitle: "ReachRich",
    period: "2026.03 ~ 현재",
    category: "Personal Full Stack",
    focuses: ["all", "frontend", "backend"],
    stack: ["Python", "FastAPI", "React", "TypeScript", "SQLAlchemy", "SQLite", "Parquet", "GitHub Actions", "pytest", "Vitest"],
    card: {
      summary: "기존 투자 연구 코어에서 검증 로직을 선별 이식하고, 계좌 추적·시장 데이터 수집·모의운용·대시보드를 새 구조로 재설계하고 있습니다.",
      description: [
        "2026년 8월 새 저장소를 만들고 데이터·종목 선정·전략·검증·운용·콘솔의 여섯 영역으로 책임을 나눴습니다.",
        "토스증권 계좌 조회와 KRX 수집, FastAPI 조회 API, React 대시보드, 일일 점검과 실패 알림을 연결했습니다.",
      ],
      result: "데이터 수집·검증·운용 로직의 백엔드 자동화 테스트 205개와 React 대시보드 테스트 95개, 프로덕션 빌드를 통과했고 실제 계좌 조회·KRX 적재·자동 실행 경보를 검증했습니다.",
      keywords: ["검증 로직 선별 이식", "멱등 데이터 수집", "React 운영 화면"],
      visibility: "비공개 개인 프로젝트",
      workRange: "재설계 · 데이터 수집 · API · 대시보드 · 자동화",
      environment: "FastAPI · React · SQLite · Parquet · GitHub Actions",
    },
    detail: {
      overview: "2026년 3월부터 진행한 투자 연구 코어를 2026년 8월 새 저장소에서 재설계하고 있습니다. 기존 코드를 통째로 옮기지 않고 미래 데이터 혼입 방지, 반복 검증, 실험 이력과 모의운용 원장처럼 검증된 자산만 선별 이식했습니다. 새 저장소에서는 계좌 추적과 KRX 데이터 수집, 조회 API, React 대시보드, 자동 실행과 실패 감지 흐름을 새로 구성했습니다.",
      scope: ["전체 구조 재설계와 모듈 경계 정의", "토스증권 계좌·KRX 데이터 수집과 로컬 저장", "FastAPI 조회 API와 React 대시보드", "GitHub Actions와 텔레그램 운영 경보"],
      workPoints: [
        "기존 코어에서 인과성 검증, Purged Walk-forward, 표준 지표, 실험 이력, Tracking Error와 모의운용 원장을 골라 여섯 모듈 구조에 맞춰 옮겼습니다.",
        "OAuth2 토큰 캐시와 429 재시도, 날짜 단위 스냅샷, KRX 종목별 Parquet upsert로 외부 API와 로컬 데이터 사이의 경계를 만들었습니다.",
        "로컬 스냅샷만 읽는 FastAPI 조회 API와 React 화면을 연결하고, 금액 가리기·기간별 자산 곡선·보유 종목·상태 확인 기능을 구성했습니다.",
        "일일 헬스체크와 모의운용 적립을 GitHub Actions로 실행하고, 로컬 작업과 Actions가 실패할 때 텔레그램으로 알리도록 분리했습니다.",
      ],
      results: [
        "2026년 8월 11일 기준 백엔드 자동화 테스트 205개와 React 대시보드 테스트 95개가 통과했고 프로덕션 빌드를 확인했습니다.",
        "토스증권 실계좌 조회와 KRX 5개 종목 × 10개 일봉 50행, 환율 1행의 실제 적재를 확인했습니다.",
        "CI·일일 헬스체크·모의운용 워크플로 실행과 강제 실패 시 텔레그램 경보 수신을 확인했습니다.",
      ],
      techUsage: [
        "FastAPI는 SQLite 스냅샷만 읽는 네 개의 조회 API와 React 정적 파일 제공에 사용했습니다.",
        "SQLAlchemy·SQLite로 계좌 스냅샷을 날짜 단위로 교체 저장하고, Parquet·JSON으로 종목별 일봉과 해당 날짜의 종목 목록을 중복 없이 보관했습니다.",
        "React·TypeScript·Vite로 자산 요약, 기간별 자산 곡선, 보유 종목과 시스템 상태 화면을 만들었습니다.",
        "GitHub Actions에서 백엔드·프론트엔드 테스트와 빌드, 일일 점검과 모의운용 적립을 실행하고 실패 경보를 연결했습니다.",
      ],
      disclosure: "비공개 개인 프로젝트로 API 자격증명, 실제 계좌 금액·보유 종목, 전략 파라미터와 투자 성과는 공개하지 않습니다. 화면은 프라이버시 모드와 구조 요약으로 보여드립니다.",
      resources: [{ label: "ReachRich 공개 기술 데모", href: "https://github.com/YongjaeKwon/quant-lab", type: "github" }],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "계좌 스냅샷을 자산 요약·기간별 곡선·보유 종목으로 읽을 수 있게 만든 React 운영 대시보드입니다.",
          description: [
            "금액 가리기와 라이트·다크·시스템 테마를 제공하고, 보이지 않는 탭에서는 폴링을 멈춰 불필요한 요청을 줄였습니다.",
            "재사용 UI 요소와 상태별 빈 화면을 구성하고 PWA로 같은 네트워크의 모바일에서도 확인할 수 있게 했습니다.",
          ],
          result: "대시보드 컴포넌트·상태 처리 테스트 95개와 프로덕션 빌드를 통과했고, JavaScript 번들을 설계 예산 180KB 이내인 gzip 140.28KB로 유지했습니다.",
          keywords: ["React·TypeScript", "프라이버시 모드", "가시성 기반 폴링"],
          workRange: "React 화면 · 상태 처리 · UI 시스템 · 테스트",
        },
        detail: {
          scope: ["React·TypeScript 대시보드", "UI 프리미티브와 듀얼 테마", "프라이버시·폴링·PWA"],
          workPoints: [
            "자산 요약, 기간별 자산 곡선, 보유 종목과 시스템 상태를 각각의 화면 컴포넌트로 나누었습니다.",
            "금액 가리기 상태를 브라우저에 보관하고, 탭이 보이지 않을 때 폴링을 건너뛴 뒤 다시 열면 즉시 최신 데이터를 조회하도록 했습니다.",
            "카드·배지·표·빈 상태 등 재사용 UI 요소와 라이트·다크·시스템 테마, PWA 앱 셸을 구성했습니다.",
          ],
        },
      },
      backend: {
        card: {
          summary: "계좌와 시장 데이터를 반복 수집해도 일관되게 쌓고, 검증과 모의운용까지 이어지도록 재설계한 Python 백엔드입니다.",
          description: [
            "외부 API 응답을 바로 화면에 전달하지 않고 SQLite·Parquet 로컬 미러에 저장한 뒤 조회 API가 이를 읽도록 분리했습니다.",
            "종목별 수집 실패는 격리하되 실패율이 30%를 넘으면 전체 작업을 실패 처리하고 경보를 보내도록 했습니다.",
          ],
          result: "데이터 수집·전략 검증·운용 로직의 자동화 테스트 205개를 통과했고, 토스증권 계좌 조회와 KRX 5개 종목 × 10개 일봉 50행의 실제 적재를 확인했습니다.",
          keywords: ["FastAPI", "SQLite·Parquet", "멱등 수집·실패 격리"],
          workRange: "구조 재설계 · API · 데이터 수집 · 자동화",
        },
        detail: {
          scope: ["여섯 모듈 구조와 검증 자산 이식", "계좌·KRX 수집과 로컬 미러", "조회 API·자동 실행·실패 경보"],
          workPoints: [
            "데이터·종목 선정·전략·검증·운용·콘솔로 책임을 나누고 기존 코어에서 재사용할 검증 로직만 선별 이식했습니다.",
            "OAuth2 토큰을 만료 전에 갱신하고 429 응답은 Retry-After를 따라 한 번 재시도하도록 외부 API 클라이언트를 구성했습니다.",
            "계좌는 날짜 기준으로 교체 저장하고 KRX 일봉은 종목·날짜 기준으로 upsert해 같은 작업을 다시 실행해도 중복이 생기지 않게 했습니다.",
          ],
        },
      },
    },
  },
];

export const techGroups = [
  { title: "프론트엔드", items: ["JavaScript", "TypeScript", "Vue", "React", "Next.js", "WebSquare", "JSP"] },
  { title: "백엔드", items: ["Java", "Spring MVC", "Spring Boot", "MyBatis", "Python", "FastAPI"] },
  { title: "데이터베이스", items: ["MariaDB", "MySQL", "Oracle", "PostgreSQL", "SQLite"] },
  { title: "도구 및 배포", items: ["Git", "GitHub", "GitHub Actions", "SVN", "Jenkins", "Linux", "Tomcat", "Docker"] },
];

export const experience = {
  title: "웹 개발자",
  company: "유한책임회사 티지나래",
  period: "2024.06 ~ 재직 중",
  description: "B2B 협력사 포털 PPS와 교육용 단말 운영 시스템 TSMS에서 요구사항 협의부터 화면·서버·DB 개발, 검수와 배포까지 맡고 있습니다.",
  responsibilities: [
    "요구사항 협의",
    "화면·서버·DB 개발",
    "검수·배포·운영 확인",
  ],
};

export const education = [
  { title: "아주대학교 e-비즈니스학과", period: "2018.03 ~ 2020.08", description: "학사 졸업", icon: "GraduationCap" },
  { title: "삼성 청년 SW 아카데미(SSAFY) 8기", period: "2022.07 ~ 2023.06", description: "웹 개발 과정 수료. 세 차례의 팀 프로젝트에서 프론트엔드를 담당했습니다.", icon: "Award" },
  { title: "California State University, Chico", period: "2014.01 ~ 2015.05", description: "Business Administration 전공 후 아주대학교 편입", icon: "GraduationCap" },
  { title: "SQLD", period: "2024.09", description: "SQL 개발자 자격 취득", icon: "Database" },
];

export const heroStats = [
  { label: "실무 시스템", value: "PPS · TSMS", unit: "" },
  { label: "담당 범위", value: "화면 · 서버 · DB", unit: "" },
  { label: "운영 경험", value: "검수 · 배포 · 대응", unit: "" },
];

export const projects = featuredProjects;
