import { Coordinate } from "@/types";
import { haversineDistance } from "./haversine";
import { MIN_DISTANCE_M } from "@/constants/config";

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

