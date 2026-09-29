import type { FeaturedProject } from "./portfolio.ko";

export const profile = {
  name: "Yongjae Kwon",
  role: "Web Developer",
  summary:
    "I work with business stakeholders to shape requirements, then build whatever the feature needs — from the UI to the server logic and data handling. After shipping, I deploy the work myself and follow how it is actually used.",
  email: "yongjae116@gmail.com",
  phone: "010-9470-1704",
  github: "https://github.com/YongjaeKwon",
  location: "Yongin, South Korea",
  resume: "/resume-en.pdf?v=20260928",
};

const backendResume = "/resume-backend-en.pdf?v=20260928";

export const focusTracks = [
  {
    id: "all" as const,
    label: "All",
    role: "Web Developer",
    headline: "I build the features that are needed, and follow them into real use.",
    target:
      "After shaping requirements with business stakeholders, I take on whatever the work needs — UI, server logic, data handling, and deployment.",
    resume: profile.resume,
    projectIntro: "Screens and feature flows I built hands-on in personal and team projects.",
    projectOrder: ["pps", "tsms", "ticketrush", "oneulsai", "reachrich", "ssafast", "ddoing", "modac"],
  },
  {
    id: "frontend" as const,
    label: "Frontend",
    role: "Frontend Developer",
    headline: "I build screens that keep users on track through complex workflows.",
    target:
      "Across production Vue/WebSquare screens and personal/team React projects, I design screens so users always understand their next step — even through complex inputs and changing state.",
    resume: profile.resume,
    projectIntro: "My contributions, focused on screen structure, input handling, progress states, and error guidance.",
    projectOrder: ["reachrich", "oneulsai", "ssafast", "ddoing", "modac", "pps", "tsms"],
  },
  {
    id: "backend" as const,
    label: "Backend",
    role: "Backend Developer",
    headline: "I build and operate server features that fit real business workflows.",
    target:
      "In Spring-based business systems I develop server logic, SQL, and external integrations, and own the deployment and operations that follow.",
    resume: backendResume,
    projectIntro: "Server-side processing, data validation, and operational automation from my personal projects.",
    projectOrder: ["pps", "tsms", "ticketrush", "oneulsai", "reachrich"],
  },
];

export const featuredProjects: FeaturedProject[] = [
  {
    id: "pps",
    title: "B2B Partner Portal (PPS)",
    shortTitle: "Partner Portal",
    period: "Feb 2025 – present",
    category: "B2B Partner Portal",
    focuses: ["all", "frontend", "backend"],
    stack: ["Vue", "Java 21", "Spring Boot", "MyBatis", "MariaDB", "Oracle", "Hazelcast", "Jenkins"],
    card: {
      summary:
        "A B2B operations portal where headquarters and ~500 partner companies handle partner registration and contracts, plus training, certification, and evidence documents for 824 field-engineer accounts.",
      description: [
        "I build the screens, APIs, and SQL for partner and field-engineer management, training, and evidence workflows, and own their deployment and operations.",
        "I improved recurring work and operational pain points: bulk file downloads, HQ account provisioning, notification policies, and the deployment process.",
      ],
      result:
        "Long-running archive requests were split into tracked jobs, so users can watch progress and resume downloads even after a page refresh.",
      keywords: ["Async bulk file processing", "HQ account & internal system integration", "Deployment pipeline"],
      visibility: "Private work project",
      workRange: "Initial build · feature development · UAT · deployment · operations",
      environment: "Vue · Spring Boot · MyBatis · Jenkins",
    },
    detail: {
      overview:
        "A B2B operations portal where headquarters and partner companies handle partner registration and contracts, plus training, certification, evidence, and evaluation for field engineers (CEs). I develop the business screens, APIs, and SQL, integrate external systems, run user acceptance, and own deployment and operations.",
      scope: [
        "Training targets, evidence, and account management features",
        "Improved archive downloads for 300–400 attachments per request",
        "HQ account provisioning integrated with the internal HR system",
        "Build, transfer, and deployment process setup and operation",
      ],
      workPoints: [
        "Synchronous archive downloads took a long time for 300–400 files, and users couldn't tell whether the job was running or had failed. I changed it to issue a job ID first, run compression in a separate worker, and poll status every 2 seconds. After a page refresh the job is found again; completed files are downloadable and expired files are cleaned up.",
        "I built the HQ account registration screen and wired department/title validation, ID duplicate checks, and initial-password/OTP generation into the server flow. User and employee records are saved together and forwarded to the internal HR system.",
        "I organized source checkout, build, server transfer, backup of existing files, and sequential deployment across two servers into Jenkins jobs and scripts.",
      ],
      caseStudy: {
        problem:
          "Compressing 300–400 attachments in one request kept the HTTP call waiting for a long time, and users couldn't tell whether it was still running or had failed.",
        decision:
          "Separate the screen request from the compression work, and connect server state to the user's screen through a job ID.",
        implementation: [
          "A dedicated worker runs the compression and records waiting / running / done / failed states.",
          "The Vue screen polls status every 2 seconds and finds the same job again after a page refresh.",
          "Completed files are streamed for download and expired result files are cleaned up automatically.",
        ],
        outcome: [
          "Bulk downloads of 300–400 attachments now run as asynchronous jobs in production.",
          "Users can see progress and failures, and resume downloading completed files.",
        ],
      },
      results: [
        "Users can now see progress and failure states during bulk downloads.",
        "Account provisioning and HR-system forwarding are used in day-to-day operations.",
        "The repeated build–transfer–deploy sequence now runs as Jenkins jobs.",
      ],
      techUsage: [
        "Vue and Tabulator for the admin screens and job-progress UI.",
        "Spring Boot and MyBatis for async job state, account provisioning, validation, and external forwarding.",
        "Jenkins, Gradle, and Linux scripts for the dev/production deployment sequence.",
      ],
      disclosure:
        "This is an internal project; company and client details, real screens, and stored data are not disclosed.",
      resources: [],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "I built the partner-facing screens and the status UI for long-running work like bulk downloads.",
          description: [
            "Built training, target, survey, and account management screens in Vue, with inputs and buttons split by permission and processing state.",
            "Showed waiting / running / done / failed states for archive jobs, resumable even after a page refresh.",
          ],
          keywords: ["Vue admin screens", "Input & state handling", "Bulk job progress UI"],
          workRange: "Business screens · state handling · API integration",
        },
        detail: {
          scope: [
            "Training, target, and account management screens",
            "Inputs and buttons driven by permission and progress state",
            "Progress and error guidance for bulk downloads",
          ],
          workPoints: [
            "Aligned screen and server query conditions so training registration, target uploads, and submission status all read from the same criteria.",
            "On archive requests, the screen polls progress periodically and finds the existing job again after a refresh to continue showing its status.",
            "Organized the account registration flow so department, title, and ID duplicate results are visible immediately and it's always clear whether saving is allowed.",
          ],
          caseStudy: {
            problem:
              "During bulk compression the screen just waited, so users couldn't distinguish running, done, or failed.",
            decision: "Manage long-running requests as explicit waiting / running / done / failed screen states.",
            implementation: [
              "Wired the Vue screen to the job request plus 2-second status polling.",
              "Used the job ID to find the existing job after a refresh and continue showing progress.",
              "Separated download and error guidance for done, failed, and expired states.",
            ],
            outcome: [
              "Users can see progress and failures for jobs covering 300–400 attachments.",
              "Completed files remain downloadable after a page refresh.",
            ],
          },
        },
      },
      backend: {
        card: {
          summary: "I built the bulk archive jobs, account provisioning with internal-system forwarding, and the Jenkins deployment flow.",
          description: [
            "Split bulk file requests into separate jobs with status tracking, expired-file cleanup, and downloads handled server-side.",
            "Connected account validation, saving, and internal-system forwarding, and set up build-to-sequential-deploy as Jenkins jobs.",
          ],
          keywords: ["Job separation", "Batch persistence", "Jenkins"],
          workRange: "Server · DB · external integration · deployment",
        },
        detail: {
          scope: [
            "Bulk archive job separation and state management",
            "Account validation/persistence and internal-system forwarding",
            "Jenkins deployment jobs",
          ],
          workPoints: [
            "Replaced the request-blocks-until-done approach with separate jobs: progress is recorded, completed files are downloadable, and old result files are cleaned up automatically.",
            "After validating department, title, and ID, the flow generates initial and one-time password data, saves user and employee records together, and forwards the result to the internal HR system.",
            "Set up Jenkins to run source checkout, Gradle build, server transfer, backups, and sequential deployment across two servers on demand.",
          ],
          caseStudy: {
            problem:
              "The HTTP request stayed open until compression finished, and job state, result-file lifetime, and failures were hard to manage.",
            decision: "Separate request handling from compression, and manage state around a job ID.",
            implementation: [
              "A dedicated worker runs compression and persists job state.",
              "Completed files are streamed for download; old result files are cleaned up automatically.",
              "Implemented job status queries and the download flow with Spring Boot and MyBatis.",
            ],
            outcome: [
              "Bulk downloads of 300–400 attachments run as asynchronous jobs in production.",
              "Built the server flow that surfaces running, done, and failed states to the screen.",
            ],
          },
        },
      },
    },
  },
  {
    id: "tsms",
    title: "Education Device Operations System (TSMS)",
    shortTitle: "TSMS",
    period: "Sep 2025 – present",
    category: "Device Lifecycle System",
    focuses: ["all", "frontend", "backend"],
    stack: ["WebSquare", "Java", "Spring MVC", "MyBatis", "MariaDB", "JSP"],
    card: {
      summary:
        "An operations system for the Seoul Metropolitan Office of Education's device program, connecting registration, delivery and installation, repairs, and inspections for about 110,000 educational devices.",
      description: [
        "I coordinate requirements with the operations team and own screen and server development, user acceptance, and deployment.",
        "On top of the existing device, shipping, installation, and repair data, I extended the system with external integrations, used-market monitoring, QR issuance, and on-site inspections.",
      ],
      result:
        "Recurring manual checks and paper-based inspection procedures were moved into the system's screen–server–DB flow and applied to the live program.",
      keywords: ["Workflow digitization", "Inspection history", "External integration cleanup"],
      visibility: "Private work project",
      workRange: "Maintenance · new program features · UAT · deployment",
      environment: "WebSquare · Spring MVC · MyBatis",
    },
    detail: {
      overview:
        "An operations system supporting device registration, delivery and installation, repairs, inspections, and after-care for the Seoul Metropolitan Office of Education's device program. I maintain existing features while building the new screens and server features each program phase needs.",
      scope: [
        "Used-market listing monitoring",
        "Digitizing the premium-care inspection program",
        "Device QR issuance/printing and school-contact notification messages",
        "Unifying Kakao address search and NEIS (national education information system) integrations",
      ],
      workPoints: [
        "Built per-platform keyword/region search links, and duplicate detection that parses the listing URL an inspector pastes to identify the site and listing ID — without accessing external sites — with admin-editable matching rules that survive URL format changes.",
        "Moved the paper-based inspection process into one flow: schedules, targets, checklists, signatures, re-inspection history, and result-file downloads.",
        "Connected device QR issuance and dedicated-printer output into the operations flow, and enabled message notifications for student roster registration, preferred installation dates, account setup, and installation confirmation.",
        "Consolidated Kakao address search and NEIS integrations — previously implemented separately per screen — into common server features, with connection details and settings managed server-side.",
      ],
      caseStudy: {
        problem:
          "Third-party API keys were embedded in browser code, and every screen had to be edited separately whenever connection details changed.",
        decision:
          "Move external-call responsibility from the screens to the server, and manage keys and connection settings in server configuration.",
        implementation: [
          "Added a common Controller and Service that proxy external API requests.",
          "Moved keys and integration URLs into server configuration; screens receive only the responses they need.",
          "Aligned the request paths and error handling of 25 existing screens to the common format.",
        ],
        outcome: [
          "API keys that were visible in the browser were pulled back to the server.",
          "External integration changes now happen in one common server path instead of per-screen code.",
        ],
      },
      results: [
        "Cut the A/S history and settlement detail lookups from a query that never finished within 60 s to 63–69 ms (production DB, measured Sep 2026).",
        "Removed browser-side key exposure across the 25 screens that called external APIs directly, consolidating calls on the server.",
        "Bulk registration now validates production-intake records and prior registrations before saving, and QR codes no longer expose internal identifiers.",
        "Inspections and re-inspections per school and device are now tracked in the system.",
      ],
      techUsage: [
        "WebSquare and JSP for the registration, lookup, inspection, and monitoring screens.",
        "Spring MVC and MyBatis for listing-URL analysis, duplicate checks, history persistence, and external integrations.",
        "MariaDB queries and production data to verify deployments and real usage.",
      ],
      disclosure:
        "This is an internal project; company and client details, real screens, and stored data are not disclosed.",
      resources: [],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "I built the registration, inspection, and monitoring screens used by multiple operations teams in WebSquare.",
          description: [
            "Broke complex workflows into schedules, targets, progress states, and re-inspection history so staff always know their next step.",
            "Reduced repeated input when saving used-market listings, and surfaced QR issuance and notification results in the operations screens.",
          ],
          keywords: ["WebSquare", "Business screens", "State-driven UI"],
          workRange: "Screen design · input validation · API integration",
        },
        detail: {
          scope: [
            "Inspection schedule, target, and re-inspection screens",
            "Used-market listing review and save screens",
            "QR issuance and notification operations screens",
          ],
          workPoints: [
            "Reflected field reality — inspections can't finish in one visit — by letting lost or absent devices carry over into 2nd and 3rd inspection rounds.",
            "When an inspector pastes a URL, extractable fields are pre-filled so only the remaining details need typing, cutting repeated input.",
            "Aligned status displays and query conditions so QR issuance and notification results are visible in both list and detail screens.",
          ],
          caseStudy: {
            problem:
              "With paper-based inspections, schedules, unfinished targets, and re-inspection history lived apart, so staff struggled to see the next action.",
            decision:
              "Restructure the field procedure into schedules, targets, rounds, and result states, in a screen flow where the next action is visible.",
            implementation: [
              "Implemented the schedule, target, and result screens in WebSquare.",
              "Linked round-by-round states so lost/absent devices flow into 2nd and 3rd re-inspections.",
              "Aligned status displays so confirmed schedules, unfinished targets, re-inspection results, and result files share one flow.",
            ],
            outcome: [
              "As of September 2026, inspections have been saved for 71 of the 119 schools in the program.",
              "14,882 inspection sheets have been saved in the system.",
            ],
          },
        },
      },
      backend: {
        card: {
          summary: "I built listing-URL analysis, inspection history persistence, QR/notification features, and external system integrations.",
          description: [
            "Built a structure that identifies the site and listing ID from a pasted URL and checks duplicates — without ever contacting external sites.",
            "Connected inspection data, result files, QR issuance, and notifications into the existing asset and installation data flow.",
          ],
          keywords: ["Listing-URL analysis", "Inspection history", "Shared integrations"],
          workRange: "Server · SQL · data validation · external integration",
        },
        detail: {
          scope: [
            "Listing-URL analysis and duplicate detection",
            "Inspection and re-inspection history persistence",
            "QR, notifications, and external system integration",
          ],
          workPoints: [
            "Stripped trailing junk from listing URLs and extracted listing IDs with per-site rules; when no ID is found, duplicates are checked against the normalized full URL.",
            "Persisted inspection targets and round-by-round results against existing asset/installation records, linking signatures and PDF/Excel/archive files to the same inspection history.",
            "Moved per-screen Kakao address search and NEIS integrations to a common server path now used by 25 screens.",
          ],
          caseStudy: {
            problem:
              "Kakao address search and NEIS integrations were implemented separately per screen, so connection and setting changes had to be applied over and over.",
            decision: "Consolidate the repeated integrations and settings into a common server path shared by all screens.",
            implementation: [
              "Moved Kakao address search and the NEIS integration into common server features.",
              "Centralized external connection details and settings on the server.",
              "Aligned existing screens' query and save flows to the common response format.",
            ],
            outcome: ["The shared integration path is used by 25 screens."],
          },
        },
      },
    },
  },
  {
    id: "ssafast",
    title: "API Spec & Testing Collaboration Tool (SSAFAST)",
    shortTitle: "SSAFAST",
    period: "Apr 2023 – May 2023",
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
      alt: "SSAFAST API spec input and test result screens",
    },
    card: {
      summary:
        "A team project that turns API spec writing, request testing, and performance results into a single screen flow.",
      description: [
        "On a 6-person team I owned the frontend and UI/UX: the dynamic spec form, API execution, and performance test result screens.",
        "Headers, path/query parameters, and nested body fields can be freely added or removed and assembled into a real request shape.",
      ],
      result:
        "Users can compare request success, response bodies, latency distribution, and throughput on screen.",
      keywords: ["Repeating & nested inputs", "API request testing", "Performance results UI"],
      visibility: "Public GitHub project",
      workRange: "Frontend · UI/UX",
      environment: "Next.js · React · TypeScript",
    },
    detail: {
      overview:
        "A 6-person SSAFY team project for writing API specs and checking real requests and performance test results.",
      scope: ["Frontend and UI/UX", "Dynamic API spec form", "Request execution and performance result screens"],
      workPoints: [
        "Used React Hook Form so request fields and nested data structures can be freely added and removed.",
        "Assembled the entered URL, method, parameters, and body into a real request shape, with inline validation at the exact field that's wrong.",
        "Showed request success and response bodies, and split performance results into latency distribution and throughput.",
      ],
      results: ["Complex API specs can be authored on one screen with test results following in the same flow."],
      techUsage: [
        "Next.js and React for the spec authoring and results screens.",
        "React Hook Form for repeating/nested inputs and validation state.",
        "TanStack Query for server data and Redux Toolkit for global UI state.",
      ],
      disclosure: "A team project from the SSAFY program; the code is public on GitHub.",
      resources: [
        { label: "GitHub repository", href: "https://github.com/SSAFAST/ssafast", type: "github" },
        { label: "Screenshot", href: "/projects/ssafast.png", type: "image" },
      ],
    },
  },
  {
    id: "ddoing",
    title: "Drawing-based English Vocabulary Service (ddoing)",
    shortTitle: "ddoing",
    period: "Feb 2023 – Apr 2023",
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
      alt: "ddoing English vocabulary drawing screen",
    },
    card: {
      summary:
        "A team project where learners draw the given English word and continue studying based on an AI's judgement.",
      description: [
        "I owned the frontend: the main screen, the drawing-based study screen, and score/XP updates.",
        "Drawings are converted to images and sent to the AI judgement server; the result drives the next question and study state.",
      ],
      result:
        "Found and fixed a duplicated-timer bug that made time run fast, and a stale word-list issue between questions.",
      keywords: ["React", "Drawing input", "State & timers"],
      visibility: "Public GitHub project",
      workRange: "Frontend · planning",
      environment: "React · TypeScript · Redux Toolkit",
    },
    detail: {
      overview:
        "A learning service where users express English words as drawings and earn scores and XP based on AI judgement.",
      scope: ["Main and drawing-study screens", "Drawing input and AI-server integration", "Study state, scores, and timers"],
      workPoints: [
        "Converted on-screen drawings to images, sent them to the AI judgement server, and applied scores and XP from the results.",
        "Fixed timers running twice when entering the screen, and made timers stop when leaving it.",
        "Fixed the state-update timing that left the previous word list visible when moving to the next question.",
      ],
      results: ["Drawing input, judgement, scoring, and moving to the next question all flow within a single screen."],
      techUsage: [
        "React and TypeScript for the study screens and state transitions.",
        "Canvas API for drawing input and image conversion.",
        "Redux Toolkit for user scores and study state.",
      ],
      disclosure:
        "A SSAFY team project. Image preprocessing was done with the team lead, who owned model training.",
      resources: [
        { label: "GitHub repository", href: "https://github.com/GomGom-Team/ddoing", type: "github" },
        { label: "Screenshot", href: "/projects/ddoing.png", type: "image" },
      ],
    },
  },
  {
    id: "modac",
    title: "Developer Study Log Service (MODAC)",
    shortTitle: "MODAC",
    period: "Jan 2023 – Feb 2023",
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
      alt: "MODAC study log and study room screens",
    },
    card: {
      summary: "A team project where developers keep study logs and manage study-group activity together.",
      description: [
        "I owned the frontend: study rooms, posts, and my-page screens.",
        "Implemented room entry/exit with invite-code validation, plus study statistics, notifications, and favorites.",
      ],
      result: "Wired up real-time chat so members can talk directly inside a study room.",
      keywords: ["Vue 3", "State management", "Real-time chat"],
      visibility: "Public GitHub project",
      workRange: "Frontend",
      environment: "Vue 3 · Pinia · SockJS/STOMP",
    },
    detail: {
      overview:
        "A SSAFY team project where developers write study logs and manage study-group activity in one service.",
      scope: [
        "Study room, post, and my-page screens",
        "Study statistics, notifications, and favorites",
        "Real-time chat UI integration",
      ],
      workPoints: [
        "Managed room entry/exit, invite-code validation, and screen state with Vue 3 and Pinia.",
        "Implemented study logs, statistics, notifications, and favorites screens.",
        "Reflected connection state and incoming messages in the study room chat UI.",
      ],
      results: ["Joining a study group, keeping logs, and chatting in real time all connect within one service."],
      techUsage: [
        "Vue 3 for the study room, post, and my-page screens.",
        "Pinia for user and study-group state.",
        "The team's SockJS/STOMP connection wired into the study room chat UI.",
      ],
      disclosure: "A 6-person SSAFY team project; the code is public on GitHub.",
      resources: [
        { label: "GitHub repository", href: "https://github.com/YongjaeKwon/MODAC", type: "github" },
        { label: "Screenshot", href: "/projects/modac.png", type: "image" },
      ],
    },
  },
  {
    id: "ticketrush",
    title: "First-come Ticketing System (ticket-rush)",
    shortTitle: "ticket-rush",
    period: "Aug 2026 – in progress",
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
      alt: "ticket-rush seat-selection mockup — section tabs, seat map, and remaining-seat count",
    },
    card: {
      summary:
        "An in-progress reservation system whose tests check that the same seat is never confirmed twice under concurrent requests.",
      description: [
        "Each seat is guarded by three layers — Redis SET NX holds, domain rules rejecting expired holds at payment, and a MySQL primary key on (show, seat) — with lost hold data reproduced in integration tests.",
        "Stage 1 (monolith backend: ZSET queue, JWT entry tokens, idempotent processing, a transactional outbox, architecture-rule tests) and stage 2 (Next.js web with a Canvas seat map, SSE, payment/completion screens, and Playwright E2E, finished Sep 2026) are complete; stage 3 (outbox relay to Kafka) is in progress.",
      ],
      result:
        "In the contention test, 100 threads competing for one seat produce exactly one successful hold; backend integration and concurrency tests plus web unit and Playwright E2E tests run in CI.",
      keywords: ["Three-layer seat defense", "Transactional outbox", "Checked by contention tests"],
      visibility: "Public GitHub project",
      workRange: "Design · backend development · web frontend · concurrency testing · CI",
      environment: "Spring Boot · Spring Modulith · MySQL · Redis · Next.js",
    },
    detail: {
      overview:
        "An in-progress personal project built to check, with tests, that the same seat is never sold twice in first-come ticketing. It follows a staged roadmap from a monolith to Kafka-based separation: stage 1 (the monolith backend) and stage 2 (the Next.js web app, Sep 2026) are complete, stage 3 (outbox relay to Kafka) is in progress, and a hexagonal structure (adapter→application→domain, one direction) is checked by architecture tests.",
      scope: [
        "Three-layer seat defense and concurrency tests",
        "ZSET queue with JWT entry tokens",
        "Idempotent processing, transactional outbox, SSE status streams",
        "Next.js web with a Canvas seat map, Testcontainers/Playwright tests, and GitHub Actions CI",
      ],
      workPoints: [
        "A Redis SET NX EX five-minute hold lets only one concurrent request through; domain rules reject payment on expired holds; and the MySQL primary key on confirmed_seat (show, seat) is the final guard.",
        "Lost hold data is reproduced by deleting hold keys to create 10 overlapping holds on one seat; integration tests check that concurrent confirmation leaves exactly one confirmed seat and one CONFIRMED reservation.",
        "Payment requests carry a per-attempt Idempotency-Key (a repeated key replays the stored response; a new attempt after a decline gets a new key), and reservation confirmation plus event records are written in one transaction via the outbox pattern.",
        "ArchUnit and Spring Modulith tests check one-directional adapter→application→domain dependencies and a domain free of Spring and JPA dependencies.",
      ],
      results: [
        "In the contention test, 100 threads competing for one seat produce exactly one successful hold.",
        "Backend integration and concurrency tests (Testcontainers) plus web unit and Playwright E2E tests run in GitHub Actions CI.",
        "With 10 overlapping holds, concurrent confirmation leaves exactly one confirmed seat and one CONFIRMED reservation.",
      ],
      techUsage: [
        "Spring Boot and Spring Modulith divide the catalog, queue, and reservation module boundaries.",
        "Redis provides SET NX EX seat holds and the ZSET queue with batch admission.",
        "MySQL and Flyway manage the confirmed_seat (show, seat) primary key and schema history; Testcontainers runs integration tests against real DB and Redis instances.",
        "GitHub Actions runs the backend suite and the web checks (types, unit tests, Playwright E2E) on pushes to main and on pull requests.",
      ],
      disclosure:
        "A public GitHub project — all code and tests are open. As work in progress, only the completed stages 1–2 are described as fact; stage 3 (Kafka delivery) is in progress, and HTTP load numbers have not been measured yet.",
      resources: [{ label: "GitHub repository & README", href: "https://github.com/YongjaeKwon/ticket-rush", type: "github" }],
    },
  },
  {
    id: "reachrich",
    title: "Personal Investment Research & Operations Platform (ReachRich)",
    shortTitle: "ReachRich",
    period: "Mar 2026 – present",
    category: "Personal Full Stack",
    focuses: ["all", "frontend", "backend"],
    stack: ["Python", "FastAPI", "React", "TypeScript", "SQLAlchemy", "SQLite", "Parquet", "GitHub Actions", "pytest", "Vitest"],
    card: {
      summary:
        "A personal research and operations platform that gathers my brokerage account and market data to validate investment strategies and run them as paper trades.",
      description: [
        "In August 2026 I created a new repository and split responsibilities into six areas: data, universe selection, strategy, validation, operations, and console.",
        "Connected brokerage account queries, KRX collection, a FastAPI read API, a React dashboard, daily health checks, and failure alerts.",
      ],
      result:
        "Queries my real brokerage account and loads daily candles for the top 200 KRX stocks by trading value every day; automated failure alerts are verified end to end. Per the README (Aug 11, 2026), 205 Python and 96 web tests pass.",
      keywords: ["Selective porting of validated logic", "Idempotent data collection", "React operations UI"],
      visibility: "Private personal project",
      workRange: "Redesign · data collection · API · dashboard · automation",
      environment: "FastAPI · React · SQLite · Parquet · GitHub Actions",
    },
    detail: {
      overview:
        "I'm redesigning the investment research core I've been building since March 2026 in a new repository as of August 2026. Rather than moving the old code wholesale, I ported only validated assets — lookahead prevention, repeatable validation, the experiment ledger, and the paper-trading ledger. In the new repository I built account tracking, KRX data collection, read APIs, a React dashboard, and automated runs with failure detection from scratch. Per the README, a trading journal, market-regime and stock-grade views, and a pre-registered strategy-combination batch are also complete; no real-money orders are placed until a strategy passes the promotion gate.",
      scope: [
        "Full architecture redesign and module boundaries",
        "Brokerage account and KRX data collection with local storage",
        "FastAPI read API and React dashboard",
        "GitHub Actions and Telegram operational alerts",
      ],
      workPoints: [
        "Selected causality checks, Purged Walk-forward validation, standard metrics, the experiment ledger, Tracking Error, and the paper-trading ledger from the old core and fitted them into the six-module structure.",
        "Built the boundary between external APIs and local data with OAuth2 token caching, 429 retries, date-keyed snapshots, and per-symbol Parquet upserts for KRX data.",
        "Connected a FastAPI read API that only reads local snapshots to the React screens: amount masking, period-based equity curve, holdings, and status views.",
        "Ran daily health checks and paper-trading accrual on GitHub Actions, with separate Telegram alerts for local job and Actions failures.",
      ],
      results: [
        "Verified real brokerage account queries; KRX collection now loads the top-200 universe by trading value and its daily candles every day.",
        "As of the August 11, 2026 README, 205 Python and 96 web automated tests pass, with the production build verified.",
        "Verified CI, daily health check, and paper-trading workflow runs, including Telegram alerts on forced failures.",
      ],
      techUsage: [
        "FastAPI serves four read APIs over SQLite snapshots plus the React static build.",
        "SQLAlchemy/SQLite store account snapshots with per-date replacement; Parquet/JSON keep per-symbol candles and each date's universe without duplicates.",
        "React, TypeScript, and Vite power the asset summary, period equity curve, holdings, and system status screens.",
        "GitHub Actions runs backend/frontend tests and builds, daily checks, and paper-trading accrual, with failure alerts wired in.",
      ],
      disclosure:
        "A private personal project: API credentials, real account amounts and holdings, strategy parameters, and investment performance are not disclosed. Screens are shown in privacy mode with structural summaries.",
      resources: [
        {
          label: "Public demo repository (quant-lab, synthetic data)",
          href: "https://github.com/YongjaeKwon/quant-lab/blob/main/README.md",
          type: "github",
        },
      ],
    },
    perspectives: {
      frontend: {
        card: {
          summary: "A React operations dashboard that turns account snapshots into asset summaries, period curves, and holdings.",
          description: [
            "Provides amount masking and light/dark/system themes, and skips polling in hidden tabs to avoid wasted requests.",
            "Built reusable UI primitives and per-state empty screens, with PWA support for mobile access on the same network.",
          ],
          result:
            "Per the README (Aug 11, 2026), 96 web tests pass along with the production build.",
          keywords: ["React & TypeScript", "Privacy mode", "Visibility-based polling"],
          workRange: "React screens · state handling · UI system · tests",
        },
        detail: {
          scope: ["React + TypeScript dashboard", "UI primitives and dual themes", "Privacy, polling, and PWA"],
          workPoints: [
            "Split asset summary, period equity curve, holdings, and system status into separate screen components.",
            "Persisted the amount-masking preference in the browser, skipped polling while the tab is hidden, and refreshed immediately when it becomes visible again.",
            "Built reusable cards, badges, tables, and empty states, plus light/dark/system themes and a PWA app shell.",
          ],
        },
      },
      backend: {
        card: {
          summary: "A Python backend redesigned so account and market data stay consistent under repeated collection, flowing into validation and paper trading.",
          description: [
            "External API responses are stored in a SQLite/Parquet local mirror first; the read API only ever reads the mirror.",
            "Per-symbol failures are isolated, but if the failure rate exceeds 30% the whole job is failed and an alert is sent.",
          ],
          result:
            "Per the README (Aug 11, 2026), 205 Python tests pass across collection, validation, and operations; real brokerage queries are verified, and KRX collection loads the top-200 universe by trading value every day.",
          keywords: ["FastAPI", "SQLite & Parquet", "Idempotent collection & failure isolation"],
          workRange: "Architecture redesign · API · data collection · automation",
        },
        detail: {
          scope: [
            "Six-module structure and ported validation assets",
            "Account/KRX collection and the local mirror",
            "Read APIs, automated runs, and failure alerts",
          ],
          workPoints: [
            "Split responsibilities into data, universe, strategy, validation, operations, and console, porting only reusable validation logic from the old core.",
            "Built the external API client to refresh OAuth2 tokens before expiry and retry 429 responses once, honoring Retry-After.",
            "Stored accounts with per-date replacement and upserted KRX candles by symbol and date, so re-running the same job never duplicates data.",
          ],
        },
      },
    },
  },
  {
    id: "oneulsai",
    title: "Offline Dating Event Service (ONULSAI)",
    shortTitle: "ONULSAI",
    period: "Sep 2026 – in progress",
    category: "Personal Full Stack",
    focuses: ["all", "frontend", "backend"],
    image: {
      src: "/projects/oneulsai.png",
      width: 1200,
      height: 675,
      previewSrc: "/projects/oneulsai-preview.webp",
      previewWidth: 960,
      previewHeight: 540,
      alt: "ONULSAI brand logo and two service introduction cards",
    },
    stack: ["TypeScript", "NestJS", "Next.js", "PostgreSQL", "Prisma", "Turborepo", "Vitest", "Playwright"],
    card: {
      summary: "A service for running offline rotation dating events: seven one-on-one conversations in a café on Sunday, connected only when both people choose each other.",
      description: [
        "A monorepo with an API Gateway in front of member, event, matching, notification and payment services, each with its own database.",
        "Sign-up and login, event scheduling and applications work today. Payment, check-in and matching are the next stages.",
      ],
      result: "Integration tests on a real PostgreSQL check that a rush of applications never exceeds the per-gender capacity: 20 simultaneous applications for the last seat produce exactly one success.",
      keywords: ["Database per service", "Row locks for capacity", "Spec-first"],
      visibility: "Private personal project",
      workRange: "Specs · service design · APIs · participant and admin web · tests",
      environment: "NestJS · Next.js · PostgreSQL · Prisma · GitHub Actions",
    },
    detail: {
      overview: "A service started in September 2026 to actually run offline rotation dating events. Each feature starts with a written spec that is approved before implementation. Foundations, member auth, and event products and schedules are done; applications are implemented and being verified. Payment will start as manual bank-transfer confirmation.",
      scope: ["Service boundaries and specs", "Gateway auth and service-to-service call rules", "Member, schedule and application APIs", "Participant and admin web apps", "Integration tests and browser E2E"],
      workPoints: [
        "Only the Gateway accepts external requests. It verifies the JWT, turns the user into internal headers, and attaches an internal token before proxying to services.",
        "Each service uses only its own database. Data owned by another service is requested over REST, never read from its tables or models.",
        "Applying locks the schedule row first, then counts applicants by gender and inserts. Lock waits are capped at 2 seconds so one long-held lock cannot stall the whole service.",
      ],
      results: [
        "20 men applying at once for the last male seat get exactly one 201; the rest end in 409 or 503.",
        "The same member pressing apply 8 times at once leaves a single application.",
        "Participants can sign up, browse schedules and apply; operators can look up members, manage schedules and cancel applications.",
      ],
      techUsage: [
        "Five NestJS services, the Gateway and two Next.js web apps live in a pnpm and Turborepo monorepo.",
        "One PostgreSQL instance holds five logical databases, one per service, with schemas and migrations managed by Prisma.",
        "Request and response types shared between services live only in one contracts package.",
        "Vitest unit and integration tests and Playwright browser E2E run in GitHub Actions.",
      ],
      disclosure: "Private personal project, so there is no repository link. Only facts confirmed in the specs and tests are listed. Specs and working rules come first; implementation and review proceed PR by PR together with AI coding agents.",
      resources: [],
    },
  },
];

export const techGroups = [
  { title: "Frontend", items: ["JavaScript", "TypeScript", "Vue", "React", "Next.js", "WebSquare", "JSP"] },
  { title: "Backend", items: ["Java", "Spring MVC", "Spring Boot", "MyBatis", "Python", "FastAPI"] },
  { title: "Database", items: ["MariaDB", "MySQL", "Oracle", "PostgreSQL", "SQLite"] },
  { title: "Tools & Deployment", items: ["Git", "GitHub", "GitHub Actions", "SVN", "Jenkins", "Linux", "Tomcat", "Docker"] },
];

export const experience = {
  title: "Web Developer",
  company: "TG Alliance",
  period: "Jun 2024 – present",
  description:
    "On the B2B partner portal PPS and the device operations system TSMS, I own everything from requirements discussion to screen, server, and DB development, UAT, and deployment.",
  responsibilities: ["Requirements discussion", "Screen, server & DB development", "UAT, deployment & operations"],
};

export const education = [
  { title: "B.A. in e-Business, Ajou University", period: "Mar 2018 – Aug 2020", description: "Graduated", icon: "GraduationCap" },
  {
    title: "SSAFY (Samsung SW Academy For Youth), 8th cohort",
    period: "Jul 2022 – Jun 2023",
    description: "Completed the web development track; owned the frontend across three team projects.",
    icon: "Award",
  },
  {
    title: "California State University, Chico",
    period: "Jan 2014 – May 2015",
    description: "Studied Business Administration before transferring to Ajou University",
    icon: "GraduationCap",
  },
  { title: "SQLD", period: "Sep 2024", description: "Korean national SQL developer certification", icon: "Database" },
];

export const projects = featuredProjects;
