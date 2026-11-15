# Swasthloop decisions and open questions

## Recorded planning decisions

| ID | Decision | Rationale / status |
|---|---|---|
| D-001 | MVP scope is limited to public website, doctors, patient auth, doctor application/verification, appointments, three dashboards and in-app notifications. | Explicit founder scope. Future roadmap features are excluded. |
| D-002 | Proposed stack is Next.js App Router, React, TypeScript, Tailwind, shadcn/ui, Supabase PostgreSQL/Auth/RLS, official JS client, SQL migrations, GitHub and Netlify free tier. | Founder proposal accepted as planning baseline, pending confirmation of current free-tier capabilities and account setup. |
| D-003 | No Prisma, Express, Redis, Docker, paid APIs/services, or Supabase Storage in initial design. | No current need; keep zero-budget and operational complexity low. Revisit only with explicit approval and evidence of need. |
| D-004 | Prototype stores no real patient medical records and uses no fabricated doctor data. | Explicit privacy/scope constraints. Empty states are valid until approved real listings exist. |
| D-005 | Database schema and authorization will use SQL migrations and RLS, with server-side checks on every protected operation. | Required security boundary; frontend checks are UX only. |
| D-006 | Appointment states must distinguish pending request from confirmed booking; exact slot model is unresolved. | PRD defines statuses and timezone but not enough scheduling policy to choose a final model. |
| D-007 | No live integrations are claimed. | Repository inspection only; no account or deployment integration was configured or verified. |

## Decisions requiring founder input before dependent implementation

### Product workflow

1. **Appointment model:** Is each request for a specific time slot, or may a patient request a preferred time range for doctor confirmation? Who owns schedule entry and availability confirmation?
2. **Booking rules:** Which party may cancel/reschedule, what notice window applies, what happens to pending requests, and are no-show/completed states in MVP?
3. **Doctor onboarding:** Which registration/qualification fields are required, what evidence is reviewed, which fields may become public, and who may approve/reject? Should document uploads remain out of the prototype until a private storage/retention policy is approved?
4. **Identity:** Can one login act as both patient and doctor, or is a doctor account exclusive? Is email sufficient for initial account verification, or is phone verification required (which may need paid messaging)?
5. **Clinic data:** Are clinic name/address and doctor-clinic associations required for launch, or should the first directory list doctor profiles without clinic management?
6. **Appointment data minimization:** What contact fields are needed to coordinate an appointment? Should patients be allowed to submit any free-text note? Recommendation for prototype: no symptoms or medical history; avoid free text unless operationally essential.
7. **Launch data:** Who supplies approved doctor listings and verifies permission to publish them? The directory may be empty until this is resolved.
8. **Admin bootstrap:** How will the first administrator be created securely without a public admin-registration path?
9. **Public launch:** Is this a non-public prototype or a real patient-facing service? What age/consent policy, support contact, retention/deletion and complaint workflow should apply?

### Platform / operational validation

10. Confirm available GitHub, Supabase and Netlify accounts and accept checking their current free-tier quotas, Next.js support, auth configuration, project region/data residency, backup and suspension behavior before setup. No paid upgrade is assumed.
11. Confirm whether a custom domain, transactional email, or rate-limit/monitoring service is permitted if free-tier native options prove insufficient. These remain out of scope until approved.
12. Obtain qualified review of privacy notice, terms, consent, data handling, and applicable Indian healthcare/professional requirements before real operations. No legal determination is made in this plan.

## Revisit triggers

Revisit the stack only if a required MVP capability cannot be delivered securely with it or current provider limits make the proposed free-tier path infeasible. Any paid service, new infrastructure, health-record collection, external notification channel, payment, or future-phase module requires separate founder approval and updated documentation.
