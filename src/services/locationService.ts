import * as Location from 'expo-location'

import {GPS_TIME_INTERVAL_MS, GPS_DISTANCE_INTERVAL_M} from '@/constants/config'
import {Coordinate} from '@/types'

export async function requestLocationPermission(): Promise<boolean> {
  const {status} = await Location.requestForegroundPermissionsAsync()
  return status === Location.PermissionStatus.GRANTED
}

export async function getCurrentPosition(): Promise<Coordinate> {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  })
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    timestamp: location.timestamp
  }
}

export async function watchPosition(
  onLocation: (coord: Coordinate) => void,
  intervalMs: number = GPS_TIME_INTERVAL_MS,
  distanceMeters: number = GPS_DISTANCE_INTERVAL_M
): Promise<Location.LocationSubscription> {
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: intervalMs,
      distanceInterval: distanceMeters
    },
    (location) => {
      onLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp
      })
    }
  )
}
