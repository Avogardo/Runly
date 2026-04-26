# 📱 Runly Mobile Sync — API Documentation

> Complete guide for integrating the Runly React Native mobile app with the Runly Web backend.
> Covers: registration, authentication, syncing runs, and fetching data from the cloud.

---

## 🌐 Base URL

```
Production:  https://main.d1guj9gwpkhlna.amplifyapp.com
Development: http://localhost:3000
```

---

## 🔐 1. Authentication

The API uses **cookie-based JWT sessions** via NextAuth.js. The mobile app must:

1. Call the login endpoint to get a session cookie
2. Include that cookie in all subsequent requests

### 1.1 Register a new user

```
POST /api/register
Content-Type: application/json
```

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "minimum6chars",
  "name": "John"              // optional
}
```

**Response `201 Created`:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John",
  "createdAt": "2026-04-26T10:00:00.000Z"
}
```

**Error responses:**

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Validation failed", "details": {...} }` | Invalid email, password < 6 chars |
| `409` | `{ "error": "Email already registered" }` | Duplicate email |
| `500` | `{ "error": "Internal server error" }` | Server error |

---

### 1.2 Login (get session)

```
POST /api/auth/callback/credentials
Content-Type: application/x-www-form-urlencoded
```

**Request body (form-encoded):**

```
email=user@example.com&password=minimum6chars
```

**On success:** Response includes `Set-Cookie` header with `authjs.session-token`. Store this cookie and include it in all subsequent requests.

> ⚠️ **Important for React Native:** Use a cookie-aware HTTP client (e.g. `fetch` with `credentials: 'include'` or a library like `axios` with cookie jar support via `react-native-cookies` / `@react-native-cookies/cookies`).

#### Recommended: NextAuth CSRF flow

For proper NextAuth authentication from mobile:

```typescript
// Step 1: Get CSRF token
const csrfResponse = await fetch(`${BASE_URL}/api/auth/csrf`)
const { csrfToken } = await csrfResponse.json()

// Step 2: Sign in with CSRF token
const loginResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    email: 'user@example.com',
    password: 'password123',
    csrfToken,
  }),
  credentials: 'include', // ← important: stores session cookie
  redirect: 'manual',     // ← don't follow redirects
})

// Step 3: Extract session cookie from response
// The cookie is automatically stored if using a cookie-aware client
```

---

### 1.3 Check current session

```
GET /api/auth/session
Cookie: authjs.session-token=<token>
```

**Response `200 OK` (authenticated):**

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John"
  },
  "expires": "2026-05-26T10:00:00.000Z"
}
```

**Response `200 OK` (not authenticated):**

```json
{}
```

---

### 1.4 Logout

```
POST /api/auth/signout
Cookie: authjs.session-token=<token>
Content-Type: application/x-www-form-urlencoded
```

**Body:** `csrfToken=<token>` (get from `/api/auth/csrf`)

---

## 🏃 2. Runs API

All run endpoints require authentication (session cookie).

### 2.1 List runs

```
GET /api/runs
GET /api/runs?month=2026-04
Cookie: authjs.session-token=<token>
```

**Query parameters:**

| Param | Format | Required | Description |
|---|---|---|---|
| `month` | `YYYY-MM` | No | Filter by month. Without it, returns all runs. |

**Response `200 OK`:**

```json
[
  {
    "id": "abc123",
    "startedAt": "2026-04-25T08:00:00.000Z",
    "endedAt": "2026-04-25T08:25:00.000Z",
    "distance": 5200.0,
    "duration": 1500.0,
    "createdAt": "2026-04-25T08:30:00.000Z"
  }
]
```

> **Note:** List endpoint does NOT include `path` and `intervals` (heavy data). Use the detail endpoint for full data.

Sorted by `startedAt DESC` (newest first).

---

### 2.2 Get single run

```
GET /api/runs/:id
Cookie: authjs.session-token=<token>
```

**Response `200 OK`:**

```json
{
  "id": "abc123",
  "startedAt": "2026-04-25T08:00:00.000Z",
  "endedAt": "2026-04-25T08:25:00.000Z",
  "distance": 5200.0,
  "duration": 1500.0,
  "path": [
    { "latitude": 50.0647, "longitude": 19.945, "timestamp": 1745568000000 },
    { "latitude": 50.0651, "longitude": 19.946, "timestamp": 1745568005000 }
  ],
  "intervals": {
    "config": {
      "total": 6,
      "lightDurationSec": 90,
      "heavyDurationSec": 60,
      "startWithHeavy": true,
      "voiceEnabled": true
    },
    "intervals": [
      { "type": "heavy", "startedAt": 1745568000000, "endedAt": 1745568060000, "duration": 60 },
      { "type": "light", "startedAt": 1745568060000, "endedAt": 1745568150000, "duration": 90 }
    ]
  },
  "createdAt": "2026-04-25T08:30:00.000Z",
  "updatedAt": "2026-04-25T08:30:00.000Z"
}
```

> `intervals` is `null` if the run had no interval training.

---

### 2.3 Create a run (sync from mobile)

```
POST /api/runs
Cookie: authjs.session-token=<token>
Content-Type: application/json
```

**Request body:**

```json
{
  "startedAt": "2026-04-25T08:00:00.000Z",
  "endedAt": "2026-04-25T08:25:00.000Z",
  "distance": 5200.0,
  "duration": 1500.0,
  "path": [
    { "latitude": 50.0647, "longitude": 19.945, "timestamp": 1745568000000 },
    { "latitude": 50.0651, "longitude": 19.946, "timestamp": 1745568005000 }
  ],
  "intervals": {
    "config": {
      "total": 6,
      "lightDurationSec": 90,
      "heavyDurationSec": 60,
      "startWithHeavy": true,
      "voiceEnabled": true
    },
    "intervals": [
      { "type": "heavy", "startedAt": 1745568000000, "endedAt": 1745568060000, "duration": 60 },
      { "type": "light", "startedAt": 1745568060000, "endedAt": 1745568150000, "duration": 90 }
    ]
  }
}
```

**Field validation:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `startedAt` | string | ✅ | ISO 8601 datetime |
| `endedAt` | string | ✅ | ISO 8601 datetime |
| `distance` | number | ✅ | Positive (meters) |
| `duration` | number | ✅ | Positive (seconds) |
| `path` | array | ✅ | Min 1 coordinate |
| `path[].latitude` | number | ✅ | -90 to 90 |
| `path[].longitude` | number | ✅ | -180 to 180 |
| `path[].timestamp` | number | ✅ | Unix timestamp ms |
| `intervals` | object | ❌ | Full IntervalSummary |

**Response `201 Created`:**

```json
{
  "id": "new-uuid",
  "startedAt": "2026-04-25T08:00:00.000Z",
  "endedAt": "2026-04-25T08:25:00.000Z",
  "distance": 5200.0,
  "duration": 1500.0,
  "path": [...],
  "intervals": {...},
  "createdAt": "2026-04-25T08:30:00.000Z",
  "updatedAt": "2026-04-25T08:30:00.000Z",
  "userId": "user-uuid"
}
```

**Error responses:**

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "Validation failed", "details": {...} }` | Invalid body |
| `401` | `{ "error": "Unauthorized" }` | No/invalid session |
| `500` | `{ "error": "Internal server error" }` | Server error |

---

### 2.4 Delete a run

```
DELETE /api/runs/:id
Cookie: authjs.session-token=<token>
```

**Response `200 OK`:**

```json
{ "message": "Run deleted successfully" }
```

**Error responses:**

| Status | Body | When |
|---|---|---|
| `401` | `{ "error": "Unauthorized" }` | No/invalid session |
| `404` | `{ "error": "Run not found" }` | Wrong ID or not owner |
| `500` | `{ "error": "Internal server error" }` | Server error |

---

## 📦 3. Data Types (TypeScript)

Shared types — use these in both mobile and web codebases:

```typescript
type Coordinate = {
  latitude: number   // -90 to 90
  longitude: number  // -180 to 180
  timestamp: number  // Unix milliseconds
}

type IntervalConfig = {
  total: number           // planned interval count
  lightDurationSec: number
  heavyDurationSec: number
  startWithHeavy: boolean
  voiceEnabled: boolean
}

type Interval = {
  type: 'light' | 'heavy'
  startedAt: number   // Unix ms
  endedAt: number     // Unix ms
  duration: number    // seconds
}

type IntervalSummary = {
  config: IntervalConfig
  intervals: Interval[]
}

type Run = {
  id: string
  startedAt: string     // ISO 8601
  endedAt: string       // ISO 8601
  distance: number      // meters
  duration: number      // seconds
  path: Coordinate[]
  intervals?: IntervalSummary | null
  createdAt: string     // ISO 8601
  updatedAt: string     // ISO 8601
}

// List endpoint returns runs without path/intervals:
type RunSummary = Omit<Run, 'path' | 'intervals' | 'updatedAt'>
```

---

## 🔄 4. Mobile Sync Strategy

### Recommended flow

```
┌──────────────────────────────────────────┐
│  Mobile App                              │
│                                          │
│  1. User finishes run                    │
│  2. Save to local storage (AsyncStorage) │
│  3. Mark as "pendingSync: true"          │
│  4. Try sync to API                      │
│     ├── Online  → POST /api/runs → OK    │
│     │            → mark "synced: true"   │
│     └── Offline → keep "pendingSync"     │
│  5. On app open / network restore:       │
│     → retry all pendingSync runs         │
└──────────────────────────────────────────┘
```

### React Native sync service example

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'https://main.d1guj9gwpkhlna.amplifyapp.com'

// Store session cookie after login
let sessionCookie: string | null = null

export async function login(email: string, password: string): Promise<boolean> {
  // Step 1: Get CSRF token
  const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`)
  const { csrfToken } = await csrfRes.json()
  const csrfCookie = csrfRes.headers.get('set-cookie') ?? ''

  // Step 2: Login
  const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': csrfCookie,
    },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&csrfToken=${csrfToken}`,
    redirect: 'manual',
  })

  // Step 3: Extract session cookie
  sessionCookie = loginRes.headers.get('set-cookie') ?? null
  if (sessionCookie) {
    await AsyncStorage.setItem('sessionCookie', sessionCookie)
    return true
  }
  return false
}

export async function syncRun(run: CreateRunInput): Promise<boolean> {
  const cookie = sessionCookie ?? (await AsyncStorage.getItem('sessionCookie'))
  if (!cookie) return false

  try {
    const response = await fetch(`${BASE_URL}/api/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify(run),
    })
    return response.status === 201
  } catch {
    return false // offline — retry later
  }
}

export async function syncPendingRuns(): Promise<void> {
  const pending = await AsyncStorage.getItem('pendingRuns')
  if (!pending) return

  const runs: CreateRunInput[] = JSON.parse(pending)
  const stillPending: CreateRunInput[] = []

  for (const run of runs) {
    const synced = await syncRun(run)
    if (!synced) {
      stillPending.push(run)
    }
  }

  await AsyncStorage.setItem('pendingRuns', JSON.stringify(stillPending))
}
```

### Duplicate prevention

Currently the API does **not** check for duplicates. To prevent re-uploading the same run:

**Option A — Client-side (recommended for now):**
- Mark each run with `synced: true` in AsyncStorage after successful POST
- Never re-send synced runs

**Option B — Server-side (future `POST /api/sync`):**
- Send a batch of runs with local IDs
- Server skips runs that already exist (by matching `startedAt + endedAt + distance`)

---

## 🔒 5. Security Notes

| Concern | Implementation |
|---|---|
| Passwords | Hashed with bcrypt (12 rounds) |
| Sessions | JWT stored in HTTP-only cookie |
| Run isolation | Each user only sees their own runs (enforced by `userId` filter) |
| Input validation | Zod schemas on all endpoints |
| CSRF | NextAuth CSRF token required for auth endpoints |

---

## 📋 6. Error Format

All error responses follow this format:

```json
{
  "error": "Human-readable error message"
}
```

Validation errors include additional details:

```json
{
  "error": "Validation failed",
  "details": {
    "distance": { "errors": ["Expected number, received string"] },
    "path": { "errors": ["Array must contain at least 1 element(s)"] }
  }
}
```

---

## 🧪 7. Quick Test (curl)

```bash
# 1. Register
curl -X POST https://main.d1guj9gwpkhlna.amplifyapp.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@runly.app","password":"test123","name":"Test"}'

# 2. Get CSRF token
curl -c cookies.txt https://main.d1guj9gwpkhlna.amplifyapp.com/api/auth/csrf

# 3. Login (extract csrfToken from step 2 response)
curl -b cookies.txt -c cookies.txt \
  -X POST https://main.d1guj9gwpkhlna.amplifyapp.com/api/auth/callback/credentials \
  -d "email=test@runly.app&password=test123&csrfToken=<TOKEN>" \
  -L

# 4. List runs (using session cookie)
curl -b cookies.txt https://main.d1guj9gwpkhlna.amplifyapp.com/api/runs

# 5. Create a run
curl -b cookies.txt \
  -X POST https://main.d1guj9gwpkhlna.amplifyapp.com/api/runs \
  -H "Content-Type: application/json" \
  -d '{"startedAt":"2026-04-26T08:00:00.000Z","endedAt":"2026-04-26T08:25:00.000Z","distance":5200,"duration":1500,"path":[{"latitude":50.06,"longitude":19.94,"timestamp":1745654400000}]}'
```

---

## 📌 Implementation Checklist for Mobile App

- [ ] Add login/register screens (email + password)
- [ ] Store session cookie (persist across app restarts)
- [ ] After finishing a run → `POST /api/runs` with run data
- [ ] Mark run as `synced` in local storage on success
- [ ] On app open → retry pending (unsynced) runs
- [ ] Handle 401 → redirect to login screen
- [ ] Handle offline → queue run for later sync
- [ ] (Optional) Fetch runs from API for cloud-based history view

