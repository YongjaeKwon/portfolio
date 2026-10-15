import type { FeaturedProject } from "./portfolio.ko";

export const profile = {
  "name": "Yongjae Kwon",
  "role": "Web Developer",
  "summary": "I'm a Java and Spring web developer. I helped build a partner portal from its early stages and develop and maintain an education device management system. My work spans requirements discussions with operations staff, UI, API and SQL development, acceptance checks, deployment, and post-deployment verification.",
  "email": "yongjae116@gmail.com",
  "phone": "010-9470-1704",
  "github": "https://github.com/YongjaeKwon",
  "location": "Yongin, South Korea",
  "resume": "/resume.pdf?v=20261014",
  "introduction": [
    "I start by understanding how people do their work and where they get stuck. When digitizing paper inspection records, I kept device-level reasons for incomplete checks and previous results so staff could continue on their next visit. I trace UI errors through server logic and data, and check that SQL changes preserve results as well as improve speed.",
    "I'm currently building Oneul Sai around the rules of an offline dating service, including both participant and operator features. I want to use my experience with business workflows and troubleshooting to finish useful features and improve the way they work in practice."
  ],
  "career": "/career.pdf?v=20261015-2",
  "portfolio": "/portfolio.pdf?v=20261015-2"
};

export const focusTracks = [
  {
    "id": "all",
    "label": "All",
    "role": "Web Developer",
    "headline": "Building and maintaining services, and finding better ways as I go.",
    "target": "I'm a Java and Spring web developer. I helped build a partner portal from its early stages and develop and maintain an education device management system. My work spans requirements discussions with operations staff, UI, API and SQL development, acceptance checks, deployment, and post-deployment verification.",
    "projectIntro": "Features I built and problems I solved in personal projects and team collaborations.",
    "projectOrder": [
      "tsms",
      "pps",
      "sr30",
      "oneulsai",
      "ticketrush",
      "reachrich",
      "ssafast",
      "ddoing",
      "modac"
    ]
  },
  {
    "id": "frontend",
    "label": "Frontend",
    "role": "Frontend Developer",
    "headline": "I build screens that keep users on track through complex workflows.",
    "target": "I build business interfaces with Vue 2, WebSquare5 and Nexacro, and personal projects with React. I work on input validation, state management, and error feedback that fit the workflow.",
    "projectIntro": "My contributions, focused on screen structure, input handling, progress states, and error guidance.",
    "projectOrder": [
      "tsms",
      "pps",
      "sr30",
      "oneulsai",
      "ticketrush",
      "reachrich",
      "ssafast",
      "ddoing",
      "modac"
    ]
  },
  {
    "id": "backend",
    "label": "Backend",
    "role": "Backend Developer",
    "headline": "I build and operate server features that fit real business workflows.",
    "target": "In Spring-based business systems I develop server logic, SQL, and external integrations, and own the deployment and operations that follow.",
    "projectIntro": "Server-side processing, data validation, and operational automation from my personal projects.",
    "projectOrder": [
      "tsms",
      "pps",
      "sr30",
      "oneulsai",
      "ticketrush",
      "reachrich",
      "ssafast",
      "ddoing",
      "modac"
    ]
  }
] as const;

export const featuredProjects: FeaturedProject[] = [
  {
    "id": "tsms",
    "title": "Education device management (TSMS)",
    "shortTitle": "Education device management",
    "period": "2025.09 – Present",
    "category": "Work · Development & operations",
    "focuses": [
      "all",
      "frontend",
      "backend"
    ],
    "stack": [
      "Java 11",
      "Spring MVC",
      "MyBatis",
      "MariaDB",
      "JavaScript",
      "WebSquare5",
      "JSP"
    ],
    "card": {
      "summary": "A system for registering approximately 110,000 education devices for the Seoul education office and managing delivery, installation, service, and inspection histories.",
      "description": [
        "Monthly service-result lookup: about 53 s → 1.2 s",
        "Digitizing paper inspections and follow-up visits"
      ],
      "result": "Rewrote SQL to look up the latest history for each service request directly and changed the date filters. Compared the old and new results on the production DB, checking for duplicates and missing rows across search conditions.",
      "keywords": [
        "SQL performance",
        "Inspection workflows",
        "Preserving production data"
      ],
      "visibility": "Private work project",
      "workRange": "UI, API and SQL development · Production data cleanup and verification",
      "environment": "Java 11 · Spring MVC · MyBatis · MariaDB",
      "highlights": [
        {
          "title": "Preserving inspection results during data cleanup",
          "detail": "Standardized serial-number storage and prepared backup, rollback, and validation before cleaning duplicate production records while preserving existing inspection results."
        },
        {
          "title": "Digitizing inspections and follow-up visits",
          "detail": "Kept device-level reasons for incomplete checks and previous results so staff could resume on a return visit. Connected signatures and certificates, with concurrent-edit checks to prevent overwriting another staff member’s work."
        }
      ]
    },
    "detail": {
      "overview": "A system for registering approximately 110,000 education devices for the Seoul education office and managing delivery, installation, service, and inspection histories.",
      "scope": [
        "UI, API and SQL development",
        "Production data cleanup and verification",
        "Acceptance checks and deployment"
      ],
      "workPoints": [
        "Monthly service-result lookup: about 53 s → 1.2 s — Replaced a combined view with base-table joins and direct lookup of the latest history per service request. Changed date filters from functions on the column to a start-inclusive, next-day-exclusive range. Compared old and new SQL in read-only transactions on the production DB, checking values, NULLs, duplicate rows, and column metadata. Reproduced missing cancellation details in the development DB under different optimizer settings and compared them with the source history.",
        "School-specific history lookup: about 9 s → 0.02 s — Filtered service requests first, then aggregated only their histories instead of aggregating the full dataset. Preserved search, school-shared history, authorization, and pagination conditions. Compared values, NULLs, order, and counts on the production DB. For old name-search queries that timed out, compared results separately with a restricted range or join order. This change has not yet been deployed.",
        "Digitizing paper inspections and follow-up visits — Paper records made progress hard to track, especially when missing devices needed another visit. Stored the inspection round, result, and reason for each incomplete device so staff could continue using previous records. Connected schedule approval, inspection forms, touch signatures, and certificates. Input fields follow role and progress state. Version checks on save prevent overwriting another staff member’s update.",
        "Cleaning duplicate records without losing inspection results — Mixed 14- and 15-digit serial numbers could link records to the wrong device or create duplicates. Standardized storage to 15 digits and resolved 14-digit input against school assignments. Identified duplicates using class, student number, and inspection history. Prepared backup, rollback, and post-change validation SQL before applying the cleanup.",
        "Preventing duplicate scroll requests and stale search results — Allowed only one request at a time. A search change discards the old response and runs the latest search. Subsequent pages retain customer, search, and authorization filters, with retry after errors.",
        "Validating device imports before registration — Compared spreadsheet imports with production-intake records, checked duplicate serial numbers, and showed existing school and user details for invalid entries. Validated devices can be registered in bulk. QR codes carry a public identifier rather than an internal DB identifier.",
        "Maintaining shared external integrations — Moved address and education-information API calls from 25 screens to shared server paths. Kept keys and external URLs in server configuration so integration changes can be made centrally."
      ],
      "techUsage": [
        "Backend & DB: Java 11 · Spring MVC · MyBatis · MariaDB",
        "Frontend: JavaScript · WebSquare5 · JSP"
      ],
      "results": [],
      "disclosure": "Internal source code, business screens, and production data are not published.",
      "resources": []
    },
    "perspectives": {
      "frontend": {
        "card": {
          "description": [
            "Digitizing paper inspections and follow-up visits"
          ],
          "result": "Kept device-level reasons for incomplete checks and previous results so staff could resume on a return visit. Connected signatures and certificates, with concurrent-edit checks to prevent overwriting another staff member’s work. Recorded approximately 15,000 inspections across 71 schools in the verified operational records.",
          "highlights": []
        }
      },
      "backend": {
        "card": {
          "description": [
            "Monthly service-result lookup: about 53 s → 1.2 s"
          ],
          "result": "Monthly lookup: about 53 s → 1.2 s. Full lookup (about 480,000 rows): about 125 s → 44 s.",
          "highlights": [
            {
              "title": "Preserving inspection results during data cleanup",
              "detail": "Standardized serial-number storage and prepared backup, rollback, and validation before cleaning duplicate production records while preserving existing inspection results."
            }
          ]
        }
      }
    }
  },
  {
    "id": "pps",
    "title": "B2B partner portal (PPS)",
    "shortTitle": "Partner portal",
    "period": "2025.02 – Present",
    "category": "Work · Initial build & operations",
    "focuses": [
      "all",
      "frontend",
      "backend"
    ],
    "stack": [
      "Java 21",
      "Spring Boot",
      "MyBatis",
      "MariaDB",
      "Oracle",
      "JavaScript",
      "Vue 2",
      "Hazelcast",
      "Jenkins"
    ],
    "card": {
      "summary": "A portal for headquarters and about 500 partners to manage registration, contracts, and field-engineer training, qualifications, and evidence. I joined during the initial build.",
      "description": [
        "Bulk downloads with progress that survives a refresh",
        "Fixing attachments linked to the wrong engineer"
      ],
      "result": "Compressing 300–400 attachments kept the request open and hid progress. Changed the endpoint to return a job ID first and run compression through Spring’s asynchronous executor.",
      "keywords": [
        "Asynchronous downloads",
        "Attachment state fixes",
        "Authentication & accounts"
      ],
      "visibility": "Private work project",
      "workRange": "Participation in the initial build · Vue UI, Spring Boot API and MyBatis SQL",
      "environment": "Java 21 · Spring Boot · MyBatis · MariaDB",
      "highlights": [
        {
          "title": "Fixing attachments linked to the wrong engineer",
          "detail": "Isolated state per Vue instance and blocked links to another active engineer’s files on the server."
        },
        {
          "title": "Preventing repeat messages and verification-code reuse",
          "detail": "Limited repeated verification messages and prevented a code from being used again after verification."
        }
      ]
    },
    "detail": {
      "overview": "A portal for headquarters and about 500 partners to manage registration, contracts, and field-engineer training, qualifications, and evidence. I joined during the initial build.",
      "scope": [
        "Participation in the initial build",
        "Vue UI, Spring Boot API and MyBatis SQL",
        "Acceptance checks, deployment and operations"
      ],
      "workPoints": [
        "Bulk downloads with progress that survives a refresh — Compressing 300–400 attachments kept the request open and hid progress. Changed the endpoint to return a job ID first and run compression through Spring’s asynchronous executor. Stored job progress, completion, and failure in Hazelcast, shared by WAS instances on the same host. The browser saves the job ID and polls for progress, recovering the existing job after a refresh. Downloads use a separate request; temporary files are removed after download or expiry.",
        "Fixing attachments linked to the wrong engineer — A shallow copy of a common object left Vue instances sharing attachment information from the previous engineer. Created fresh state per instance and cleared attachment information when registration or lookup failed. The server also rejects file groups belonging to another active engineer. Preserved the existing exception that allows files from an inactive account to be reused when an engineer moves centers.",
        "Preventing repeated verification messages and code reuse — Shared per-user resend limits through Hazelcast so concurrent requests face the same limit whichever WAS instance receives them. putIfAbsent admits one request; TTL sets expiry and conditional removal avoids deleting a newer request’s limit. Verified and consumed codes together in the DB to prevent reuse. Removed codes and message bodies from API responses and return failure when saving a message request or changing a password fails. Wrote unit tests for concurrent requests, expiry, reuse, and failure responses.",
        "Repeatable Jenkins deployment jobs — Connected source updates, Gradle builds, transfer, backup, and sequential deployment to two WAS instances in manually triggered Jenkins jobs. Separated development and production jobs and kept stage-level execution logs.",
        "Account management with checks before department changes — Built the UI and API for headquarters account creation and updates, checking department, grade, and duplicate accounts, and showing synchronization results. Before disabling an account or changing its department, check remaining inventory and service work; block saving if work remains or the API check fails. Verify the linked user and department exist, require exactly one updated user record, and apply the same department code to related requests.",
        "Notification policies and additional recipients — Built policy UI and APIs for sending rules, templates, additional recipients, preferences, and change history. Deduplicated recipients by engineer ID and kept the default recipient’s template. Unit tests cover duplicate recipients and skipping recipient lookup when extra sends are disabled.",
        "Completed-contract emails and delivery history — Check that a contract is complete before emailing its document to the center manager. Record the request, success or failure, and error details so operators can review delivery results.",
        "Training rosters and attendance reporting — Connected roster submissions with attendance views and Excel exports. Flagged engineers from another center or already registered as entries to exclude. Reports count submitted rosters separately from centers that have not submitted."
      ],
      "techUsage": [
        "Backend & DB: Java 21 · Spring Boot · MyBatis · MariaDB · Oracle",
        "Frontend: JavaScript · Vue 2",
        "Shared state & delivery: Hazelcast · Jenkins"
      ],
      "results": [],
      "disclosure": "Internal source code, business screens, and production data are not published.",
      "resources": []
    },
    "perspectives": {
      "frontend": {
        "card": {
          "description": [
            "Fixing attachments linked to the wrong engineer"
          ],
          "result": "A shallow copy of a common object left Vue instances sharing attachment information from the previous engineer. Created fresh state per instance and cleared attachment information when registration or lookup failed. Isolated state per Vue instance and blocked links to another active engineer’s files on the server.",
          "highlights": [
            {
              "title": "Asynchronous compression with progress after a refresh",
              "detail": "Moved compression of 300–400 files to an asynchronous job, retaining its ID to recover progress, completion, or failure after a refresh."
            }
          ]
        }
      },
      "backend": {
        "card": {
          "description": [
            "Preventing repeated verification messages and code reuse"
          ],
          "result": "Limited repeated verification messages and prevented a code from being used again after verification.",
          "highlights": [
            {
              "title": "Asynchronous compression with progress after a refresh",
              "detail": "Moved compression of 300–400 files to an asynchronous job, retaining its ID to recover progress, completion, or failure after a refresh."
            }
          ]
        }
      }
    }
  },
  {
    "id": "sr30",
    "title": "Service and inventory management (SR30)",
    "shortTitle": "Service & inventory management",
    "period": "Main work: 2024.07 – 2025.01",
    "category": "Work · Features & maintenance",
    "focuses": [
      "all",
      "frontend",
      "backend"
    ],
    "stack": [
      "Java 8",
      "Spring MVC",
      "eGovFrame 3.9",
      "MyBatis",
      "Oracle",
      "JavaScript",
      "Nexacro 17"
    ],
    "card": {
      "summary": "An internal system for service requests, inventory, and business reporting. Early in my employment, I added features and fixed errors in Nexacro screens, Java services, and SQL.",
      "description": [
        "Service reports by period and product group",
        "Fixing service-history search by phone number"
      ],
      "result": "Built monthly service reports with Java-generated month lists, MyBatis aggregation, and matching Nexacro columns. Displayed delivery, return, cancellation, and subtotal counts for the selected period and product group.",
      "keywords": [
        "Service reporting",
        "Search fixes",
        "Inventory & access history"
      ],
      "visibility": "Private work project",
      "workRange": "Nexacro business interfaces · Java services and MyBatis SQL",
      "environment": "Java 8 · Spring MVC · eGovFrame 3.9 · MyBatis"
    },
    "detail": {
      "overview": "An internal system for service requests, inventory, and business reporting. Early in my employment, I added features and fixed errors in Nexacro screens, Java services, and SQL.",
      "scope": [
        "Nexacro business interfaces",
        "Java services and MyBatis SQL",
        "Search fixes and inventory query conditions"
      ],
      "workPoints": [
        "Service reports by period and product group — Built monthly service reports with Java-generated month lists, MyBatis aggregation, and matching Nexacro columns. Displayed delivery, return, cancellation, and subtotal counts for the selected period and product group.",
        "Fixing service-history search by phone number — Fixed the input-to-dataset binding and Java request parameters. SQL converts the search value using the existing encryption scheme and compares it against landline, mobile, and additional contact numbers.",
        "Correcting inventory date filters and search branches — Separated aggregation ranges for current stock and stock as of a selected date. Removed TO_DATE from the stored date column, corrected MyBatis branches for the screen checkbox, and improved date-range validation and display.",
        "Access and personal-data download history — Built screens and SQL aggregating existing login, screen-access, and personal-data download logs by department, user, and period. Joined menu names to make the accessed screens identifiable.",
        "Equipment installation and removal forms — Added Nexacro screens and MyBatis SQL to find equipment by management number and save installation or removal records. Connected the appropriate inputs, equipment lookup, and registration request for each work type."
      ],
      "techUsage": [
        "Backend & DB: Java 8 · Spring MVC (eGovFrame 3.9) · MyBatis · Oracle",
        "Frontend: JavaScript · Nexacro 17"
      ],
      "results": [],
      "disclosure": "Internal source code, business screens, and production data are not published.",
      "resources": []
    },
    "perspectives": {
      "frontend": {
        "card": {
          "description": [
            "Service reports by period and product group"
          ],
          "result": "Built monthly service reports with Java-generated month lists, MyBatis aggregation, and matching Nexacro columns. Displayed delivery, return, cancellation, and subtotal counts for the selected period and product group."
        }
      },
      "backend": {
        "card": {
          "description": [
            "Correcting inventory date filters and search branches"
          ],
          "result": "Separated aggregation ranges for current stock and stock as of a selected date. Removed TO_DATE from the stored date column, corrected MyBatis branches for the screen checkbox, and improved date-range validation and display."
        }
      }
    }
  },
  {
    "id": "oneulsai",
    "title": "Offline dating operations (Oneul Sai)",
    "shortTitle": "Oneul Sai",
    "subtitle": "In-person speed dating service",
    "period": "2026.09 – In development",
    "category": "Personal project",
    "focuses": [
      "all",
      "frontend",
      "backend"
    ],
    "image": {
      "src": "/projects/oneulsai.png",
      "width": 1200,
      "height": 675,
      "previewSrc": "/projects/oneulsai-preview.webp",
      "previewWidth": 960,
      "previewHeight": 540,
      "alt": "ONULSAI brand logo and two service introduction cards"
    },
    "stack": [
      "TypeScript",
      "NestJS",
      "Prisma",
      "PostgreSQL",
      "React",
      "Next.js",
      "Vitest",
      "Playwright",
      "GitHub Actions"
    ],
    "card": {
      "summary": "An in-person speed dating service where participants meet through one-to-one conversations and connect when they choose each other. I am building participant and operator web apps based on the service’s actual operating rules. Account and authentication features, event browsing and management, and applications and cancellations are implemented.",
      "description": [
        "Capacity checks under concurrent applications",
        "Participant and operator flows with cancellation rules"
      ],
      "result": "Used a DB row lock for each session and kept capacity checks and application inserts in one transaction. In a local test with a stubbed member lookup, only one of 20 concurrent requests for the last seat succeeded. Also tested duplicate applications and applications during deadline or capacity changes.",
      "keywords": [
        "Capacity & concurrent applications",
        "Participant & operator UI",
        "Cancellation rules"
      ],
      "visibility": "Public GitHub project",
      "workRange": "Session capacity, applications and cancellations · Participant and operator interfaces",
      "environment": "TypeScript · NestJS · Prisma · PostgreSQL"
    },
    "detail": {
      "overview": "An in-person speed dating service where participants meet through one-to-one conversations and connect when they choose each other. I am building participant and operator web apps based on the service’s actual operating rules. Account and authentication features, event browsing and management, and applications and cancellations are implemented. On-site event operations and matching are planned for later development.",
      "scope": [
        "Session capacity, applications and cancellations",
        "Participant and operator interfaces",
        "Concurrency and end-to-end flow tests"
      ],
      "workPoints": [
        "Capacity checks under concurrent applications — Used a DB row lock for each session and kept capacity checks and application inserts in one transaction. In a local test with a stubbed member lookup, only one of 20 concurrent requests for the last seat succeeded. Also tested duplicate applications and applications during deadline or capacity changes.",
        "Participant and operator flows with cancellation rules — Participants can view and cancel applications; operators manage applicants per session. Canceling a session also cancels its applications, and capacity cannot be reduced below the accepted count.",
        "Testing the application flow across UI and server — Run participant and operator interfaces with the server in Playwright tests on GitHub Actions. Checked error feedback and retained login during a member-service outage, followed by successful reapplication after recovery."
      ],
      "techUsage": [
        "Backend & DB: TypeScript · NestJS · Prisma · PostgreSQL",
        "Frontend: TypeScript · React · Next.js",
        "Testing & automation: Vitest · Playwright · GitHub Actions"
      ],
      "results": [],
      "disclosure": "A personal project in development. Concurrency figures come from local tests.",
      "resources": [
        {
          "label": "GitHub repository",
          "href": "https://github.com/YongjaeKwon/oneul-sai",
          "type": "github"
        }
      ]
    },
    "perspectives": {
      "frontend": {
        "card": {
          "description": [
            "Participant and operator flows with cancellation rules"
          ],
          "result": "Participants can view and cancel applications; operators manage applicants per session. Canceling a session also cancels its applications, and capacity cannot be reduced below the accepted count."
        }
      },
      "backend": {
        "card": {
          "description": [
            "Capacity checks under concurrent applications"
          ],
          "result": "Used a DB row lock for each session and kept capacity checks and application inserts in one transaction. In a local test with a stubbed member lookup, only one of 20 concurrent requests for the last seat succeeded. Also tested duplicate applications and applications during deadline or capacity changes."
        }
      }
    }
  },
  {
    "id": "ticketrush",
    "title": "First-come ticket booking (Ticket Rush)",
    "shortTitle": "Ticket Rush",
    "subtitle": "First-come ticket reservations",
    "period": "2026.08 – In development",
    "category": "Personal project",
    "focuses": [
      "all",
      "frontend",
      "backend"
    ],
    "stack": [
      "Java 21",
      "Spring Boot",
      "MySQL",
      "Redis",
      "TypeScript",
      "React",
      "Next.js",
      "Playwright",
      "GitHub Actions"
    ],
    "image": {
      "src": "/projects/ticketrush.png",
      "width": 1200,
      "height": 675,
      "previewSrc": "/projects/ticketrush-preview.webp",
      "previewWidth": 960,
      "previewHeight": 540,
      "alt": "ticket-rush seat-selection mockup — section tabs, seat map, and remaining-seat count"
    },
    "card": {
      "summary": "A personal project covering event browsing, queue entry, seat selection, mock payment, and booking confirmation. It focuses on competing requests for the same seat and repeated payment requests.",
      "description": [
        "Preventing duplicate seat holds and final reservations",
        "Separating payment acceptance from result processing"
      ],
      "result": "Hold seats for five minutes in Redis and enforce unique final reservations with a MySQL session-and-seat composite primary key. In local integration tests using MySQL and Redis, only one of 100 concurrent hold requests for the same seat succeeded.",
      "keywords": [
        "Seat holds",
        "Mock payment",
        "Duplicate requests"
      ],
      "visibility": "Public GitHub project",
      "workRange": "Queue, seats, mock payment and booking flow · Seat holds and duplicate-booking prevention",
      "environment": "Java 21 · Spring Boot · MySQL · Redis"
    },
    "detail": {
      "overview": "A personal project covering event browsing, queue entry, seat selection, mock payment, and booking confirmation. It focuses on competing requests for the same seat and repeated payment requests.",
      "scope": [
        "Queue, seats, mock payment and booking flow",
        "Seat holds and duplicate-booking prevention",
        "Local integration tests for concurrent requests"
      ],
      "workPoints": [
        "Preventing duplicate seat holds and final reservations — Hold seats for five minutes in Redis and enforce unique final reservations with a MySQL session-and-seat composite primary key. In local integration tests using MySQL and Redis, only one of 100 concurrent hold requests for the same seat succeeded.",
        "Separating payment acceptance from result processing — Save the payment-request event and transition the reservation to payment-in-progress in one transaction. Status checks and optimistic locking ensure ten concurrent confirmation requests for one reservation produce one event.",
        "Connecting queue, seat, and payment states to the UI — Built the booking flow in Next.js and update queue position and seat state through SSE. After payment acceptance, poll for approval or rejection; reuse the request identifier when retrying a lost response. Payments are simulated."
      ],
      "techUsage": [
        "Backend & DB: Java 21 · Spring Boot · MySQL · Redis",
        "Frontend: TypeScript · React · Next.js",
        "Testing & automation: Playwright · GitHub Actions"
      ],
      "results": [],
      "disclosure": "A personal project in development. Concurrency figures come from local tests.",
      "resources": [
        {
          "label": "GitHub repository",
          "href": "https://github.com/YongjaeKwon/ticket-rush",
          "type": "github"
        }
      ]
    },
    "perspectives": {
      "frontend": {
        "card": {
          "description": [
            "Connecting queue, seat, and payment states to the UI"
          ],
          "result": "Built the booking flow in Next.js and update queue position and seat state through SSE. After payment acceptance, poll for approval or rejection; reuse the request identifier when retrying a lost response. Payments are simulated."
        }
      },
      "backend": {
        "card": {
          "description": [
            "Preventing duplicate seat holds and final reservations"
          ],
          "result": "Hold seats for five minutes in Redis and enforce unique final reservations with a MySQL session-and-seat composite primary key. In local integration tests using MySQL and Redis, only one of 100 concurrent hold requests for the same seat succeeded."
        }
      }
    }
  },
  {
    "id": "reachrich",
    "title": "Personal investment research and operations (ReachRich)",
    "shortTitle": "ReachRich",
    "subtitle": "Personal investment research & operations",
    "period": "2026.03 – Present",
    "category": "Personal project",
    "focuses": [
      "all",
      "frontend",
      "backend"
    ],
    "stack": [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "SQLite",
      "Parquet",
      "TypeScript",
      "React",
      "Vite",
      "pytest",
      "Vitest",
      "GitHub Actions"
    ],
    "card": {
      "summary": "A private project that collects account and price data through the Toss Securities API and supports strategy testing and paper operation. I migrated validation logic from existing research code and connected collection with a web dashboard.",
      "description": [
        "Repeatable account and price ingestion",
        "Handling API limits and partial failures"
      ],
      "result": "Replace daily account summaries and holdings together in a SQLAlchemy/SQLite transaction. Merge each symbol’s daily prices by date in Parquet so recollecting the same data does not create duplicates.",
      "keywords": [
        "Data collection & validation",
        "API error handling",
        "Paper operation"
      ],
      "visibility": "Private personal project",
      "workRange": "Account and price data collection · Migration of existing strategy validation",
      "environment": "Python · FastAPI · SQLAlchemy · SQLite"
    },
    "detail": {
      "overview": "A private project that collects account and price data through the Toss Securities API and supports strategy testing and paper operation. I migrated validation logic from existing research code and connected collection with a web dashboard.",
      "scope": [
        "Account and price data collection",
        "Migration of existing strategy validation",
        "Dashboard, scheduled workflows and failure alerts"
      ],
      "workPoints": [
        "Repeatable account and price ingestion — Replace daily account summaries and holdings together in a SQLAlchemy/SQLite transaction. Merge each symbol’s daily prices by date in Parquet so recollecting the same data does not create duplicates.",
        "Handling API limits and partial failures — Reuse OAuth2 tokens before expiry. On a rate-limit response, wait for the server’s specified delay and retry once. Continue collecting other symbols after a failure, but fail the job if the failure ratio exceeds its threshold.",
        "Preventing future-data leakage in strategy validation — Migrated the existing validation module, passing only data available at each decision point and applying decisions from the next bar. Preserved tests that remove later data and verify past signals do not change, including tests that detect future-data references.",
        "Account dashboard and trading journal — Serve locally stored account data through FastAPI and display equity history, holdings, and a journal in React. Persist the amount-hiding preference and pause polling when the browser tab is hidden.",
        "Separating local collection from hosted workflows — Configured IP-restricted account and price collection as local jobs, and paper-operation records and health checks in GitHub Actions. Local jobs continue to later steps after a failure, and both environments send failure notifications through Telegram."
      ],
      "techUsage": [
        "Backend & data: Python · FastAPI · SQLAlchemy · SQLite · Parquet",
        "Frontend: TypeScript · React · Vite",
        "Testing & automation: pytest · Vitest · GitHub Actions"
      ],
      "results": [],
      "disclosure": "Based on the private original repository. Source code and actual account data are not published.",
      "resources": []
    },
    "perspectives": {
      "frontend": {
        "card": {
          "description": [
            "Account dashboard and trading journal"
          ],
          "result": "Serve locally stored account data through FastAPI and display equity history, holdings, and a journal in React. Persist the amount-hiding preference and pause polling when the browser tab is hidden."
        }
      },
      "backend": {
        "card": {
          "description": [
            "Repeatable account and price ingestion"
          ],
          "result": "Replace daily account summaries and holdings together in a SQLAlchemy/SQLite transaction. Merge each symbol’s daily prices by date in Parquet so recollecting the same data does not create duplicates."
        }
      }
    },
    "image": {
      "src": "/projects/reachrich.png",
      "width": 1180,
      "height": 838,
      "previewSrc": "/projects/reachrich-preview.webp",
      "previewWidth": 901,
      "previewHeight": 640,
      "alt": "ReachRich account summary, asset history and holdings screen example — synthetic data",
      "caption": "Screen example using synthetic data. The description below covers the private implementation."
    }
  },
  {
    "id": "ssafast",
    "title": "API specification and testing collaboration (SSAFAST)",
    "shortTitle": "SSAFAST",
    "subtitle": "Collaborative API specifications & testing",
    "period": "2023.04 – 2023.05",
    "category": "Team project · 6 members",
    "focuses": [
      "all",
      "frontend"
    ],
    "stack": [
      "TypeScript",
      "React",
      "Next.js",
      "React Hook Form"
    ],
    "image": {
      "src": "/projects/ssafast.png",
      "width": 1200,
      "height": 675,
      "previewSrc": "/projects/ssafast-preview.webp",
      "previewWidth": 960,
      "previewHeight": 540,
      "alt": "SSAFAST API spec input and test result screens"
    },
    "card": {
      "summary": "A team tool for authoring API specifications, sending requests, and reviewing responses and performance-test results. I worked on the frontend specification forms and test request and result screens.",
      "description": [
        "Repeatable and nested API input forms",
        "Converting form values into test requests"
      ],
      "result": "Used React Hook Form for headers, path variables, query parameters, and nested objects. Rendered inputs according to the API specification and managed values used for test requests.",
      "keywords": [
        "Nested input forms",
        "Test request composition",
        "Result views"
      ],
      "visibility": "Public GitHub project",
      "workRange": "API specification input forms · Request composition and API integration",
      "environment": "TypeScript · React · Next.js · React Hook Form"
    },
    "detail": {
      "overview": "A team tool for authoring API specifications, sending requests, and reviewing responses and performance-test results. I worked on the frontend specification forms and test request and result screens.",
      "scope": [
        "API specification input forms",
        "Request composition and API integration",
        "Test history and result details"
      ],
      "workPoints": [
        "Repeatable and nested API input forms — Used React Hook Form for headers, path variables, query parameters, and nested objects. Rendered inputs according to the API specification and managed values used for test requests.",
        "Converting form values into test requests — Combined header, path, query, and body values into request data and connected them to the execution API. Validated required values and allowed ranges for request rate and duration in performance tests.",
        "Test history and detailed results — Built screens for previous runs, average and percentile response latency, throughput, and counts by response status. Connected specification editing, execution, and result review in one workflow."
      ],
      "techUsage": [
        "Frontend: TypeScript · React · Next.js · React Hook Form"
      ],
      "results": [],
      "disclosure": "Frontend contributions within a six-person team.",
      "resources": [
        {
          "label": "GitHub repository",
          "href": "https://github.com/SSAFAST/ssafast",
          "type": "github"
        }
      ]
    }
  },
  {
    "id": "ddoing",
    "title": "Drawing-based English Vocabulary Service (ddoing)",
    "shortTitle": "ddoing",
    "subtitle": "English vocabulary through drawing",
    "period": "Feb 2023 – Apr 2023",
    "category": "Team project",
    "focuses": [
      "all",
      "frontend"
    ],
    "stack": [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "Vite",
      "Canvas API"
    ],
    "image": {
      "src": "/projects/ddoing.png",
      "width": 800,
      "height": 459,
      "previewSrc": "/projects/ddoing-preview.webp",
      "previewWidth": 800,
      "previewHeight": 459,
      "alt": "ddoing English vocabulary drawing screen"
    },
    "card": {
      "summary": "A team project where learners draw the given English word and continue studying based on an AI's judgement.",
      "description": [
        "I owned the frontend: the main screen, the drawing-based study screen, and score/XP updates.",
        "Drawings are converted to images and sent to the AI judgement server; the result drives the next question and study state."
      ],
      "result": "Found and fixed a duplicated-timer bug that made time run fast, and a stale word-list issue between questions.",
      "keywords": [
        "React",
        "Drawing input",
        "State & timers"
      ],
      "visibility": "Public GitHub project",
      "workRange": "Frontend · planning",
      "environment": "React · TypeScript · Redux Toolkit"
    },
    "detail": {
      "overview": "A learning service where users express English words as drawings and earn scores and XP based on AI judgement.",
      "scope": [
        "Main and drawing-study screens",
        "Drawing input and AI-server integration",
        "Study state, scores, and timers"
      ],
      "workPoints": [
        "Converted on-screen drawings to images, sent them to the AI judgement server, and applied scores and XP from the results.",
        "Fixed timers running twice when entering the screen, and made timers stop when leaving it.",
        "Fixed the state-update timing that left the previous word list visible when moving to the next question."
      ],
      "results": [
        "Drawing input, judgement, scoring, and moving to the next question all flow within a single screen."
      ],
      "techUsage": [
        "Frontend: TypeScript · React · Vite",
        "Input & state: Canvas API · Redux Toolkit"
      ],
      "disclosure": "A SSAFY team project. Image preprocessing was done with the team lead, who owned model training.",
      "resources": [
        {
          "label": "GitHub repository",
          "href": "https://github.com/GomGom-Team/ddoing",
          "type": "github"
        },
        {
          "label": "Screenshot",
          "href": "/projects/ddoing.png",
          "type": "image"
        }
      ]
    }
  },
  {
    "id": "modac",
    "title": "Developer Study Log Service (MODAC)",
    "shortTitle": "MODAC",
    "subtitle": "Learning records & study rooms for developers",
    "period": "Jan 2023 – Feb 2023",
    "category": "Team project · 6 members",
    "focuses": [
      "all",
      "frontend"
    ],
    "stack": [
      "Vue 3",
      "Pinia",
      "SockJS",
      "STOMP"
    ],
    "image": {
      "src": "/projects/modac.png",
      "width": 600,
      "height": 338,
      "previewSrc": "/projects/modac-preview.webp",
      "previewWidth": 600,
      "previewHeight": 338,
      "alt": "MODAC study log and study room screens"
    },
    "card": {
      "summary": "A team project where developers keep study logs and manage study-group activity together.",
      "description": [
        "I owned the frontend: study rooms, posts, and my-page screens.",
        "Implemented room entry/exit with invite-code validation, plus study statistics, notifications, and favorites."
      ],
      "result": "Wired up real-time chat so members can talk directly inside a study room.",
      "keywords": [
        "Vue 3",
        "State management",
        "Real-time chat"
      ],
      "visibility": "Public GitHub project",
      "workRange": "Frontend",
      "environment": "Vue 3 · Pinia · SockJS/STOMP"
    },
    "detail": {
      "overview": "A SSAFY team project where developers write study logs and manage study-group activity in one service.",
      "scope": [
        "Study room, post, and my-page screens",
        "Study statistics, notifications, and favorites",
        "Real-time chat UI integration"
      ],
      "workPoints": [
        "Managed room entry/exit, invite-code validation, and screen state with Vue 3 and Pinia.",
        "Implemented study logs, statistics, notifications, and favorites screens.",
        "Reflected connection state and incoming messages in the study room chat UI."
      ],
      "results": [
        "Joining a study group, keeping logs, and chatting in real time all connect within one service."
      ],
      "techUsage": [
        "Frontend: Vue 3 · Pinia",
        "Chat integration: SockJS · STOMP"
      ],
      "disclosure": "A 6-person SSAFY team project; the code is public on GitHub.",
      "resources": [
        {
          "label": "GitHub repository",
          "href": "https://github.com/YongjaeKwon/MODAC",
          "type": "github"
        },
        {
          "label": "Screenshot",
          "href": "/projects/modac.png",
          "type": "image"
        }
      ]
    }
  }
];

export const techGroups = [
  {
    "title": "Backend",
    "items": [
      "Java",
      "Spring Boot",
      "Spring MVC",
      "MyBatis"
    ]
  },
  {
    "title": "Frontend",
    "items": [
      "JavaScript",
      "Vue 2",
      "WebSquare5",
      "Nexacro 17",
      "JSP"
    ]
  },
  {
    "title": "Databases",
    "items": [
      "SQL",
      "MariaDB",
      "Oracle"
    ]
  },
  {
    "title": "Delivery & version control",
    "items": [
      "Jenkins",
      "Git",
      "SVN"
    ]
  }
];

export const experience = {
  "title": "Web Developer",
  "company": "TG Alliance",
  "period": "Jun 2024 – present",
  "description": "I build and maintain partner portals and business systems, from requirements discussions to UI, API and SQL development and deployment.",
  "responsibilities": [
    "Requirements discussion",
    "Screen, server & DB development",
    "UAT, deployment & operations"
  ]
};

export const education = [
  {
    "title": "TOEIC 885",
    "period": "Jun 2026",
    "description": "Listening 480 · Reading 405",
    "icon": "Languages"
  },
  {
    "title": "TOEIC Speaking, Advanced Low",
    "period": "Jun 2026",
    "description": "Score 170",
    "icon": "Languages"
  },
  {
    "title": "SQLD",
    "period": "Sep 2024",
    "description": "Korean national SQL developer certification",
    "icon": "Database"
  },
  {
    "title": "SSAFY (Samsung SW Academy For Youth), 8th cohort",
    "period": "Jul 2022 – Jun 2023",
    "description": "Completed the web development track; owned the frontend across three team projects.",
    "icon": "Award"
  },
  {
    "title": "B.A. in e-Business, Ajou University",
    "period": "Mar 2018 – Aug 2020",
    "description": "Graduated",
    "icon": "GraduationCap"
  },
  {
    "title": "California State University, Chico",
    "period": "Jan 2014 – May 2015",
    "description": "Studied Business Administration before transferring to Ajou University",
    "icon": "GraduationCap"
  }
];

