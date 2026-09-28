export type FocusTrackId = "all" | "frontend" | "backend";
export type RoleFocusId = Exclude<FocusTrackId, "all">;

export const profile = {
  name: "권용재",
  role: "웹 개발자",
  summary:
    "운영 담당자와 요구사항을 정리하고 화면, 서버, 데이터 처리를 직접 개발합니다. 새 기능은 배포 후 실제로 어떻게 쓰이는지까지 확인합니다.",
  email: "yongjae116@gmail.com",
  phone: "010-9470-1704",
  github: "https://github.com/YongjaeKwon",
  location: "경기도 용인시 수지구",
  resume: "/resume.pdf?v=20260928",
};

const backendResume = "/resume-backend.pdf?v=20260928";

export const focusTracks = [
  {
    id: "all" as const,
    label: "전체",
    role: "Web Developer",
    headline: "필요한 기능을 만들고, 쓰이는 모습까지 확인합니다.",
    target: "요구사항 정리부터 배포 후 확인까지 한 기능을 끝까지 맡아 왔습니다.",
    resume: profile.resume,
    projectIntro: "실무와 개인·팀 프로젝트에서 직접 구현한 부분을 모았습니다.",
    projectOrder: ["pps", "tsms", "ticketrush", "oneulsai", "reachrich", "ssafast", "ddoing", "modac"],
  },
  {
    id: "frontend" as const,
    label: "Frontend",
    role: "Frontend Developer",
    headline: "입력과 상태가 많은 업무 화면을 만듭니다.",
    target:
      "Vue·WebSquare 실무 화면과 React 프로젝트를 만들었습니다. 입력과 상태가 많은 화면에서도 사용자가 다음에 할 일을 바로 알 수 있게 하는 데 집중합니다.",
    resume: profile.resume,
    projectIntro: "화면 구조, 입력 처리, 진행 상태와 오류 안내에서 제가 한 일을 모았습니다.",
    projectOrder: ["reachrich", "oneulsai", "ssafast", "ddoing", "modac", "pps", "tsms"],
  },
  {
    id: "backend" as const,
    label: "Backend",
    role: "Backend Developer",
    headline: "업무에 맞는 서버 기능을 만들고 운영합니다.",
    target:
      "Spring 기반 업무 시스템에서 서버 로직과 SQL, 외부 연계를 개발하고 배포와 운영까지 맡아 왔습니다.",
    resume: backendResume,
    projectIntro: "서버 처리, 데이터 검증, 운영 자동화에서 제가 한 일을 모았습니다.",
    projectOrder: ["pps", "tsms", "ticketrush", "oneulsai", "reachrich"],
  },
];

export type ProjectVisibility =
  | "비공개 실무 프로젝트"
  | "비공개 개인 프로젝트"
  | "공개 GitHub 프로젝트"
  | "Private work project"
  | "Private personal project"
  | "Public GitHub project";

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
    stack: ["Vue", "Java 21", "Spring Boot", "MyBatis", "MariaDB", "Oracle", "Hazelcast", "Jenkins"],
    card: {
      summary: "본사와 협력사 약 500곳이 쓰는 B2B 포털입니다. 파트너 등록과 계약, 현장 엔지니어(CE) 계정 824개의 교육·자격·증빙을 처리합니다.",
      description: [
        "파트너와 CE 관리, 교육과 증빙에 필요한 화면, API, SQL을 개발하고 배포와 운영을 맡고 있습니다.",
        "대량 파일 다운로드, 본사 계정 발급, 알림 정책, 배포 절차에서 반복되던 불편을 줄였습니다.",
      ],
      result: "오래 걸리던 압축을 별도 작업으로 떼어 내, 사용자가 진행 상황을 보고 새로고침 후에도 이어서 내려받게 했습니다.",
      keywords: ["대량 파일 비동기 처리", "본사 계정·사내 시스템 연계", "배포 절차 구성"],
      visibility: "비공개 실무 프로젝트",
      workRange: "초기 구축 참여 · 기능 개발 · 검수 · 배포 · 운영",
      environment: "Vue · Spring Boot · MyBatis · Jenkins",
    },
    detail: {
      overview:
        "본사와 협력사가 파트너 등록과 계약, CE의 교육·자격·증빙·평가를 처리하는 B2B 포털입니다. 업무 화면과 API, SQL을 개발하고 외부 시스템 연동, 사용자 검수, 배포와 운영을 맡고 있습니다.",
      scope: [
        "교육 대상자, 증빙, 계정 관리 기능 개발",
        "첨부파일 300~400건 압축 다운로드 방식 개선",
        "본사 계정 발급과 사내 업무 시스템 연계",
        "빌드, 전송, 배포 절차 구성과 운영",
      ],
      workPoints: [
        "기존 압축 다운로드는 300~400건을 한 번에 요청하면 오래 걸렸고, 진행 중인지 실패했는지도 알기 어려웠습니다. 그래서 작업 ID를 먼저 내주고 별도 실행기에서 압축한 뒤, 화면이 2초마다 상태를 조회하도록 바꿨습니다. 새로고침해도 작업을 다시 찾아 완료 파일을 내려받을 수 있고, 만료된 파일은 자동으로 지웁니다.",
        "본사 계정 등록 화면을 만들었습니다. 부서와 직급 확인, 아이디 중복 검사, 초기 비밀번호와 일회용 비밀번호(OTP) 정보 생성은 서버에서 처리합니다. 사용자와 사원 정보를 함께 저장한 뒤 사내 업무 시스템으로 보냅니다.",
        "소스 가져오기, 빌드, 서버 전송, 기존 파일 백업, 두 서버 순차 배포를 Jenkins 작업과 스크립트로 묶었습니다.",
      ],
      caseStudy: {
        problem: "첨부파일 300~400건을 한 번에 압축하면 요청이 오래 멈춰 있었고, 사용자는 진행 중인지 실패했는지 알 수 없었습니다.",
        decision: "화면 요청과 압축 실행을 나누고, 작업 ID 하나로 서버 상태와 화면을 이어 주기로 했습니다.",
        implementation: [
          "전용 실행기에서 압축하고 대기, 진행, 완료, 실패 상태를 저장했습니다.",
          "Vue 화면이 2초마다 상태를 조회하고, 새로고침 뒤에도 기존 작업을 찾아 이어서 보여 줍니다.",
          "완료 파일은 스트리밍으로 내려받고, 만료된 결과 파일은 자동으로 지웁니다.",
        ],
        outcome: [
          "첨부파일 300~400건 규모의 대량 다운로드를 비동기 작업으로 운영하고 있습니다.",
          "사용자는 진행 상황과 실패 여부를 보고, 완료 파일을 이어서 내려받을 수 있습니다.",
        ],
      },
      results: [
        "대량 다운로드 중 진행 상황과 실패 여부가 화면에 보입니다.",
        "계정 발급과 사내 시스템 전송 기능을 실제 업무에서 쓰고 있습니다.",
        "손으로 반복하던 빌드, 전송, 배포를 Jenkins 작업으로 실행합니다.",
      ],
      techUsage: [
        "Vue와 Tabulator로 관리 화면과 작업 진행 표시를 만들었습니다.",
        "Spring Boot와 MyBatis로 비동기 작업 상태, 계정 발급, 입력값 검사, 외부 전송을 구현했습니다.",
        "Jenkins, Gradle, Linux 스크립트로 개발·운영 서버 배포 순서를 정리했습니다.",
      ],
      disclosure: "사내 프로젝트라 회사와 고객사 정보, 실제 화면과 데이터는 공개하지 않습니다.",
      resources: [],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "협력사 업무 화면과, 대량 다운로드처럼 오래 걸리는 기능의 진행 표시를 개발했습니다.",
          description: [
            "Vue로 교육, 대상자, 설문, 계정 관리 화면을 만들고 권한과 처리 상태에 따라 버튼과 입력 조건을 나눴습니다.",
            "압축 작업의 대기, 진행, 완료, 실패를 화면에 보여 주고 새로고침 뒤에도 이어서 확인하게 했습니다.",
          ],
          keywords: ["Vue 관리 화면", "입력·상태 처리", "대량 작업 진행 안내"],
          workRange: "업무 화면 · 상태 처리 · API 연동",
        },
        detail: {
          scope: ["교육, 대상자, 계정 관리 화면", "권한과 진행 상태에 따른 입력·버튼 처리", "대량 다운로드 진행 표시와 오류 안내"],
          workPoints: [
            "교육 등록, 대상자 업로드, 제출 현황이 같은 기준으로 조회되도록 화면과 서버의 조회 조건을 맞췄습니다.",
            "압축 다운로드를 요청하면 진행 상태를 주기적으로 확인합니다. 새로고침해도 기존 작업을 찾아 진행 상황을 이어서 보여 줍니다.",
            "계정 등록 화면에서 부서, 직급, 아이디 중복 결과를 바로 보여 주고, 저장할 수 있는지가 분명히 드러나게 입력 순서를 정리했습니다.",
          ],
          caseStudy: {
            problem: "대량 압축 중에는 화면이 오래 멈춰 있어, 사용자가 진행 중인지 끝났는지 실패했는지 구분하기 어려웠습니다.",
            decision: "오래 걸리는 요청을 대기, 진행, 완료, 실패 네 가지 화면 상태로 나눠 보여 주기로 했습니다.",
            implementation: [
              "Vue 화면에서 작업을 요청한 뒤 2초마다 상태를 조회합니다.",
              "새로고침 뒤에도 작업 ID로 기존 작업을 찾아 진행 상황을 이어서 보여 줍니다.",
              "완료, 실패, 만료 상태마다 다운로드 버튼과 오류 안내를 따로 보여 줍니다.",
            ],
            outcome: [
              "첨부파일 300~400건 규모 작업의 진행과 실패 여부를 화면에서 확인할 수 있습니다.",
              "완료된 파일은 새로고침 후에도 이어서 내려받을 수 있습니다.",
            ],
          },
        },
      },
      backend: {
        card: {
          summary: "대량 파일 압축 작업, 계정 발급과 사내 시스템 연계, Jenkins 배포를 구현했습니다.",
          description: [
            "대량 파일 요청을 별도 작업으로 떼어 내고, 진행 상태 조회와 만료 파일 정리, 다운로드를 서버에서 처리했습니다.",
            "계정 정보를 확인해 저장하고 사내 시스템으로 보내는 기능을 만들었습니다. 빌드부터 순차 배포까지는 Jenkins 작업으로 묶었습니다.",
          ],
          keywords: ["대량 작업 분리", "데이터 일괄 저장", "Jenkins"],
          workRange: "서버 · DB · 외부 연계 · 배포",
        },
        detail: {
          scope: ["대량 파일 압축 작업 분리와 상태 관리", "계정 검증·저장과 사내 시스템 전송", "Jenkins 배포 작업 구성"],
          workPoints: [
            "압축이 끝날 때까지 요청 하나가 계속 붙잡혀 있던 방식을 별도 작업으로 바꿨습니다. 진행 상태를 저장해 완료 파일을 내려받게 하고, 오래된 결과 파일은 자동으로 지웁니다.",
            "부서, 직급, 아이디를 확인한 뒤 초기 비밀번호와 일회용 비밀번호 정보를 만들고 사용자와 사원 정보를 함께 저장합니다. 저장 결과는 사내 업무 시스템으로 보냅니다.",
            "소스 가져오기, Gradle 빌드, 서버 전송, 기존 파일 백업, 두 서버 순차 배포를 Jenkins에서 수동으로 실행할 수 있게 했습니다.",
          ],
          caseStudy: {
            problem: "압축이 끝날 때까지 HTTP 요청이 계속 대기했고, 작업 상태와 결과 파일 보관 기간, 실패를 관리하기 어려웠습니다.",
            decision: "요청 처리와 압축 실행을 나누고 작업 ID로 상태를 관리하기로 했습니다.",
            implementation: [
              "전용 실행기에서 압축하고 작업 상태를 저장했습니다.",
              "완료 파일은 스트리밍으로 내려받게 하고, 오래된 결과 파일은 자동으로 지웁니다.",
              "Spring Boot와 MyBatis로 작업 상태 조회와 다운로드를 구현했습니다.",
            ],
            outcome: [
              "첨부파일 300~400건 규모의 대량 다운로드를 비동기 작업으로 운영하고 있습니다.",
              "서버가 진행, 완료, 실패 상태를 화면에 넘겨줄 수 있게 됐습니다.",
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
      summary: "서울시교육청 디벗 사업의 교육용 단말 약 11만 대를 등록하고, 배송·설치·A/S·점검 이력을 관리하는 시스템입니다.",
      description: [
        "운영 담당자와 요구사항을 맞추고 화면과 서버 기능 개발, 사용자 검수, 배포를 맡고 있습니다.",
        "기존 단말, 출고, 설치, A/S 데이터 위에 외부 연계, 중고거래 모니터링, QR 발급, 현장 점검 기능을 더했습니다.",
      ],
      result: "손으로 확인하던 운영 업무와 종이 점검표를 시스템으로 옮겨 실제 사업에서 쓰고 있습니다.",
      keywords: ["운영 업무 전산화", "점검 이력 관리", "외부 연계 개선"],
      visibility: "비공개 실무 프로젝트",
      workRange: "유지보수 · 사업별 신규 개발 · 검수 · 배포",
      environment: "WebSquare · Spring MVC · MyBatis",
    },
    detail: {
      overview:
        "서울시교육청 디벗 사업에서 교육용 단말의 등록, 배송·설치, A/S, 점검, 사후관리를 지원하는 시스템입니다. 기존 기능을 유지보수하면서 사업에 필요한 화면과 서버 기능을 새로 개발하고 있습니다.",
      scope: [
        "중고거래 게시글 모니터링 기능 개발",
        "프리미엄 케어 점검 업무 전산화",
        "단말 QR 발급·출력과 학교 담당자 안내 메시지 연계",
        "카카오 주소 검색과 교육행정정보시스템(NEIS) 연동 방식 통합",
      ],
      workPoints: [
        "중고거래 플랫폼별로 키워드·지역 검색 링크를 만들고, 검수자가 붙여넣은 게시글 주소에서 사이트와 게시글 번호를 찾아 중복을 확인합니다. 서버는 외부 사이트에 접속하지 않습니다. 주소 형식이 바뀌면 관리 화면에서 판별 규칙만 고치면 됩니다.",
        "종이로 하던 점검 업무를 시스템으로 옮겼습니다. 일정, 대상, 체크리스트, 서명, 재점검 이력, 결과 파일 다운로드를 한 화면 흐름에서 처리합니다.",
        "단말 QR 발급과 전용 프린터 출력을 운영 업무에 붙였습니다. 학생 명단 등록, 설치 희망일, 계정 방식, 설치 확정 안내도 메시지로 보낼 수 있게 했습니다.",
        "화면마다 따로 구현돼 있던 카카오 주소 검색과 NEIS 연동을 서버 공통 기능으로 옮기고, 연결 정보와 설정은 서버에서 관리하게 했습니다.",
      ],
      caseStudy: {
        problem: "외부 API 키가 브라우저 코드에 들어 있었고, 연결 정보가 바뀌면 관련 화면을 하나하나 고쳐야 했습니다.",
        decision: "외부 API는 화면이 아니라 서버에서 호출하도록 바꾸고, 키와 연결 정보는 서버 설정에서 관리하기로 했습니다.",
        implementation: [
          "외부 API 요청을 대신 처리하는 공통 Controller와 Service를 추가했습니다.",
          "키와 연동 URL은 서버 설정으로 빼고, 화면에는 필요한 응답만 넘깁니다.",
          "기존 25개 화면의 요청 경로와 오류 처리를 공통 형식에 맞췄습니다.",
        ],
        outcome: [
          "브라우저에서 보이던 API 키를 서버로 옮겼습니다.",
          "연동 정보가 바뀌어도 화면마다 고칠 필요 없이 서버 한 곳만 고치면 됩니다.",
        ],
      },
      results: [
        "외부 API를 직접 호출하던 25개 화면에서 브라우저에 키가 드러나지 않게 하고, 호출은 서버에서 하도록 바꿨습니다.",
        "대량 등록 전에 생산입고 정보와 기등록 여부를 검사하고, QR에는 내부 식별자 대신 외부 노출용 ID를 넣었습니다. QR은 전체 111,593대 중 108,237대에 발급됐습니다.",
        "학교와 단말별 점검, 재점검 이력을 시스템에서 관리합니다.",
      ],
      techUsage: [
        "WebSquare와 JSP로 등록, 조회, 점검, 모니터링 화면을 만들었습니다.",
        "Spring MVC와 MyBatis로 게시글 주소 분석, 중복 검사, 이력 저장, 외부 시스템 연계를 개발했습니다.",
        "배포 후에는 MariaDB에서 운영 데이터를 조회해 기능이 실제로 쓰이는지 확인했습니다.",
      ],
      disclosure: "사내 프로젝트라 회사와 고객사 정보, 실제 화면과 데이터는 공개하지 않습니다.",
      resources: [],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "여러 운영팀이 쓰는 등록, 점검, 모니터링 화면을 WebSquare로 개발했습니다.",
          description: [
            "복잡한 점검 업무를 일정, 대상, 진행 상태, 재점검 이력으로 나눠 담당자가 다음 작업을 알 수 있게 했습니다.",
            "중고거래 게시글을 저장할 때 반복 입력을 줄이고, QR 발급과 안내 메시지 발송 결과를 운영 화면에서 확인하게 했습니다.",
          ],
          keywords: ["WebSquare", "업무 화면", "상태별 UI"],
          workRange: "화면 설계 · 입력 검증 · API 연동",
        },
        detail: {
          scope: ["점검 일정·대상·재점검 화면", "중고거래 게시글 확인·저장 화면", "QR 발급·안내 메시지 운영 화면"],
          workPoints: [
            "점검은 한 번에 끝나지 않는 경우가 많습니다. 분실이나 미지참 단말은 2차, 3차 일정으로 이어서 관리하게 화면을 짰습니다.",
            "검수자가 URL을 붙여넣으면 뽑아낼 수 있는 정보를 먼저 채워, 나머지만 입력하고 저장하게 했습니다.",
            "QR 발급 여부와 안내 메시지 발송 결과를 목록과 상세 화면에서 볼 수 있게 상태 표시와 조회 조건을 맞췄습니다.",
          ],
          caseStudy: {
            problem: "종이로 점검하다 보니 일정, 미완료 대상, 재점검 이력이 따로 놀아 담당자가 다음에 할 일을 파악하기 어려웠습니다.",
            decision: "현장 절차를 일정, 대상, 회차, 결과 상태로 나누고, 화면에서 다음 할 일이 보이게 했습니다.",
            implementation: [
              "WebSquare로 일정, 대상, 점검 결과 화면을 만들었습니다.",
              "분실·미지참 단말이 2차, 3차 재점검으로 이어지도록 회차별 상태를 연결했습니다.",
              "일정 확정, 미완료 대상, 재점검 결과, 결과 파일을 같은 화면 흐름에서 확인하게 상태 표시를 맞췄습니다.",
            ],
            outcome: [
              "2026년 9월 기준 대상 119개 학교 중 71개 학교에서 점검을 진행했습니다.",
              "시스템에 저장된 점검표는 14,882건입니다.",
            ],
          },
        },
      },
      backend: {
        card: {
          summary: "게시글 주소 분석, 점검 이력 저장, QR·안내 메시지, 외부 시스템 연계를 개발했습니다.",
          description: [
            "외부 사이트에 접속하지 않고 게시글 주소만 분석해 사이트와 게시글 번호를 찾고 중복을 확인합니다.",
            "점검 데이터와 결과 파일, QR 발급, 안내 메시지 발송을 기존 자산·설치 데이터에 연결했습니다.",
          ],
          keywords: ["게시글 주소 분석", "점검 이력 관리", "외부 연동 공통화"],
          workRange: "서버 · SQL · 데이터 검증 · 외부 연계",
        },
        detail: {
          scope: ["게시글 주소 분석과 중복 확인", "점검과 재점검 이력 저장", "QR·안내 메시지·외부 시스템 연계"],
          workPoints: [
            "게시글 주소 뒤에 붙은 불필요한 값을 지우고, 사이트별 주소 규칙으로 게시글 번호를 찾습니다. 번호를 못 찾으면 전체 주소로 중복을 확인합니다.",
            "기존 자산·설치 정보를 기준으로 점검 대상과 회차별 결과를 저장하고, 서명과 PDF, Excel, 압축 파일을 같은 점검 이력에 연결했습니다.",
            "화면마다 따로 하던 카카오 주소 검색과 NEIS 연동을 서버 공통 경로로 옮겨, 25개 화면이 같은 방식으로 호출하게 했습니다.",
          ],
          caseStudy: {
            problem: "카카오 주소 검색과 NEIS 연동이 화면마다 따로 구현돼 있어, 연결 정보나 설정이 바뀔 때마다 여러 곳을 고쳐야 했습니다.",
            decision: "반복되는 외부 연계와 설정을 서버 공통 경로 하나로 모으기로 했습니다.",
            implementation: [
              "카카오 주소 검색과 NEIS 연계를 서버 공통 기능으로 옮겼습니다.",
              "외부 시스템의 연결 정보와 설정은 서버에서 관리합니다.",
              "기존 화면이 공통 응답을 쓰도록 조회와 저장 부분을 고쳤습니다.",
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
      summary: "API 명세를 쓰고, 바로 요청과 성능 테스트까지 해 볼 수 있는 도구입니다(6인 팀 프로젝트).",
      description: [
        "프론트엔드와 UI·UX를 맡아 명세 입력 폼, API 실행 화면, 성능 테스트 결과 화면을 만들었습니다.",
        "헤더, 경로·검색 조건, 중첩된 본문 항목을 자유롭게 넣고 빼면, 입력한 내용이 실제 요청 형태로 조합됩니다.",
      ],
      result: "요청 성공 여부와 응답 내용, 응답 시간 분포, 초당 처리량을 화면에서 비교할 수 있게 했습니다.",
      keywords: ["반복·중첩 입력", "API 요청 테스트", "성능 결과 화면"],
      visibility: "공개 GitHub 프로젝트",
      workRange: "프론트엔드 · UI·UX",
      environment: "Next.js · React · TypeScript",
    },
    detail: {
      overview: "API 명세를 작성하고 실제 요청과 성능 테스트 결과까지 확인하는 도구로, SSAFY에서 6명이 함께 만들었습니다.",
      scope: ["프론트엔드와 UI·UX", "API 명세 동적 입력 폼", "요청 실행과 성능 테스트 결과 화면"],
      workPoints: [
        "React Hook Form으로 요청 항목과 중첩된 데이터 구조를 자유롭게 추가하고 삭제하게 했습니다.",
        "입력한 주소, 요청 방식, 조건, 본문을 실제 요청 형식으로 조합하고, 잘못 입력한 곳은 그 자리에서 알려 줍니다.",
        "API 요청의 성공 여부와 응답 내용을 보여 주고, 성능 테스트 결과는 응답 시간 분포와 초당 처리량으로 나눠 표시했습니다.",
      ],
      results: ["복잡한 API 명세를 한 화면에서 쓰고, 테스트 결과까지 이어서 볼 수 있습니다."],
      techUsage: [
        "Next.js와 React로 명세 작성 화면과 결과 화면을 만들었습니다.",
        "반복·중첩 입력과 검증 상태는 React Hook Form으로 관리했습니다.",
        "서버 데이터는 TanStack Query, 화면 전역 상태는 Redux Toolkit으로 나눠 관리했습니다.",
      ],
      disclosure: "SSAFY 교육 과정의 팀 프로젝트이며 코드는 GitHub에 공개돼 있습니다.",
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
      summary: "영어 단어를 보고 그림을 그리면, 팀이 만든 AI 판정 결과에 따라 학습이 이어지는 팀 프로젝트입니다.",
      description: [
        "프론트엔드를 맡아 메인 화면, 그림 입력 학습 화면, 점수와 경험치 반영을 개발했습니다.",
        "그린 그림을 이미지로 바꿔 AI 판정 서버에 보내고, 결과에 따라 다음 문제와 학습 상태로 넘어가게 했습니다.",
      ],
      result: "타이머가 중복 실행돼 시간이 빨리 흐르던 문제와 이전 단어 목록이 남던 문제를 찾아 고쳤습니다.",
      keywords: ["React", "그림 입력", "상태·타이머"],
      visibility: "공개 GitHub 프로젝트",
      workRange: "프론트엔드 · 기획 참여",
      environment: "React · TypeScript · Redux Toolkit",
    },
    detail: {
      overview: "영어 단어를 그림으로 그리면 AI 판정 결과에 따라 점수와 경험치를 얻는 학습 서비스입니다.",
      scope: ["메인·그림 학습 화면", "그림 입력과 AI 판정 서버 연동", "학습 상태·점수·타이머 처리"],
      workPoints: [
        "화면에 그린 그림을 이미지로 바꿔 AI 판정 서버에 보내고, 판정 결과에 따라 점수와 경험치를 반영했습니다.",
        "화면에 들어올 때 타이머가 두 번 돌던 문제를 고치고, 화면을 벗어나면 타이머도 멈추게 했습니다.",
        "다음 문제로 넘어갈 때 이전 단어 목록이 남지 않도록 상태 갱신 시점을 고쳤습니다.",
      ],
      results: ["그림 입력, 판정, 점수 반영, 다음 문제까지 한 화면에서 이어집니다."],
      techUsage: [
        "React와 TypeScript로 학습 화면과 상태 전환을 만들었습니다.",
        "Canvas API로 그림 입력과 이미지 변환을 처리했습니다.",
        "Redux Toolkit으로 사용자 점수와 학습 상태를 관리했습니다.",
      ],
      disclosure: "SSAFY 교육 과정의 팀 프로젝트입니다. 이미지 전처리는 팀장과 함께 했고, 판정 모델 학습은 팀장이 맡았습니다.",
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
      summary: "개발자가 학습 기록을 남기고 스터디를 함께 운영하는 서비스를 만든 팀 프로젝트입니다.",
      description: [
        "프론트엔드를 맡아 스터디룸, 게시글, 마이페이지 화면을 개발했습니다.",
        "스터디룸 입장·퇴장과 초대 코드 검증, 학습 통계, 알림, 즐겨찾기 화면을 만들었습니다.",
      ],
      result: "팀이 구성한 SockJS·STOMP 연결을 스터디룸 채팅 화면에 붙여, 방 안에서 바로 대화할 수 있게 했습니다.",
      keywords: ["Vue 3", "상태 관리", "채팅 UI"],
      visibility: "공개 GitHub 프로젝트",
      workRange: "프론트엔드",
      environment: "Vue 3 · Pinia · SockJS/STOMP",
    },
    detail: {
      overview: "개발자가 학습 기록을 쓰고 스터디를 함께 운영할 수 있게 만든 SSAFY 팀 프로젝트입니다.",
      scope: ["스터디룸·게시글·마이페이지 화면", "학습 통계·알림·즐겨찾기", "채팅 화면 연결"],
      workPoints: [
        "Vue 3와 Pinia로 스터디룸 입장·퇴장, 초대 코드 검증, 화면 상태를 관리했습니다.",
        "학습 기록과 통계, 알림, 즐겨찾기 화면을 만들었습니다.",
        "연결 상태와 새로 받은 메시지를 스터디룸 채팅 화면에 보여 줍니다.",
      ],
      results: ["스터디 참여, 학습 기록, 채팅을 한 서비스 안에서 오갈 수 있게 화면을 구성했습니다."],
      techUsage: [
        "Vue 3로 스터디룸, 게시글, 마이페이지 화면을 만들었습니다.",
        "Pinia로 사용자와 스터디 상태를 관리했습니다.",
        "팀에서 구성한 SockJS·STOMP 연결을 스터디룸 채팅 UI에 연결했습니다.",
      ],
      disclosure: "SSAFY 교육 과정에서 6명이 진행한 팀 프로젝트이며 코드는 GitHub에 공개돼 있습니다.",
      resources: [
        { label: "GitHub 저장소", href: "https://github.com/YongjaeKwon/MODAC", type: "github" },
        { label: "화면 이미지", href: "/projects/modac.png", type: "image" },
      ],
    },
  },
  {
    id: "ticketrush",
    title: "선착순 티켓팅 시스템(ticket-rush)",
    shortTitle: "티켓러시",
    period: "2026.08 ~ 진행 중",
    category: "Personal Backend",
    focuses: ["all", "backend"],
    stack: ["Java 21", "Spring Boot 4", "Spring Modulith", "MySQL 8.4", "Redis 7", "Flyway", "Next.js", "TypeScript", "JUnit", "Testcontainers", "Vitest", "Playwright"],
    image: {
      src: "/projects/ticketrush.png",
      width: 1200,
      height: 675,
      previewSrc: "/projects/ticketrush-preview.webp",
      previewWidth: 960,
      previewHeight: 540,
      alt: "티켓러시 좌석 선택 목업 — 구역 탭, 좌석 배치도와 잔여석 표시",
    },
    card: {
      summary: "같은 좌석에 요청이 몰려도 한 번만 팔리는지 테스트로 확인하며 만들고 있는 예매 시스템입니다.",
      description: [
        "Redis 선점, 만료된 선점의 결제 거절, MySQL (회차, 좌석) 기본키로 좌석 중복 확정을 막습니다. Redis 선점 정보가 사라진 상황도 통합 테스트로 재현했습니다.",
        "모놀리스 백엔드(1단계)와 Next.js 웹(2단계)을 마쳤고, 지금은 Outbox 릴레이로 Kafka에 이벤트를 보내는 3단계를 진행하고 있습니다.",
      ],
      result: "좌석 하나에 동시 요청 100건을 보내는 테스트에서 성공은 1건입니다. 백엔드 통합·동시성 테스트와 웹 단위·Playwright E2E 테스트를 CI에서 실행합니다.",
      keywords: ["좌석 중복 확정 방지", "트랜잭셔널 아웃박스", "동시성 테스트"],
      visibility: "공개 GitHub 프로젝트",
      workRange: "설계 · 백엔드 개발 · 웹 · 동시성 테스트 · CI",
      environment: "Spring Boot · MySQL · Redis · Next.js",
    },
    detail: {
      overview:
        "선착순 예매에서 같은 좌석이 두 번 팔리지 않는지를 테스트로 확인하며 만드는 개인 프로젝트입니다. 1단계 모놀리스 백엔드에 이어 2단계(Next.js 웹, Canvas 좌석맵, SSE, 결제·완료 화면, Playwright E2E)를 2026년 9월 10일에 마쳤고, 3단계(Outbox 릴레이와 Kafka)를 진행하고 있습니다.",
      scope: [
        "좌석 중복 확정 방지 설계와 동시성 테스트",
        "ZSET 대기열과 JWT 입장권",
        "멱등 처리, 트랜잭셔널 아웃박스, SSE 상태 전달",
        "Testcontainers 통합 테스트, Playwright E2E, GitHub Actions CI",
      ],
      workPoints: [
        "Redis SET NX EX로 좌석을 5분간 선점해 동시 요청 중 한 건만 통과시킵니다. 선점이 만료되면 도메인 규칙이 결제를 거절하고, 마지막으로 confirmed_seat 테이블의 (회차, 좌석) 기본키가 두 번째 확정을 막습니다.",
        "선점 키를 지워 같은 좌석에 선점 10건을 만든 뒤 동시에 확정해도, 확정 좌석과 CONFIRMED 예매가 각각 1건만 남는지 통합 테스트로 확인합니다.",
        "결제 요청은 멱등성 키로 중복 실행을 막습니다. 응답을 못 받으면 예매 상태를 먼저 조회하고 같은 시도의 키를 유지하며, 결제 거절 뒤 새로 시도할 때는 다른 키를 씁니다. 예매 확정과 이벤트 기록은 한 트랜잭션으로 묶었습니다.",
        "의존 방향(adapter→application→domain)과 도메인이 프레임워크에 의존하지 않는다는 규칙을 아키텍처 테스트로 검사합니다.",
      ],
      results: [
        "좌석 하나에 동시 요청 100건을 보내는 테스트에서 성공은 1건, 나머지 99건은 이미 선점된 좌석으로 거절됩니다.",
        "백엔드 통합·동시성 테스트와 웹 단위 테스트, Playwright E2E를 GitHub Actions CI에서 실행합니다.",
        "Redis 선점 정보가 사라진 상황에서도 DB 기본키가 중복 확정을 막는 것을 통합 테스트로 확인했습니다.",
      ],
      techUsage: [
        "Spring Boot와 Spring Modulith로 catalog, queue, reservation 모듈을 나눴습니다.",
        "Redis는 좌석 선점(SET NX EX)과 ZSET 대기열, 순차 입장에 씁니다.",
        "MySQL 스키마는 Flyway로 관리하고, Testcontainers로 실제 MySQL과 Redis를 띄워 통합 테스트를 돌립니다.",
        "Next.js 웹에서 Canvas로 좌석을 그리고 SSE로 대기 순번과 좌석 상태를 받습니다. Playwright로 예매 흐름을 E2E 테스트합니다.",
      ],
      disclosure:
        "공개 GitHub 프로젝트라 전체 코드와 테스트를 볼 수 있습니다. 진행 중인 프로젝트라 구현한 범위만 적었습니다. Kafka 이벤트 전달은 진행 중이고, HTTP 부하 테스트의 응답 시간과 처리량은 아직 측정하지 않았습니다.",
      resources: [{ label: "GitHub 저장소·README", href: "https://github.com/YongjaeKwon/ticket-rush", type: "github" }],
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
      summary: "예전 투자 연구 코드에서 검증 로직만 골라 옮기고, 계좌 추적, 시장 데이터 수집, 모의운용, 대시보드를 새로 설계하고 있습니다.",
      description: [
        "2026년 8월 새 저장소를 만들었습니다. 코드는 데이터, 종목 선정, 전략, 검증, 운용, 콘솔 여섯 영역으로 나눴습니다.",
        "토스증권 계좌 조회, KRX 수집, FastAPI 조회 API, React 대시보드, 일일 점검과 실패 알림을 연결했고 매매일지, 시장 국면·종목 등급, 전략 조합 배치까지 만들었습니다.",
      ],
      result: "2026년 8월 11일 기준 파이썬 테스트 205개와 웹 테스트 96개가 통과합니다. 실계좌 조회, KRX 적재, 자동 실행 실패 알림은 실제로 돌려 확인했습니다.",
      keywords: ["검증 로직 선별 이식", "멱등 데이터 수집", "React 대시보드"],
      visibility: "비공개 개인 프로젝트",
      workRange: "재설계 · 데이터 수집 · API · 대시보드 · 자동화",
      environment: "FastAPI · React · SQLite · Parquet · GitHub Actions",
    },
    detail: {
      overview: "2026년 3월부터 만든 투자 연구 코드를 2026년 8월 새 저장소에서 다시 설계하고 있습니다. 기존 코드를 통째로 옮기지 않고, 미래 데이터 혼입 방지, 반복 검증, 실험 이력, 모의운용 원장처럼 이미 검증한 부분만 골라 옮겼습니다. 계좌 추적, KRX 데이터 수집, 조회 API, React 대시보드, 자동 실행과 실패 감지는 새로 만들었습니다. 매매일지, 시장 국면·종목 등급, 사전등록한 전략 조합 배치까지 마쳤고, 승격 게이트를 통과한 전략이 나오기 전까지 실전 주문은 하지 않습니다.",
      scope: ["전체 구조 재설계와 모듈 나누기", "토스증권 계좌·KRX 데이터 수집과 로컬 저장", "FastAPI 조회 API와 React 대시보드", "GitHub Actions와 텔레그램 실패 알림"],
      workPoints: [
        "기존 코드에서 인과성 검증, Purged Walk-forward, 표준 지표, 실험 이력, Tracking Error, 모의운용 원장을 골라 여섯 모듈 구조에 맞게 옮겼습니다.",
        "외부 API 결과를 로컬에 먼저 저장해 두고, 화면은 로컬 데이터만 읽게 했습니다. OAuth2 토큰 캐시, 429 재시도, 날짜 단위 스냅샷, KRX 종목별 Parquet upsert가 그 역할을 합니다.",
        "로컬 스냅샷만 읽는 FastAPI 조회 API와 React 화면을 연결했습니다. 금액 가리기, 기간별 자산 곡선, 보유 종목, 상태 확인 기능이 있습니다.",
        "일일 헬스체크와 모의운용 적립은 GitHub Actions에서 돌리고, 로컬 작업이나 Actions가 실패하면 텔레그램으로 알림을 보냅니다.",
      ],
      results: [
        "2026년 8월 11일 기준 파이썬 테스트 205개와 웹 테스트 96개가 통과합니다.",
        "토스증권 실계좌를 조회하고, KRX 거래대금 상위 200종목과 일봉을 매일 적재합니다.",
        "CI, 일일 헬스체크, 모의운용 워크플로가 돌아가고, 일부러 실패시켰을 때 텔레그램 알림이 오는 것까지 확인했습니다.",
      ],
      techUsage: [
        "FastAPI는 SQLite 스냅샷만 읽는 조회 API 네 개와 React 정적 파일 제공에 씁니다.",
        "SQLAlchemy와 SQLite로 계좌 스냅샷을 날짜 단위로 교체 저장합니다. 종목별 일봉과 그날의 종목 목록은 Parquet과 JSON에 중복 없이 보관합니다.",
        "React, TypeScript, Vite로 자산 요약, 기간별 자산 곡선, 보유 종목, 시스템 상태 화면을 만들었습니다.",
        "GitHub Actions에서 백엔드·프론트엔드 테스트와 빌드, 일일 점검, 모의운용 적립을 돌리고 실패 알림을 연결했습니다.",
      ],
      disclosure: "비공개 개인 프로젝트라 API 자격증명, 실제 계좌 금액과 보유 종목, 전략 파라미터, 투자 성과는 공개하지 않습니다. 화면은 금액 가리기를 켠 상태와 구조 요약으로만 보여 드립니다.",
      resources: [{ label: "공개 데모 저장소(quant-lab, 합성 데이터)", href: "https://github.com/YongjaeKwon/quant-lab/blob/main/README.md", type: "github" }],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "계좌 스냅샷을 자산 요약, 기간별 곡선, 보유 종목으로 보여 주는 React 대시보드입니다.",
          description: [
            "금액 가리기와 라이트·다크·시스템 테마를 넣고, 보이지 않는 탭에서는 폴링을 멈춰 쓸데없는 요청을 줄였습니다.",
            "재사용 UI 요소와 상태별 빈 화면을 만들고, PWA로 같은 네트워크의 휴대폰에서도 볼 수 있게 했습니다.",
          ],
          result: "2026년 8월 11일 기준 웹 테스트 96개와 프로덕션 빌드가 통과합니다.",
          keywords: ["React·TypeScript", "금액 가리기", "탭 가시성 기반 폴링"],
          workRange: "React 화면 · 상태 처리 · UI 시스템 · 테스트",
        },
        detail: {
          scope: ["React·TypeScript 대시보드", "재사용 UI 요소와 라이트·다크 테마", "금액 가리기·폴링·PWA"],
          workPoints: [
            "자산 요약, 기간별 자산 곡선, 보유 종목, 시스템 상태를 각각 별도 컴포넌트로 나눴습니다.",
            "금액 가리기 설정은 브라우저에 저장합니다. 탭이 안 보이면 폴링을 건너뛰고, 다시 열면 바로 최신 데이터를 가져옵니다.",
            "카드, 배지, 표, 빈 상태 같은 재사용 UI 요소와 라이트·다크·시스템 테마, PWA 앱 셸을 만들었습니다.",
          ],
        },
      },
      backend: {
        card: {
          summary: "계좌와 시장 데이터를 여러 번 수집해도 중복 없이 쌓고, 검증과 모의운용으로 이어지게 다시 설계한 Python 백엔드입니다.",
          description: [
            "외부 API 응답을 화면에 바로 넘기지 않고 SQLite·Parquet 로컬 저장소에 쌓은 뒤, 조회 API는 이것만 읽게 했습니다.",
            "종목 하나가 실패해도 나머지는 계속 수집합니다. 다만 실패율이 30%를 넘으면 작업 전체를 실패로 보고 알림을 보냅니다.",
          ],
          result: "2026년 8월 11일 기준 파이썬 테스트 205개가 통과합니다. 토스증권 계좌를 조회하고 KRX 거래대금 상위 200종목과 일봉을 매일 적재합니다.",
          keywords: ["FastAPI", "SQLite·Parquet", "멱등 수집·실패 격리"],
          workRange: "구조 재설계 · API · 데이터 수집 · 자동화",
        },
        detail: {
          scope: ["여섯 모듈 구조와 검증 코드 이식", "계좌·KRX 수집과 로컬 저장", "조회 API·자동 실행·실패 알림"],
          workPoints: [
            "데이터, 종목 선정, 전략, 검증, 운용, 콘솔로 영역을 나누고 기존 코드에서 다시 쓸 검증 로직만 골라 옮겼습니다.",
            "OAuth2 토큰은 만료 전에 갱신하고, 429 응답을 받으면 Retry-After만큼 기다렸다가 한 번 다시 요청합니다.",
            "계좌는 날짜 기준으로 통째로 교체 저장하고 KRX 일봉은 종목·날짜 기준으로 upsert합니다. 같은 작업을 다시 돌려도 중복이 생기지 않습니다.",
          ],
        },
      },
    },
  },
  {
    id: "oneulsai",
    title: "오프라인 소개팅 운영 서비스(오늘사이)",
    shortTitle: "오늘사이",
    period: "2026.09 ~ 진행 중",
    category: "Personal Full Stack",
    focuses: ["all", "frontend", "backend"],
    stack: ["TypeScript", "NestJS", "Next.js", "PostgreSQL", "Prisma", "Turborepo", "Vitest", "Playwright"],
    card: {
      summary: "일요일 카페에서 7명과 1:1로 대화하고, 서로 선택한 경우에만 연결되는 오프라인 소개팅을 운영하기 위한 서비스입니다.",
      description: [
        "API Gateway 뒤에 회원, 일정, 매칭, 알림, 결제 서비스를 나누고 서비스마다 DB를 따로 둔 모노레포로 만들고 있습니다.",
        "지금은 가입과 로그인, 모임 일정 관리, 참가 신청까지 동작합니다. 결제, 체크인, 매칭은 다음 단계입니다.",
      ],
      result: "신청이 한꺼번에 몰려도 성별 정원을 넘기지 않는지 실제 PostgreSQL 통합 테스트로 확인합니다. 남은 자리 하나에 20명이 동시에 신청하면 성공은 1건입니다.",
      keywords: ["서비스별 DB 분리", "행 잠금으로 정원 지키기", "설계서 먼저"],
      visibility: "비공개 개인 프로젝트",
      workRange: "설계서 · 서비스 설계 · API · 참가자·운영자 웹 · 테스트",
      environment: "NestJS · Next.js · PostgreSQL · Prisma · GitHub Actions",
    },
    detail: {
      overview: "오프라인 로테이션 소개팅을 실제로 운영하기 위해 2026년 9월에 시작한 서비스입니다. 기능마다 설계서를 먼저 쓰고 확정한 뒤 구현합니다. 기반 정리, 회원과 인증, 모임 상품과 일정은 끝났고, 참가 신청은 구현을 마치고 검증하고 있습니다. 결제는 처음에는 계좌이체 입금 확인으로 운영할 예정입니다.",
      scope: ["서비스 경계와 설계서 작성", "Gateway 인증과 서비스 사이 호출 규칙", "회원·일정·참가 신청 API", "참가자 웹과 운영자 웹", "통합 테스트와 브라우저 E2E"],
      workPoints: [
        "외부 요청은 Gateway만 받습니다. Gateway가 JWT를 검증한 뒤 사용자 정보를 내부 헤더로 바꾸고 내부 토큰을 붙여 서비스에 넘깁니다.",
        "서비스마다 자기 DB만 씁니다. 다른 서비스의 데이터가 필요하면 REST로 묻고, 테이블이나 모델을 직접 참조하지 않습니다.",
        "참가 신청은 회차 행을 먼저 잠근 뒤 성별 인원을 세고 저장합니다. 잠금 대기는 2초로 제한해, 오래 잠금을 쥔 요청이 있어도 서비스 전체가 멈추지 않게 했습니다.",
      ],
      results: [
        "남은 남성 자리 하나에 20명이 동시에 신청하면 201은 1건이고, 나머지는 409나 503으로 끝납니다.",
        "같은 회원이 8번 동시에 눌러도 신청은 1건만 남습니다.",
        "참가자 웹에서 가입, 일정 보기, 참가 신청이, 운영자 웹에서 회원 조회, 회차 관리, 신청 취소가 동작합니다.",
      ],
      techUsage: [
        "NestJS 서비스 다섯 개와 Gateway, Next.js 웹 두 개를 pnpm·Turborepo 모노레포로 관리합니다.",
        "PostgreSQL 하나에 서비스별 논리 DB 다섯 개를 두고 Prisma로 스키마와 마이그레이션을 관리합니다.",
        "서비스 사이에 주고받는 요청·응답 타입은 공유 계약 패키지 하나에만 둡니다.",
        "Vitest 단위·통합 테스트와 Playwright 브라우저 E2E를 GitHub Actions에서 실행합니다.",
      ],
      disclosure: "비공개 개인 프로젝트라 저장소 링크는 없습니다. 설계서와 테스트에서 확인한 내용만 적었습니다. 설계서와 작업 규칙을 먼저 정하고, AI 코딩 에이전트와 함께 PR 단위로 구현과 검토를 진행합니다.",
      resources: [],
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
  description: "B2B 협력사 포털 PPS와 교육용 단말 운영 시스템 TSMS에서 요구사항 협의, 화면·서버·DB 개발, 검수와 배포를 맡고 있습니다.",
  responsibilities: [
    "요구사항 협의",
    "화면·서버·DB 개발",
    "검수·배포·운영 확인",
  ],
};

export const education = [
  { title: "아주대학교 e-비즈니스학과", period: "2018.03 ~ 2020.08", description: "학사 졸업", icon: "GraduationCap" },
  { title: "삼성 청년 SW 아카데미(SSAFY) 8기", period: "2022.07 ~ 2023.06", description: "웹 개발 과정 수료. 팀 프로젝트 세 개에서 프론트엔드를 맡았습니다.", icon: "Award" },
  { title: "California State University, Chico", period: "2014.01 ~ 2015.05", description: "Business Administration 전공 후 아주대학교 편입", icon: "GraduationCap" },
  { title: "SQLD", period: "2024.09", description: "SQL 개발자 자격 취득", icon: "Database" },
];

export const projects = featuredProjects;
