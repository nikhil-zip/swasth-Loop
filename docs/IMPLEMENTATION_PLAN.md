# Swasthloop MVP implementation plan

## Pages and routes

Proposed App Router map; final route names can be adjusted during foundation work without changing scope.

| Route | Access | Purpose |
|---|---|---|
| `/` | Guest | Public home, truthful doctor search entry, product scope and emergency disclaimer. |
| `/doctors` | Guest | Search/filter approved, published doctors; honest empty state. |
| `/doctors/[slug]` | Guest | Approved public profile and appointment request entry. |
| `/about`, `/contact`, `/faq` | Guest | Public information and contact route (submission handling policy pending). |
| `/privacy`, `/terms`, `/emergency` | Guest | Reviewed policy and emergency information; legal copy needs qualified review before launch. |
| `/login`, `/register` | Guest | Patient account entry and authentication. |
| `/doctor/apply` | Signed-in applicant | Doctor application form and status; sensitive submission details private. |
| `/appointments/request/[doctor]` | Patient | Submit a minimal appointment request. Authentication required before final submission. |
| `/patient` | Patient | Patient overview and upcoming appointment summary. |
| `/patient/profile`, `/patient/appointments`, `/patient/appointments/[id]`, `/patient/notifications`, `/patient/settings` | Patient | Own profile, appointments, notification inbox and account settings. |
| `/doctor` | Verified doctor | Doctor overview. Pending applicants see application status, not doctor tools. |
| `/doctor/profile`, `/doctor/appointments`, `/doctor/appointments/[id]`, `/doctor/availability`, `/doctor/notifications`, `/doctor/settings` | Doctor | Own public profile, assigned appointments, availability only if approved, notifications and settings. |
| `/admin` | Admin | Protected overview with real database counts only. |
| `/admin/doctors`, `/admin/doctors/[id]`, `/admin/applications`, `/admin/appointments`, `/admin/users`, `/admin/audit-logs` | Admin | Verification and platform operations, with auditable privileged actions. |

Do not show unimplemented future services as operational. Admin creation/bootstrap must not allow self-assigned admin roles; choose a controlled bootstrap process before launch.

## API and server-action plan

Prefer typed server-side modules and Server Actions for same-app mutations. Use Route Handlers for stable resource endpoints, external callbacks, or clients that need HTTP. These are planned interfaces, not implemented integrations.

| Operation | Server entry point | Authorization and effects |
|---|---|---|
| Register/sign in/out/reset | Supabase Auth via server-aware Next.js integration | Validate fields; secure cookie/session handling; role not accepted from signup form. |
| Read doctor directory/profile | Server query or `GET /api/doctors` as needed | Public query only for approved/published fields; validate filters, bound pagination. |
| Submit doctor application | Server Action | Authenticated applicant; validate and minimize; create pending application; no uploads. |
| Review/verify doctor | Server Action | Admin role revalidated server-side; update application/profile in transaction; append audit event; notify applicant. |
| Request appointment | Server Action | Patient role/session; validate doctor and requested time; enforce booking rules transactionally; create reference/history/notification. |
| Accept/reject/cancel/complete | Server Action | Patient can cancel only own eligible booking; assigned doctor can respond/manage allowed transitions; admin override audited. |
| Read/update patient profile | Server Action/query | Own user only; field allowlist and server validation. |
| Read/update doctor profile | Server Action/query | Owner only for edits; public reads restricted to approved published fields. |
| Read notifications / mark read | Server Action/query | Recipient only; safe content and recipient ownership. |
| Admin user/appointment operations | Server Action or route handler | Admin check on every request; input validation; audit privileged changes. |

Centralize schemas and domain authorization. Return generic safe errors to clients; keep internal error details server-side without sensitive payloads. Use transactions/RPC or constraints for multi-row critical workflows and race-sensitive booking operations. Do not add a separate API server.

## Role and permission matrix

| Capability | Guest | Patient | Doctor/applicant | Admin |
|---|---:|---:|---:|---:|
| Browse/search published verified doctors | Yes | Yes | Yes | Yes |
| See private application details | No | No | Own only | Yes, as needed |
| Submit appointment request | No | Yes | No | Admin support action only, audited if enabled |
| View appointment | No | Own patient bookings | Assigned doctor bookings | Yes, operationally necessary |
| Change appointment status | No | Cancel own eligible request | Manage assigned eligible bookings | Override only if approved and audited |
| Edit patient profile | No | Own only | No | Restricted support operation, audited |
| Edit doctor profile | No | No | Own profile; public fields subject to verification policy | Review/approve; changes audited |
| Verify doctor application | No | No | No | Yes, admin-only |
| View/mark own notifications | No | Own only | Own only | Own only; admin does not read all users' inboxes by default |
| Manage roles/users/audit logs | No | No | No | Yes, least privilege and audited |

An applicant is not a verified doctor. Admin status must be granted outside public registration and checked from trusted server/database state.

## Security and privacy plan

1. Use Supabase Auth's supported session flow; secure, HTTP-only cookies where applicable; verify current SDK/Next.js integration during implementation. Require verified contact method before sensitive workflows according to the chosen policy.
2. Define database grants and RLS policies in SQL migrations. Enable RLS on every user-facing table, including history, notification and audit tables. Test policies with anon, patient A, patient B, doctor A, doctor B and admin identities before accepting implementation.
3. Use server-side authorization on every page data path, action and handler. Middleware may redirect for UX but is not the security boundary.
4. Validate and normalize input server-side; enforce allowlists, length limits, state transitions, pagination bounds and database constraints. Add abuse controls for auth and booking endpoints; select rate limiting only after provider capabilities/free limits are confirmed.
5. Keep Supabase service-role key and all secrets server-only. Commit no `.env` secrets; provide a sanitized example file only when implementation begins. Separate development/preview/production credentials and data.
6. Collect only account basics, doctor verification fields, and minimal appointment coordination data. No patient medical records, diagnoses, symptoms or document uploads in the prototype. Avoid health details in URLs, analytics, logs, notification previews and error messages.
7. Make administrative verification/status changes auditable through append-only audit rows with actor, action, target, time and minimal metadata. Prevent direct client writes to audit history.
8. Establish retention, deletion, consent, contact verification, incident handling, backup/recovery and privacy notice policies before real public patient operations. Obtain qualified review of applicable Indian privacy, healthcare and professional requirements; no legal compliance claim is made here.
9. Use synthetic test accounts only. Do not use actual patient data. Review dependencies and security advisories during implementation; avoid unneeded packages.

## Free-tier deployment plan

Proposed starting path: GitHub for version control, Supabase free project for Auth/Postgres, and Netlify free deployment for Next.js. Before connecting, verify current eligibility, quotas, supported Next.js features, project sleep/backup behavior, database region/data residency choices, build/deployment limits, and whether the required auth/session behavior works on the chosen hosting plan. Free offerings change; this document does not guarantee uninterrupted free operation or regulatory suitability.

1. Develop locally with no production data and local environment secrets.
2. Create separate development and production Supabase projects only if free quotas/accounts allow; otherwise keep prototype data isolated and never label it production.
3. Commit schema/RLS changes as SQL migrations; apply to a disposable development project first and inspect the result.
4. Connect GitHub to Netlify only after founder account/access and deployment approval. Configure preview builds with non-production credentials; production secrets stay in server environment settings.
5. Verify build, auth callbacks, RLS, security headers/HTTPS, error behavior, accessibility and core workflows on the actual deployed preview before any public launch.
6. Document quota monitoring and a pause plan. No paid upgrade, domain purchase, email/SMS provider or paid monitoring service is included without approval.

## Milestones

| Milestone | Deliverable / exit check |
|---|---|
| 0. Inspection and decisions | This architecture/plan; founder resolves critical booking, identity, verification and launch policy decisions. |
| 1. Foundation | Approved Next.js/TypeScript/Tailwind setup; Supabase project wiring; migrations, auth, roles, validation, error states and tested RLS. No real patient data. |
| 2. Public website and doctor directory | Responsive public pages, honest empty state, approved doctor data only, safe search and profile pages. |
| 3. Applications and verification | Applicant workflow, private review queue, admin-only verification, audit trail and notifications. |
| 4. Appointment workflow | Approved availability/request semantics, patient and doctor dashboards, transactional booking/status lifecycle and owner isolation. |
| 5. Admin and in-app notifications | User/appointment operations, notification inbox, authorization and audit coverage. |
| 6. Controlled preview and readiness | Free-tier deployment verified, security/accessibility/performance review, policy/legal review, operational limits documented. Public launch requires separate approval. |

Each milestone should be reviewed before starting the next; report files, schema, endpoints, verification performed, issues and run instructions. Do not start future roadmap modules as part of MVP.

## Risks and limitations

- Empty repository means setup and integration failures are not yet known.
- No approved doctor data means the directory may initially be empty; invented listings are prohibited.
- Scheduling, verification evidence, doctor onboarding eligibility, cancellations and clinic requirements need founder decisions.
- Free tiers have changing quotas, availability, data location and operational limits; they may not support a reliable public healthcare service.
- Legal, privacy and healthcare review is outstanding; prototype planning is not launch authorization.
- Email/SMS/WhatsApp/push are excluded; in-app notifications require users to sign in.
- Storage, backups, monitoring, abuse controls and retention may require capabilities beyond free tiers; validate before real use.
