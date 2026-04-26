# 📄 Runly Web — Documentation

---

## 1. Project Description

Runly Web is a companion web dashboard for the [Runly](../README.md) mobile app. It provides a calendar-based view of running history, detailed run analytics with route visualization, and a REST API that serves as the future sync backend for the mobile app.

The web app focuses on:

- Desktop-friendly history browsing (calendar view)
- Detailed run analysis with interactive map
- API-first architecture (ready for mobile sync)
- Same dark glassmorphism visual identity as the mobile app

---

## 🎯 2. Goals

### MVP

- Calendar/month view with run indicators per day
- Run details page with stats and route map
- REST API for runs (CRUD)
- Dark glassmorphism UI matching the mobile app
- PostgreSQL database with Prisma ORM

### Extensions (v2+)

- Authentication (NextAuth)
- Mobile sync (Runly app → API)
- Advanced statistics and charts
- AWS deployment with CI/CD
- Multi-user support

---

## 👤 3. User

### Persona

- Runs regularly, uses Runly mobile to track
- Wants a desktop view to review training history
- Prefers a clean monthly overview over infinite scroll
- Values visual consistency between mobile and web

---

## 📱 4. Features

### 4.1 Calendar View (main page)

- Monthly grid showing all days
- Each day shows: run count, total distance badge
- Click on a day → list of runs for that day
- Month navigation (previous / next)
- Current day highlight

### 4.2 Run Details

- Dynamic route: `/run/[id]`
- Stats: distance, duration, average pace, date/time
- Interactive map with route polyline (Leaflet)
- Start/end markers
- Interval breakdown (if applicable): config summary, completed count

### 4.3 API Routes

- `GET /api/runs` — list all runs (with optional date filters)
- `GET /api/runs/[id]` — single run with full path data
- `POST /api/runs` — create run (for future mobile sync)
- `DELETE /api/runs/[id]` — delete a run
- Input validation with Zod

### 4.4 Auth (v2)

- NextAuth.js with credentials or GitHub OAuth
- Protected dashboard routes via middleware
- API key auth for mobile sync endpoint

---

## 🧱 5. Architecture

### Next.js App Router

```
app/
├── layout.tsx                 # Root layout (dark theme, fonts)
├── page.tsx                   # Calendar view (main page)
├── run/
│   └── [id]/
│       └── page.tsx           # Run details
├── api/
│   └── runs/
│       ├── route.ts           # GET all, POST create
│       └── [id]/
│           └── route.ts       # GET one, DELETE
└── login/
    └── page.tsx               # Auth page (v2)

src/
├── components/
│   ├── ui/                    # GlassCard, Button, Badge
│   ├── calendar/              # MonthGrid, DayCell, RunBadge
│   └── run/                   # RunStats, RouteMap, IntervalBreakdown
├── lib/
│   ├── db.ts                  # Prisma client instance
│   ├── theme.ts               # Theme tokens (shared with Tailwind config)
│   └── utils.ts               # Formatters, helpers
├── types/
│   └── run.types.ts           # Shared types (same as mobile)
└── actions/
    └── runs.ts                # Server Actions (if needed)

prisma/
├── schema.prisma
└── seed.ts
```

### Rendering Strategy

- **Server Components** by default (calendar, run details — data fetched on server)
- **Client Components** only for interactive parts: month navigation, map

---

## 📊 6. Data Model

### Shared Types (compatible with mobile app)

```typescript
type Coordinate = {
  latitude: number
  longitude: number
  timestamp: number
}

type IntervalConfig = {
  total: number
  lightDurationSec: number
  heavyDurationSec: number
  startWithHeavy: boolean
  voiceEnabled: boolean
}

type Interval = {
  type: 'light' | 'heavy'
  startedAt: number
  endedAt: number
  duration: number
}

type IntervalSummary = {
  config: IntervalConfig
  intervals: Interval[]
}

type Run = {
  id: string
  startedAt: string // ISO 8601
  endedAt: string // ISO 8601
  distance: number // meters
  duration: number // seconds
  path: Coordinate[]
  intervals?: IntervalSummary
}
```

### Prisma Schema

```prisma
model Run {
  id          String   @id @default(uuid())
  startedAt   DateTime
  endedAt     DateTime
  distance    Float
  duration    Float
  path        Json     // Coordinate[]
  intervals   Json?    // IntervalSummary
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

> `path` and `intervals` stored as JSON columns for simplicity. Can normalize later for query performance.

---

## 🛠️ 7. Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 15 (App Router)                   |
| Language   | TypeScript 5 (strict)                     |
| Styling    | Tailwind CSS v4                           |
| ORM        | Prisma                                    |
| Database   | PostgreSQL (Neon — serverless, free tier) |
| Map        | Leaflet + react-leaflet                   |
| Validation | Zod                                       |
| Auth (v2)  | NextAuth.js                               |
| Linting    | ESLint + Prettier                         |
| Testing    | Vitest + Testing Library                  |
| Deployment | AWS Amplify                               |
| CI/CD      | GitHub Actions                            |

---

## 🎨 8. Theme / Design System

### Color Tokens (matching mobile app)

```typescript
const theme = {
  bg: '#0B0B1E',
  bgGradient: ['#0B0B1E', '#1A1035', '#2D1B69'],
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceBorder: 'rgba(255, 255, 255, 0.10)',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.55)',
  textMuted: 'rgba(255, 255, 255, 0.35)',

  accent: '#A855F7', // purple
  success: '#34D399', // emerald
  warning: '#FBBF24', // amber
  danger: '#F87171', // red
  info: '#818CF8', // indigo
}
```

### Tailwind Config Mapping

```js
// tailwind.config.ts → extend.colors
colors: {
  runly: {
    bg: '#0B0B1E',
    accent: '#A855F7',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#818CF8',
  }
}
```

### Glass Card Recipe (CSS)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

Tailwind equivalent: `bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl`

---

## ☁️ 9. Deployment Strategy

| Option                | Pros                                                     | Cons                             | Recommended        |
| --------------------- | -------------------------------------------------------- | -------------------------------- | ------------------ |
| **AWS Amplify**       | Auto-builds from GitHub, supports Next.js SSR, free tier | Vendor lock-in to Amplify config | ✅ Yes (simplest)  |
| Docker on ECS/Fargate | Full control, real-world infra                           | More complex setup               | For advanced phase |
| Vercel                | Best Next.js DX, zero config                             | Not AWS (requirement)            | ❌                 |

### Database Hosting

| Option   | Pros                                         | Cons                       | Recommended    |
| -------- | -------------------------------------------- | -------------------------- | -------------- |
| **Neon** | Serverless PostgreSQL, free tier, easy setup | External to AWS            | ✅ Yes (MVP)   |
| AWS RDS  | Full AWS ecosystem                           | Costs, more setup          | For production |
| Supabase | Postgres + API + Auth                        | Overkill for this use case | ❌             |

---

## 🚀 10. CI/CD Pipeline

### GitHub Actions Workflow

```
push to main / PR
  ↓
┌─────────────┐
│   Lint       │  eslint + prettier check
├─────────────┤
│   Type Check │  tsc --noEmit
├─────────────┤
│   Test       │  vitest run
├─────────────┤
│   Build      │  next build
├─────────────┤
│   Deploy     │  AWS Amplify (on main only)
└─────────────┘
```

- **PR checks**: lint + typecheck + test + build (block merge on failure)
- **Deploy**: auto-trigger on push to `main` via Amplify webhook or GitHub Actions
- **Secrets**: `DATABASE_URL`, `NEXTAUTH_SECRET` stored in GitHub Secrets + Amplify env vars
