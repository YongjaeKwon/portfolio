import type { CaseStudyProjectId, ProjectCaseStudy } from "./caseStudies.ko";

export const enProjectCaseStudies: Record<CaseStudyProjectId, ProjectCaseStudy[]> = {
  "tsms": [
    {
      "id": "sql",
      "area": "Backend",
      "title": "Monthly service-result lookup: about 53 s → 1.2 s",
      "implementation": [
        "Replaced a combined view with base-table joins and direct lookup of the latest history per service request. Changed date filters from functions on the column to a start-inclusive, next-day-exclusive range.",
        "Compared old and new SQL in read-only transactions on the production DB, checking values, NULLs, duplicate rows, and column metadata. Reproduced missing cancellation details in the development DB under different optimizer settings and compared them with the source history."
      ],
      "outcome": "Monthly lookup: about 53 s → 1.2 s. Full lookup (about 480,000 rows): about 125 s → 44 s."
    },
    {
      "id": "cc",
      "area": "Backend",
      "title": "Reducing call-center service-history wait times",
      "implementation": [
        "Service history loaded slowly after an agent selected a customer or completed a service request. The query aggregated all requests and histories before narrowing the search.",
        "Filtered matching requests by school, customer name, or phone number before fetching their latest histories. The count query now checks whether history exists instead of aggregating the latest records. Preserved grouped-request counts, search filters, permissions, and pagination.",
        "Compared values, NULLs, ordering, and counts on the production DB before deployment. Where the original name search timed out, used a bounded range or fixed join order to compare results separately."
      ],
      "outcome": "Daily production logs before and after deployment showed median lookup API response time falling from about 20 s to 0.02 s. Agents also reported that the wait for a request number to appear fell from about 10 s to 1 s."
    },
    {
      "id": "inspection",
      "area": "Full Stack",
      "title": "Digitizing paper inspections and follow-up visits",
      "implementation": [
        "Paper records made progress hard to track, especially when missing devices needed another visit. Stored the inspection round, result, and reason for each incomplete device so staff could continue using previous records.",
        "Connected schedule approval, inspection forms, touch signatures, and certificates. Input fields follow role and progress state. Version checks on save prevent overwriting another staff member’s update."
      ],
      "outcome": "Recorded approximately 15,000 inspections across 71 schools in the verified operational records."
    },
    {
      "id": "data",
      "area": "Backend",
      "title": "Cleaning duplicate records without losing inspection results",
      "implementation": [
        "Mixed 14- and 15-digit serial numbers could link records to the wrong device or create duplicates. Standardized storage to 15 digits and resolved 14-digit input against school assignments.",
        "Identified duplicates using class, student number, and inspection history. Prepared backup, rollback, and post-change validation SQL before applying the cleanup."
      ],
      "outcome": "Applied the cleanup to the production DB while preserving existing inspection results."
    },
    {
      "id": "request",
      "area": "Frontend",
      "title": "Preventing duplicate scroll requests and stale search results",
      "implementation": [
        "Allowed only one request at a time. A search change discards the old response and runs the latest search. Subsequent pages retain customer, search, and authorization filters, with retry after errors."
      ],
      "outcome": "Tests running the screen functions handled 100 consecutive scroll events with one additional fetch and checked search changes and retry after errors."
    },
    {
      "id": "register",
      "area": "Full Stack",
      "title": "Validating device imports before registration",
      "implementation": [
        "Compared spreadsheet imports with production-intake records, checked duplicate serial numbers, and showed existing school and user details for invalid entries. Validated devices can be registered in bulk. QR codes carry a public identifier rather than an internal DB identifier."
      ],
      "outcome": "Used for bulk registration and printing with the factory’s dedicated printer."
    },
    {
      "id": "api",
      "area": "Backend",
      "title": "Maintaining shared external integrations",
      "implementation": [
        "Moved address and education-information API calls from 25 screens to shared server paths. Kept keys and external URLs in server configuration so integration changes can be made centrally."
      ]
    }
  ],
  "pps": [
    {
      "id": "download",
      "area": "Full Stack",
      "title": "Asynchronous compression with progress recovery after a refresh",
      "implementation": [
        "Compressing 300–400 attachments kept the request open and hid progress. Changed the endpoint to return a job ID first and run compression through Spring’s asynchronous executor.",
        "Compression requests and status checks needed to find the same job even when handled by different WAS instances. Stored job progress, completion, and failure in Hazelcast, shared by WAS instances on the same host. The browser saves the job ID and polls for progress, recovering the existing job after a refresh. Downloads use a separate request; temporary files are removed after download or expiry."
      ]
    },
    {
      "id": "attachment",
      "area": "Full Stack",
      "title": "Fixing attachments linked to the wrong engineer",
      "implementation": [
        "A shallow copy of a common object left Vue instances sharing attachment information from the previous engineer. Created fresh state per instance and cleared attachment information when registration or lookup failed.",
        "The server also rejects file groups belonging to another active engineer. Preserved the existing exception that allows files from an inactive account to be reused when an engineer moves centers."
      ]
    },
    {
      "id": "otp",
      "area": "Backend",
      "title": "Preventing repeated verification messages and code reuse",
      "implementation": [
        "Shared per-user resend limits through Hazelcast so concurrent requests face the same limit whichever WAS instance receives them. putIfAbsent admits one request; TTL sets expiry and conditional removal avoids deleting a newer request’s limit.",
        "Verified and consumed codes together in the DB to prevent reuse. Removed codes and message bodies from API responses and return failure when saving a message request or changing a password fails. Wrote unit tests for concurrent requests, expiry, reuse, and failure responses."
      ]
    },
    {
      "id": "deploy",
      "area": "Deployment",
      "title": "Repeatable Jenkins deployment jobs",
      "implementation": [
        "Connected source updates, Gradle builds, transfer, backup, and sequential deployment to two WAS instances in manually triggered Jenkins jobs. Separated development and production jobs and kept stage-level execution logs."
      ]
    },
    {
      "id": "account",
      "area": "Full Stack",
      "title": "Account management with checks before department changes",
      "implementation": [
        "Built the UI and API for headquarters account creation and updates, checking department, grade, and duplicate accounts, and showing synchronization results.",
        "Before disabling an account or changing its department, check remaining inventory and service work; block saving if work remains or the API check fails. Verify the linked user and department exist, require exactly one updated user record, and apply the same department code to related requests."
      ]
    },
    {
      "id": "policy",
      "area": "Full Stack",
      "title": "Notification policies and additional recipients",
      "implementation": [
        "Built policy UI and APIs for sending rules, templates, additional recipients, preferences, and change history.",
        "Deduplicated recipients by engineer ID and kept the default recipient’s template. Unit tests cover duplicate recipients and skipping recipient lookup when extra sends are disabled."
      ]
    },
    {
      "id": "contract",
      "area": "Full Stack",
      "title": "Completed-contract emails and delivery history",
      "implementation": [
        "Check that a contract is complete before emailing its document to the center manager. Record the request, success or failure, and error details so operators can review delivery results."
      ]
    },
    {
      "id": "education",
      "area": "Full Stack",
      "title": "Training rosters and attendance reporting",
      "implementation": [
        "Connected roster submissions with attendance views and Excel exports. Flagged engineers from another center or already registered as entries to exclude. Reports count submitted rosters separately from centers that have not submitted."
      ]
    }
  ],
  "sr30": [
    {
      "id": "sr30_kpi",
      "area": "Full Stack",
      "title": "Service reports by period and product group",
      "implementation": [
        "Built monthly service reports with Java-generated month lists, MyBatis aggregation, and matching Nexacro columns. Displayed delivery, return, cancellation, and subtotal counts for the selected period and product group."
      ]
    },
    {
      "id": "sr30_search",
      "area": "Full Stack",
      "title": "Fixing service-history search by phone number",
      "implementation": [
        "Fixed the input-to-dataset binding and Java request parameters. SQL converts the search value using the existing encryption scheme and compares it against landline, mobile, and additional contact numbers."
      ]
    },
    {
      "id": "sr30_stock",
      "area": "Full Stack",
      "title": "Correcting inventory date filters and search branches",
      "implementation": [
        "Separated aggregation ranges for current stock and stock as of a selected date. Removed TO_DATE from the stored date column, corrected MyBatis branches for the screen checkbox, and improved date-range validation and display."
      ]
    },
    {
      "id": "sr30_log",
      "area": "Full Stack",
      "title": "Access and personal-data download history",
      "implementation": [
        "Built screens and SQL aggregating existing login, screen-access, and personal-data download logs by department, user, and period. Joined menu names to make the accessed screens identifiable."
      ]
    },
    {
      "id": "sr30_postal",
      "area": "Full Stack",
      "title": "Equipment installation and removal forms",
      "implementation": [
        "Added Nexacro screens and MyBatis SQL to find equipment by management number and save installation or removal records. Connected the appropriate inputs, equipment lookup, and registration request for each work type."
      ]
    }
  ],
  "oneulsai": [
    {
      "id": "oneulsai-1",
      "area": "Full Stack",
      "title": "Capacity checks under concurrent applications",
      "implementation": [
        "Used a DB row lock per session to prevent concurrent applications from being accepted against the same remaining capacity. After acquiring the lock, read the current capacity, deadline status, and applicant count, then insert the application in the same transaction. In a local test with a stubbed member lookup, only one of 20 concurrent requests for the last seat succeeded. Also tested duplicate applications and applications during deadline or capacity changes."
      ]
    },
    {
      "id": "oneulsai-2",
      "area": "Full Stack",
      "title": "Participant and operator flows with cancellation rules",
      "implementation": [
        "Participants can view and cancel applications; operators manage applicants per session. Canceling a session also cancels its applications, and capacity cannot be reduced below the accepted count."
      ]
    },
    {
      "id": "oneulsai-3",
      "area": "Full Stack",
      "title": "Testing the application flow across UI and server",
      "implementation": [
        "Run participant and operator interfaces with the server in Playwright tests on GitHub Actions. Checked error feedback and retained login during a member-service outage, followed by successful reapplication after recovery."
      ]
    }
  ],
  "ticketrush": [
    {
      "id": "ticketrush-1",
      "area": "Full Stack",
      "title": "Preventing duplicate seat holds and final reservations",
      "implementation": [
        "Hold seats for five minutes in Redis and enforce unique final reservations with a MySQL session-and-seat composite primary key. In local integration tests using MySQL and Redis, only one of 100 concurrent hold requests for the same seat succeeded."
      ]
    },
    {
      "id": "ticketrush-2",
      "area": "Full Stack",
      "title": "Separating payment acceptance from result processing",
      "implementation": [
        "Save the payment-request event and transition the reservation to payment-in-progress in one transaction. Status checks and optimistic locking ensure ten concurrent confirmation requests for one reservation produce one event."
      ]
    },
    {
      "id": "ticketrush-3",
      "area": "Full Stack",
      "title": "Connecting queue, seat, and payment states to the UI",
      "implementation": [
        "Built the booking flow in Next.js and update queue position and seat state through SSE. After payment acceptance, poll for approval or rejection; reuse the request identifier when retrying a lost response. Payments are simulated."
      ]
    }
  ],
  "reachrich": [
    {
      "id": "reachrich-1",
      "area": "Full Stack",
      "title": "Repeatable account and price ingestion",
      "implementation": [
        "Replace daily account summaries and holdings together in a SQLAlchemy/SQLite transaction. Merge each symbol’s daily prices by date in Parquet so recollecting the same data does not create duplicates."
      ]
    },
    {
      "id": "reachrich-2",
      "area": "Full Stack",
      "title": "Handling API limits and partial failures",
      "implementation": [
        "Reuse OAuth2 tokens before expiry. On a rate-limit response, wait for the server’s specified delay and retry once. Continue collecting other symbols after a failure, but fail the job if the failure ratio exceeds its threshold."
      ]
    },
    {
      "id": "reachrich-3",
      "area": "Full Stack",
      "title": "Preventing future-data leakage in strategy validation",
      "implementation": [
        "Migrated the existing validation module, passing only data available at each decision point and applying decisions from the next bar. Preserved tests that remove later data and verify past signals do not change, including tests that detect future-data references."
      ]
    },
    {
      "id": "reachrich-4",
      "area": "Full Stack",
      "title": "Account dashboard and trading journal",
      "implementation": [
        "Serve locally stored account data through FastAPI and display equity history, holdings, and a journal in React. Persist the amount-hiding preference and pause polling when the browser tab is hidden."
      ]
    },
    {
      "id": "reachrich-5",
      "area": "Full Stack",
      "title": "Separating local collection from hosted workflows",
      "implementation": [
        "Configured IP-restricted account and price collection as local jobs, and paper-operation records and health checks in GitHub Actions. Local jobs continue to later steps after a failure, and both environments send failure notifications through Telegram."
      ]
    }
  ],
  "ssafast": [
    {
      "id": "ssafast-1",
      "area": "Frontend",
      "title": "Repeatable and nested API input forms",
      "implementation": [
        "Used React Hook Form for headers, path variables, query parameters, and nested objects. Rendered inputs according to the API specification and managed values used for test requests."
      ]
    },
    {
      "id": "ssafast-2",
      "area": "Frontend",
      "title": "Converting form values into test requests",
      "implementation": [
        "Combined header, path, query, and body values into request data and connected them to the execution API. Validated required values and allowed ranges for request rate and duration in performance tests."
      ]
    },
    {
      "id": "ssafast-3",
      "area": "Frontend",
      "title": "Test history and detailed results",
      "implementation": [
        "Built screens for previous runs, average and percentile response latency, throughput, and counts by response status. Connected specification editing, execution, and result review in one workflow."
      ]
    }
  ],
  "ddoing": [
    {
      "id": "drawing-session-state",
      "area": "Frontend",
      "title": "Stabilizing the drawing session's timers and step state",
      "implementation": [
        "Managed the current question, correct count, timer, modal, and word list as one learning flow.",
        "Converted Canvas drawings to images, sent them to the trained classifier's inference API, and reflected judgements on screen.",
        "Used a custom effect that skips the initial render, and reset intervals and session state on restart."
      ],
      "outcome": "Timed learning, judgement, next-question, and final results now connect properly — fixing the duplicated timers and stale word lists that appeared on restart."
    },
    {
      "id": "main-api-content",
      "area": "Frontend",
      "title": "Turning the main screen into API-driven content",
      "implementation": [
        "Requested popular videos and gallery data separately on mount, with separate response types and state.",
        "Composed the service banner, popular content, and hall of fame as separate carousels.",
        "Rendered drawing paths, words, nicknames, and scores in a loop, with navigation to video details and the service screens."
      ],
      "outcome": "The main screen now shows popular videos and real drawings instead of static cards, with API responses and display components cleanly separated."
    }
  ],
  "modac": [
    {
      "id": "study-room-entry",
      "area": "Frontend",
      "title": "An entry flow driven by room type and membership state",
      "implementation": [
        "Computed invite-code necessity from the member list and room visibility.",
        "Surfaced capacity-full and code-mismatch errors separately, updating Pinia's current-room state only on successful validation.",
        "Connected entry/exit and favorites updates through the same room store and API module."
      ],
      "outcome": "Entry and exit now flow consistently across public and private rooms, respecting capacity, invite codes, and existing membership."
    },
    {
      "id": "realtime-room-ui",
      "area": "Frontend",
      "title": "Wiring room chat and room-switching state to the screen",
      "implementation": [
        "Separated the chat list and input components, distinguishing message display by the signed-in user.",
        "Cleared the previous chat log on entry and opened the chat screen only after the new room's data was ready.",
        "Cleaned up existing connections and fetched fresh room data when leaving or entering another room from favorites."
      ],
      "outcome": "Switching rooms now clears the previous connection and chat log, so messages from other study rooms never mix in."
    }
  ]
};
