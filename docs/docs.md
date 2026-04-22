1. Project Description

Runly is a mobile application for real-time running activity tracking. It allows users to record routes, analyze results, and browse training history.

The app focuses on:

simplicity of use
accurate GPS tracking
offline-first operation

🎯 2. Project Goals

MVP

Recording a run (time + route + distance)
Route visualization on a map
Storing workouts locally
Activity history

Extensions (v2+)

Statistics (pace, streaks)
Notifications
Google Fit integration

👤 3. User

Persona

physically active person
wants to track runs without complex features
does not need a full Strava-like social system

📱 4. Features

4.1 Run tracking (core feature)

Start / Pause / Stop a run
Real-time GPS location tracking
Drawing route on a map
Measurements:
time
distance
pace

4.2 Training history

List of saved runs
Details:
route map
distance
time
average pace

4.3 Data storage

Local storage (SQLite)
Offline-first approach
Possibility of later synchronization

4.4 Permissions

Location access (foreground + background)
Handling permission denial

🧱 5. Architecture

Frontend (React Native + Expo)

/src
/features
/run
RunScreen.tsx
useRunTracking.ts
runStore.ts
distance.ts
/history
HistoryScreen.tsx
RunDetailsScreen.tsx
/components
MapView.tsx
StatsBar.tsx
/services
locationService.ts
storageService.ts

🔧 6. Key modules

6.1 GPS Tracking (useRunTracking)
Responsible for:

location subscription
collecting GPS points
managing run state

6.2 Distance calculation

based on distance between GPS points
uses the Haversine formula

6.3 Map

route rendering (Polyline)
current user position

6.4 Storage

saving workouts
reading history

📊 7. Data model

Run

type Run = {
id: string
startedAt: string
endedAt: string
distance: number // in meters
duration: number // in seconds
path: Coordinate[]
}

Coordinate

type Coordinate = {
latitude: number
longitude: number
timestamp: number
}

🔄 8. App flow

Start of run

User clicks "Start"
App requests GPS access
Tracking begins

During the run

Collecting GPS points
Updating route
Calculating distance and time

End of run

User clicks "Stop"
Data is saved locally
Transition to summary screen

⚠️ 9. Technical challenges

GPS

measurement inaccuracy
“jumping” points

Solutions:

filtering points (e.g. minimum distance threshold)
route smoothing

Battery

continuous GPS usage

Solutions:

adjusting sampling frequency
background mode only when run is active

Platforms

Android only
document iOS vs Android differences

5.5 Interwały (nowy feature)

Aplikacja umożliwia prowadzenie treningów interwałowych (np. bieg + odpoczynek), z pełnym wsparciem podczas biegu oraz w historii.

🧩 Funkcjonalności
🎛️ Konfiguracja interwałów (przed biegiem)

Użytkownik może ustawić:

liczba interwałów
długość interwału:
🟢 lekkiego (np. trucht / odpoczynek)
🔴 ciężkiego (np. sprint)

Opcjonalnie:

jednostka: czas (minuty) 
start od ciężkiego
🏃‍♂️ Tracking interwałów (w trakcie biegu)

Podczas biegu:

aktualny typ interwału (lekki / ciężki)
czas pozostały do końca interwału
liczba pozostałych interwałów

Widoczne na ekranie:

🔴 / 🟢 aktualny tryb
⏱ countdown
🔁 np. „3 / 8 interwałów”
🔊 Komunikaty głosowe

Przy zmianie interwału:

informacja o zmianie:
„Start interwału szybkiego”
„Start interwału lekkiego”
liczba pozostałych:
„Pozostało 3 interwały”

Opcjonalnie:

włącz / wyłącz voice feedback
język (PL / EN)

W szczegółach biegu:

liczba interwałów
konfiguracja (np. 8 × 1min / 2min)

🧱 Zmiany w modelu danych (możesz dostosować do swojej implementacji)
Run (rozszerzenie)
type Run = {
id: string
startedAt: string
endedAt: string
distance: number
duration: number
path: Coordinate[]

intervals?: IntervalSummary
}
IntervalSummary
type IntervalSummary = {
total: number
lightDuration: number
heavyDuration: number
intervals: Interval[]
}
Interval
type Interval = {
type: 'light' | 'heavy'
startedAt: number
endedAt: number
duration: number
}

🧠 Logika interwałów
Przebieg:
Start biegu
Start pierwszego interwału
Timer odlicza czas
Po zakończeniu:
zmiana typu interwału
voice feedback
aktualizacja licznika
Powtarzaj aż do końca
⚠️ Edge cases (ważne)
pauza biegu → pauza interwału
GPS lag → nie wpływa na timer interwałów
wyjście z aplikacji → interwały działają w background
użytkownik kończy bieg wcześniej:
zapis częściowych interwałów
🚀 UX / UI sugestie (warto dodać)
🔥 1. Haptic feedback
wibracja przy zmianie interwału
🔥 2. Lock screen mode
duże liczby (czas + typ interwału)
minimal UI podczas biegu
🧭 TL;DR

Feature interwałów dodaje:

realną wartość treningową (to już nie tylko tracker)
więcej logiki (state machine + timer)
lepszy UX (voice + wizualne wskazówki)