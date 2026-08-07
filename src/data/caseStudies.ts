export type CaseStudyCode = {
  language: string;
  title: string;
  content: string;
  note: string;
};

export type ProjectCaseStudy = {
  id: string;
  area: "Frontend" | "Backend" | "Full Stack" | "배포";
  title: string;
  summary: string;
  problem: string;
  constraint: string;
  decision: string;
  implementation: string[];
  outcome: string;
  code?: CaseStudyCode;
};

export const projectCaseStudies: Record<"pps" | "tsms", ProjectCaseStudy[]> = {
  pps: [
    {
      id: "archive-job",
      area: "Full Stack",
      title: "대량 첨부파일 다운로드를 작업 단위로 분리",
      summary: "오래 대기하던 요청을 작업 ID와 상태 조회 방식으로 바꿨습니다.",
      problem:
        "첨부파일 300~400건을 한 번에 압축하면 HTTP 요청이 오래 유지됐고, 사용자는 작업이 진행 중인지 실패했는지 알기 어려웠습니다.",
      constraint:
        "기존 파일 선택과 다운로드 방식은 유지하면서 새로고침, 실패, 결과 파일 만료까지 화면과 서버가 같은 작업을 식별해야 했습니다.",
      decision:
        "압축 실행을 브라우저 요청에서 분리하고, 서버가 발급한 작업 ID를 기준으로 진행 상태와 결과 파일을 연결했습니다.",
      implementation: [
        "압축 요청은 작업 ID를 먼저 반환하고 실제 압축은 별도 실행기에서 처리했습니다.",
        "화면은 2초 간격으로 대기·진행·완료·실패 상태를 확인하고 작업 ID를 브라우저에 보관했습니다.",
        "완료된 파일은 별도 요청으로 내려받고 오래된 결과 파일은 만료 정책에 따라 정리했습니다.",
      ],
      outcome:
        "장시간 HTTP 요청 점유를 줄이고, 사용자가 진행 상태를 확인한 뒤 새로고침 이후에도 같은 작업의 결과를 내려받을 수 있게 했습니다.",
      code: {
        language: "JavaScript",
        title: "작업 ID를 이용한 상태 확인 흐름",
        content: `const jobId = await startArchive(selectedIds);
sessionStorage.setItem("archiveJobId", jobId);

for (let count = 0; count < MAX_POLL_COUNT; count += 1) {
  const job = await getArchiveStatus(jobId);
  if (job.status === "DONE") return downloadArchive(jobId);
  if (job.status === "ERROR") throw new Error("압축 작업 실패");
  await delay(2_000);
}

showRetryGuide();`,
        note: "실제 사내 코드를 공개하지 않고 화면의 상태 확인과 종료 조건만 축약한 예시입니다.",
      },
    },
    {
      id: "vue-state-isolation",
      area: "Frontend",
      title: "Vue 화면 사이에 남던 공통 상태 분리",
      summary: "얕은 복사로 공유되던 중첩 객체를 화면마다 새로 만들도록 수정했습니다.",
      problem:
        "한 관리 화면에서 사용한 조회 조건과 제목 정보가 다른 화면에 남아, 화면을 이동한 뒤 이전 상태가 섞여 보이는 문제가 있었습니다.",
      constraint:
        "여러 화면이 같은 공통 스크립트를 사용하고 있어 공통 API는 유지하면서 각 Vue 인스턴스의 상태만 분리해야 했습니다.",
      decision:
        "초기 객체를 얕게 복사하는 대신, 화면이 생성될 때마다 중첩 객체까지 새로 반환하는 팩토리와 명시적인 초기화를 사용했습니다.",
      implementation: [
        "공통 고정 객체를 복사하던 초기화 코드를 인스턴스별 상태 생성 함수로 교체했습니다.",
        "검색 조건과 화면 제목처럼 중첩된 상태도 매번 새로운 참조를 갖도록 구성했습니다.",
        "화면을 다시 열거나 탭을 전환할 때 필요한 상태를 명시적으로 초기화했습니다.",
      ],
      outcome:
        "서로 다른 관리 화면이 중첩 상태를 공유하지 않게 되어 이전 화면의 조회 조건과 표시 값이 남는 문제를 제거했습니다.",
      code: {
        language: "JavaScript",
        title: "인스턴스마다 새로운 상태 반환",
        content: `const createInitialState = () => ({
  filters: { keyword: "", status: "ALL" },
  selectedRows: [],
  pageTitle: { main: "", sub: "" },
});

export const createCommonData = () => createInitialState();

// 화면을 다시 열 때도 같은 기준으로 초기화
Object.assign(vm.$data, createInitialState());`,
        note: "실제 변수명과 업무 값은 일반적인 이름으로 바꿔 상태 분리 원리만 보여주는 예시입니다.",
      },
    },
    {
      id: "account-issuance",
      area: "Full Stack",
      title: "분리돼 있던 본사 계정 발급 절차 통합",
      summary: "여러 시스템과 수동 입력을 오가던 절차를 하나의 관리 화면으로 모았습니다.",
      problem:
        "사내 계정과 포털 계정을 각각 만든 뒤 발급 결과를 DB에 따로 반영해야 해 누락과 정보 불일치 가능성이 있었습니다.",
      constraint:
        "조직·아이디 검증과 두 시스템의 처리 결과가 일치해야 했고, 실패했을 때 불완전한 계정 정보가 남지 않아야 했습니다.",
      decision:
        "포털을 단일 발급 창구로 정하고 사전 검증, 계정 생성, 사내 시스템 전달을 하나의 업무 흐름으로 묶었습니다.",
      implementation: [
        "부서·직급과 아이디 중복을 먼저 확인하고 필수 정보가 갖춰졌을 때만 저장할 수 있게 했습니다.",
        "사용자와 사원 정보를 같은 트랜잭션 범위에서 저장하고 처리 실패 시 변경을 취소하도록 구성했습니다.",
        "생성·수정·인증 정보 재발송을 한 화면에서 처리하고 사내 시스템 전달 결과를 함께 확인하도록 했습니다.",
      ],
      outcome:
        "사내 계정 생성, 포털 계정 생성, 별도 DB 반영으로 나뉘어 있던 절차를 한 화면의 발급 흐름으로 통합했습니다.",
    },
    {
      id: "notification-policy",
      area: "Backend",
      title: "알림톡 발송 조건과 수신자 처리 공통화",
      summary: "기능마다 흩어져 있던 발송 정책을 공통 서비스와 설정으로 옮겼습니다.",
      problem:
        "알림톡을 보내는 기능마다 발송 조건과 수신자 정보가 따로 작성돼 정책이 바뀔 때 여러 코드를 함께 수정해야 했습니다.",
      constraint:
        "업무별 발송 시점은 유지하면서 중복 수신자를 제거하고, 운영 중에도 발송 여부와 대상을 조정할 수 있어야 했습니다.",
      decision:
        "자주 바뀌는 발송 정책은 DB 설정으로 분리하고, 각 업무 기능은 공통 발송 서비스를 호출하도록 정리했습니다.",
      implementation: [
        "업무 기능에 분산된 수신자 조회와 발송 호출을 공통 서비스로 전환했습니다.",
        "발송 유형별 사용 여부와 수신자 조건을 DB에서 조회하고 중복 수신자를 제거했습니다.",
        "발송 여부와 수신자 선택처럼 결과에 영향을 주는 주요 분기를 단위 테스트로 확인했습니다.",
      ],
      outcome:
        "발송 정책이 바뀌면 여러 업무 코드를 수정하는 대신 공통 설정을 조정할 수 있는 구조를 만들었습니다.",
    },
    {
      id: "jenkins-deployment",
      area: "배포",
      title: "반복하던 배포 순서를 Jenkins 작업으로 정리",
      summary: "빌드·전송·백업·두 서버 배포 순서를 같은 방식으로 실행하게 했습니다.",
      problem:
        "소스 반영부터 빌드, 파일 전송, 기존 파일 백업과 두 서버 배포를 수동으로 반복해 단계 누락 여부를 매번 확인해야 했습니다.",
      constraint:
        "전용 배포 서버가 없는 환경에서 기존 서버 구성과 배포 순서를 유지하면서 개발·운영 환경에 같은 절차를 적용해야 했습니다.",
      decision:
        "사람의 기억에 의존하던 실행 순서를 Jenkins 작업과 스크립트에 고정하고 실행 결과를 남기도록 했습니다.",
      implementation: [
        "소스 반영, Gradle 빌드, 서버 전송과 기존 파일 백업을 순서대로 연결했습니다.",
        "두 WAS는 한 번에 교체하지 않고 정해진 순서대로 배포하도록 스크립트를 구성했습니다.",
        "개발·운영 작업을 분리하고 각 단계의 성공 여부와 실행 기록을 Jenkins에서 확인하도록 했습니다.",
      ],
      outcome:
        "반복 배포를 같은 순서로 실행하고 단계별 결과를 확인할 수 있게 해 수동 작업의 누락 가능성을 줄였습니다.",
    },
  ],
  tsms: [
    {
      id: "external-api-proxy",
      area: "Full Stack",
      title: "외부 API 키 노출 제거와 호출 경로 공통화",
      summary: "25개 화면의 브라우저 호출을 서버 공통 경로로 옮겼습니다.",
      problem:
        "주소 검색과 교육행정정보 연동 키가 브라우저 코드에 포함돼 있었고, 연동 정보가 바뀔 때 관련 화면을 각각 수정해야 했습니다.",
      constraint:
        "기존 25개 화면의 입력과 응답 형식을 유지하면서 키와 외부 연동 주소를 사용자에게 노출하지 않아야 했습니다.",
      decision:
        "키만 교체하면 같은 문제가 반복되므로 외부 API 호출 책임을 화면에서 서버로 옮기고 설정을 한곳에서 관리했습니다.",
      implementation: [
        "외부 API 요청을 대신 처리하는 공통 Controller와 Service를 추가했습니다.",
        "키와 외부 URL은 서버 설정으로 분리하고 화면에는 필요한 응답만 전달했습니다.",
        "25개 WebSquare 화면의 요청 경로와 오류 처리를 공통 응답 형식에 맞췄습니다.",
      ],
      outcome:
        "브라우저에서 확인할 수 있던 API 키를 서버로 회수하고, 연동 정보의 변경 지점을 화면별 코드가 아닌 공통 서버 경로로 모았습니다.",
    },
    {
      id: "resale-monitoring",
      area: "Full Stack",
      title: "중고거래 게시글 모니터링 업무 전산화",
      summary: "외부 사이트에 직접 요청하지 않고 URL 문자열만 분석해 기록과 중복을 관리했습니다.",
      problem:
        "운영팀이 여러 중고거래 플랫폼을 키워드·지역별로 반복 검색하고 의심 게시물, 캡처와 조치 내용을 따로 관리했습니다.",
      constraint:
        "내부 보안과 외부 사이트 정책 때문에 서버 요청이나 iframe으로 게시글을 가져올 수 없어 사람의 육안 확인이 필요했습니다.",
      decision:
        "검색과 게시글 확인은 새 탭에서 수행하고, 검수자가 붙여넣은 URL 문자열만 서버에서 분석하는 방식으로 범위를 정했습니다.",
      implementation: [
        "프래그먼트와 추적 파라미터를 제거한 뒤 사이트별 규칙으로 플랫폼과 게시글 ID를 찾았습니다.",
        "사이트 코드·게시글 ID를 우선 사용하고 ID가 없으면 정규화한 전체 URL로 중복을 확인했습니다.",
        "검색 링크, 게시글 링크와 캡처본, 판매 정보, 처리 이력을 한 업무 흐름으로 연결했습니다.",
      ],
      outcome:
        "외부 사이트에 직접 접속하지 않으면서 반복 검색 이후의 기록, 중복 확인과 조치 이력을 시스템에서 관리할 수 있게 했습니다.",
      code: {
        language: "Java",
        title: "URL 문자열 분석의 핵심 흐름",
        content: `String normalized = normalizeUrl(inputUrl);
SiteRule site = findMatchingRule(normalized);
String postId = extractPostId(site.getPostIdPattern(), normalized);

return postId != null
    ? existsBySiteAndPostId(site.getSiteCode(), postId)
    : existsByNormalizedUrl(normalized);`,
        note: "실제 테이블명·정규식·사이트 주소를 제외하고 문자열 처리 순서만 Java 형태로 축약했습니다. 외부 사이트 요청은 발생하지 않습니다.",
      },
    },
    {
      id: "device-qr-validation",
      area: "Backend",
      title: "대량 단말 등록 검증과 QR 발급",
      summary: "생산입고 정보와 기등록 상태를 저장 전에 확인하도록 검증 순서를 앞당겼습니다.",
      problem:
        "엑셀로 단말을 등록할 때 생산입고 내역에 없거나 다른 학교·사용자에게 이미 등록된 일련번호가 함께 들어올 수 있었습니다.",
      constraint:
        "정상 데이터의 일괄 등록은 유지하면서 오류 단말은 저장 전에 구분하고 기존 소유 정보를 운영자에게 알려야 했습니다.",
      decision:
        "등록 후 오류를 정리하기보다 저장 전에 기준 데이터와 타인 등록 여부를 확인해 잘못된 반영을 막았습니다.",
      implementation: [
        "입력 일련번호를 생산입고 마스터와 대조하고 존재하지 않는 단말은 오류 목록으로 반환했습니다.",
        "기등록 단말은 기존 학교와 사용자 정보를 함께 반환해 충돌 원인을 바로 확인하게 했습니다.",
        "QR에는 DB 식별자를 직접 넣지 않고 외부 노출용 토큰을 사용했습니다.",
      ],
      outcome:
        "대량 등록 단계에서 오류 단말을 먼저 구분하고 QR에 내부 식별자가 그대로 노출되지 않게 했습니다. 이 기능은 약 11만 대의 단말 정보를 다루는 운영 업무에 사용되고 있습니다.",
    },
    {
      id: "field-inspection",
      area: "Full Stack",
      title: "현장 점검과 재점검 이력 관리",
      summary: "종이 점검표와 여러 차수의 재방문 이력을 학교·단말 기준으로 연결했습니다.",
      problem:
        "종이 점검표로는 학교별 진행 상황을 한눈에 확인하기 어려웠고, 분실·미지참 단말의 2·3차 재방문 이력도 이어서 관리할 수 없었습니다.",
      constraint:
        "한 번에 모든 단말을 점검할 수 없는 현장 상황과 학교·단말별 여러 점검 회차, 서명과 결과 문서를 함께 처리해야 했습니다.",
      decision:
        "학교의 완료 여부만 저장하지 않고 단말별 점검 회차와 결과가 다음 방문으로 이어지는 구조로 정리했습니다.",
      implementation: [
        "역할과 진행 상태에 따라 입력·조회 모드를 나누고 필수값 누락 시 첫 오류 항목으로 이동하도록 했습니다.",
        "미완료 단말은 다음 점검 차수로 넘기고 이전 사유와 결과를 함께 조회하도록 연결했습니다.",
        "터치 서명, 미저장 이동 경고와 확인서·결과 파일 발급을 같은 점검 흐름에 포함했습니다.",
      ],
      outcome:
        "학교·단말별 점검과 재점검 이력을 한 시스템에서 관리하게 됐습니다. 2026년 7월 기준 119개 대상 학교에서 약 3,800건의 점검 데이터가 기록됐습니다.",
    },
  ],
};

export const hasProjectCaseStudies = (projectId: string): projectId is keyof typeof projectCaseStudies =>
  Object.prototype.hasOwnProperty.call(projectCaseStudies, projectId);
