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
      title: "대량 첨부파일 다운로드를 작업 단위로 분리",
      summary: "오래 대기하던 요청을 작업 ID와 상태 조회 방식으로 바꿨습니다.",
      problem:
        "첨부파일 300~400건을 한 번에 압축하면 HTTP 요청이 오래 유지됐고, 사용자는 작업이 진행 중인지 실패했는지 알기 어려웠습니다.",
      constraint:
        "기존 파일 선택과 다운로드 방식은 유지하면서 새로고침, 실패, 결과 파일 만료까지 화면과 서버가 같은 작업을 식별해야 했습니다.",
      decision:
        "압축 실행을 브라우저 요청에서 분리하고, 서버가 발급한 작업 ID를 기준으로 진행 상태와 결과 파일을 연결했습니다.",
      implementation: [
        "압축 요청은 작업 ID를 먼저 반환하고 실제 압축은 별도 실행기에서 처리했으며, 작업 상태는 두 서버가 공유하는 분산 맵에 저장했습니다.",
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
      id: "password-reset-limiter",
      area: "Backend",
      title: "서버 2대에서 함께 동작하는 인증번호 요청 제한",
      summary: "비밀번호 초기화 인증번호 발송에 분산 쿨다운과 원자적 획득을 적용했습니다.",
      problem:
        "비밀번호 초기화가 인증번호를 알림톡으로 발송하는데 반복 클릭이나 자동화된 요청을 막는 장치가 없었고, 서버가 2대라 서버별 메모리 제한만으로는 요청이 분산되면 제한이 무력화될 수 있었습니다.",
      constraint:
        "제한 상태를 서버 간에 공유해야 했고, 계정과 전화번호 같은 식별값을 제한 키로 원문 그대로 저장하지 않아야 했으며, 분산 저장소가 없는 로컬 환경에서도 같은 코드가 동작해야 했습니다.",
      decision:
        "이미 운영 중인 분산 맵에 TTL 쿨다운을 저장하고, 동시 요청 중 한 건만 통과하도록 원자적 획득 연산을 사용했습니다. 제한 키에는 식별값의 해시만 사용했습니다.",
      implementation: [
        "분산 맵의 putIfAbsent로 쿨다운을 원자적으로 획득하고, 만료된 항목은 조건부 삭제로 정리해 동시 획득이 덮어써지지 않게 했습니다.",
        "제한 키는 계정·전화번호를 정규화한 뒤 SHA-256 해시로 만들어 원문이 저장되지 않게 했습니다.",
        "분산 저장소가 없는 환경은 로컬 맵으로 폴백하고, 화면에는 남은 대기 시간을 반환해 재시도 시점을 안내했습니다.",
        "만료 직후 획득과 동시 요청 경쟁 같은 경계 조건을 단위 테스트로 고정했습니다.",
      ],
      outcome:
        "어느 서버로 요청해도 같은 제한이 적용되고 사용자는 남은 대기 시간을 안내받습니다. 관련 단위 테스트 30건으로 핵심 분기를 검증했습니다.",
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
        note: "실제 구현에서 키 해시와 폴백 처리를 덜어내고, 분산 맵에서 쿨다운을 원자적으로 획득하는 핵심 루프만 옮긴 예시입니다.",
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
      id: "view-query-rewrite",
      area: "Backend",
      title: "60초에도 못 끝나던 통합 뷰 조회 재작성",
      summary: "실행계획이 폭발하던 뷰 조회를 기본 테이블 조인으로 바꿔 밀리초 단위로 만들었습니다.",
      problem:
        "AS 이력과 정산 세부현황 조회가 여러 테이블을 합친 통합 뷰를 거쳤는데, 데이터가 쌓이면서 화면이 수십 초를 기다리는 수준까지 느려졌습니다.",
      constraint:
        "화면의 조회 조건과 표시 항목은 그대로 유지해야 했고, 같은 뷰를 사용하는 다른 화면에는 영향을 주지 않아야 했습니다.",
      decision:
        "실행계획을 확인하니 고객 조건이 뷰 안까지 전달되지 못해 뷰 전체를 만들어 놓고 거르는 구조였습니다. 인덱스 추가가 아니라 화면이 실제로 쓰는 컬럼만 기본 테이블 조인으로 재작성하는 쪽을 선택했습니다.",
      implementation: [
        "통합 뷰 대신 기본 테이블을 직접 조인하고 고객 조건이 처음부터 인덱스로 적용되게 했습니다.",
        "화면이 사용하는 컬럼만 남기고 최신 처리 이력은 서브쿼리로 붙여 결과 구성을 동일하게 유지했습니다.",
        "개선 전후 쿼리를 같은 파라미터로 실행해 결과 행이 일치하는지 비교했습니다.",
      ],
      outcome:
        "운영 DB 재측정(2026.09, 이력 최다 고객 기준)에서 기존 쿼리는 60초 상한 안에 끝나지 않았고, 재작성한 쿼리는 63~69ms로 같은 결과를 반환했습니다. 실행계획 추정 행도 약 2.1조에서 1,854행으로 줄었습니다.",
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
        "학교·단말별 점검과 재점검 이력을 한 시스템에서 관리하게 됐습니다. 2026년 9월 기준 대상 119개 학교 중 71개교에서 점검표 14,882건이 저장돼 운영 중입니다.",
    },
    {
      id: "inspection-data-rekey",
      area: "Backend",
      title: "운영 중 점검 데이터의 시리얼 기준 재정립",
      summary: "혼재된 시리얼 기준을 바로잡고 운영 데이터의 중복을 백업·롤백 절차와 함께 정리했습니다.",
      problem:
        "점검 대상이 입력용 14자리 시리얼로 저장돼 15자리 전체 시리얼과 혼재했고, 같은 시리얼 후보가 여러 건이면 잘못 매핑되거나 중복 저장될 수 있었습니다.",
      constraint:
        "시스템이 이미 운영 중이라 화면만 고쳐서는 쌓인 데이터가 정리되지 않았고, 이미 저장된 점검 결과와 상세 정보는 반드시 보존해야 했습니다.",
      decision:
        "저장 기준을 15자리 전체 시리얼로 재정립하고, 기존 데이터는 점검 결과를 보존한 채 정리하되 운영 반영 전에 되돌릴 수 있는 절차를 함께 준비했습니다.",
      implementation: [
        "저장 기준을 15자리로 변경하고 14자리 입력은 후보 검색 뒤 학교 배정 정보로 확정하게 했습니다.",
        "학년·반·번호와 점검 이력 우선순위로 중복을 정리하는 SQL을 작성해 결과를 보존한 채 중복 행만 제거했습니다.",
        "운영 반영 전 백업과 롤백, 반영 후 검증 SQL을 함께 준비해 순서대로 실행했습니다.",
      ],
      outcome:
        "점검 결과를 잃지 않고 중복을 제거했으며, ID 기준 수정으로 같은 문제가 다시 쌓이지 않게 했습니다. 2026년 7월 운영 DB에 반영됐습니다.",
    },
    {
      id: "parent-enrollment",
      area: "Frontend",
      title: "학부모가 로그인 없이 쓰는 공개 접수 화면",
      summary: "네 교육청의 동의서·QR 확인·배송 예약 화면을 모바일 기준으로 만들었습니다.",
      problem:
        "단말 대여 동의, 배송 희망일 예약, QR 배부 확인을 학부모가 직접 처리해야 했는데, 로그인 없는 공개 화면이라 마감 이후 제출과 중복 제출, 모바일 표시 문제를 화면에서 걸러야 했습니다.",
      constraint:
        "접수 기간과 마감 시각이 교육청마다 달랐고 기간 중에도 일정이 바뀌었으며, 학부모 대부분이 휴대폰으로 접속해 관리자 화면과는 다른 기준이 필요했습니다.",
      decision:
        "안내 문구와 오류 화면, 마감·잠금 처리를 우선순위로 두고 모바일 화면을 기본으로 설계했습니다. 접수 기간 중의 일정 변경 요청은 당일 반영을 원칙으로 대응했습니다.",
      implementation: [
        "제주·세종·경기·강원 교육청의 동의서 작성, QR 배부 확인, 배송 희망일 예약 화면을 개발했습니다.",
        "마감 시각 이후 제출 잠금과 뒤로가기 방지를 적용하고, 응답 파싱이 실패하면 전용 오류 화면으로 전환했습니다.",
        "다크모드에서 QR이 인식되지 않는 문제는 QR 영역에 밝은 배경을 강제해 해결했습니다.",
      ],
      outcome:
        "학부모가 안내만 보고 접수를 마칠 수 있는 화면으로 여러 접수 기간에 운영됐고, 기간 중의 일정 변경과 마감 요청을 당일 반영하며 지원했습니다.",
    },
  ],
  ticketrush: [
    {
      id: "three-layer-defense",
      area: "Backend",
      title: "같은 좌석을 지키는 세 겹의 방어",
      summary: "빠른 선점, 도메인 규칙, DB 제약이 각자 다른 실패 상황을 막도록 역할을 나눴습니다.",
      problem:
        "동시 요청이 몰리는 선착순 예매에서 한 겹의 방어에만 의존하면, 그 계층이 실패하는 순간 같은 좌석이 두 번 팔릴 수 있습니다.",
      constraint:
        "선점은 빠르게 응답해야 했고, Redis 장애나 홀드 만료처럼 각 계층이 실패하는 상황에서도 최종 확정은 반드시 한 건이어야 했습니다.",
      decision:
        "속도는 Redis SET NX 선점이, 흐름 검증은 도메인 규칙이, 최종 정합성은 DB 유니크 제약이 맡도록 계층별 책임을 나눴습니다.",
      implementation: [
        "Redis SET NX EX 5분 홀드로 동시 요청 중 첫 한 건만 좌석을 선점하게 했습니다.",
        "만료됐거나 존재하지 않는 홀드로는 결제를 진행할 수 없도록 도메인 규칙에서 거부했습니다.",
        "확정 테이블의 (회차·좌석) 유니크 제약이 같은 좌석의 두 번째 INSERT를 물리적으로 거부하게 했습니다.",
      ],
      outcome:
        "1좌석 100동시요청 경합 테스트에서 성공은 정확히 1건, 중복 예매는 0건입니다. 어떤 계층이 실패해도 다음 계층이 같은 결론을 지킵니다.",
      code: {
        language: "Java",
        title: "선점과 최종 방어의 역할 분리",
        content: `boolean held = redis.setIfAbsent(seatKey(showId, seatId), holdToken, HOLD_TTL);
if (!held) throw new SeatAlreadyHeldException();

// 결제 시점: 만료된 홀드는 도메인 규칙이 거부
hold.ensureActive(clock.now());

// 최종 확정: (회차, 좌석) 유니크 제약이 두 번째 INSERT를 거부
confirmedSeatRepository.insert(showId, seatId, reservationId);`,
        note: "공개 저장소의 실제 흐름에서 예외 처리와 트랜잭션 경계를 덜어내고, 세 계층이 각자 맡는 지점만 순서대로 보여주는 예시입니다.",
      },
    },
    {
      id: "redis-outage-proof",
      area: "Backend",
      title: "Redis가 죽는 상황을 테스트로 재현",
      summary: "1차 방어가 사라져 홀드가 두 건 생겨도 확정은 한 건임을 통합 테스트로 증명했습니다.",
      problem:
        "Redis 선점은 빠르지만 Redis가 죽으면 홀드 정보가 사라져, 같은 좌석에 두 명이 동시에 홀드를 가진 것처럼 진행될 수 있습니다.",
      constraint:
        "장애 상황은 운영에서 기다릴 수 없으니 테스트에서 재현해야 했고, 모킹이 아니라 실제 DB·Redis를 띄운 환경에서 검증해야 의미가 있었습니다.",
      decision:
        "Testcontainers로 실제 MySQL·Redis를 띄운 통합 테스트에서 Redis 컨테이너를 의도적으로 중단시키고, 이후 흐름이 DB 제약까지 도달하는 경로를 검증했습니다.",
      implementation: [
        "같은 좌석에 홀드 두 건이 존재하는 비정상 상태를 만들어 두 건 모두 확정을 시도하게 했습니다.",
        "첫 확정은 성공하고 두 번째 확정은 DB (회차·좌석) 유니크 제약 위반으로 실패하는 것을 검증했습니다.",
        "실패한 쪽이 사용자에게 어떤 오류로 전달되는지까지 테스트 범위에 포함했습니다.",
      ],
      outcome:
        "1차 방어가 완전히 사라진 상황에서도 확정이 정확히 1건만 남는 것을 자동화 테스트로 증명했고, 이 시나리오는 CI에서 계속 실행됩니다.",
    },
    {
      id: "outbox-idempotency",
      area: "Backend",
      title: "정확히 한 번의 확정을 위한 멱등 처리와 아웃박스",
      summary: "재시도와 이벤트 발행이 겹쳐도 결제·확정이 두 번 실행되지 않게 했습니다.",
      problem:
        "결제 요청은 네트워크 오류로 재시도될 수 있고, 확정 이후의 이벤트 발행이 저장과 분리돼 있으면 저장은 됐는데 이벤트만 유실되는 상황이 생길 수 있습니다.",
      constraint:
        "재시도는 사용자가 제어할 수 없어 서버가 흡수해야 했고, 이벤트는 확정 저장과 같은 운명이어야 했습니다(둘 다 성공하거나 둘 다 취소).",
      decision:
        "요청에는 멱등성 키를 두어 같은 키의 재시도가 새 처리를 만들지 않게 하고, 이벤트는 별도 발행 대신 확정과 같은 트랜잭션에서 아웃박스 테이블에 기록했습니다.",
      implementation: [
        "같은 멱등성 키의 요청은 처음 처리 결과를 그대로 반환하도록 저장 시점에 판정했습니다.",
        "예약 확정과 이벤트 행 기록을 한 트랜잭션으로 묶고, 릴레이가 아웃박스를 읽어 이벤트를 전달하게 했습니다.",
        "이벤트를 소비하는 쪽도 이벤트 ID 기준으로 멱등 처리해 중복 전달을 흡수했습니다.",
      ],
      outcome:
        "재시도·중복 전달·발행 유실이 겹치는 경우에도 확정과 이벤트가 한 번씩만 반영되는 구조를 만들었고, 관련 경로를 통합 테스트로 검증했습니다.",
    },
  ],
  ssafast: [
    {
      id: "dynamic-api-form",
      area: "Frontend",
      title: "반복·중첩 입력을 지원하는 API 명세 폼 구성",
      summary: "요청 항목과 응답을 자유롭게 추가하면서 서버 문서 구조에 맞춰 저장하도록 만들었습니다.",
      problem:
        "API 명세에는 Header, Query, Path, Body와 여러 Response가 포함되고 Body 안에는 기존 DTO가 다시 들어갈 수 있어 고정 입력 폼으로 표현하기 어려웠습니다.",
      constraint:
        "반복 항목을 한 화면에서 추가·삭제해야 했고, 화면의 입력 배열을 서버가 사용하는 일반 필드와 중첩 DTO 구조로 나눠 전달해야 했습니다.",
      decision:
        "React Hook Form으로 섹션별 입력 상태를 공유하고, 화면에서는 편집하기 쉬운 배열로 관리한 뒤 제출 시점에 서버 문서 구조로 변환했습니다.",
      implementation: [
        "Header·Query·Path·Body와 Response에 각각 useFieldArray를 적용해 반복 항목을 다뤘습니다.",
        "기본 타입과 워크스페이스 DTO를 같은 선택기에 표시하고 DTO는 제출할 때 중첩 구조로 다시 조합했습니다.",
        "응답을 상태 코드별로 추가·접을 수 있게 하고 필수 성공 응답이 중복되거나 삭제되지 않도록 화면 규칙을 두었습니다.",
      ],
      outcome:
        "복수 요청 항목과 중첩 DTO, 여러 응답을 하나의 명세 작성 흐름에서 편집하고 저장 결과를 API 목록에 다시 반영할 수 있게 했습니다.",
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
        note: "공개 저장소의 실제 처리 흐름을 읽기 쉽게 줄인 코드입니다. 상태 코드 형식과 설명 입력을 확인하고 기본 성공 응답 200의 중복 등록을 막았습니다.",
      },
    },
    {
      id: "load-test-flow",
      area: "Frontend",
      title: "부하 테스트 실행부터 결과 상세까지 한 흐름으로 연결",
      summary: "대상 서버 확인, API 선택, 실행 조건과 결과 이력을 단계별 화면으로 구성했습니다.",
      problem:
        "부하 테스트는 API를 고르는 것만으로 끝나지 않고 대상 서버 인증, 요청값 입력, 실행 조건 설정과 결과 이력 확인까지 이어져야 했습니다.",
      constraint:
        "인증된 서버만 테스트할 수 있어야 했고 API 명세의 Header·Path·Query·Body 값을 실제 실행 요청으로 다시 조합해야 했습니다.",
      decision:
        "미인증 상태에서는 인증 안내를 먼저 보여주고, 인증 후에는 API·요청 설정과 결과 영역을 분리해 사용 순서가 드러나도록 구성했습니다.",
      implementation: [
        "Base URL별 인증 상태를 확인하고 미인증 상태에서는 환경별 안내와 코드 입력 모달을 표시했습니다.",
        "선택한 API 명세를 실행 폼에 채우고 요청 항목과 부하 조건을 검증해 실행 객체로 조합했습니다.",
        "결과를 이력과 상세로 나눠 지연 시간 구간, 처리량과 상태 코드별 건수를 확인하도록 했습니다.",
      ],
      outcome:
        "서버 인증부터 API 선택, 실행 조건 입력과 결과 확인까지 하나의 화면 흐름으로 연결했습니다.",
    },
  ],
  ddoing: [
    {
      id: "drawing-session-state",
      area: "Frontend",
      title: "그림 학습 세션의 타이머와 단계 상태 안정화",
      summary: "6개 단어의 제한 시간, 판정 결과와 재시작 상태가 겹치지 않도록 정리했습니다.",
      problem:
        "재시작할 때 이전 interval이 남아 타이머가 빨라지고, 새 단어 목록의 반영이 늦어 이전 목록이 잠시 남는 문제가 있었습니다.",
      constraint:
        "Canvas 입력, 제한 시간, 현재 문제, 결과 모달과 단어 설명이 함께 움직여야 했고 단어 목록과 추론 결과는 비동기로 도착했습니다.",
      decision:
        "학습 진행 상태는 Drawing 페이지에 모으고 interval ID는 ref로 보관해 모달 열기, 단계 이동과 재시작 때 명시적으로 정리했습니다.",
      implementation: [
        "현재 문제와 정답 수, 타이머, 모달과 단어 목록을 하나의 학습 흐름으로 관리했습니다.",
        "Canvas 그림을 이미지로 변환해 학습된 분류 모델의 추론 API에 보내고 판정 결과를 화면에 반영했습니다.",
        "초기 렌더를 제외한 상태 변경에만 동작하는 custom effect를 사용하고 재시작 시 interval과 학습 상태를 초기화했습니다.",
      ],
      outcome:
        "제한 시간 학습과 판정, 다음 문제와 최종 결과를 연결하고 재시작 시 발생하던 타이머 중복 실행과 이전 단어 목록이 남는 문제를 수정했습니다.",
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
        note: "공개 저장소의 실제 변환 로직을 변수명만 다듬어 옮겼습니다. Canvas의 Data URL을 PNG File로 변환한 뒤 그림 저장 요청에 사용했습니다.",
      },
    },
    {
      id: "main-api-content",
      area: "Frontend",
      title: "메인 화면을 API 데이터 기반 콘텐츠로 전환",
      summary: "고정 카드 대신 인기 영상과 그림 갤러리 데이터를 API로 불러와 보여주었습니다.",
      problem:
        "메인 화면이 서비스 소개에 머물러 있었고 인기 콘텐츠와 사용자가 만든 우수 작품을 실제 데이터로 보여줄 구조가 필요했습니다.",
      constraint:
        "인기 영상과 그림 갤러리는 서로 다른 API 응답을 사용했고, 데이터가 도착하기 전에는 캐러셀에 유효한 배열이 없었습니다.",
      decision:
        "페이지에서 두 응답을 관리하고 인기 콘텐츠와 명예의 전당 컴포넌트에는 필요한 배열만 전달하도록 역할을 나눴습니다.",
      implementation: [
        "마운트 시 인기 영상과 그림 갤러리 데이터를 각각 요청하고 응답 타입과 상태를 분리했습니다.",
        "서비스 배너, 인기 콘텐츠와 명예의 전당을 별도 캐러셀로 구성했습니다.",
        "그림 경로, 단어, 닉네임과 점수를 반복 렌더링하고 영상 상세와 서비스 화면으로 이동하는 동선을 연결했습니다.",
      ],
      outcome:
        "정적으로 배치한 카드 대신 인기 영상과 실제 그림 데이터를 보여주는 메인 화면을 만들고 API 응답과 표시 컴포넌트의 책임을 나눴습니다.",
    },
  ],
  modac: [
    {
      id: "study-room-entry",
      area: "Frontend",
      title: "스터디룸 유형과 참여 상태에 맞춘 입장 흐름",
      summary: "공개·비공개 여부와 정원, 초대 코드 조건을 한 입장 화면에서 처리했습니다.",
      problem:
        "스터디룸마다 공개 여부와 참여 상태가 달랐고 비공개 방은 초대 코드를 확인해야 해 같은 입장 버튼에서도 처리 조건이 달랐습니다.",
      constraint:
        "현재 참여자, 정원과 방 유형을 함께 확인하고 비동기 코드 검증이 끝난 뒤에만 방 상태와 화면을 바꿔야 했습니다.",
      decision:
        "방 정보와 로그인 사용자를 기준으로 초대 코드 필요 여부를 계산하고, 입장 전 검증과 오류 안내를 모달 안에서 순서대로 처리했습니다.",
      implementation: [
        "참여자 목록과 방 공개 유형으로 초대 코드 입력 필요 여부를 계산했습니다.",
        "정원 초과와 코드 불일치를 각각 안내하고 검증에 성공했을 때만 Pinia의 현재 방 상태를 갱신했습니다.",
        "방 입장·나가기와 즐겨찾기 목록 갱신을 같은 room store와 API 모듈을 통해 연결했습니다.",
      ],
      outcome:
        "공개방과 비공개방의 정원·초대 코드·기존 참여 여부에 맞춰 입장과 나가기 상태가 이어지는 화면 흐름을 구현했습니다.",
    },
    {
      id: "realtime-room-ui",
      area: "Frontend",
      title: "스터디룸 채팅과 방 이동 상태를 화면에 연결",
      summary: "실시간 메시지를 화면에 반영하고 방을 옮길 때 이전 연결과 채팅 로그를 정리했습니다.",
      problem:
        "방을 옮길 때 이전 채팅이 남거나 연결이 계속 유지되면 다른 스터디룸의 메시지와 참여 상태가 섞일 수 있었습니다.",
      constraint:
        "방 정보와 채팅 로그는 여러 컴포넌트가 함께 사용했고 입장·퇴장·즐겨찾기 이동에 따라 연결 생명주기를 맞춰야 했습니다.",
      decision:
        "현재 방과 채팅 로그를 Pinia store로 나누고 방 진입 전 로그를 비운 뒤, 화면은 store에 들어온 메시지만 렌더링하도록 구성했습니다.",
      implementation: [
        "채팅 목록과 입력 컴포넌트를 분리하고 로그인 사용자를 기준으로 메시지 표시를 구분했습니다.",
        "방 입장 시 이전 채팅 로그를 초기화하고 새 방 정보가 준비된 뒤 채팅 화면을 열도록 연결했습니다.",
        "방을 나가거나 즐겨찾기 목록에서 다른 방으로 입장할 때 기존 연결을 정리하고 새 방 정보를 조회했습니다.",
      ],
      outcome:
        "방을 옮길 때 이전 연결과 채팅 로그를 정리해 다른 스터디룸의 메시지가 섞이지 않도록 했습니다.",
    },
  ],
  reachrich: [
    {
      id: "selective-core-migration",
      area: "Full Stack",
      title: "기존 코어 전체가 아닌 검증 자산만 선별 이식",
      summary: "검증된 로직은 보존하고 연구·운영 책임은 여섯 개 모듈로 다시 나눴습니다.",
      problem:
        "기존 투자 연구 코어에는 검증 로직과 실험용 스크립트, 운영 코드와 대시보드가 함께 쌓여 있어 기능을 추가할수록 변경 범위가 넓어졌습니다.",
      constraint:
        "미래 데이터 혼입을 막는 검증과 실험 이력, 모의운용 원장은 유지해야 했지만 기존 코드의 결합과 오래된 실행 방식까지 함께 옮기면 재설계 의미가 없었습니다.",
      decision:
        "새 저장소에서 데이터·종목 선정·전략·검증·운용·콘솔의 책임을 먼저 나누고, 각 경계를 통과할 수 있는 검증 자산만 골라 이식했습니다.",
      implementation: [
        "미래 데이터 혼입 검사, 시간 순서를 보존한 반복 검증(Purged Walk-forward), 표준 성과 지표와 실험 이력 모듈을 선별 이식했습니다.",
        "기준 성과와의 차이를 확인하는 Tracking Error 비교와 가격 기준의 멱등 모의운용 원장은 기존 표본을 보존해 새 운용 영역으로 옮겼습니다.",
        "기존 관리 화면과 레거시 스크립트는 가져오지 않고 계좌 추적, 데이터 수집과 React 콘솔은 새 경계에 맞춰 구현했습니다.",
      ],
      outcome:
        "기존 검증 기준을 버리지 않으면서도 새 기능이 어느 책임에 속하는지 분명한 여섯 모듈 구조로 연구와 운영 흐름을 다시 구성했습니다.",
    },
    {
      id: "idempotent-market-mirror",
      area: "Backend",
      title: "반복 실행과 부분 실패를 고려한 계좌·시장 데이터 수집",
      summary: "외부 API 결과를 날짜 기준의 SQLite·Parquet 로컬 미러로 만들었습니다.",
      problem:
        "계좌와 KRX 데이터를 매일 모으는 작업은 같은 날 다시 실행하거나 일부 종목만 실패할 수 있어, 응답을 그대로 덧붙이면 중복과 불완전한 데이터가 쌓일 수 있었습니다.",
      constraint:
        "OAuth2 토큰 수명과 호출 제한을 지켜야 했고, 당시의 종목 구성을 남기면서도 개별 종목 오류가 전체 수집을 무조건 중단시키지 않도록 해야 했습니다.",
      decision:
        "계좌는 날짜 단위로 교체 저장하고 KRX 일봉은 종목·날짜 기준으로 upsert하며, 그날의 종목 목록은 별도 스냅샷으로 남기는 로컬 미러 방식을 선택했습니다.",
      implementation: [
        "OAuth2 토큰은 만료 60초 전까지 재사용하고, 429 응답은 Retry-After 값만큼 기다린 뒤 한 번 재시도했습니다.",
        "거래대금 상위 종목 목록을 날짜별로 저장하고 종목별 일봉은 Parquet에서 같은 날짜를 새 값으로 교체했습니다.",
        "종목 하나의 실패는 격리해 다음 종목을 수집하되 전체의 30%를 넘으면 부분 성공을 정상 결과로 보지 않고 작업을 실패 처리했습니다.",
      ],
      outcome:
        "실제 API로 5개 종목의 일봉 10개씩 총 50행과 환율 1행을 적재했고, 문서와 달랐던 랭킹 응답 필드도 라이브 검증에서 찾아 수정했습니다.",
      code: {
        language: "Python",
        title: "날짜 기준 Parquet upsert",
        content: `incoming["date"] = incoming["date"].map(to_iso)
existing = pd.read_parquet(path) if path.exists() else pd.DataFrame()

merged = pd.concat([existing, incoming], ignore_index=True)
merged = merged.drop_duplicates(subset="date", keep="last")
merged = merged.sort_values("date").reset_index(drop=True)
merged.to_parquet(path, index=False)`,
        note: "실제 저장소의 종목별 일봉 병합 흐름에서 경로와 예외 처리를 덜어내고 공개용으로 축약한 예시입니다.",
      },
    },
    {
      id: "privacy-aware-dashboard",
      area: "Frontend",
      title: "실계좌 데이터를 안전하게 읽는 React 운영 화면",
      summary: "로컬 스냅샷을 자산 요약·곡선·보유 종목과 시스템 상태로 연결했습니다.",
      problem:
        "계좌 수집 결과가 명령행과 알림 메시지에 흩어져 있어 기간별 변화를 한눈에 보기 어려웠고, 실제 금액이 담긴 화면을 다른 사람 앞에서 열기도 부담스러웠습니다.",
      constraint:
        "서버는 인증 없이 로컬에서만 실행하므로 외부 노출을 막아야 했고, 주기적으로 갱신하면서도 보이지 않는 브라우저 탭에서 불필요한 요청을 계속 보내지 않아야 했습니다.",
      decision:
        "외부 API를 직접 호출하지 않고 로컬 스냅샷만 읽는 조회 API를 두고, React 화면에 금액 가리기와 탭 가시성 기반 폴링을 함께 적용했습니다.",
      implementation: [
        "자산 요약, 기간별 자산 곡선, 보유 종목과 수집 상태를 네 개의 조회 API와 화면 컴포넌트로 연결했습니다.",
        "프라이버시 모드는 브라우저에 선택을 보관해 금액을 가리고, 라이트·다크·시스템 테마와 PWA 앱 셸을 구성했습니다.",
        "탭이 숨겨지면 폴링을 건너뛰고 다시 보이는 순간 즉시 최신 데이터를 조회하도록 공통 훅으로 분리했습니다.",
      ],
      outcome:
        "Vitest 75개와 프로덕션 빌드를 통과했고 초기 JavaScript 번들을 gzip 119.18KB로 유지하면서 계좌 상태를 한 화면에서 확인할 수 있게 했습니다.",
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
        note: "실제 공통 훅에서 최초 조회를 제외하고, 숨은 탭의 요청을 건너뛰며 리스너를 정리하는 핵심만 옮긴 예시입니다.",
      },
    },
    {
      id: "observable-automation",
      area: "배포",
      title: "멈춰도 놓치지 않도록 실행 경로와 실패 경보 분리",
      summary: "로컬 수집과 클라우드 실행의 제약을 나누고 각 경로에 상태 확인을 붙였습니다.",
      problem:
        "정해진 시간에 실행되는 수집과 모의운용 작업은 실패해도 화면을 보고 있지 않으면 알아차리기 어려워 데이터 공백이 조용히 누적될 수 있었습니다.",
      constraint:
        "계좌와 KRX API는 허용된 IP에서만 호출할 수 있어 로컬에서 실행해야 했지만, 헬스체크와 모의운용 적립은 PC 상태와 무관하게 계속 돌아야 했습니다.",
      decision:
        "IP가 필요한 수집은 로컬 일일 러너로 묶고, 테스트·헬스체크·모의운용은 GitHub Actions로 분리해 각 작업이 실패를 직접 알리도록 했습니다.",
      implementation: [
        "로컬 러너는 계좌 스냅샷과 KRX 수집을 순서대로 실행하되 한 단계가 실패해도 다른 단계는 계속 진행하도록 구성했습니다.",
        "GitHub Actions에서 백엔드·프론트엔드 테스트와 빌드, 일일 헬스체크와 멱등 모의운용 원장 적립을 실행했습니다.",
        "정상 실행뿐 아니라 강제 실패 옵션으로 텔레그램 경보가 실제 도착하는 경로까지 확인했습니다.",
      ],
      outcome:
        "CI와 일일 헬스체크, 모의운용 워크플로의 성공 실행을 확인했고 강제 실패 시 알림이 도착해 조용한 중단을 감지할 수 있게 했습니다.",
    },
  ],
};

export const hasProjectCaseStudies = (projectId: string): projectId is keyof typeof projectCaseStudies =>
  Object.prototype.hasOwnProperty.call(projectCaseStudies, projectId);
