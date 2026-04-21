1. Opis projektu

Runly to mobilna aplikacja do śledzenia aktywności biegowej w czasie rzeczywistym. Umożliwia użytkownikowi rejestrowanie tras, analizę wyników oraz przegląd historii treningów.

Aplikacja skupia się na:

prostocie użycia
dokładnym śledzeniu GPS
działaniu offline-first
🎯 2. Cele projektu
MVP
Rejestrowanie biegu (czas + trasa + dystans)
Wizualizacja trasy na mapie
Zapisywanie treningów lokalnie
Historia aktywności
Rozszerzenia (v2+)
Statystyki (tempo, streaki)
Powiadomienia
Integracja z Google Fit
👤 3. Użytkownik
Persona
osoba aktywna fizycznie
chce śledzić swoje biegi bez skomplikowanych funkcji
nie potrzebuje pełnego Strava-like social systemu
📱 4. Funkcjonalności
4.1 Tracking biegu (core feature)
Start / Pause / Stop biegu
Śledzenie lokalizacji GPS w czasie rzeczywistym
Rysowanie trasy na mapie
Pomiar:
czasu
dystansu
tempa
4.2 Historia treningów
Lista zapisanych biegów
Szczegóły:
mapa trasy
dystans
czas
średnie tempo
4.3 Przechowywanie danych
Lokalnie (SQLite)
Offline-first
Możliwość późniejszej synchronizacji
4.4 Uprawnienia
Dostęp do lokalizacji (foreground + background)
Obsługa odmowy uprawnień
🧱 5. Architektura
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

🔧 6 Kluczowe moduły
   6.1 Tracking GPS (useRunTracking)

Odpowiedzialny za:

subskrypcję lokalizacji
zbieranie punktów GPS
zarządzanie stanem biegu
6.2 Obliczanie dystansu
bazuje na odległości między punktami GPS
wykorzystuje wzór Haversine
6.3 Mapa
renderowanie trasy (Polyline)
aktualna pozycja użytkownika
6.4 Storage
zapis treningów
odczyt historii
📊 7. Model danych
Run
type Run = {
id: string
startedAt: string
endedAt: string
distance: number // w metrach
duration: number // w sekundach
path: Coordinate[]
}
Coordinate
type Coordinate = {
latitude: number
longitude: number
timestamp: number
}
🔄 8. Flow aplikacji
Start biegu
Użytkownik klika "Start"
Aplikacja prosi o dostęp do GPS
Rozpoczyna się tracking
W trakcie biegu
Zbieranie punktów GPS
Aktualizacja trasy
Liczenie dystansu i czasu
Koniec biegu
Użytkownik klika "Stop"
Dane są zapisywane lokalnie
Przejście do podsumowania
⚠️ 9. Wyzwania techniczne
GPS
niedokładność pomiarów
„skaczące” punkty

Rozwiązania:

filtrowanie punktów (np. minimalna odległość)
smoothing trasy
Bateria
ciągłe użycie GPS

Rozwiązania:

regulacja częstotliwości odczytu
tryb background tylko gdy aktywny bieg
Platformy
Tylko android
udokumentować różnice iOS vs Android 