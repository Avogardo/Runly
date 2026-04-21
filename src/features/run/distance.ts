import { Coordinate } from "../../types";

const EARTH_RADIUS_M = 6_371_000; // promień Ziemi w metrach

/**
 * Oblicza odległość między dwoma punktami GPS (wzór Haversine).
 * Zwraca dystans w metrach.
 */
export function haversineDistance(a: Coordinate, b: Coordinate): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLon * sinLon;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/**
 * Minimalna odległość między punktami GPS (w metrach).
 * Punkty bliższe niż ten próg są uznawane za "szum GPS" i odrzucane.
 */
const MIN_DISTANCE_M = 3;

/**
 * Filtruje "skaczące" punkty GPS.
 * Odrzuca punkty, które są bliżej niż MIN_DISTANCE_M od poprzedniego.
 */
export function filterGpsNoise(path: Coordinate[]): Coordinate[] {
  if (path.length === 0) return [];

  const filtered: Coordinate[] = [path[0]];
  for (let i = 1; i < path.length; i++) {
    const dist = haversineDistance(filtered[filtered.length - 1], path[i]);
    if (dist >= MIN_DISTANCE_M) {
      filtered.push(path[i]);
    }
  }
  return filtered;
}

/**
 * Oblicza łączny dystans z tablicy punktów GPS (w metrach).
 * Automatycznie filtruje szum GPS.
 */
export function calculateTotalDistance(path: Coordinate[]): number {
  const filtered = filterGpsNoise(path);
  let total = 0;
  for (let i = 1; i < filtered.length; i++) {
    total += haversineDistance(filtered[i - 1], filtered[i]);
  }
  return total;
}

/**
 * Oblicza tempo (min/km) na podstawie dystansu (m) i czasu (ms).
 * Zwraca null jeśli dystans = 0.
 */
export function calculatePace(
  distanceM: number,
  elapsedMs: number
): number | null {
  if (distanceM <= 0) return null;
  const distanceKm = distanceM / 1000;
  const elapsedMin = elapsedMs / 1000 / 60;
  return elapsedMin / distanceKm; // min/km
}

/**
 * Formatuje dystans w metrach do czytelnego stringa.
 * np. 1234.5 → "1.23 km", 850 → "850 m"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Formatuje tempo (min/km) do stringa.
 * np. 5.5 → "5'30\"", null → "--:--"
 */
export function formatPace(paceMinPerKm: number | null): string {
  if (paceMinPerKm === null || !isFinite(paceMinPerKm)) return "--:--";
  const min = Math.floor(paceMinPerKm);
  const sec = Math.round((paceMinPerKm - min) * 60);
  return `${min}'${String(sec).padStart(2, "0")}"`;
}

/**
 * Formatuje czas w ms do stringa MM:SS lub HH:MM:SS.
 */
export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const min = Math.floor((totalSec % 3600) / 60);
  const sec = totalSec % 60;

  if (hrs > 0) {
    return `${hrs}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
