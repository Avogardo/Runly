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