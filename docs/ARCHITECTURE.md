# Swasthloop MVP architecture

## Repository inspection

Inspection found a clean `main` branch tracking `origin/main`, with `PRD.md` as the only project file. There is no application code, framework selection/configuration, package manifest, dependency installation, or existing `docs/` directory. The PRD is tracked by Git under the case-insensitive path `prd.md` in this Windows checkout. It is unchanged. No integrations or external services were tested or configured.

## MVP boundary

Build only public healthcare pages, doctor directory/search and public approved profiles, patient registration/login, doctor applications and admin verification, appointment requests and management, patient/doctor/admin dashboards, and in-app notifications. Exclude pharmacy/medicine, diagnostic services, telemedicine, clinical records, AI diagnosis, prescriptions, subscriptions, ratings, payments and ambulance dispatch. Never use invented healthcare listings or real patient medical data in a prototype.

## Proposed stack

- **Web and server:** Next.js App Router, React, TypeScript. Render public pages on the server where practical; use Server Components by default and client components only for interactive UI.
- **Styling/UI:** Tailwind CSS and shadcn/ui components where useful. Treat shadcn/ui as source code in the repository, not a hosted paid dependency. Check accessibility and avoid adding packages without a clear need.
- **Data/auth:** Supabase PostgreSQL, Supabase Auth and PostgreSQL RLS, accessed using the official Supabase JavaScript client. SQL migrations in version control are the source of truth for schema and policies. No ORM initially.
- **Business operations:** Next.js Server Actions for form-driven mutations and Route Handlers for resource-oriented HTTP endpoints or callbacks. Centralize validation and authorization in server-only domain modules. Never trust a client-supplied user ID or role.
- **Files:** No Storage in the prototype. Reconsider only for a clearly approved, necessary document or image workflow; verification evidence should not be publicly accessible.
- **Source/deployment:** GitHub repository and a free-tier Netlify deployment are proposed. Connect only after account, repository, build settings, region, and current free-tier limits are confirmed. Preview deployments must use non-production data and separate credentials.

The choice of Netlify and service free tiers is a proposal, not a claim that accounts, integrations, eligibility, quotas, data location, or availability have been checked. Check current provider terms and limits before setup or launch. No paid upgrade is assumed.

## Suggested structure once implementation is approved

```text
src/app/                 routes, layouts, pages, route handlers
src/components/          shared accessible UI and layouts
src/features/            auth, doctors, appointments, notifications, admin
src/lib/supabase/        server/client setup and typed database helpers
src/lib/validation/      shared schemas and input parsing
src/lib/auth/            server session and authorization helpers
supabase/migrations/     versioned SQL schema, indexes, functions, RLS
docs/                    architecture, decisions, implementation, progress
```

Keep feature rules out of presentation components. Server-only modules must not be imported into client bundles.

## Data model and relationships

Use UUID primary keys, UTC `timestamptz` instants, explicit `Asia/Kolkata` display/appointment policy, foreign keys, check constraints, and indexes driven by access patterns. Prefer restrictive access and explicit status enums/checks. Exact SQL and status-transition rules require approval before migrations.

| Entity | Purpose and links |
|---|---|
| `profiles` | One row per Supabase Auth user (`id` references `auth.users`); minimal name/contact/display data and account state. Never store passwords or duplicate credentials. |
| `user_roles` | Restricted role assignments (`patient`, `doctor`, `admin`); role changes are admin-controlled and audited. A user may have patient and doctor intent only if product policy permits; role cardinality is unresolved. |
| `doctor_applications` | Applicant-owned private professional and registration details, submission/review state, reviewer and timestamps. Separate from public profile; access only applicant and authorized admin. Do not accept/store evidence files in prototype. |
| `specialties` | Admin-managed searchable specialty catalog. |
| `doctor_profiles` | One-to-one approved doctor identity/profile; owner user, optional specialty, public biography/qualifications/experience and verification/publication state. Public reads expose approved fields only. |
| `clinics` (decision pending) | Potential clinic/location details linked to doctors through `doctor_clinics`. Include only if required for first appointment workflow; avoid collecting unnecessary clinic data. |
| `doctor_clinics` (conditional) | Many-to-many doctor/clinic relationship, with approved location/consultation details if needed. |
| `doctor_availability` (conditional) | Doctor-owned recurring schedule or explicitly managed availability. Include only after availability and timezone semantics are decided. |
| `appointments` | Patient, doctor profile, requested time, unique public-safe reference, status and minimal booking note/contact snapshot if approved. Both sides can read relevant rows; no medical history. Enforce writes/transitions on server and RLS. |
| `appointment_status_history` | Append-only old/new status, actor, time and minimal reason; record every transition. RLS prevents user edits/deletes. |
| `notifications` | Recipient-owned in-app event type, safe short message/metadata, read/created timestamps. Do not include sensitive details in previews. |
| `audit_logs` | Append-only privileged action, actor, target, timestamp and minimal structured metadata; never log secrets or unnecessary health data. Admin read access. |

Relationships: `auth.users 1—1 profiles`; users have restricted role assignments; a doctor applicant may become the owner of a doctor profile after approval; a doctor profile has one specialty and may relate to clinics/availability if approved; each appointment links one patient profile/user and one doctor profile; each appointment has status-history entries; notifications belong to one user; admin actions create audit entries. Use uniqueness for one profile per auth user, safe booking reference, and any slot collision constraint the final scheduling model supports.

No pharmacy, diagnostic, payment, subscription, review, prescription, or medical-record entities belong in this MVP schema.

## Permission model

See the role matrix in `docs/IMPLEMENTATION_PLAN.md`. Apply least privilege with RLS on every exposed table. Public access is limited to published, verified doctor profile fields and active specialties. Avoid broad public table grants; use safe views or explicitly selected columns where needed. Never return application documents or internal review notes publicly.

Use the caller's Supabase session for normal reads/writes. If a service-role client is ever necessary for a narrowly scoped trusted server operation, keep it server-only, authorize first, minimize scope, and never use it as a shortcut around RLS. Authentication and authorization are separate checks.

## Booking behavior (pending product decisions)

The initial implementation should create an appointment **request** and distinguish `pending` from `confirmed`. Prevent duplicate/conflicting confirmed appointments transactionally once the slot/availability model is approved. Store instants consistently; render in Asia/Kolkata. The PRD does not settle whether booking is exact-slot or request-based, who sets availability, cancellation windows, rescheduling, doctor response deadlines, or no-show handling; resolve these before the appointment schema and business rules are finalized.
