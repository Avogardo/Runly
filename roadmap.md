# 🗺️ Runly — Roadmap

> Roadmapa dla doświadczonego React developera uczącego się React Native.
> Każda faza kończy się działającym, testowalnym rezultatem.

---

## Faza 0 — Setup projektu ⚙️

**Cel:** Działający szkielet aplikacji z nawigacją.

- [x] Inicjalizacja projektu Expo (`npx create-expo-app`)
- [x] Konfiguracja TypeScript
- [x] Struktura katalogów wg `docs.md` (`/features`, `/components`, `/services`)
- [x] Instalacja i konfiguracja nawigacji (`expo-router`)
- [x] Dwa ekrany-placeholdery: **RunScreen** i **HistoryScreen** z bottom tabs
- [x] Pierwsze uruchomienie na emulatorze / fizycznym urządzeniu Android

**Czego się nauczysz:**
- Expo workflow vs bare workflow
- Nawigacja w React Native (stack + tabs)
- Różnice między komponentami webowymi a natywnymi (`View`, `Text`, `ScrollView`)

---

## Faza 1 — Tracking GPS 📍

**Cel:** Zbieranie punktów GPS w czasie rzeczywistym podczas biegu.

- [x] Instalacja `expo-location`
- [x] Obsługa uprawnień lokalizacji (foreground)
- [x] Hook `useRunTracking` — subskrypcja lokalizacji, zbieranie punktów `Coordinate[]`
- [x] Stan biegu: `idle` → `running` → `paused` → `stopped`
- [x] Logika **Start / Pause / Resume / Stop**
- [x] Wyświetlanie aktualnych współrzędnych na ekranie (debug)

**Czego się nauczysz:**
- Uprawnienia natywne (permissions API)
- Praca z API lokalizacji
- Lifecycle subskrypcji (cleanup)

---

## Faza 2 — Obliczanie dystansu i tempa ⏱️

**Cel:** Liczenie metryki biegu w czasie rzeczywistym.

- [x] Implementacja wzoru **Haversine** (`distance.ts`)
- [x] Obliczanie dystansu kumulatywnego z `path[]`
- [x] Licznik czasu (timer) — `duration` w sekundach
- [x] Obliczanie bieżącego tempa (min/km)
- [x] Komponent `StatsBar` wyświetlający: dystans, czas, tempo
- [x] Filtrowanie "skaczących" punktów GPS (min. odległość między punktami)

**Czego się nauczysz:**
- Custom hooks z logiką obliczeniową
- Renderowanie aktualizacji w czasie rzeczywistym (performance)
- Stylowanie komponentów (StyleSheet / NativeWind)

---

## Faza 3 — Mapa 🗺️

**Cel:** Wizualizacja trasy na mapie w czasie rzeczywistym.

- [x] Instalacja `react-native-maps` (via `expo`)
- [x] Komponent `MapView` z markerem aktualnej pozycji
- [x] Rysowanie trasy (`Polyline`) na podstawie `path[]`
- [x] Centrowanie mapy na użytkowniku
- [x] Aktualizacja mapy w trakcie biegu (animacja kamery)

**Czego się nauczysz:**
- Natywne komponenty mapowe
- Integracja natywnych modułów z Expo
- Optymalizacja rerenderów mapy

---

## Faza 4 — Zapis danych (offline-first) 💾

**Cel:** Trwałe przechowywanie treningów lokalnie.

- [x] Instalacja `expo-sqlite`
- [x] `storageService.ts` — CRUD dla modelu `Run`
- [x] Zapis biegu po kliknięciu "Stop" (dane + ścieżka GPS)
- [x] Generowanie `id` (UUID)
- [x] Walidacja: nie zapisuj pustych biegów
- [x] Testy manualne: zamknij apkę → otwórz → dane nadal są

**Czego się nauczysz:**
- Lokalna baza danych w React Native
- Praca z SQLite / async storage
- Podejście offline-first

---

## Faza 5 — Historia treningów 📋

**Cel:** Przeglądanie zapisanych biegów.

- [x] Ekran `HistoryScreen` — lista biegów (`FlatList`)
- [x] Każdy element: data, dystans, czas, tempo
- [x] Ekran `RunDetailsScreen` — szczegóły biegu
- [x] Mapa z trasą (statyczna, na podstawie `path[]`)
- [x] Nawigacja z listy do szczegółów (stack navigation)
- [x] Pusty stan (empty state) gdy brak treningów

**Czego się nauczysz:**
- `FlatList` i optymalizacja długich list
- Nawigacja ze stanem (przekazywanie parametrów)
- Prezentacja danych w natywnym UI

---

## Faza 6 — Polish & UX ✨

**Cel:** Dopracowanie aplikacji do poziomu "chcę tego używać".

- [ ] Ekran podsumowania biegu (po kliknięciu Stop)
- [ ] Ładne formatowanie: `12:34 min`, `5.2 km`, `6'04" /km`
- [ ] Animacje przejść między ekranami
- [ ] Loading states i error handling (np. brak GPS)
- [ ] Obsługa odmowy uprawnień (komunikat + przycisk do ustawień)
- [ ] Splash screen i ikona aplikacji
- [ ] Testowanie na fizycznym urządzeniu Android

**Czego się nauczysz:**
- UX patterns w mobile
- Obsługa edge-case'ów natywnych
- Konfiguracja splash/icon w Expo

---

## Faza 7 — Background tracking 🔋

**Cel:** GPS działa nawet gdy aplikacja jest w tle.

- [ ] Konfiguracja `expo-location` background task
- [ ] Uprawnienia background location (Android)
- [ ] Powiadomienie foreground service (Android wymaga)
- [ ] Testowanie: zablokuj ekran → bieg nadal się nagrywa
- [ ] Optymalizacja baterii (częstotliwość odczytów)

**Czego się nauczysz:**
- Background tasks w React Native
- Foreground service / notification
- Różnice Android vs iOS w background processing

---

## Faza 8 (v2) — Statystyki i rozszerzenia 📊

**Cel:** Wartość dodana ponad MVP.

- [ ] Ekran statystyk: łączny dystans, liczba biegów, streak
- [ ] Wykres tempa na trasie (charting library)
- [ ] Powiadomienia motywacyjne (expo-notifications)
- [ ] Eksport danych (GPX / JSON)
- [ ] Dark mode
- [ ] Integracja z Google Fit (opcjonalna)

---

## 📐 Podsumowanie faz

| Faza | Zakres | Priorytet |
|------|--------|-----------|
| 0 | Setup + nawigacja | 🔴 Must |
| 1 | GPS tracking | 🔴 Must |
| 2 | Dystans + tempo | 🔴 Must |
| 3 | Mapa | 🔴 Must |
| 4 | Zapis lokalny | 🔴 Must |
| 5 | Historia | 🔴 Must |
| 6 | Polish & UX | 🟡 Should |
| 7 | Background tracking | 🟡 Should |
| 8 | Statystyki & extras | 🟢 Nice to have |

> **Fazy 0–5 = MVP**
> Szacowany czas przy regularnej pracy: **2–4 tygodnie**

---

## 💡 Wskazówki dla React deva

| React (web) | React Native | Uwaga |
|---|---|---|
| `<div>` | `<View>` | Brak semantycznych tagów HTML |
| `<span>` / tekst | `<Text>` | Tekst MUSI być w `<Text>` |
| CSS / Tailwind | `StyleSheet.create` / NativeWind | Brak kaskadowości CSS |
| `react-router` | `expo-router` / `react-navigation` | Stack + Tabs zamiast URL routing |
| `localStorage` | `AsyncStorage` / `SQLite` | Async by nature |
| `fetch` + SWR | tak samo | Fetch działa identycznie |
| `window.navigator` | `expo-location` / natywne API | Brak Web API |
| hot reload | fast refresh | Działa bardzo podobnie |

