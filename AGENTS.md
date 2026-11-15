# Swasthloop project rules

- Follow `PRD.md` for product scope; never edit it. Build one approved milestone at a time and preserve unrelated files.
- MVP scope: public healthcare site, doctor discovery, patient authentication, doctor application/verification, appointments, role dashboards and in-app notifications. Exclude pharmacy/medicine, diagnostics, telemedicine, AI diagnosis, prescriptions, subscriptions and ambulance dispatch unless separately approved.
- Use Next.js App Router, React, strict TypeScript, Tailwind CSS, accessible UI components, Lucide icons, Supabase PostgreSQL/Auth/RLS, SQL migrations, npm, GitHub and Netlify-compatible deployment. Prefer Supabase's official JS client. Do not add paid services, unnecessary packages, Prisma, Express, Redis or Docker without approval and clear need.
- Design mobile-first from 360px. Prioritize trust, readable information, accessible controls, white/light-grey surfaces, deep healthcare green and muted teal. Avoid generic SaaS styling, fake testimonials, fake doctor data/photos/ratings/statistics, excessive gradients, decorative blobs and oversized headings. Check widths 360, 390, 430, 768, 1024 and 1440; fix horizontal overflow and mobile usability.
- Use semantic HTML, labeled accessible controls, touch-friendly actions and responsive navigation. Keep components focused; use client components only for interactions that need them; optimize images.
- Never simulate authentication or backend behavior. Do not claim a form, integration or feature works unless implemented and verified. Use truthful empty/placeholder states.
- Enforce authorization on the server and with database RLS; frontend role checks are not security. Validate untrusted input server-side. Protect secrets and never expose service-role credentials to the browser. Do not collect real patient medical records during prototyping.
- Keep setup instructions in README.md concise and factual. Do not add planning/progress Markdown unless requested. Do not overwrite existing working files or start a later milestone without approval.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
