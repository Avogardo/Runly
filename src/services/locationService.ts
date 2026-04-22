import * as Location from "expo-location";
import { Coordinate } from "@/types";
import {
  GPS_TIME_INTERVAL_MS,
  GPS_DISTANCE_INTERVAL_M,
} from "@/constants/config";

/**
 * Prosi o uprawnienia foreground location.
 * Zwraca true jeśli przyznane, false jeśli odmówione.
 */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

/**
 * Pobiera aktualną pozycję (jednorazowo).
 */
export async function getCurrentPosition(): Promise<Coordinate> {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: location.timestamp,
  };
}

/**
 * Subskrybuje aktualizacje lokalizacji.
 * Zwraca obiekt subskrypcji — wywołaj .remove() aby się odsubskrybować.
 */
export async function watchPosition(
  onLocation: (coord: Coordinate) => void,
  intervalMs: number = GPS_TIME_INTERVAL_MS,
  distanceMeters: number = GPS_DISTANCE_INTERVAL_M
): Promise<Location.LocationSubscription> {
  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: intervalMs,
      distanceInterval: distanceMeters,
    },
    (location) => {
      onLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      });
    }
  );
  return subscription;
}
