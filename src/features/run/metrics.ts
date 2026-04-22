import { Coordinate } from "@/types";
import { haversineDistance } from "./haversine";
import { filterGpsNoise } from "./gpsFilter";

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

