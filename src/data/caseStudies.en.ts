import type { CaseStudyProjectId, ProjectCaseStudy } from "./caseStudies.ko";

export const enProjectCaseStudies: Record<CaseStudyProjectId, ProjectCaseStudy[]> = {
  pps: [
    {
      id: "archive-job",
      area: "Full Stack",
      title: "Splitting bulk attachment downloads into tracked jobs",
      summary: "Replaced a long-blocking request with a job ID and status polling.",
      problem:
        "Compressing 300–400 attachments in one request kept the HTTP call open for a long time, and users couldn't tell whether the job was running or had failed.",
      constraint:
        "The existing file-selection and download UX had to stay, while the screen and server needed to identify the same job across refreshes, failures, and result-file expiry.",
      decision:
        "Separate compression from the browser request, and link progress and result files through a server-issued job ID.",
      implementation: [
        "The archive request returns a job ID first; the actual compression runs in a separate worker.",
        "The screen checks waiting / running / done / failed states every 2 seconds and keeps the job ID in the browser.",
        "Completed files download through a separate request, and old result files are cleaned up by an expiry policy.",
      ],
      outcome:
        "Long HTTP request occupancy dropped, and users can watch progress and download the same job's results even after a page refresh.",
      code: {
        language: "JavaScript",
        title: "Status polling driven by a job ID",
        content: `const jobId = await startArchive(selectedIds);
sessionStorage.setItem("archiveJobId", jobId);

for (let count = 0; count < MAX_POLL_COUNT; count += 1) {
  const job = await getArchiveStatus(jobId);
  if (job.status === "DONE") return downloadArchive(jobId);
  if (job.status === "ERROR") throw new Error("Archive job failed");
  await delay(2_000);
}

showRetryGuide();`,
        note: "An abbreviated example showing only the screen's status polling and exit conditions — the actual internal code is not disclosed.",
      },
    },
    {
      id: "vue-state-isolation",
      area: "Frontend",
      title: "Isolating shared state that leaked between Vue screens",
      summary: "Nested objects shared through shallow copies are now created fresh per screen.",
      problem:
        "Query filters and title info used on one admin screen lingered on others, so stale state showed up after navigating between screens.",
      constraint:
        "Multiple screens shared the same common script, so the shared API had to stay while each Vue instance's state was isolated.",
      decision:
        "Instead of shallow-copying an initial object, use a factory that returns fresh nested objects per screen creation, plus explicit resets.",
      implementation: [
        "Replaced the copy-a-shared-constant initializer with a per-instance state factory.",
        "Made nested state like search filters and page titles get a new reference every time.",
        "Explicitly reset the necessary state when reopening a screen or switching tabs.",
      ],
      outcome:
        "Admin screens no longer share nested state, eliminating leftover query filters and display values from previous screens.",
      code: {
        language: "JavaScript",
        title: "Returning fresh state per instance",
        content: `const createInitialState = () => ({
  filters: { keyword: "", status: "ALL" },
  selectedRows: [],
  pageTitle: { main: "", sub: "" },
});

export const createCommonData = () => createInitialState();

// Reopening a screen resets from the same baseline
Object.assign(vm.$data, createInitialState());`,
        note: "Variable names and business values are generalized — the example shows only the state-isolation principle.",
      },
    },
    {
      id: "account-issuance",
      area: "Full Stack",
      title: "Unifying the fragmented HQ account provisioning process",
      summary: "A process spread across systems and manual entry now lives in one admin screen.",
      problem:
        "Internal and portal accounts were created separately and their results reflected in the DB by hand, leaving room for omissions and mismatched records.",
      constraint:
        "Organization/ID validation and both systems' results had to agree, and failures couldn't leave partial account records behind.",
      decision:
        "Make the portal the single provisioning entry point, tying pre-validation, account creation, and internal-system forwarding into one flow.",
      implementation: [
        "Department, title, and ID duplicates are checked first; saving is allowed only when required fields are complete.",
        "User and employee records are saved in the same transaction scope, rolling back on failure.",
        "Creation, updates, and credential re-sending all happen on one screen, with internal-system forwarding results visible alongside.",
      ],
      outcome:
        "What used to be three separate steps — internal account creation, portal account creation, and manual DB updates — became a single provisioning flow on one screen.",
    },
    {
      id: "notification-policy",
      area: "Backend",
      title: "Consolidating notification rules and recipient handling",
      summary: "Dispatch policies scattered across features moved into a common service and settings.",
      problem:
        "Every feature that sent notifications had its own dispatch conditions and recipient logic, so policy changes meant editing several codepaths at once.",
      constraint:
        "Per-feature send timing had to stay, duplicate recipients had to be removed, and operators needed to adjust targets and toggles without a deploy.",
      decision:
        "Move the frequently changing dispatch policy into DB settings, and have each feature call a common dispatch service.",
      implementation: [
        "Replaced recipient lookup and dispatch calls scattered across features with a common service.",
        "Per-type enablement and recipient conditions are read from the DB, with duplicate recipients removed.",
        "Covered the outcome-affecting branches — send/skip decisions and recipient selection — with unit tests.",
      ],
      outcome:
        "Policy changes now mean adjusting shared settings instead of editing multiple feature codepaths.",
    },
    {
      id: "jenkins-deployment",
      area: "Deployment",
      title: "Fixing the repeated deployment sequence into Jenkins jobs",
      summary: "Build, transfer, backup, and two-server deployment now run the same way every time.",
      problem:
        "Source updates, builds, file transfers, backups, and two-server deployments were repeated by hand, requiring a manual check for skipped steps each time.",
      constraint:
        "With no dedicated deployment server, the existing server layout and deployment order had to stay, applied identically to dev and production.",
      decision:
        "Fix the human-memory-driven sequence into Jenkins jobs and scripts that leave an execution record.",
      implementation: [
        "Chained source checkout, Gradle build, server transfer, and backup of existing files in order.",
        "Scripted the two WAS servers to deploy sequentially rather than being swapped at once.",
        "Separated dev and production jobs, with each step's success and history visible in Jenkins.",
      ],
      outcome:
        "Repeated deployments run in the same order with per-step results visible, reducing the chance of missed manual steps.",
    },
  ],
  tsms: [
    {
      id: "external-api-proxy",
      area: "Full Stack",
      title: "Removing exposed API keys and consolidating call paths",
      summary: "Browser calls from 25 screens moved to a common server path.",
      problem:
        "Address-search and national education system (NEIS) keys lived in browser code, and every screen needed separate edits whenever integration details changed.",
      constraint:
        "The 25 existing screens' input and response formats had to stay, while keys and external endpoints could no longer be exposed to users.",
      decision:
        "Since rotating keys would just repeat the problem, move external-call responsibility from screens to the server and manage settings in one place.",
      implementation: [
        "Added a common Controller and Service that proxy external API requests.",
        "Moved keys and external URLs into server configuration; screens receive only the responses they need.",
        "Aligned the 25 WebSquare screens' request paths and error handling to a common response format.",
      ],
      outcome:
        "API keys visible in the browser were pulled back to the server, and integration changes now happen in one common server path instead of per-screen code.",
    },
    {
      id: "resale-monitoring",
      area: "Full Stack",
      title: "Digitizing used-market listing monitoring",
      summary: "Records and duplicates are managed by analyzing URL strings only — no requests to external sites.",
      problem:
        "The operations team repeatedly searched multiple marketplaces by keyword and region, tracking suspicious listings, screenshots, and actions separately.",
      constraint:
        "Internal security and external site policies ruled out server requests or iframes, so human visual confirmation had to stay in the loop.",
      decision:
        "Scope the system so searching and viewing happen in a new tab, and the server analyzes only the URL string an inspector pastes.",
      implementation: [
        "Stripped fragments and tracking parameters, then identified the platform and listing ID with per-site rules.",
        "Used site code + listing ID when available, falling back to the normalized full URL for duplicate checks.",
        "Connected search links, listing links with screenshots, sale details, and action history into one workflow.",
      ],
      outcome:
        "Without ever contacting external sites, the records, duplicate checks, and action history that follow repeated searches are now managed in the system.",
      code: {
        language: "Java",
        title: "Core flow of the URL string analysis",
        content: `String normalized = normalizeUrl(inputUrl);
SiteRule site = findMatchingRule(normalized);
String postId = extractPostId(site.getPostIdPattern(), normalized);

return postId != null
    ? existsBySiteAndPostId(site.getSiteCode(), postId)
    : existsByNormalizedUrl(normalized);`,
        note: "Table names, regexes, and site addresses are omitted — only the string-processing order is shown, in Java form. No external site requests occur.",
      },
    },
    {
      id: "device-qr-validation",
      area: "Backend",
      title: "Bulk device registration validation and QR issuance",
      summary: "Moved validation ahead of saving: production-intake records and prior registrations are checked first.",
      problem:
        "Excel-based device registration could include serial numbers missing from production intake, or already registered to another school or user.",
      constraint:
        "Bulk registration of valid rows had to stay, while invalid devices were separated before saving and existing ownership shown to the operator.",
      decision:
        "Rather than cleaning up errors after registration, check master data and third-party registrations before saving to block bad writes.",
      implementation: [
        "Matched input serials against the production-intake master, returning unknown devices as an error list.",
        "For already-registered devices, returned the existing school and user so conflicts are immediately explainable.",
        "Used external-facing tokens in QR codes instead of raw DB identifiers.",
      ],
      outcome:
        "Invalid devices are now separated at the bulk-registration step, and QR codes no longer expose internal identifiers. This feature runs in operations covering about 110,000 devices.",
    },
    {
      id: "field-inspection",
      area: "Full Stack",
      title: "On-site inspection and re-inspection history",
      summary: "Paper checklists and multi-round revisit history are now linked by school and device.",
      problem:
        "Paper checklists made per-school progress hard to see, and 2nd/3rd revisits for lost or absent devices couldn't be tracked as a sequence.",
      constraint:
        "Field reality meant not every device could be inspected in one visit; multiple rounds per school and device, signatures, and result documents all had to be handled together.",
      decision:
        "Instead of storing only per-school completion, structure per-device rounds and results so each visit carries into the next.",
      implementation: [
        "Split input and read-only modes by role and progress, jumping to the first invalid field on missing required values.",
        "Carried unfinished devices into the next round, with previous reasons and results visible alongside.",
        "Included touch signatures, unsaved-navigation warnings, and certificate/result file issuance in the same inspection flow.",
      ],
      outcome:
        "Inspections and re-inspections are now managed per school and device in one system. As of July 2026, about 3,800 inspection records span the 119-school program.",
    },
  ],
  ssafast: [
    {
      id: "dynamic-api-form",
      area: "Frontend",
      title: "An API spec form supporting repeating and nested inputs",
      summary: "Request fields and responses can be added freely, then saved in the server's document structure.",
      problem:
        "API specs include headers, query, path, body, and multiple responses — and bodies can nest existing DTOs — so a fixed input form couldn't express them.",
      constraint:
        "Repeating fields had to be added and removed on one screen, and the screen's input arrays had to be split into plain fields and nested DTO structures for the server.",
      decision:
        "Share per-section input state with React Hook Form, manage the screen as easy-to-edit arrays, and convert to the server's document structure at submit time.",
      implementation: [
        "Applied useFieldArray to headers, query, path, body, and responses to handle repeating items.",
        "Showed primitive types and workspace DTOs in one selector, recombining DTOs into nested structures at submit.",
        "Made responses addable and collapsible per status code, with screen rules preventing the required success response from being duplicated or deleted.",
      ],
      outcome:
        "Multiple request fields, nested DTOs, and multiple responses can be edited in one authoring flow, with saved results reflected back into the API list.",
      code: {
        language: "TypeScript",
        title: "Input validation before adding a response status code",
        content: `const addComponentHandler = () => {
  if (codeRef.current?.value.length !== 3) {
    showToast("Status codes must be 3 digits.");
  } else if (descRef.current?.value === "") {
    showToast("Please describe the status code.");
  } else if (codeRef.current?.value === "200") {
    showToast("Status code 200 is already registered.");
  } else {
    addComponent();
  }
};`,
        note: "A readability-trimmed version of the public repository's actual flow: it validates the status-code format and description, and blocks duplicate registration of the default 200 response.",
      },
    },
    {
      id: "load-test-flow",
      area: "Frontend",
      title: "Connecting load-test execution through to result details",
      summary: "Target-server verification, API selection, run conditions, and result history as staged screens.",
      problem:
        "A load test isn't just picking an API — it needs target-server authentication, request values, run conditions, and result history in sequence.",
      constraint:
        "Only authenticated servers could be tested, and the spec's header/path/query/body values had to be reassembled into a real execution request.",
      decision:
        "Show authentication guidance first when unverified; once verified, separate the API/request setup and result areas so the usage order is clear.",
      implementation: [
        "Checked per-base-URL auth state, showing per-environment guidance and a code-entry modal when unverified.",
        "Filled the execution form from the selected spec, validating request fields and load conditions into a run object.",
        "Split results into history and detail views showing latency buckets, throughput, and counts per status code.",
      ],
      outcome:
        "Server authentication, API selection, run configuration, and result review connect in a single screen flow.",
    },
  ],
  ddoing: [
    {
      id: "drawing-session-state",
      area: "Frontend",
      title: "Stabilizing the drawing session's timers and step state",
      summary: "Time limits, judgement results, and restarts across 6 words no longer overlap.",
      problem:
        "On restart, a leftover interval made the timer run fast, and the new word list arrived late enough that the old list briefly lingered.",
      constraint:
        "Canvas input, the time limit, the current question, the result modal, and word descriptions moved together, while word lists and inference results arrived asynchronously.",
      decision:
        "Concentrate session state in the Drawing page, keep interval IDs in refs, and clear them explicitly on modal open, step changes, and restarts.",
      implementation: [
        "Managed the current question, correct count, timer, modal, and word list as one learning flow.",
        "Converted Canvas drawings to images, sent them to the trained classifier's inference API, and reflected judgements on screen.",
        "Used a custom effect that skips the initial render, and reset intervals and session state on restart.",
      ],
      outcome:
        "Timed learning, judgement, next-question, and final results now connect properly — fixing the duplicated timers and stale word lists that appeared on restart.",
      code: {
        language: "TypeScript",
        title: "Converting the Canvas result into an upload file",
        content: `const dataURLtoFileObject = (dataURL: string, fileName: string) => {
  const [, encoded] = dataURL.split(",");
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], fileName, { type: "image/png" });
};`,
        note: "The public repository's actual conversion logic with only variable names tidied: the Canvas Data URL becomes a PNG File used in the drawing-save request.",
      },
    },
    {
      id: "main-api-content",
      area: "Frontend",
      title: "Turning the main screen into API-driven content",
      summary: "Static cards were replaced with popular videos and a drawing gallery loaded from APIs.",
      problem:
        "The main screen stopped at introducing the service; it needed a structure for showing popular content and users' best work from real data.",
      constraint:
        "Popular videos and the drawing gallery used different API responses, and the carousels had no valid arrays until data arrived.",
      decision:
        "Let the page own both responses, passing only the arrays each component needs to the popular-content and hall-of-fame components.",
      implementation: [
        "Requested popular videos and gallery data separately on mount, with separate response types and state.",
        "Composed the service banner, popular content, and hall of fame as separate carousels.",
        "Rendered drawing paths, words, nicknames, and scores in a loop, with navigation to video details and the service screens.",
      ],
      outcome:
        "The main screen now shows popular videos and real drawings instead of static cards, with API responses and display components cleanly separated.",
    },
  ],
  modac: [
    {
      id: "study-room-entry",
      area: "Frontend",
      title: "An entry flow driven by room type and membership state",
      summary: "Public/private rooms, capacity, and invite codes handled in one entry screen.",
      problem:
        "Rooms differed in visibility and membership, and private rooms required invite-code checks — so the same entry button had different rules per room.",
      constraint:
        "Current members, capacity, and room type had to be checked together, and room state and screens could change only after async code validation finished.",
      decision:
        "Compute whether an invite code is needed from the room and the signed-in user, handling pre-entry validation and error guidance in order inside a modal.",
      implementation: [
        "Computed invite-code necessity from the member list and room visibility.",
        "Surfaced capacity-full and code-mismatch errors separately, updating Pinia's current-room state only on successful validation.",
        "Connected entry/exit and favorites updates through the same room store and API module.",
      ],
      outcome:
        "Entry and exit now flow consistently across public and private rooms, respecting capacity, invite codes, and existing membership.",
    },
    {
      id: "realtime-room-ui",
      area: "Frontend",
      title: "Wiring room chat and room-switching state to the screen",
      summary: "Real-time messages render on screen, and switching rooms cleans up the old connection and chat log.",
      problem:
        "When switching rooms, leftover chat or a lingering connection could mix another room's messages and membership state into the current one.",
      constraint:
        "Room info and chat logs were shared by several components, and connection lifecycles had to follow entry, exit, and favorites navigation.",
      decision:
        "Split current-room and chat-log state into Pinia stores, clear logs before entering a room, and render only messages that arrive through the store.",
      implementation: [
        "Separated the chat list and input components, distinguishing message display by the signed-in user.",
        "Cleared the previous chat log on entry and opened the chat screen only after the new room's data was ready.",
        "Cleaned up existing connections and fetched fresh room data when leaving or entering another room from favorites.",
      ],
      outcome:
        "Switching rooms now clears the previous connection and chat log, so messages from other study rooms never mix in.",
    },
  ],
  reachrich: [
    {
      id: "selective-core-migration",
      area: "Full Stack",
      title: "Porting only validated assets, not the whole legacy core",
      summary: "Validated logic was preserved while research/operations responsibilities were split into six modules.",
      problem:
        "The old research core mixed validation logic, experiment scripts, operations code, and a dashboard — every new feature widened the blast radius.",
      constraint:
        "Lookahead-prevention checks, the experiment ledger, and the paper-trading ledger had to survive, but dragging along the old coupling and run patterns would defeat the redesign.",
      decision:
        "Define responsibilities first in the new repository — data, universe, strategy, validation, operations, console — then port only the validated assets that fit those boundaries.",
      implementation: [
        "Selectively ported lookahead checks, Purged Walk-forward validation, standard metrics, and the experiment-ledger module.",
        "Moved Tracking Error comparison and the price-based idempotent paper-trading ledger into the new operations area, preserving existing samples.",
        "Left the old admin screens and legacy scripts behind; account tracking, data collection, and the React console were built fresh against the new boundaries.",
      ],
      outcome:
        "The research and operations flow was rebuilt on a six-module structure where every new feature has an obvious home — without abandoning the existing validation standards.",
    },
    {
      id: "idempotent-market-mirror",
      area: "Backend",
      title: "Account and market data collection built for re-runs and partial failures",
      summary: "External API results become a date-keyed SQLite/Parquet local mirror.",
      problem:
        "Daily account and KRX collection can be re-run the same day or fail for some symbols — appending responses as-is would accumulate duplicates and incomplete data.",
      constraint:
        "OAuth2 token lifetimes and rate limits had to be respected, that day's universe had to be preserved, and one symbol's failure couldn't always abort the whole run.",
      decision:
        "Store accounts with per-date replacement, upsert KRX candles by symbol and date, and keep each day's universe as a separate snapshot — a local mirror.",
      implementation: [
        "Reused OAuth2 tokens until 60 seconds before expiry, and retried 429 responses once after waiting out Retry-After.",
        "Stored the top-traded universe per date, replacing same-date rows in each symbol's Parquet candles.",
        "Isolated single-symbol failures and moved on — but failed the whole job if more than 30% of symbols failed, refusing to treat partial success as normal.",
      ],
      outcome:
        "Loaded 50 rows of daily candles (5 symbols × 10) plus 1 FX row from the real API — and live verification caught a ranking-response field that differed from the documentation.",
      code: {
        language: "Python",
        title: "Date-keyed Parquet upsert",
        content: `incoming["date"] = incoming["date"].map(to_iso)
existing = pd.read_parquet(path) if path.exists() else pd.DataFrame()

merged = pd.concat([existing, incoming], ignore_index=True)
merged = merged.drop_duplicates(subset="date", keep="last")
merged = merged.sort_values("date").reset_index(drop=True)
merged.to_parquet(path, index=False)`,
        note: "The per-symbol candle merge from the real repository, trimmed of paths and error handling for public display.",
      },
    },
    {
      id: "privacy-aware-dashboard",
      area: "Frontend",
      title: "A React operations screen that reads real account data safely",
      summary: "Local snapshots feed the asset summary, equity curve, holdings, and system status.",
      problem:
        "Collection results were scattered across the CLI and alert messages, making period-over-period change hard to see — and a screen full of real amounts wasn't something to open in front of others.",
      constraint:
        "The server runs locally without authentication, so exposure had to be prevented; periodic refresh couldn't keep firing requests from hidden browser tabs.",
      decision:
        "Serve read-only APIs over local snapshots — never calling external APIs directly — and pair the React screens with amount masking and visibility-based polling.",
      implementation: [
        "Connected asset summary, period equity curve, holdings, and collection status through four read APIs and screen components.",
        "Privacy mode persists in the browser to mask amounts, alongside light/dark/system themes and a PWA app shell.",
        "Extracted a shared hook that skips polling while the tab is hidden and refreshes immediately when it becomes visible.",
      ],
      outcome:
        "75 Vitest tests and the production build passed, the initial JavaScript bundle stayed at 119.18KB gzipped, and account state is now visible on one screen.",
      code: {
        language: "TypeScript",
        title: "Polling that follows tab visibility",
        content: `const refreshWhenVisible = () => {
  if (document.visibilityState === "visible") tick();
};
const timer = setInterval(refreshWhenVisible, intervalMs);
document.addEventListener("visibilitychange", refreshWhenVisible);

return () => {
  clearInterval(timer);
  document.removeEventListener("visibilitychange", refreshWhenVisible);
};`,
        note: "The core of the real shared hook, minus the initial fetch: skip hidden-tab requests and clean up listeners.",
      },
    },
    {
      id: "observable-automation",
      area: "Deployment",
      title: "Separate execution paths with failure alerts, so silence never hides a stop",
      summary: "Local collection and cloud runs were split by constraint, each with its own health reporting.",
      problem:
        "Scheduled collection and paper-trading jobs can fail unnoticed when no one is watching, letting data gaps accumulate silently.",
      constraint:
        "The account and KRX APIs only accept calls from allow-listed IPs, forcing local execution — but health checks and paper-trading accrual had to keep running regardless of the PC's state.",
      decision:
        "Bundle IP-bound collection into a local daily runner, move tests/health checks/paper trading to GitHub Actions, and have every job report its own failures.",
      implementation: [
        "The local runner executes account snapshots and KRX collection in order, continuing past a failed step.",
        "GitHub Actions runs backend/frontend tests and builds, the daily health check, and idempotent paper-trading accrual.",
        "Verified not just normal runs but the alert path itself, using a forced-failure option to confirm Telegram alerts actually arrive.",
      ],
      outcome:
        "CI, daily health checks, and the paper-trading workflow run green — and forced failures deliver alerts, so silent stoppages get detected.",
    },
  ],
};
