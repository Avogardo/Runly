import * as Location from 'expo-location'

import {
  GPS_TIME_INTERVAL_MS,
  GPS_DISTANCE_INTERVAL_M,
  BACKGROUND_LOCATION_TASK
} from '@/consts'
import {Coordinate} from '@/types'

export async function requestLocationPermission(): Promise<boolean> {
  const {status} = await Location.requestForegroundPermissionsAsync()
  return status === Location.PermissionStatus.GRANTED
}

export async function requestBackgroundLocationPermission(): Promise<boolean> {
  const foreground = await Location.requestForegroundPermissionsAsync()
  if (foreground.status !== Location.PermissionStatus.GRANTED) return false

  const background = await Location.requestBackgroundPermissionsAsync()
  return background.status === Location.PermissionStatus.GRANTED
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

export async function startBackgroundLocationUpdates(): Promise<void> {
  const isStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
  if (isStarted) return

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: GPS_TIME_INTERVAL_MS,
    distanceInterval: GPS_DISTANCE_INTERVAL_M,
    showsBackgroundLocationIndicator: true,
    pausesUpdatesAutomatically: false,
    foregroundService: {
      notificationTitle: 'Runly',
      notificationBody: 'Tracking your run...',
      notificationColor: '#A855F7'
    }
  })
}

export async function stopBackgroundLocationUpdates(): Promise<void> {
  const isStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK).catch(
    () => false
  )
  if (isStarted) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
  }
}
