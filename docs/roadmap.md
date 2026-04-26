# 🗺️ Runly — Roadmap

> Each phase ends with a working, testable result.

---

## Phase 0 — Project Setup ⚙️

**Goal:** Working app skeleton with navigation.

- [x] Initialize Expo project (`npx create-expo-app`)
- [x] TypeScript configuration
- [x] Directory structure per `docs.md` (`/features`, `/components`, `/services`)
- [x] Install and configure navigation (`expo-router`)
- [x] Two placeholder screens: **RunScreen** and **HistoryScreen** with bottom tabs
- [x] First launch on emulator / physical Android device

**What you'll learn:**
- Expo workflow vs bare workflow
- Navigation in React Native (stack + tabs)
- Differences between web and native components (`View`, `Text`, `ScrollView`)

---

## Phase 1 — GPS Tracking 📍

**Goal:** Collecting GPS points in real time during a run.

- [x] Install `expo-location`
- [x] Handle location permissions (foreground)
- [x] Hook `useRunTracking` — location subscription, collecting `Coordinate[]` points
- [x] Run state: `idle` → `running` → `paused` → `stopped`
- [x] **Start / Pause / Resume / Stop** logic
- [x] Display current coordinates on screen (debug)

**What you'll learn:**
- Native permissions (permissions API)
- Working with location API
- Subscription lifecycle (cleanup)

---

## Phase 2 — Distance & Pace Calculation ⏱️

**Goal:** Calculating run metrics in real time.

- [x] Implement **Haversine** formula (`distance.ts`)
- [x] Calculate cumulative distance from `path[]`
- [x] Timer — `duration` in seconds
- [x] Calculate current pace (min/km)
- [x] `StatsBar` component displaying: distance, time, pace
- [x] Filter "jumping" GPS points (minimum distance between points)

**What you'll learn:**
- Custom hooks with computational logic
- Real-time update rendering (performance)
- Component styling (StyleSheet / NativeWind)

---

## Phase 3 — Map 🗺️

**Goal:** Real-time route visualization on a map.

- [x] Install `react-native-maps` (via `expo`)
- [x] `MapView` component with current position marker
- [x] Draw route (`Polyline`) based on `path[]`
- [x] Center map on user
- [x] Update map during run (camera animation)

**What you'll learn:**
- Native map components
- Integrating native modules with Expo
- Optimizing map re-renders

---

## Phase 4 — Data Storage (offline-first) 💾

**Goal:** Persistent local storage for workouts.

- [x] Install `expo-sqlite`
- [x] `storageService.ts` — CRUD for `Run` model
- [x] Save run on "Stop" click (data + GPS path)
- [x] Generate `id` (UUID)
- [x] Validation: don't save empty runs
- [x] Manual testing: close app → reopen → data persists

**What you'll learn:**
- Local database in React Native
- Working with SQLite / async storage
- Offline-first approach

---

## Phase 5 — Workout History 📋

**Goal:** Browsing saved runs.

- [x] `HistoryScreen` — list of runs (`FlatList`)
- [x] Each item: date, distance, time, pace
- [x] `RunDetailsScreen` — run details
- [x] Map with route (static, based on `path[]`)
- [x] Navigation from list to details (stack navigation)
- [x] Empty state when no workouts
- [x] Delete workouts (with alert confirmation)
- [x] Internationalization (`i18next` + `react-i18next`, languages: PL / EN)

**What you'll learn:**
- `FlatList` and long list optimization
- Navigation with state (passing parameters)
- Data presentation in native UI

---

## Phase 5.5 — Intervals 

**Goal:** Intervals (new feature)

- [x] `Interwały` — implementation

---

## Phase 6 — Polish & UX ✨

**Goal:** Refine the app to a "I want to use this" level.

- [x] Run summary screen (after clicking Stop)
- [x] Nice formatting: `12:34 min`, `5.2 km`, `6'04" /km`
- [x] Screen transition animations
- [x] Loading states and error handling (e.g. no GPS)
- [x] Permission denial handling (message + button to settings)
- [x] Splash screen and app icon
- [ ] Testing on physical Android device

**What you'll learn:**
- UX patterns in mobile
- Handling native edge cases
- Splash/icon configuration in Expo

---

## Phase 7 — Background Tracking 🔋

**Goal:** GPS works even when the app is in the background.

- [ ] Configure `expo-location` background task
- [ ] Background location permissions (Android)
- [ ] Foreground service notification (required by Android)
- [ ] Testing: lock screen → run still recording
- [ ] Battery optimization (read frequency)

**What you'll learn:**
- Background tasks in React Native
- Foreground service / notification
- Android vs iOS differences in background processing

---

## Phase 8 (v2) — Statistics & Extensions 📊

**Goal:** Added value beyond MVP.

- [ ] Statistics screen: total distance, number of runs, streak
- [ ] Pace chart on route (charting library)
- [ ] Motivational notifications (expo-notifications)
- [ ] Data export (GPX / JSON)
- [ ] Dark mode
- [ ] Google Fit integration (optional)

---

## 📐 Phase Summary

| Phase | Scope               | Priority |
|-------|---------------------|----------|
| 0     | Setup + navigation  | 🔴 Must |
| 1     | GPS tracking        | 🔴 Must |
| 2     | Distance + pace     | 🔴 Must |
| 3     | Map                 | 🔴 Must |
| 4     | Local storage       | 🔴 Must |
| 5     | History             | 🔴 Must |
| 5.5   | Intervals           | 🟡 Should |
| 6     | Polish & UX         | 🟡 Should |
| 7     | Background tracking | 🟡 Should |
| 8     | Statistics & extras | 🟢 Nice to have |

> **Phases 0–5 = MVP**
> Estimated time with regular work: **2–4 weeks**

---

## 💡 Tips for React Devs

| React (web) | React Native | Note |
|---|---|---|
| `<div>` | `<View>` | No semantic HTML tags |
| `<span>` / text | `<Text>` | Text MUST be inside `<Text>` |
| CSS / Tailwind | `StyleSheet.create` / NativeWind | No CSS cascading |
| `react-router` | `expo-router` / `react-navigation` | Stack + Tabs instead of URL routing |
| `localStorage` | `AsyncStorage` / `SQLite` | Async by nature |
| `fetch` + SWR | same | Fetch works identically |
| `window.navigator` | `expo-location` / native API | No Web API |
| hot reload | fast refresh | Works very similarly |
