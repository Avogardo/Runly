import {DeviceEventEmitter} from 'react-native'

import {Coordinate} from '@/types'

export const BACKGROUND_LOCATION_EVENT = 'backgroundLocation'

export const runningFlag = {isRunning: false}

export function emitBackgroundLocation(coordinate: Coordinate): void {
  if (runningFlag.isRunning) {
    DeviceEventEmitter.emit(BACKGROUND_LOCATION_EVENT, coordinate)
  }
}

export function onBackgroundLocation(callback: (coordinate: Coordinate) => void) {
  return DeviceEventEmitter.addListener(BACKGROUND_LOCATION_EVENT, callback)
}

