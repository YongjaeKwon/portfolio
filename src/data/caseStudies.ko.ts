export type CaseStudyCode = {
  language: string;
  title: string;
  content: string;
  note: string;
};

export type ProjectCaseStudy = {
  id: string;
  area: "Frontend" | "Backend" | "Full Stack" | "배포" | "Deployment";
  title: string;
  summary: string;
  problem: string;
  constraint: string;
  decision: string;
  implementation: string[];
  outcome: string;
  code?: CaseStudyCode;
};

export type CaseStudyProjectId = "pps" | "tsms" | "ticketrush" | "ssafast" | "ddoing" | "modac" | "reachrich";

export const projectCaseStudies: Record<CaseStudyProjectId, ProjectCaseStudy[]> = {
  pps: [
    {
      id: "archive-job",
      area: "Full Stack",
      title: "대량 첨부파일 다운로드를 별도 작업으로 분리",
      summary: "오래 붙잡혀 있던 요청을 작업 ID와 상태 조회 방식으로 바꿨습니다.",
      problem:
        "첨부파일 300~400건을 한 번에 압축하면 HTTP 요청이 오래 열려 있었고 사용자는 작업이 진행 중인지 실패했는지 알 수 없었습니다.",
      constraint:
        "파일을 고르고 내려받는 기존 방식은 그대로 두어야 했습니다. 새로고침, 실패, 결과 파일 만료가 생겨도 화면과 서버가 같은 작업을 가리켜야 했습니다.",
      decision:
        "압축 실행을 브라우저 요청에서 떼어 내고 서버가 내준 작업 ID로 진행 상태와 결과 파일을 찾게 했습니다.",
      implementation: [
        "압축 요청은 작업 ID부터 돌려주고 실제 압축은 별도 실행기에서 합니다. 작업 상태는 두 서버가 함께 보는 분산 맵에 저장했습니다.",
        "화면은 2초마다 대기, 진행, 완료, 실패 상태를 확인하고 작업 ID를 브라우저에 보관합니다.",
        "완료된 파일은 별도 요청으로 내려받고 오래된 결과 파일은 만료 정책에 따라 지웁니다.",
      ],
      outcome:
        "HTTP 요청이 오래 붙잡혀 있는 일이 줄었습니다. 사용자는 진행 상황을 보고 새로고침한 뒤에도 같은 작업의 결과를 내려받을 수 있습니다.",
      code: {
        language: "JavaScript",
        title: "작업 ID로 상태를 확인하는 순서",
        content: `const jobId = await startArchive(selectedIds);
sessionStorage.setItem("archiveJobId", jobId);

for (let count = 0; count < MAX_POLL_COUNT; count += 1) {
  const job = await getArchiveStatus(jobId);
  if (job.status === "DONE") return downloadArchive(jobId);
  if (job.status === "ERROR") throw new Error("압축 작업 실패");
  await delay(2_000);
}

showRetryGuide();`,
        note: "사내 코드를 그대로 싣지 않고 화면에서 상태를 확인하고 끝내는 조건만 줄여 옮긴 예시입니다.",
      },
    },
    {
      id: "password-reset-limiter",
      area: "Backend",
      title: "서버 두 대에서 같이 동작하는 인증번호 요청 제한",
      summary: "비밀번호 초기화 인증번호 발송에 서버 간 공유 쿨다운과 원자적 획득을 적용했습니다.",
      problem:
        "비밀번호를 초기화하면 인증번호가 알림톡으로 나가는데 반복 클릭이나 자동화된 요청을 막는 장치가 없었습니다. 서버가 두 대라 서버별 메모리로 제한하면 요청이 나뉘어 들어올 때 제한이 먹히지 않을 수 있었습니다.",
      constraint:
        "제한 상태를 두 서버가 함께 봐야 했습니다. 계정과 전화번호 같은 식별값을 제한 키에 원문 그대로 남기면 안 됐고 분산 저장소가 없는 로컬 환경에서도 같은 코드가 돌아야 했습니다.",
      decision:
        "이미 쓰고 있던 분산 맵에 TTL 쿨다운을 저장하고 동시에 들어온 요청 중 한 건만 통과하도록 원자적 획득 연산을 썼습니다. 제한 키에는 식별값의 해시만 넣었습니다.",
      implementation: [
        "분산 맵의 putIfAbsent로 쿨다운을 원자적으로 잡고 만료된 항목은 조건부 삭제로 지워 동시 획득이 서로 덮어쓰지 않게 했습니다.",
        "제한 키는 계정과 전화번호를 정규화한 뒤 SHA-256 해시로 만들어 원문이 남지 않게 했습니다.",
        "분산 저장소가 없으면 로컬 맵을 쓰고 화면에는 남은 대기 시간을 돌려줘 언제 다시 시도할지 알려 줍니다.",
        "만료 직후 획득, 동시 요청 경쟁 같은 경계 조건은 단위 테스트로 고정했습니다.",
      ],
      outcome:
        "어느 서버로 요청해도 같은 제한이 걸리고 사용자는 남은 대기 시간을 안내받습니다. 핵심 분기는 단위 테스트 30건으로 확인했습니다.",
      code: {
        language: "Java",
        title: "분산 맵에서 쿨다운을 원자적으로 획득",
        content: `public Decision tryAcquire(String key) {
  while (true) {
    long now = clock.millis();
    Long current = cooldowns.putIfAbsent(key, now + ttlMillis, ttlSeconds, SECONDS);
    if (current == null) return Decision.permit();
    if (current > now) return Decision.reject(remainingSeconds(current, now));
    // TTL 정리가 늦어도 동시 획득을 덮어쓰지 않도록 조건부 삭제
    cooldowns.remove(key, current);
  }
}`,
        note: "실제 구현에서 키 해시와 로컬 맵 대체 처리를 빼고 쿨다운을 원자적으로 잡는 핵심 반복문만 옮긴 예시입니다.",
      },
    },
    {
      id: "vue-state-isolation",
      area: "Frontend",
      title: "Vue 화면 사이에 남던 공통 상태 분리",
      summary: "얕은 복사로 공유되던 중첩 객체를 화면마다 새로 만들게 고쳤습니다.",
      problem:
        "한 관리 화면에서 쓴 조회 조건과 제목 정보가 다른 화면에 남았습니다. 새 CE를 등록할 때는 직전에 조회한 CE의 첨부파일 그룹이 화면에 남아, 이전 사람의 첨부파일이 새 데이터에 연결될 수 있었습니다.",
      constraint:
        "여러 화면이 같은 공통 스크립트를 쓰고 있어서 공통 API는 그대로 두고 Vue 인스턴스마다 상태만 떼어 내야 했습니다.",
      decision:
        "초기 객체를 얕게 복사하던 방식을 버리고 화면이 만들어질 때마다 중첩 객체까지 새로 돌려주는 함수와 명시적인 초기화를 썼습니다.",
      implementation: [
        "공통 고정 객체를 복사하던 초기화 코드를 인스턴스별 상태 생성 함수로 바꿨습니다.",
        "검색 조건과 화면 제목처럼 중첩된 상태도 매번 새 참조를 갖게 했습니다.",
        "등록, 상세 조회, 조회 실패 때 첨부 상태를 명시적으로 초기화합니다.",
        "서버는 이미 다른 CE가 쓰는 첨부파일 그룹이면 저장을 거부하도록 검증을 추가했습니다.",
      ],
      outcome:
        "관리 화면끼리 중첩 상태를 공유하지 않게 됐고 화면에서 놓쳐도 서버가 잘못된 첨부파일 연결을 한 번 더 막습니다.",
      code: {
        language: "JavaScript",
        title: "인스턴스마다 새 상태 반환",
        content: `const createInitialState = () => ({
  filters: { keyword: "", status: "ALL" },
  selectedRows: [],
  pageTitle: { main: "", sub: "" },
});

export const createCommonData = () => createInitialState();

// 화면을 다시 열 때도 같은 기준으로 초기화
Object.assign(vm.$data, createInitialState());`,
        note: "실제 변수명과 업무 값은 일반적인 이름으로 바꿨습니다. 상태를 나누는 원리만 보여 주는 예시입니다.",
      },
    },
    {
      id: "account-issuance",
      area: "Full Stack",
      title: "나뉘어 있던 본사 계정 발급 절차 통합",
      summary: "여러 시스템과 수동 입력을 오가던 절차를 관리 화면 하나로 모았습니다.",
      problem:
        "사내 계정과 포털 계정을 따로 만든 뒤 발급 결과를 DB에 또 반영해야 해서 빠뜨리거나 정보가 어긋날 수 있었습니다.",
      constraint:
        "조직과 아이디 검증, 두 시스템의 처리 결과가 서로 맞아야 했고 실패했을 때 반쯤 만들어진 계정 정보가 남으면 안 됐습니다.",
      decision:
        "포털을 유일한 발급 창구로 정하고 사전 검증, 계정 생성, 사내 시스템 전달을 한 번에 처리하게 했습니다.",
      implementation: [
        "부서, 직급, 아이디 중복을 먼저 확인하고 필수 정보가 다 있을 때만 저장할 수 있게 했습니다.",
        "사용자와 사원 정보를 한 트랜잭션에서 저장하고 처리에 실패하면 변경을 되돌립니다.",
        "생성, 수정, 인증 정보 재발송을 한 화면에서 처리하고 사내 시스템 전달 결과도 같이 보여 줍니다.",
      ],
      outcome:
        "사내 계정 생성, 포털 계정 생성, 별도 DB 반영으로 나뉘어 있던 절차가 한 화면의 발급 기능으로 합쳐졌습니다.",
    },
    {
      id: "notification-policy",
      area: "Backend",
      title: "알림톡 발송 조건과 수신자 처리 공통화",
      summary: "기능마다 흩어져 있던 발송 정책을 공통 서비스와 설정으로 옮겼습니다.",
      problem:
        "알림톡을 보내는 기능마다 발송 조건과 수신자 정보가 따로 작성돼 있어, 정책이 바뀌면 여러 코드를 같이 고쳐야 했습니다.",
      constraint:
        "업무별 발송 시점은 그대로 두면서 중복 수신자를 빼야 했고 운영 중에도 발송 여부와 대상을 바꿀 수 있어야 했습니다.",
      decision:
        "자주 바뀌는 발송 정책은 DB 설정으로 빼고 각 업무 기능은 공통 발송 서비스를 부르게 했습니다.",
      implementation: [
        "업무 기능마다 흩어져 있던 수신자 조회와 발송 호출을 공통 서비스로 옮겼습니다.",
        "발송 유형별 사용 여부와 수신자 조건을 DB에서 읽고 중복 수신자를 뺍니다.",
        "발송 여부와 수신자 선택처럼 결과를 바꾸는 주요 분기는 단위 테스트로 확인했습니다.",
      ],
      outcome:
        "발송 정책이 바뀌어도 여러 업무 코드를 고치지 않고 공통 설정만 바꾸면 됩니다.",
    },
    {
      id: "jenkins-deployment",
      area: "배포",
      title: "손으로 반복하던 배포 순서를 Jenkins 작업으로 정리",
      summary: "빌드, 전송, 백업, 두 서버 배포를 매번 같은 순서로 실행하게 했습니다.",
      problem:
        "소스 반영, 빌드, 파일 전송, 기존 파일 백업, 두 서버 배포를 손으로 반복하다 보니 빠뜨린 단계가 없는지 매번 확인해야 했습니다.",
      constraint:
        "전용 배포 서버가 없었습니다. 기존 서버 구성과 배포 순서는 그대로 두고 개발·운영 환경에 같은 절차를 적용해야 했습니다.",
      decision:
        "사람이 기억하던 실행 순서를 Jenkins 작업과 스크립트에 박아 두고 실행 기록을 남기게 했습니다.",
      implementation: [
        "소스 반영, Gradle 빌드, 서버 전송, 기존 파일 백업을 순서대로 이었습니다.",
        "WAS 두 대는 한 번에 바꾸지 않고 정해진 순서대로 배포하도록 스크립트를 짰습니다.",
        "개발·운영 작업을 나누고 단계별 성공 여부와 실행 기록을 Jenkins에서 보게 했습니다.",
      ],
      outcome:
        "배포를 늘 같은 순서로 실행하고 단계별 결과를 확인할 수 있어, 손으로 할 때 생기던 누락 가능성이 줄었습니다.",
    },
  ],
  tsms: [
    {
      id: "external-api-proxy",
      area: "Full Stack",
      title: "브라우저에 드러난 외부 API 키 제거와 호출 경로 공통화",
      summary: "25개 화면이 브라우저에서 하던 외부 호출을 서버 공통 경로로 옮겼습니다.",
      problem:
        "주소 검색과 교육행정정보시스템(NEIS) 연동 키가 브라우저 코드에 들어 있었고 연동 정보가 바뀌면 관련 화면을 하나하나 고쳐야 했습니다.",
      constraint:
        "기존 25개 화면의 입력과 응답 형식은 그대로 두면서 키와 외부 연동 주소는 사용자에게 보이지 않아야 했습니다.",
      decision:
        "키만 바꾸면 같은 문제가 되풀이되므로 외부 API 호출을 서버로 옮기고 설정은 한곳에서 관리했습니다.",
      implementation: [
        "외부 API 요청을 대신 처리하는 공통 Controller와 Service를 추가했습니다.",
        "키와 외부 URL은 서버 설정으로 빼고 화면에는 필요한 응답만 넘깁니다.",
        "25개 WebSquare 화면의 요청 경로와 오류 처리를 공통 응답 형식에 맞췄습니다.",
      ],
      outcome:
        "브라우저에서 보이던 API 키를 서버로 옮겼습니다. 연동 정보가 바뀌어도 화면마다 고칠 필요 없이 서버 한 곳만 고치면 됩니다.",
    },
    {
      id: "view-query-rewrite",
      area: "Backend",
      title: "60초 안에 끝나지 않던 통합 뷰 조회 재작성",
      summary: "실행계획이 크게 불어나던 뷰 조회를 기본 테이블 조인으로 바꿔 밀리초 단위로 줄였습니다.",
      problem:
        "A/S 이력과 정산 세부현황 조회가 여러 테이블을 합친 통합 뷰를 거쳤는데 데이터가 쌓이면서 화면이 수십 초씩 기다릴 만큼 느려졌습니다.",
      constraint:
        "화면의 조회 조건과 표시 항목은 그대로 둬야 했고 같은 뷰를 쓰는 다른 화면에 영향을 주면 안 됐습니다.",
      decision:
        "실행계획을 보니 고객 조건이 뷰 안까지 전달되지 않아, 뷰 전체를 만든 뒤에 거르고 있었습니다. 인덱스를 더하는 대신 화면이 실제로 쓰는 컬럼만 기본 테이블 조인으로 다시 쓰기로 했습니다.",
      implementation: [
        "통합 뷰 대신 기본 테이블을 직접 조인해 고객 조건이 처음부터 인덱스를 타게 했습니다.",
        "화면이 쓰는 컬럼만 남기고 최신 처리 이력은 서브쿼리로 붙여 결과 구성을 똑같이 맞췄습니다.",
        "바꾸기 전후 쿼리를 같은 파라미터로 실행해 결과 행이 일치하는지 비교했습니다.",
      ],
      outcome:
        "운영 DB에서 다시 재 보니(2026.09, 이력이 가장 많은 고객 기준) 기존 쿼리는 60초 안에 끝나지 않았고 새 쿼리는 63~69ms에 같은 결과를 돌려줬습니다(최소 약 870배).",
    },
    {
      id: "resale-monitoring",
      area: "Full Stack",
      title: "중고거래 게시글 모니터링 업무 전산화",
      summary: "외부 사이트에 요청하지 않고 URL 문자열만 분석해 기록과 중복을 관리했습니다.",
      problem:
        "운영팀이 여러 중고거래 플랫폼을 키워드와 지역별로 반복 검색하고 의심 게시글과 캡처, 조치 내용을 따로 관리하고 있었습니다.",
      constraint:
        "내부 보안과 외부 사이트 정책 때문에 서버 요청이나 iframe으로 게시글을 가져올 수 없어, 사람이 눈으로 확인해야 했습니다.",
      decision:
        "검색과 게시글 확인은 새 탭에서 하고 서버는 검수자가 붙여넣은 URL 문자열만 분석하도록 범위를 정했습니다.",
      implementation: [
        "프래그먼트와 추적 파라미터를 지운 뒤 사이트별 규칙으로 플랫폼과 게시글 ID를 찾습니다.",
        "사이트 코드와 게시글 ID로 먼저 중복을 확인하고 ID가 없으면 정규화한 전체 URL로 확인합니다.",
        "검색 링크, 게시글 링크와 캡처본, 판매 정보, 처리 이력을 한 업무 화면에서 이어서 다룹니다.",
      ],
      outcome:
        "외부 사이트에 접속하지 않고도, 검색 이후의 기록과 중복 확인, 조치 이력을 시스템에서 관리하게 됐습니다.",
      code: {
        language: "Java",
        title: "URL 문자열 분석의 핵심 순서",
        content: `String normalized = normalizeUrl(inputUrl);
SiteRule site = findMatchingRule(normalized);
String postId = extractPostId(site.getPostIdPattern(), normalized);

return postId != null
    ? existsBySiteAndPostId(site.getSiteCode(), postId)
    : existsByNormalizedUrl(normalized);`,
        note: "실제 테이블명, 정규식, 사이트 주소를 빼고 문자열 처리 순서만 Java로 줄여 옮겼습니다. 외부 사이트 요청은 없습니다.",
      },
    },
    {
      id: "device-qr-validation",
      area: "Backend",
      title: "대량 단말 등록 검증과 QR 발급",
      summary: "생산입고 정보와 기등록 여부를 저장 전에 확인하도록 검증 순서를 앞당겼습니다.",
      problem:
        "엑셀로 단말을 등록할 때 생산입고 내역에 없거나, 이미 다른 학교나 사용자에게 등록된 일련번호가 섞여 들어올 수 있었습니다.",
      constraint:
        "정상 데이터는 그대로 일괄 등록하면서 오류 단말은 저장 전에 골라내고 기존 소유 정보를 운영자에게 알려야 했습니다.",
      decision:
        "저장 전에 기준 데이터와 다른 사람 등록 여부부터 확인해 잘못된 등록을 막았습니다.",
      implementation: [
        "입력한 일련번호를 생산입고 마스터와 대조하고 없는 단말은 오류 목록으로 돌려줍니다.",
        "이미 등록된 단말은 기존 학교와 사용자 정보를 같이 돌려줘 충돌 원인을 바로 볼 수 있게 했습니다.",
        "QR에는 DB 식별자 대신 외부 노출용 ID를 넣었습니다.",
      ],
      outcome:
        "대량 등록 단계에서 오류 단말을 먼저 골라내고 QR에 내부 식별자가 드러나지 않게 했습니다. 이 기능은 약 11만 대의 단말 정보를 다루는 운영 업무에 쓰이고 있고 QR은 전체 111,593대 중 108,237대에 발급됐습니다.",
    },
    {
      id: "field-inspection",
      area: "Full Stack",
      title: "현장 점검과 재점검 이력 관리",
      summary: "종이 점검표와 여러 차례의 재방문 이력을 학교와 단말 기준으로 이었습니다.",
      problem:
        "종이 점검표로는 학교별 진행 상황을 한눈에 보기 어려웠고 분실·미지참 단말의 2·3차 재방문 이력도 이어서 관리할 수 없었습니다.",
      constraint:
        "한 번에 모든 단말을 점검할 수 없는 현장 사정에 맞춰, 학교와 단말별 여러 점검 회차와 서명, 결과 문서를 함께 다뤄야 했습니다.",
      decision:
        "학교의 완료 여부만 저장하지 않고 단말별 점검 회차와 결과가 다음 방문으로 이어지게 했습니다.",
      implementation: [
        "역할과 진행 상태에 따라 입력 모드와 조회 모드를 나누고 필수값이 비면 첫 오류 항목으로 이동합니다.",
        "미완료 단말은 다음 점검 회차로 넘기고 이전 사유와 결과를 함께 조회하게 했습니다.",
        "터치 서명, 저장하지 않고 나갈 때의 경고 확인서와 결과 파일 발급을 같은 점검 화면에 넣었습니다.",
      ],
      outcome:
        "학교와 단말별 점검, 재점검 이력을 한 시스템에서 관리합니다. 2026년 9월 기준 대상 119개교 중 71개교에서 점검표 14,882건이 저장돼 있습니다.",
    },
    {
      id: "inspection-data-rekey",
      area: "Backend",
      title: "운영 중인 점검 데이터의 일련번호 기준 바로잡기",
      summary: "섞여 있던 일련번호 기준을 바로잡고 백업·롤백 절차를 갖춰 운영 데이터의 중복을 정리했습니다.",
      problem:
        "점검 대상이 입력용 14자리 일련번호로 저장돼 15자리 전체 일련번호와 섞여 있었습니다. 같은 번호 후보가 여러 건이면 엉뚱한 단말에 연결되거나 중복 저장될 수 있었습니다.",
      constraint:
        "이미 운영 중이라 화면만 고쳐서는 쌓인 데이터가 정리되지 않았고 저장된 점검 결과와 상세 정보는 하나도 잃으면 안 됐습니다.",
      decision:
        "저장 기준을 15자리 전체 일련번호로 바꿨습니다. 기존 데이터는 점검 결과를 살린 채 정리하되, 운영에 반영하기 전에 되돌릴 방법을 먼저 준비했습니다.",
      implementation: [
        "저장 기준을 15자리로 바꾸고 14자리 입력은 후보를 찾은 뒤 학교 배정 정보로 확정합니다.",
        "학년, 반, 번호와 점검 이력 우선순위로 중복을 가려내는 SQL을 써서, 결과는 남기고 중복 행만 지웠습니다.",
        "운영 반영 전 백업과 롤백, 반영 후 검증 SQL을 준비해 순서대로 실행했습니다.",
      ],
      outcome:
        "점검 결과를 잃지 않고 중복을 지웠고 ID 기준으로 고쳐 같은 문제가 다시 쌓이지 않게 했습니다. 2026년 7월 운영 DB에 반영했습니다.",
    },
    {
      id: "parent-enrollment",
      area: "Frontend",
      title: "학부모가 로그인 없이 쓰는 공개 접수 화면",
      summary: "네 교육청의 동의서, QR 확인, 배송 예약 화면을 휴대폰 기준으로 만들었습니다.",
      problem:
        "단말 대여 동의, 배송 희망일 예약, QR 배부 확인을 학부모가 직접 해야 했습니다. 로그인 없는 공개 화면이라 마감 뒤 제출, 중복 제출, 휴대폰 표시 문제를 화면에서 걸러야 했습니다.",
      constraint:
        "접수 기간과 마감 시각이 교육청마다 달랐고 기간 중에도 일정이 바뀌었습니다. 학부모 대부분이 휴대폰으로 들어와 관리자 화면과는 다른 기준이 필요했습니다.",
      decision:
        "안내 문구, 오류 화면, 마감·잠금 처리를 먼저 챙기고 휴대폰 화면을 기본으로 설계했습니다. 접수 기간 중 일정 변경 요청은 그날 반영하는 것을 원칙으로 했습니다.",
      implementation: [
        "제주, 세종, 경기, 강원 교육청의 동의서 작성, QR 배부 확인, 배송 희망일 예약 화면을 개발했습니다.",
        "마감 시각이 지나면 제출을 잠그고 뒤로 가기를 막았습니다. 응답을 해석하지 못하면 전용 오류 화면으로 넘어갑니다.",
        "다크 모드에서 QR이 인식되지 않던 문제는 QR 영역에 밝은 배경을 고정해 해결했습니다.",
      ],
      outcome:
        "학부모가 안내만 보고 접수를 마칠 수 있는 화면으로 여러 접수 기간을 운영했고 기간 중 일정 변경과 마감 요청도 그날 반영했습니다.",
    },
  ],
  ticketrush: [
    {
      id: "three-layer-defense",
      area: "Backend",
      title: "선점, 만료 규칙, 기본키로 나눈 좌석 중복 확정 방지",
      summary: "빠른 선점, 도메인 규칙, DB 기본키가 각자 다른 실패를 막도록 역할을 나눴습니다.",
      problem:
        "동시 요청이 몰리는 선착순 예매에서 한 곳에서만 막으면, 그곳이 실패하는 순간 같은 좌석이 두 번 팔릴 수 있습니다.",
      constraint:
        "선점은 빠르게 응답해야 했습니다. Redis 데이터 유실이나 선점 만료처럼 앞단이 실패해도 최종 확정은 한 건이어야 했습니다.",
      decision:
        "속도는 Redis SET NX 선점, 결제 가능 여부는 도메인 규칙, 최종 확정은 MySQL (회차, 좌석) 기본키가 맡도록 나눴습니다.",
      implementation: [
        "Redis SET NX EX로 5분간 선점해, 동시 요청 중 첫 한 건만 좌석을 잡게 했습니다.",
        "선점이 만료됐거나 없으면 도메인 규칙이 결제를 거절합니다.",
        "confirmed_seat 테이블의 (회차, 좌석) 기본키 때문에 같은 좌석의 두 번째 INSERT는 DB가 거부합니다.",
      ],
      outcome:
        "좌석 하나에 동시 요청 100건을 보내는 테스트에서 성공은 1건입니다. 선점 정보가 사라진 경우에도 DB 기본키가 두 번째 확정을 막습니다.",
      code: {
        language: "Java",
        title: "선점과 최종 확정의 역할 분리",
        content: `boolean held = redis.setIfAbsent(seatKey(showId, seatId), holdToken, HOLD_TTL);
if (!held) throw new SeatAlreadyHeldException();

// 결제 시점: 만료된 홀드는 도메인 규칙이 거부
hold.ensureActive(clock.now());

// 최종 확정: (회차, 좌석) 기본키가 두 번째 INSERT를 거부
confirmedSeatRepository.insert(showId, seatId, reservationId);`,
        note: "공개 저장소의 실제 처리에서 예외 처리와 트랜잭션 경계를 빼고 세 곳이 각각 막는 지점만 순서대로 보여 주는 예시입니다.",
      },
    },
    {
      id: "redis-outage-proof",
      area: "Backend",
      title: "Redis 선점 정보가 사라진 상황을 테스트로 재현",
      summary: "선점 키를 지워 같은 좌석에 선점 10건을 만들어도 확정은 1건만 남는지 통합 테스트로 확인했습니다.",
      problem:
        "Redis 선점은 빠르지만 Redis의 선점 정보가 사라지면 같은 좌석을 여러 사람이 선점한 상태로 결제까지 갈 수 있습니다.",
      constraint:
        "이런 장애를 운영에서 기다릴 수는 없어 테스트로 재현해야 했습니다. 모킹이 아니라 실제 DB와 Redis를 띄운 환경에서 확인해야 의미가 있었습니다.",
      decision:
        "Testcontainers로 실제 MySQL과 Redis를 띄운 통합 테스트에서, Redis 서버를 멈추는 대신 선점 키를 지워 데이터 유실을 재현했습니다.",
      implementation: [
        "같은 좌석을 10번 선점하면서 매번 선점 키를 지워, HELD 상태 예매 10건을 만들었습니다.",
        "10건을 동시에 확정하게 하고 성공은 1건이며 나머지 9건은 SEAT_ALREADY_CONFIRMED로 실패하는지 확인했습니다.",
        "끝난 뒤 DB에서 확정 좌석과 CONFIRMED 예매가 각각 1건인지 확인합니다.",
      ],
      outcome:
        "앞단의 선점이 무너진 상황에서도 확정은 1건만 남는 것을 테스트로 확인했습니다. 이 테스트는 CI에서 계속 실행됩니다.",
    },
    {
      id: "outbox-idempotency",
      area: "Backend",
      title: "결제 재시도를 위한 멱등 처리와 아웃박스",
      summary: "결제 재시도와 이벤트 기록이 겹쳐도 결제와 확정이 두 번 실행되지 않게 했습니다.",
      problem:
        "결제 요청은 네트워크 오류로 다시 올 수 있습니다. 확정 뒤 이벤트 기록이 저장과 따로 놀면, 저장은 됐는데 이벤트만 빠지는 경우도 생길 수 있습니다.",
      constraint:
        "재시도는 사용자가 통제할 수 없으니 서버가 받아 줘야 했습니다. 이벤트 기록과 확정 저장은 함께 성공하거나 함께 취소돼야 했습니다.",
      decision:
        "결제 시도마다 멱등성 키를 둬서 같은 키로 다시 와도 새로 처리하지 않게 했습니다(ADR 0006). 이벤트는 따로 발행하지 않고 확정과 같은 트랜잭션에서 아웃박스 테이블에 기록합니다.",
      implementation: [
        "같은 멱등성 키로 다시 온 요청에는 처음 처리한 응답을 그대로 돌려줍니다. 웹은 응답을 못 받으면 예매 상태를 먼저 조회하고 결제가 거절된 뒤 새로 시도할 때만 새 키를 씁니다.",
        "예매 확정과 이벤트 기록을 한 트랜잭션으로 묶었습니다. 지금은 3단계로 릴레이가 아웃박스를 읽어 Kafka로 보내는 부분을 만들고 있습니다.",
        "받는 쪽에서 (컨슈머, 이벤트 ID)를 기록해 중복 전달을 걸러 내는 처리도 3단계에서 만들고 있습니다.",
      ],
      outcome:
        "같은 키의 재요청 응답과 결제 거절 뒤 선점 유지를 통합 테스트로 확인했습니다. 같은 키로 동시에 들어오는 요청의 실행 제어와 결제 승인 뒤 DB 저장이 실패했을 때의 보상 처리는 아직 남아 있습니다.",
    },
  ],
  ssafast: [
    {
      id: "dynamic-api-form",
      area: "Frontend",
      title: "반복·중첩 입력을 지원하는 API 명세 폼",
      summary: "요청 항목과 응답을 자유롭게 추가하고 저장할 때는 서버 문서 구조에 맞춰 보냈습니다.",
      problem:
        "API 명세에는 Header, Query, Path, Body와 여러 Response가 들어가고 Body 안에 기존 DTO가 다시 들어갈 수 있어, 고정된 입력 폼으로는 표현하기 어려웠습니다.",
      constraint:
        "반복 항목을 한 화면에서 넣고 빼야 했고 화면의 입력 배열을 서버가 쓰는 일반 필드와 중첩 DTO 구조로 나눠 보내야 했습니다.",
      decision:
        "React Hook Form으로 섹션별 입력 상태를 공유했습니다. 화면에서는 편집하기 쉬운 배열로 다루고 제출할 때 서버 문서 구조로 바꿨습니다.",
      implementation: [
        "Header, Query, Path, Body, Response마다 useFieldArray를 써서 반복 항목을 다뤘습니다.",
        "기본 타입과 워크스페이스 DTO를 같은 선택 목록에 보여 주고 DTO는 제출할 때 중첩 구조로 다시 조합했습니다.",
        "응답은 상태 코드별로 추가하고 접을 수 있게 했습니다. 필수 성공 응답은 중복되거나 삭제되지 않게 막았습니다.",
      ],
      outcome:
        "여러 요청 항목, 중첩 DTO, 여러 응답을 한 명세 작성 화면에서 편집하고 저장 결과가 API 목록에 다시 반영됩니다.",
      code: {
        language: "TypeScript",
        title: "응답 상태 코드 추가 전 입력 검증",
        content: `const addComponentHandler = () => {
  if (codeRef.current?.value.length !== 3) {
    showToast("상태 코드는 3자리여야 합니다.");
  } else if (descRef.current?.value === "") {
    showToast("상태 코드 설명을 입력해 주세요.");
  } else if (codeRef.current?.value === "200") {
    showToast("상태 코드 200은 이미 등록되어 있습니다.");
  } else {
    addComponent();
  }
};`,
        note: "공개 저장소의 실제 코드를 읽기 쉽게 줄였습니다. 상태 코드 형식과 설명 입력을 확인하고 기본 성공 응답 200이 두 번 등록되지 않게 막습니다.",
      },
    },
    {
      id: "load-test-flow",
      area: "Frontend",
      title: "부하 테스트 실행부터 결과 상세까지 한 화면 흐름으로",
      summary: "대상 서버 확인, API 선택, 실행 조건, 결과 이력을 단계별 화면으로 나눴습니다.",
      problem:
        "부하 테스트는 API만 고른다고 끝나지 않습니다. 대상 서버 인증, 요청값 입력, 실행 조건 설정, 결과 이력 확인까지 이어져야 했습니다.",
      constraint:
        "인증된 서버만 테스트할 수 있어야 했고 API 명세의 Header, Path, Query, Body 값을 실제 실행 요청으로 다시 조합해야 했습니다.",
      decision:
        "인증 전에는 인증 안내부터 보여 주고 인증 후에는 API·요청 설정과 결과 영역을 나눠 무엇을 먼저 할지 드러나게 했습니다.",
      implementation: [
        "Base URL별 인증 상태를 확인하고 인증 전이면 환경별 안내와 코드 입력 모달을 띄웁니다.",
        "고른 API 명세를 실행 폼에 채우고 요청 항목과 부하 조건을 검증해 실행 요청으로 조합했습니다.",
        "결과는 이력과 상세로 나눠 응답 시간 구간, 처리량, 상태 코드별 건수를 볼 수 있게 했습니다.",
      ],
      outcome:
        "서버 인증, API 선택, 실행 조건 입력, 결과 확인이 한 화면 흐름으로 이어집니다.",
    },
  ],
  ddoing: [
    {
      id: "drawing-session-state",
      area: "Frontend",
      title: "그림 학습의 타이머와 단계 상태 바로잡기",
      summary: "단어 6개의 제한 시간, 판정 결과, 재시작 상태가 서로 꼬이지 않게 정리했습니다.",
      problem:
        "재시작하면 이전 interval이 남아 타이머가 빨라졌고 새 단어 목록이 늦게 반영돼 이전 목록이 잠시 남았습니다.",
      constraint:
        "Canvas 입력, 제한 시간, 현재 문제, 결과 모달, 단어 설명이 함께 움직여야 했고 단어 목록과 판정 결과는 비동기로 도착했습니다.",
      decision:
        "학습 진행 상태는 Drawing 페이지에 모으고 interval ID는 ref에 보관해, 모달을 열거나 단계를 옮기거나 재시작할 때 명시적으로 정리했습니다.",
      implementation: [
        "현재 문제, 정답 수, 타이머, 모달, 단어 목록을 한 학습 진행 상태로 관리했습니다.",
        "Canvas 그림을 이미지로 바꿔 팀장이 학습시킨 분류 모델의 추론 API에 보내고 판정 결과를 화면에 반영했습니다.",
        "첫 렌더링을 뺀 상태 변경에만 동작하는 custom effect를 쓰고 재시작할 때 interval과 학습 상태를 초기화했습니다.",
      ],
      outcome:
        "제한 시간 안의 학습, 판정, 다음 문제, 최종 결과가 이어지고 재시작 때 타이머가 두 번 돌거나 이전 단어 목록이 남던 문제가 사라졌습니다.",
      code: {
        language: "TypeScript",
        title: "Canvas 결과를 업로드 파일로 변환",
        content: `const dataURLtoFileObject = (dataURL: string, fileName: string) => {
  const [, encoded] = dataURL.split(",");
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], fileName, { type: "image/png" });
};`,
        note: "공개 저장소의 실제 변환 코드에서 변수명만 다듬어 옮겼습니다. Canvas의 Data URL을 PNG 파일로 바꿔 그림 저장 요청에 썼습니다.",
      },
    },
    {
      id: "main-api-content",
      area: "Frontend",
      title: "메인 화면을 API 데이터로 채우기",
      summary: "고정 카드 대신 인기 영상과 그림 갤러리 데이터를 API로 불러와 보여 줬습니다.",
      problem:
        "메인 화면이 서비스 소개에 그쳐 있었고 인기 콘텐츠와 사용자가 그린 우수 작품을 실제 데이터로 보여 줄 구조가 필요했습니다.",
      constraint:
        "인기 영상과 그림 갤러리는 서로 다른 API 응답을 썼고 데이터가 오기 전에는 캐러셀에 넣을 배열이 없었습니다.",
      decision:
        "두 응답은 페이지에서 관리하고 인기 콘텐츠와 명예의 전당 컴포넌트에는 필요한 배열만 넘겼습니다.",
      implementation: [
        "화면이 뜰 때 인기 영상과 그림 갤러리 데이터를 따로 요청하고 응답 타입과 상태도 나눴습니다.",
        "서비스 배너, 인기 콘텐츠, 명예의 전당을 각각 캐러셀로 만들었습니다.",
        "그림 경로, 단어, 닉네임, 점수를 반복해 그리고 영상 상세와 서비스 화면으로 가는 링크를 달았습니다.",
      ],
      outcome:
        "고정 카드 대신 인기 영상과 실제 그림 데이터를 보여 주는 메인 화면이 됐고 API 응답 처리와 표시 컴포넌트의 역할도 나뉘었습니다.",
    },
  ],
  modac: [
    {
      id: "study-room-entry",
      area: "Frontend",
      title: "스터디룸 유형과 참여 상태에 맞춘 입장 처리",
      summary: "공개·비공개 여부, 정원, 초대 코드 조건을 입장 화면 하나에서 처리했습니다.",
      problem:
        "스터디룸마다 공개 여부와 참여 상태가 달랐고 비공개 방은 초대 코드를 확인해야 해서 같은 입장 버튼이라도 처리 조건이 달랐습니다.",
      constraint:
        "현재 참여자, 정원, 방 유형을 함께 확인해야 했고 코드 검증이 비동기로 끝난 뒤에만 방 상태와 화면을 바꿔야 했습니다.",
      decision:
        "방 정보와 로그인 사용자를 보고 초대 코드가 필요한지 계산하고 입장 전 검증과 오류 안내는 모달 안에서 차례로 처리했습니다.",
      implementation: [
        "참여자 목록과 방 공개 유형으로 초대 코드 입력이 필요한지 계산했습니다.",
        "정원 초과와 코드 불일치를 따로 안내하고 검증에 성공했을 때만 Pinia의 현재 방 상태를 바꿨습니다.",
        "방 입장·나가기와 즐겨찾기 목록 갱신은 같은 room store와 API 모듈을 거치게 했습니다.",
      ],
      outcome:
        "공개방과 비공개방의 정원, 초대 코드, 기존 참여 여부에 맞춰 입장과 나가기 상태가 제대로 바뀝니다.",
    },
    {
      id: "realtime-room-ui",
      area: "Frontend",
      title: "스터디룸 채팅과 방 이동 상태를 화면에 연결",
      summary: "팀이 구성한 실시간 연결로 들어온 메시지를 화면에 보여 주고 방을 옮길 때 이전 연결과 채팅 기록을 정리했습니다.",
      problem:
        "방을 옮길 때 이전 채팅이 남거나 연결이 계속 살아 있으면 다른 스터디룸의 메시지와 참여 상태가 섞일 수 있었습니다.",
      constraint:
        "방 정보와 채팅 기록은 여러 컴포넌트가 같이 썼고 입장·퇴장·즐겨찾기 이동에 맞춰 연결을 열고 닫아야 했습니다.",
      decision:
        "현재 방과 채팅 기록을 Pinia store로 나누고 방에 들어가기 전에 기록을 비웠습니다. 화면은 store에 들어온 메시지만 그립니다.",
      implementation: [
        "채팅 목록과 입력 컴포넌트를 나누고 로그인 사용자 기준으로 내 메시지와 남의 메시지를 구분해 표시했습니다.",
        "방에 들어갈 때 이전 채팅 기록을 비우고 새 방 정보가 준비된 뒤 채팅 화면을 엽니다.",
        "방을 나가거나 즐겨찾기 목록에서 다른 방으로 들어갈 때 기존 연결을 정리하고 새 방 정보를 조회합니다.",
      ],
      outcome:
        "방을 옮길 때 이전 연결과 채팅 기록을 정리해, 다른 스터디룸의 메시지가 섞이지 않습니다.",
    },
  ],
  reachrich: [
    {
      id: "selective-core-migration",
      area: "Full Stack",
      title: "기존 코드를 통째로 옮기지 않고 검증 로직만 골라 옮기기",
      summary: "검증한 로직은 살리고 연구와 운영 코드는 여섯 모듈로 다시 나눴습니다.",
      problem:
        "기존 투자 연구 코드에는 검증 로직, 실험용 스크립트, 운영 코드, 대시보드가 한데 쌓여 있어 기능을 더할수록 고칠 범위가 넓어졌습니다.",
      constraint:
        "미래 데이터 혼입을 막는 검증, 실험 이력, 모의운용 원장은 살려야 했습니다. 하지만 기존 코드의 얽힘과 오래된 실행 방식까지 옮기면 다시 설계하는 의미가 없었습니다.",
      decision:
        "새 저장소에서 데이터, 종목 선정, 전략, 검증, 운용, 콘솔로 영역부터 나누고 이미 검증한 부분만 골라 옮겼습니다.",
      implementation: [
        "미래 데이터 혼입 검사, 시간 순서를 지키는 반복 검증(Purged Walk-forward), 표준 성과 지표, 실험 이력 모듈을 골라 옮겼습니다.",
        "기준 성과와의 차이를 보는 Tracking Error 비교와, 가격 기준으로 중복 없이 쌓는 모의운용 원장은 기존 표본을 그대로 살려 새 운용 영역으로 옮겼습니다.",
        "기존 관리 화면과 레거시 스크립트는 가져오지 않았습니다. 계좌 추적, 데이터 수집, React 콘솔은 새 구조에 맞춰 새로 만들었습니다.",
      ],
      outcome:
        "기존 검증 기준은 그대로 두고 새 기능이 어느 모듈에 들어갈지 분명한 여섯 모듈 구조로 연구와 운영 코드를 다시 짰습니다.",
    },
    {
      id: "idempotent-market-mirror",
      area: "Backend",
      title: "다시 돌려도, 일부가 실패해도 안전한 계좌·시장 데이터 수집",
      summary: "외부 API 결과를 날짜 기준으로 SQLite와 Parquet에 저장해 두는 로컬 사본을 만들었습니다.",
      problem:
        "계좌와 KRX 데이터를 매일 모으다 보면 같은 날 다시 돌리거나 일부 종목만 실패할 수 있습니다. 응답을 그대로 덧붙이면 중복되거나 빠진 데이터가 쌓입니다.",
      constraint:
        "OAuth2 토큰 수명과 호출 제한을 지켜야 했습니다. 그날의 종목 구성도 남겨야 했고 종목 하나의 오류로 전체 수집이 무조건 멈추면 안 됐습니다.",
      decision:
        "계좌는 날짜 단위로 교체 저장하고 KRX 일봉은 종목·날짜 기준으로 upsert합니다. 그날의 종목 목록은 별도 스냅샷으로 남기기로 했습니다.",
      implementation: [
        "OAuth2 토큰은 만료 60초 전까지 다시 쓰고 429 응답을 받으면 Retry-After만큼 기다렸다가 한 번 다시 요청합니다.",
        "거래대금 상위 종목 목록을 날짜별로 저장하고 종목별 일봉은 Parquet에서 같은 날짜를 새 값으로 바꿉니다.",
        "종목 하나가 실패하면 건너뛰고 다음 종목을 수집합니다. 다만 실패가 전체의 30%를 넘으면 부분 성공을 정상으로 보지 않고 작업을 실패 처리합니다.",
      ],
      outcome:
        "처음에는 5개 종목 일봉 10개씩 50행과 환율 1행으로 실제 API를 확인했고 이때 문서와 다른 랭킹 응답 필드를 찾아 고쳤습니다. 지금은 거래대금 상위 200종목과 일봉을 매일 적재합니다.",
      code: {
        language: "Python",
        title: "날짜 기준 Parquet upsert",
        content: `incoming["date"] = incoming["date"].map(to_iso)
existing = pd.read_parquet(path) if path.exists() else pd.DataFrame()

merged = pd.concat([existing, incoming], ignore_index=True)
merged = merged.drop_duplicates(subset="date", keep="last")
merged = merged.sort_values("date").reset_index(drop=True)
merged.to_parquet(path, index=False)`,
        note: "실제 저장소에서 종목별 일봉을 합치는 부분의 경로와 예외 처리를 빼고 공개용으로 줄인 예시입니다.",
      },
    },
    {
      id: "privacy-aware-dashboard",
      area: "Frontend",
      title: "실계좌 데이터를 부담 없이 여는 React 대시보드",
      summary: "로컬 스냅샷을 자산 요약, 자산 곡선, 보유 종목, 시스템 상태 화면으로 보여 줍니다.",
      problem:
        "계좌 수집 결과가 명령행과 알림 메시지에 흩어져 있어 기간별 변화를 한눈에 보기 어려웠습니다. 실제 금액이 나오는 화면을 다른 사람 앞에서 열기도 부담스러웠습니다.",
      constraint:
        "서버는 인증 없이 로컬에서만 돌기 때문에 외부에 노출되면 안 됐습니다. 주기적으로 새로 고치되, 보이지 않는 탭에서까지 요청을 계속 보내면 안 됐습니다.",
      decision:
        "외부 API는 부르지 않고 로컬 스냅샷만 읽는 조회 API를 두었습니다. React 화면에는 금액 가리기와 탭 가시성 기반 폴링을 넣었습니다.",
      implementation: [
        "자산 요약, 기간별 자산 곡선, 보유 종목, 수집 상태를 조회 API 네 개와 화면 컴포넌트로 연결했습니다.",
        "금액 가리기 설정은 브라우저에 저장합니다. 라이트·다크·시스템 테마와 PWA 앱 셸도 만들었습니다.",
        "탭이 숨으면 폴링을 건너뛰고 다시 보이면 바로 최신 데이터를 가져오는 공통 훅으로 뺐습니다.",
      ],
      outcome:
        "2026년 8월 11일 기준 웹 테스트 96개와 프로덕션 빌드가 통과하고 계좌 상태를 한 화면에서 볼 수 있습니다.",
      code: {
        language: "TypeScript",
        title: "화면 가시성에 맞춘 폴링",
        content: `const refreshWhenVisible = () => {
  if (document.visibilityState === "visible") tick();
};
const timer = setInterval(refreshWhenVisible, intervalMs);
document.addEventListener("visibilitychange", refreshWhenVisible);

return () => {
  clearInterval(timer);
  document.removeEventListener("visibilitychange", refreshWhenVisible);
};`,
        note: "실제 공통 훅에서 최초 조회를 빼고 숨은 탭의 요청을 건너뛰고 리스너를 정리하는 부분만 옮긴 예시입니다.",
      },
    },
    {
      id: "observable-automation",
      area: "배포",
      title: "자동 실행이 실패하면 바로 알 수 있게 경보 연결",
      summary: "로컬 수집과 클라우드 실행을 나누고 각각 실패하면 알림이 오게 했습니다.",
      problem:
        "정해진 시간에 도는 수집과 모의운용 작업은 실패해도 화면을 보고 있지 않으면 알아차리기 어렵습니다. 그 사이 데이터 공백이 쌓일 수 있었습니다.",
      constraint:
        "계좌와 KRX API는 등록한 IP에서만 호출할 수 있어 로컬에서 돌려야 했습니다. 반면 헬스체크와 모의운용 적립은 PC가 꺼져 있어도 돌아야 했습니다.",
      decision:
        "IP가 필요한 수집은 로컬 일일 러너로 묶고 테스트와 헬스체크, 모의운용은 GitHub Actions로 옮겼습니다. 각 작업은 실패하면 직접 알림을 보냅니다.",
      implementation: [
        "로컬 러너는 계좌 스냅샷과 KRX 수집을 차례로 실행하고 한 단계가 실패해도 다음 단계는 계속 진행합니다.",
        "GitHub Actions에서 백엔드·프론트엔드 테스트와 빌드, 일일 헬스체크, 중복 없이 쌓는 모의운용 원장 적립을 돌립니다.",
        "강제 실패 옵션으로 텔레그램 알림이 실제로 오는지도 확인했습니다.",
      ],
      outcome:
        "CI, 일일 헬스체크, 모의운용 워크플로가 정상 실행되는 것을 확인했습니다. 일부러 실패시켰을 때 알림이 와서, 조용히 멈추는 일을 바로 알 수 있습니다.",
    },
  ],
};
