# SWASTHLOOP
## Product Requirements Document (PRD)

**Product:** Swasthloop  
**Tagline:** Your Healthcare, Connected.  
**Document Version:** 1.0  
**Status:** Product & Development Specification  
**Product Type:** Full-Stack Healthcare Platform  
**Initial Launch Market:** Gorakhpur, Uttar Pradesh, India  
**Development Approach:** AI-assisted development using OpenAI Codex

---

# 1. PRODUCT OVERVIEW

## 1.1 Product Vision

Swasthloop is a comprehensive digital healthcare platform designed to connect patients, doctors, clinics, pharmacies, diagnostic centres and healthcare service providers through one integrated ecosystem.

The platform aims to simplify healthcare discovery, appointment scheduling, medicine price comparison, diagnostic service discovery and digital healthcare access.

Swasthloop will initially focus on Gorakhpur, Uttar Pradesh, with a scalable architecture that supports expansion across India.

## 1.2 Core Objective

Build a unified healthcare ecosystem where:

- Patients can discover doctors and book appointments.
- Doctors can manage their profiles and appointments.
- Clinics can manage their operations.
- Patients can compare medicine prices across participating pharmacies.
- Patients can discover nearby diagnostic centres.
- Diagnostic centres can manage their services and bookings.
- Administrators can manage the entire platform.
- Users can access healthcare services through a responsive website and mobile experience.

## 1.3 Product Philosophy

The product must prioritize:

1. Simplicity and accessibility.
2. Trust and verified information.
3. Patient privacy and data security.
4. Fast and reliable booking workflows.
5. Mobile-first user experience.
6. Scalable architecture.
7. Affordable and accessible healthcare discovery.

---

# 2. TARGET USERS AND USER ROLES

The platform must support the following roles.

## 2.1 Guest / Visitor

Capabilities:

- Browse the homepage.
- Discover doctors.
- Search doctors by specialization.
- View doctor profiles.
- Explore diagnostic centres.
- Browse participating pharmacies.
- Compare publicly available medicine prices.
- View healthcare information pages.
- Register or sign in.

## 2.2 Patient

Capabilities:

- Register and authenticate.
- Manage personal profile.
- Search and filter doctors.
- View doctor profiles.
- Book appointments.
- Manage upcoming and previous appointments.
- Cancel appointment requests according to platform policies.
- Access consultation history.
- Discover diagnostic centres.
- Book diagnostic services where supported.
- Compare medicine prices.
- Save favourite doctors.
- Receive appointment notifications.
- Manage notification preferences.
- Submit feedback through approved workflows.

## 2.3 Doctor

Capabilities:

- Secure doctor authentication.
- Manage professional profile.
- Submit qualifications and registration details for verification.
- Add clinic information.
- Configure consultation fees.
- Manage availability and schedules.
- View appointment requests.
- Accept or reject appointments.
- Manage appointment statuses.
- View patient-provided booking information.
- Access permitted consultation records.
- Manage consultation settings.
- View basic dashboard analytics.

## 2.4 Clinic / Hospital Administrator

Capabilities:

- Manage clinic profile.
- Manage associated doctors.
- Manage clinic locations.
- Configure consultation schedules.
- Manage appointments.
- View operational statistics.
- Manage authorized staff accounts.

## 2.5 Pharmacy Partner

Capabilities:

- Register pharmacy business.
- Submit business verification information.
- Manage pharmacy profile.
- Add and update medicine listings.
- Manage medicine prices.
- Update stock availability.
- Manage medicine catalogue.
- View product enquiries or orders if commerce is enabled.
- View basic performance statistics.

## 2.6 Diagnostic Centre Partner

Capabilities:

- Register diagnostic centre.
- Submit verification information.
- Manage centre profile.
- Add diagnostic services.
- Configure service prices.
- Manage available slots.
- Manage diagnostic bookings.
- Update booking status.
- View basic analytics.

## 2.7 Platform Administrator

Capabilities:

- Manage patients.
- Manage doctors.
- Verify doctor credentials.
- Manage clinics and hospitals.
- Manage pharmacies.
- Manage diagnostic centres.
- Manage specialties.
- Manage medicine categories.
- Manage diagnostic categories.
- Manage appointments.
- Manage service bookings.
- Manage user roles and permissions.
- Manage platform content.
- Handle complaints and reports.
- View platform analytics.
- Manage platform settings.
- Maintain audit logs.
- Suspend or deactivate accounts when necessary.

---

# 3. COMPLETE PRODUCT FEATURE SCOPE

Features are divided into implementation phases. The overall product vision includes all the following capabilities, but the first release must prioritize the core healthcare workflows.

## PHASE 1 — CORE HEALTHCARE PLATFORM (MVP)

### 3.1 Public Website

Create a professional healthcare website containing:

- Modern homepage.
- Hero section with doctor search.
- Search by doctor name.
- Search by medical specialty.
- Featured doctors using real, approved listings.
- Popular specialties.
- How Swasthloop works.
- Healthcare service categories.
- Diagnostic centre discovery entry point.
- Medicine comparison entry point.
- About Swasthloop.
- Contact page.
- Frequently asked questions.
- Privacy policy.
- Terms and conditions.
- Emergency disclaimer.
- Login and registration entry points.

Requirements:

- Responsive design.
- SEO-friendly pages.
- Accessible navigation.
- Optimized images.
- Fast loading.
- Clear calls to action.

### 3.2 Doctor Discovery

Patients must be able to discover doctors through:

- Doctor name.
- Medical specialization.
- Location.
- Clinic or hospital.
- Consultation mode.
- Availability, when maintained and confirmed.

Filters:

- Specialty.
- Location.
- Experience.
- Consultation fee.
- Available appointment dates.
- Consultation type.

Doctor cards should display:

- Doctor name.
- Profile image.
- Specialty.
- Qualifications.
- Experience.
- Clinic name.
- Location.
- Consultation fee, if confirmed.
- Verification status.
- Available appointment information, if confirmed.

Never display invented credentials, ratings, fees or availability.

### 3.3 Doctor Profile

Each doctor must have a dedicated profile page.

Information:

- Full name.
- Profile photograph.
- Specialization.
- Qualifications.
- Professional experience.
- Registration information where appropriate.
- Clinic or hospital affiliation.
- Clinic address.
- Consultation fees.
- Consultation modes.
- Available schedules.
- Verification status.
- Appointment booking action.

Only reviewed and authorized information can be publicly displayed.

### 3.4 Appointment Booking System

Patients should be able to:

1. Select a doctor.
2. View appointment options.
3. Select an available date and time, if live availability is supported.
4. Enter minimum required patient information.
5. Review booking details.
6. Submit appointment request.
7. Receive a unique booking reference.
8. Track booking status.

Appointment statuses:

- Pending
- Confirmed
- Rejected
- Cancelled
- Completed
- No-show

Booking rules:

- Prevent double-booking.
- Validate availability on the server.
- Record status changes.
- Use Asia/Kolkata timezone.
- Clearly distinguish pending requests from confirmed appointments.
- Define cancellation and rescheduling policies.

### 3.5 Patient Dashboard

Dashboard sections:

- Overview.
- Personal profile.
- Upcoming appointments.
- Previous appointments.
- Cancelled appointments.
- Appointment details.
- Saved doctors.
- Notifications.
- Account settings.

Patients must only access their own private information.

### 3.6 Doctor Dashboard

Dashboard sections:

- Overview.
- Professional profile.
- Verification status.
- Appointment requests.
- Upcoming appointments.
- Appointment history.
- Availability management.
- Schedule management.
- Consultation settings.
- Basic statistics.
- Account settings.

Doctors must only access bookings assigned to their authorized doctor profile.

### 3.7 Admin Dashboard

Create a protected administrative dashboard.

Overview statistics:

- Total registered users.
- Total patients.
- Total doctors.
- Verified doctors.
- Pending doctor verifications.
- Total appointments.
- Pending appointments.
- Completed appointments.
- Registered clinics.
- Registered pharmacies.
- Diagnostic centres.

Management modules:

- User management.
- Doctor management.
- Doctor verification.
- Specialty management.
- Clinic management.
- Pharmacy management.
- Diagnostic centre management.
- Appointment management.
- Service management.
- Content management.
- Reports and complaints.
- Platform configuration.
- Audit logs.

---

# 4. PHASE 2 — MEDICINE PRICE COMPARISON

## 4.1 Medicine Discovery

Patients should be able to search medicines by:

- Medicine name.
- Brand name.
- Generic name.
- Active ingredient.
- Strength.
- Dosage form.

Medicine listing information:

- Medicine name.
- Brand.
- Generic composition.
- Strength.
- Dosage form.
- Pack size.
- Manufacturer.
- MRP, when verified.
- Participating pharmacy prices.
- Stock availability.
- Last updated time.

## 4.2 Price Comparison

Display participating pharmacies offering the same medicine.

Comparison information:

- Pharmacy name.
- Medicine price.
- Stock status.
- Distance or location.
- Last price update.
- Contact information.

Important rules:

- Compare equivalent formulations and strengths.
- Do not compare non-equivalent medicines as identical.
- Do not fabricate medicine prices.
- Show price update timestamps.
- Clearly identify unavailable products.
- Respect prescription requirements.
- Never recommend changing prescribed medicines independently.

## 4.3 Pharmacy Dashboard

- Pharmacy registration.
- Verification.
- Medicine catalogue.
- Add medicine.
- Update medicine price.
- Update stock.
- Manage listings.
- View enquiries.
- Manage orders if ordering is enabled.
- Basic analytics.

Online medicine ordering and payment require a separately approved operational and legal workflow.

---

# 5. PHASE 3 — DIAGNOSTIC CENTRE DISCOVERY

## 5.1 Diagnostic Centre Directory

Patients can discover:

- Pathology laboratories.
- X-ray centres.
- CT scan centres.
- MRI centres.
- Ultrasound centres.
- Other approved diagnostic services.

Search and filters:

- Test name.
- Centre name.
- Location.
- Service category.
- Price.
- Availability.

## 5.2 Diagnostic Centre Profile

Display:

- Centre name.
- Address.
- Contact details.
- Available services.
- Service prices.
- Operating hours.
- Available booking slots.
- Verification status.

## 5.3 Diagnostic Booking

Patient workflow:

1. Search for a diagnostic test.
2. Compare participating centres.
3. Open a centre profile.
4. Select a service.
5. Select an available slot.
6. Enter required details.
7. Submit booking.
8. Receive booking reference.
9. Track booking status.

Diagnostic booking statuses:

- Pending
- Confirmed
- Cancelled
- Completed

Do not provide diagnostic interpretation or automated medical conclusions.

## 5.4 Diagnostic Centre Dashboard

- Centre profile.
- Verification status.
- Service catalogue.
- Pricing management.
- Slot management.
- Booking management.
- Basic statistics.

---

# 6. PHASE 4 — TELECONSULTATION

Introduce secure online doctor consultations after operational, technical and legal approval.

Features:

- Online consultation booking.
- Doctor availability.
- Consultation scheduling.
- Secure video consultation.
- Consultation session management.
- Consultation status.
- Patient and doctor notifications.
- Consultation history.

The pitch concept includes a free two-minute introductory video call. Treat this as an optional promotional feature requiring founder approval, not a guaranteed clinical service.

Security requirements:

- Authenticated participants.
- Authorized session access.
- Secure communication.
- Consent before consultation.
- No publicly accessible meeting links.
- Appropriate privacy safeguards.

Telemedicine functionality must follow applicable Indian professional and telemedicine requirements.

---

# 7. PHASE 5 — ADDITIONAL HEALTHCARE FEATURES

These features are part of the longer-term product roadmap and must not delay the core MVP.

## 7.1 Medicine Reminders

- Create medicine reminders.
- Set reminder schedules.
- Manage reminder preferences.
- Receive notifications.
- Mark reminders as completed.

This feature must not independently change prescriptions or medication dosages.

## 7.2 Digital Prescriptions

Subject to qualified clinical and legal approval:

- Authorized doctor prescription creation.
- Secure prescription storage.
- Patient access to authorized prescriptions.
- Prescription history.
- Controlled document sharing.

## 7.3 Patient Health Records

Potential capabilities:

- Patient-authorized medical documents.
- Consultation records.
- Diagnostic reports.
- Secure document storage.
- Permission-controlled sharing.

Do not introduce health-record storage until privacy, consent, retention and access-control requirements are approved.

## 7.4 Healthcare Subscriptions

Potential subscription capabilities:

- Patient membership plans.
- Premium service packages.
- Subscription management.
- Payment integration.
- Billing history.
- Subscription cancellation.

Subscription benefits and pricing must be defined by the founder before implementation.

## 7.5 Home Sample Collection

Potential workflow:

- Discover participating laboratories.
- Select an eligible test.
- Request home sample collection.
- Select available collection time.
- Track booking status.

Requires verified partners and an operational service agreement.

## 7.6 Emergency Information

Provide clear emergency guidance and links or contact information for appropriate emergency services.

Swasthloop must not present itself as an emergency dispatch service.

Ambulance discovery or dispatch is not part of the MVP and requires a separate verified operational model.

---

# 8. RATINGS AND REVIEWS

Introduce ratings and reviews only after a reliable review system exists.

Requirements:

- Verified appointment eligibility.
- One eligible review per completed appointment.
- Rating and written feedback.
- Review moderation.
- Report review functionality.
- Anti-fraud controls.
- Admin moderation dashboard.

Never publish fabricated ratings or testimonials.

---

# 9. NOTIFICATION SYSTEM

Support in-app notifications in the initial release.

Future notification channels:

- Email.
- SMS.
- WhatsApp.
- Push notifications.

Notification events:

- Registration confirmation.
- Appointment request submitted.
- Appointment confirmed.
- Appointment rejected.
- Appointment cancelled.
- Appointment reminders.
- Diagnostic booking updates.
- Pharmacy order updates, if ordering is enabled.
- Account and security alerts.

Requirements:

- User notification preferences.
- Consent for external messaging.
- Delivery status where supported.
- Failure handling.
- Avoid exposing sensitive health information in notification previews.

---

# 10. USER INTERFACE AND DESIGN REQUIREMENTS

## 10.1 Design Direction

Swasthloop should look like a modern, trustworthy healthcare technology platform.

Design characteristics:

- Clean and minimal.
- Professional healthcare branding.
- Consistent spacing.
- Clear typography.
- Accessible colour contrast.
- Simple navigation.
- Mobile-first layouts.
- Consistent cards and forms.
- High-quality dashboard design.

Avoid:

- Excessive gradients.
- Unnecessary animations.
- Overcrowded dashboards.
- Excessive decorative elements.
- Generic template appearance.
- Fake doctor information.
- Fake statistics.

## 10.2 Main Website Navigation

Recommended navigation:

- Home
- Find Doctors
- Medicines
- Diagnostics
- About
- Contact
- Login / Get Started

Only show features that are implemented and operational. Future services should be clearly labelled as coming soon.

## 10.3 Application Interfaces

Create separate interfaces for:

1. Public visitors.
2. Patients.
3. Doctors.
4. Clinics.
5. Pharmacies.
6. Diagnostic centres.
7. Administrators.

Each role must have an appropriate navigation structure and permissions.

## 10.4 Responsive Requirements

Support:

- Mobile phones.
- Tablets.
- Laptops.
- Desktop screens.

The public website and dashboards must be fully responsive.

---

# 11. TECHNICAL ARCHITECTURE

Codex must inspect the existing repository before choosing or changing the architecture.

If starting from an empty repository, propose a maintainable full-stack architecture.

## 11.1 Architecture Principles

- Shared backend and database.
- Modular feature architecture.
- Clear separation of responsibilities.
- Reusable UI components.
- Centralized validation.
- Server-side authorization.
- Documented APIs.
- Maintainable database schema.
- Scalable deployment structure.

## 11.2 Recommended Technology Stack

The following is the preferred starting stack, subject to repository inspection.

**Frontend:**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Accessible UI component system

**Backend:**
- Next.js server-side functionality or a separately justified Node.js API.
- REST API architecture where appropriate.
- Server-side business logic.
- Centralized validation and error handling.

**Database:**
- PostgreSQL.
- Prisma ORM or another justified type-safe database layer.

**Authentication:**
- Secure authentication provider or well-maintained authentication implementation.
- Role-based access control.
- Secure sessions.

**Infrastructure:**
- Git and GitHub.
- Environment-based configuration.
- Managed database.
- Staging and production environments.
- Automated deployment pipeline.

Do not introduce unnecessary infrastructure or paid services without justification.

## 11.3 Suggested Project Structure

```text
swasthloop/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── branding/
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── patient/
│   │   ├── doctor/
│   │   ├── clinic/
│   │   ├── pharmacy/
│   │   ├── diagnostics/
│   │   ├── admin/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   └── shared/
│   │
│   ├── features/
│   │   ├── authentication/
│   │   ├── patients/
│   │   ├── doctors/
│   │   ├── appointments/
│   │   ├── clinics/
│   │   ├── pharmacies/
│   │   ├── medicines/
│   │   ├── diagnostics/
│   │   ├── notifications/
│   │   └── administration/
│   │
│   ├── lib/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── validators/
│   └── config/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│
├── .env.example
├── .gitignore
├── PRD.md
├── README.md
└── package.json
```

This structure is a starting proposal. Codex may adjust it after inspecting the actual project.

---

# 12. DATABASE DESIGN

Design a normalized relational database.

Initial entities should include:

### Identity and Access
- User
- PatientProfile
- DoctorProfile
- Clinic
- ClinicStaff
- Pharmacy
- DiagnosticCentre
- Role
- Permission

### Doctor Management
- Specialty
- DoctorQualification
- DoctorVerification
- DoctorAvailability
- DoctorClinic

### Appointment Management
- Appointment
- AppointmentStatusHistory
- AvailabilitySlot

### Medicine Marketplace
- Medicine
- MedicineBrand
- MedicineComposition
- PharmacyInventory
- MedicinePriceHistory

### Diagnostics
- DiagnosticCategory
- DiagnosticService
- DiagnosticPrice
- DiagnosticAvailability
- DiagnosticBooking

### Platform
- Notification
- Review
- SupportTicket
- AuditLog
- Subscription
- Payment
- UserConsent

Additional entities can be introduced when their respective phases are approved.

Database requirements:

- Use proper primary and foreign keys.
- Add appropriate indexes.
- Enforce unique constraints.
- Use transactions for critical operations.
- Implement soft deletion where justified.
- Protect sensitive records.
- Maintain audit history.
- Define data retention policies.

Codex must explain the schema before implementation and document important design decisions.

---

# 13. AUTHENTICATION AND AUTHORIZATION

Implement secure authentication.

Requirements:

- Registration.
- Login.
- Logout.
- Password hashing.
- Password recovery.
- Session management.
- Email or phone verification where configured.
- Account suspension.
- Role-based authorization.

Roles must never be trusted solely from frontend state.

Every protected API and server-side operation must independently validate permissions.

A patient must not access another patient's appointments.

A doctor must not access unrelated doctors' bookings.

A pharmacy must not modify another pharmacy's inventory.

Only authorized administrators may perform administrative actions.

---

# 14. SECURITY AND PRIVACY

Healthcare data requires strong security controls.

Mandatory requirements:

- HTTPS.
- Secure authentication.
- Server-side validation.
- Role-based access control.
- Secure password hashing.
- Protected environment variables.
- Rate limiting.
- Input sanitization.
- Protection against common web vulnerabilities.
- Secure file upload validation.
- Restricted access to private records.
- Audit logs.
- Secure session handling.
- Database backups.
- Error handling without exposing sensitive information.

Privacy requirements:

- Collect only necessary information.
- Obtain appropriate consent.
- Publish privacy and data-handling policies.
- Define account deletion and data-request workflows.
- Restrict access to patient information.
- Avoid sensitive data in analytics and logs.

Before public healthcare operations, obtain qualified legal review of applicable Indian data protection, healthcare, professional and telemedicine requirements.

Do not implement AI diagnosis, automated treatment recommendations or clinical decision-making in this specification.

---

# 15. BUSINESS MODEL

Potential revenue streams:

1. Commission on eligible doctor appointments.
2. Premium doctor listings.
3. Pharmacy partnerships.
4. Diagnostic centre partnerships.
5. Patient subscription plans.
6. Premium platform services.

All commercial arrangements must be transparent.

Do not charge, collect or distribute payments until pricing, refunds, commissions, settlements and applicable compliance requirements are approved.

---

# 16. ANALYTICS AND REPORTING

Admin analytics should include:

- Total users.
- Active patients.
- Active doctors.
- Verified doctors.
- Appointment volume.
- Booking confirmation rate.
- Appointment completion rate.
- Cancellation rate.
- Diagnostic booking volume.
- Pharmacy listing activity.
- Medicine catalogue coverage.
- Platform growth.

Use privacy-conscious analytics and avoid collecting sensitive medical information unnecessarily.

---

# 17. PERFORMANCE AND QUALITY REQUIREMENTS

The application must:

- Load quickly.
- Use optimized images.
- Support pagination.
- Avoid unnecessary database queries.
- Use appropriate caching.
- Handle network failures gracefully.
- Provide loading states.
- Provide error states.
- Provide empty states.
- Validate forms properly.
- Support keyboard navigation.
- Follow accessibility best practices.
- Work on common modern browsers.

Performance targets should be measured during implementation and validated before launch.

---

# 18. TESTING REQUIREMENTS

Implement:

## Unit Testing
- Validation logic.
- Appointment business rules.
- Permission checks.
- Pricing calculations.
- Utility functions.

## Integration Testing
- Authentication.
- Registration.
- Doctor profile management.
- Appointment creation.
- Appointment status transitions.
- Inventory updates.
- Diagnostic booking.
- Admin permissions.

## End-to-End Testing
- Patient registration.
- Doctor discovery.
- Appointment booking.
- Doctor appointment management.
- Admin doctor verification.
- Pharmacy listing management.
- Diagnostic booking.

## Security Testing
- Unauthorized API access.
- Cross-user data access.
- Role escalation.
- Input validation.
- Rate limiting.
- Session security.

Never use real patient information in development or test environments.

---

# 19. DEVELOPMENT ROADMAP

Codex must follow these milestones.

## Milestone 0 — Repository Inspection and Planning

Before coding:

- Inspect the entire repository.
- Identify existing framework and dependencies.
- Review existing pages and components.
- Identify reusable code.
- Identify missing features.
- Inspect configuration and environment setup.
- Propose the final architecture.
- Propose database schema.
- Define the screen map.
- Define API structure.
- Identify security requirements.

Deliverable: Architecture and implementation plan.

Do not overwrite working code without justification.

## Milestone 1 — Foundation

- Project configuration.
- Design system.
- Shared layout.
- Responsive navigation.
- Database connection.
- Authentication.
- User roles.
- Validation.
- Error handling.

Deliverable: Working application foundation.

## Milestone 2 — Public Website

- Homepage.
- Doctor directory.
- Specialty pages.
- Doctor profiles.
- Search and filtering.
- Contact page.
- About page.
- Legal information pages.

Deliverable: Functional public healthcare website.

## Milestone 3 — Appointment System

- Patient dashboard.
- Doctor dashboard.
- Doctor availability.
- Appointment creation.
- Appointment management.
- Status transitions.
- Booking history.

Deliverable: Complete appointment workflow.

## Milestone 4 — Admin Dashboard

- User management.
- Doctor management.
- Verification workflow.
- Specialty management.
- Appointment management.
- Reports.
- Audit logs.

Deliverable: Functional administration system.

## Milestone 5 — Pharmacy and Medicine Module

- Pharmacy registration.
- Verification.
- Medicine catalogue.
- Inventory management.
- Price comparison.

Deliverable: Functional medicine discovery module.

## Milestone 6 — Diagnostics Module

- Diagnostic centre registration.
- Service management.
- Price management.
- Availability.
- Diagnostic booking.

Deliverable: Diagnostic discovery and booking module.

## Milestone 7 — Additional Healthcare Features

Subject to approval:

- Video consultations.
- Medicine reminders.
- Digital prescriptions.
- Patient health records.
- Subscriptions.
- Home sample collection.
- Ratings and reviews.
- Additional notification channels.

Deliverable: Approved additional modules.

## Milestone 8 — Production Readiness

- Complete testing.
- Security review.
- Performance optimization.
- Database backup configuration.
- SEO.
- Accessibility.
- Deployment.
- Monitoring.
- Documentation.

Deliverable: Production-ready platform for controlled launch.

---

# 20. ACCEPTANCE CRITERIA

The MVP is considered complete when:

1. Visitors can browse doctors without registration.
2. Patients can register and log in.
3. Patients can search and filter doctors.
4. Doctor profiles display approved information.
5. Patients can submit appointment requests.
6. Every booking receives a unique reference.
7. Booking statuses update correctly.
8. Patients can access only their own bookings.
9. Doctors can manage their assigned bookings.
10. Admins can manage users and doctors.
11. Doctor verification is functional.
12. Unauthorized access is blocked.
13. Responsive layouts work across devices.
14. Database operations are reliable.
15. Critical workflows pass automated tests.
16. No fabricated healthcare data is displayed as real.
17. Privacy, terms and emergency information are available.
18. Deployment and environment setup are documented.

Later-phase modules have separate acceptance criteria and must not be represented as operational until implemented and tested.

---

# 21. RULES FOR CODEX

These instructions are mandatory throughout development.

### Before Coding

1. Read this entire PRD.
2. Inspect the complete existing repository.
3. Do not assume the repository is empty.
4. Do not replace the existing architecture without justification.
5. Identify incomplete features and dependencies.
6. Present an implementation plan.
7. Identify unresolved product decisions.

### During Development

1. Work milestone by milestone.
2. Do not generate the entire platform in one attempt.
3. Write clean, maintainable TypeScript.
4. Use reusable components.
5. Follow established coding conventions.
6. Keep frontend and backend responsibilities separated.
7. Validate all inputs on the server.
8. Implement authorization on every protected operation.
9. Handle loading, success, empty and error states.
10. Write tests for critical business logic.
11. Avoid unnecessary dependencies.
12. Never hardcode secrets.
13. Never fabricate real healthcare information.
14. Keep documentation updated.

### After Each Milestone

Provide:

- Features implemented.
- Files created or modified.
- Database changes.
- API changes.
- Tests executed.
- Test results.
- Known issues.
- Remaining tasks.
- Instructions for running the application.

Do not mark a feature complete merely because its UI exists. Its business logic, authorization, persistence and tests must also work.

### Critical Restrictions

- Do not build fake functionality.
- Do not use localStorage as a substitute for backend persistence.
- Do not expose secrets in frontend code.
- Do not trust frontend role checks.
- Do not bypass database validation.
- Do not fabricate doctors, pharmacies, prices or diagnostic centres.
- Do not implement unapproved payment workflows.
- Do not implement clinical diagnosis or treatment recommendations.
- Do not claim that an integration works without testing it.

If a requirement is unclear, document the assumption and request approval before implementing a consequential product decision.

---

# 22. FINAL PRODUCT VISION

Swasthloop should evolve into a unified healthcare ecosystem that connects:

- Patients.
- Doctors.
- Clinics.
- Hospitals.
- Pharmacies.
- Diagnostic centres.
- Healthcare service providers.

The long-term objective is to make healthcare discovery, appointment access and related services simpler, more transparent and more accessible.

The initial product must establish a reliable foundation through doctor discovery, appointment management and administrative operations.

All additional modules must build on the same secure, maintainable and scalable platform.

**Swasthloop — Your Healthcare, Connected.**

---

**END OF PRODUCT REQUIREMENTS DOCUMENT**