# 🗺️ Runly Web — Roadmap

> Roadmap for an experienced React developer learning Next.js, AWS and CI/CD.
> Each phase ends with a working, testable result.

---

## Phase 0 — Project Setup ⚙️

**Goal:** Working Next.js skeleton with Tailwind and project structure.

- [x] Initialize project: `npx create-next-app@latest` (App Router + TypeScript + Tailwind + ESLint)
- [x] Configure strict TypeScript (`tsconfig.json`)
- [x] Set up directory structure per `docs.md` (`src/components`, `src/lib`, `src/types`, `prisma`)
- [x] Configure path aliases (`@/` → `src/`)
- [x] Create placeholder pages: `/` (calendar) and `/run/[id]` (details)
- [x] Install Prettier, configure ESLint + Prettier integration
- [x] First run: `npm run dev` → see placeholder pages

**What you'll learn:**

- Next.js App Router vs Pages Router
- File-based routing (`page.tsx`, `layout.tsx`, dynamic `[id]`)
- Server Components vs Client Components
- Tailwind CSS setup in Next.js

---

## Phase 1 — Database + Prisma 💾

**Goal:** PostgreSQL schema with seed data, ready for querying.

- [x] Install Prisma: `npm install prisma @prisma/client`
- [x] Set up PostgreSQL (Neon free tier — serverless, no Docker needed)
- [x] Define `schema.prisma` — `Run` model with `path` (Json) and `intervals` (Json?)
- [x] Run `npx prisma migrate dev` — create initial migration
- [x] Create Prisma client singleton (`src/lib/db.ts`)
- [x] Write seed script (`prisma/seed.ts`) with 10–15 fake runs across different days
- [x] Verify with `npx prisma studio` — browse data in GUI

**What you'll learn:**

- Prisma ORM (schema, migrations, client)
- Serverless PostgreSQL (Neon)
- JSON columns for flexible data (path, intervals)

---

## Phase 2 — API Routes 🔌

**Goal:** Working REST API for runs.

- [x] `GET /api/runs` — list all runs, sorted by date DESC
- [x] `GET /api/runs?month=2026-04` — filter by month
- [x] `GET /api/runs/[id]` — single run with full data
- [x] `POST /api/runs` — create a run (validate with Zod)
- [x] `DELETE /api/runs/[id]` — delete a run
- [x] Shared Zod schemas for request validation
- [x] Error handling (404, 400, 500) with consistent JSON responses
- [x] Test endpoints with Postman / curl

**What you'll learn:**

- Next.js Route Handlers (`route.ts` with `GET`, `POST`, `DELETE`)
- Request/response handling in App Router
- Zod validation
- How API routes differ from Express

---

## Phase 3 — Calendar View 📅

**Goal:** Main page showing month grid with runs per day.

- [x] **Server Component**: fetch runs for current month from DB
- [x] **MonthGrid** component — 7-column grid (Mon–Sun), day cells
- [x] **DayCell** component — day number, run count badge, total distance
- [x] **Client Component**: month navigation (← prev / next →) with `useSearchParams`
- [x] Current day highlight
- [x] Click day → show list of runs below the calendar (or expand)
- [x] Click run → navigate to `/run/[id]`
- [x] Responsive: grid adapts to mobile/tablet/desktop
- [x] Empty state for days/months with no runs

**What you'll learn:**

- Server Components for data fetching (no `useEffect` + loading states)
- Mixing Server + Client Components (`'use client'` directive)
- `searchParams` for URL-driven state (month navigation)
- Next.js `<Link>` component

---

## Phase 4 — Run Details Page 🏃

**Goal:** Full run details with interactive route map.

- [x] Dynamic route: `app/run/[id]/page.tsx` (Server Component)
- [x] Fetch run data from DB via Prisma
- [x] Stats display: distance, duration, pace, date/time range
- [x] Install `leaflet` + `react-leaflet` for map
- [x] **RouteMap** component (Client) — render `Polyline` from `path[]`
- [x] Start marker (green) and end marker (purple)
- [x] Map auto-fits to route bounds
- [x] Interval breakdown section (if `run.intervals` exists): config, completed count
- [x] Back navigation to calendar
- [x] 404 page for non-existent run

**What you'll learn:**

- Dynamic routes with `params`
- Server-side data fetching (no loading spinner needed)
- Integrating client-only libraries (Leaflet) in Server Component architecture
- `next/dynamic` with `ssr: false` for map component

---

## Phase 5 — Glassmorphism UI ✨

**Goal:** Match the mobile app's dark glassmorphism visual identity.

- [x] Tailwind config: add custom `runly` color palette from `docs.md` §8
- [x] Dark gradient background: `bg-gradient-to-b from-[#0B0B1E] via-[#1A1035] to-[#2D1B69]`
- [x] `GlassCard` component: `bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl`
- [x] Typography: white primary, muted secondary
- [x] Stats bar glass styling (matching mobile `StatsBar`)
- [x] Button styles: transparent bg + colored border + glow shadow (matching mobile)
- [x] Calendar day cells with glass effect
- [x] Responsive layout (mobile-first)
- [x] Dark Leaflet map tiles (CartoDB Dark Matter or similar)
- [x] Polish: transitions, hover states, focus rings

**What you'll learn:**

- Tailwind CSS customization (theme extension)
- `backdrop-filter` / glassmorphism in CSS
- Responsive design with Tailwind breakpoints
- Dark theme patterns

---

## Phase 6 — Auth 🔐

**Goal:** Protect the dashboard with authentication.

- [x] Install NextAuth.js (`next-auth`)
- [x] Configure credentials provider (email + password)
- [x] Create `login` page with glass-styled form
- [x] Middleware to protect `/` and `/run/[id]` routes
- [x] Session display in layout (user info / logout)
- [x] User model in Prisma (link runs to user)
- [x] API route protection (validate session)

**What you'll learn:**

- NextAuth.js setup with App Router
- Middleware for route protection
- Session management (server-side & client-side)
- Extending Prisma schema for auth

---

## Phase 7 — AWS Deployment ☁️

**Goal:** App running on AWS, accessible via URL.

- [x] Create AWS account (if needed) + configure IAM
- [x] Set up AWS Amplify app (connect to GitHub repo)
- [x] Configure environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`)
- [x] Deploy — verify SSR works on Amplify
- [x] Set up PostgreSQL on Neon (or AWS RDS if preferred)
- [x] Run Prisma migrations in production
- [ ] Custom domain (optional, via Route 53)
- [x] Verify: full flow works in production (calendar → run details)

**What you'll learn:**

- AWS Amplify (hosting, build settings, env vars)
- Production database setup
- Environment management (dev vs prod)
- DNS and custom domains

---

## Phase 8 — GitHub Actions CI/CD 🚀

**Goal:** Automated pipeline: lint → test → build → deploy.

- [x] Create `.github/workflows/ci.yml`
- [x] **Lint** step: `eslint . --max-warnings 0`
- [x] **Type check** step: `tsc --noEmit`
- [x] **Test** step: `vitest run`
- [x] **Build** step: `next build`
- [x] **Deploy** step: trigger Amplify deploy (on push to `main` only)
- [ ] PR checks: require all steps to pass before merge
- [x] GitHub Secrets for `DATABASE_URL`, `NEXTAUTH_SECRET`
- [x] Badge in README showing pipeline status

---

## Phase 9 — Mobile Sync 🔄

**Goal:** Runly mobile app syncs runs to the web API.

- [ ] Design sync endpoint: `POST /api/sync` (batch upload)
- [ ] API key or JWT auth for mobile client
- [ ] Conflict resolution: skip duplicates by `id`
- [ ] Update Runly mobile: add sync service calling the API after saving a run
- [ ] Queue/retry logic for offline → online transitions
- [ ] Test: record run on phone → appears in web calendar

**What you'll learn:**

- API design for mobile clients
- Authentication for mobile↔server communication
- Offline-first sync patterns
- Cross-platform data flow

---

## 📐 Phase Summary

| Phase | Scope             | Priority        |
| ----- | ----------------- | --------------- |
| 0     | Project setup     | 🔴 Must         |
| 1     | Database + Prisma | 🔴 Must         |
| 2     | API routes        | 🔴 Must         |
| 3     | Calendar view     | 🔴 Must         |
| 4     | Run details + map | 🔴 Must         |
| 5     | Glassmorphism UI  | 🟡 Should       |
| 6     | Auth              | 🟡 Should       |
| 7     | AWS deployment    | 🟡 Should       |
| 8     | CI/CD             | 🟡 Should       |
| 9     | Mobile sync       | 🟢 Nice to have |

> **Phases 0–4 = MVP**
> Estimated time at regular pace: **3–5 weeks**

---

## 💡 Tips for React → Next.js Devs

| React (CRA / Vite)               | Next.js (App Router)                     | Note                                              |
| -------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| `react-router-dom`               | File-based routing (`page.tsx`)          | Folders = routes, no config                       |
| `useEffect` + `fetch`            | Server Components                        | Data fetched on server, no loading spinners       |
| Everything is a Client Component | Server Components by default             | Add `'use client'` only for interactivity         |
| `express` backend                | API Route Handlers (`route.ts`)          | Same repo, same deploy                            |
| `index.html`                     | `layout.tsx` + `page.tsx`                | Layout wraps pages automatically                  |
| `process.env.REACT_APP_*`        | `process.env.NEXT_PUBLIC_*`              | Only `NEXT_PUBLIC_` exposed to client             |
| `react-helmet`                   | `metadata` export / `generateMetadata`   | Built-in SEO support                              |
| Client-side routing only         | SSR / SSG / ISR                          | Choose per page: static, dynamic, or revalidating |
| `npm start` (static server)      | `next dev` / `next build` / `next start` | Dev, build, production server                     |
| `.env`                           | `.env.local`                             | Auto-loaded, not committed to git                 |
