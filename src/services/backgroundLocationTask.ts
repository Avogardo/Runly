import {defineTask} from 'expo-task-manager'
import {LocationObject} from 'expo-location'

import {BACKGROUND_LOCATION_TASK} from '@/consts'

import {emitBackgroundLocation} from './locationEventEmitter'

defineTask(BACKGROUND_LOCATION_TASK, async ({data, error}) => {
  if (error) {
    console.warn('[BackgroundLocation] Error:', error)
    return
  }

  if (data) {
    const {locations} = data as {locations: LocationObject[]}
    for (const location of locations) {
      emitBackgroundLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp
      })
    }
  }
})
