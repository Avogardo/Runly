import {LocationSubscription} from 'expo-location'
import {useReducer, useRef, useCallback, useEffect, useState} from 'react'
import {AppState, type AppStateStatus} from 'react-native'

import {
  requestBackgroundLocationPermission,
  watchPosition,
  startBackgroundLocationUpdates,
  stopBackgroundLocationUpdates,
  onBackgroundLocation,
  runningFlag
} from '@/services'
import {Coordinate, IntervalConfig, IntervalType} from '@/types'

import {TIMER_INTERVAL_MS} from '../consts'
import {
  runReducer,
  initialRunState,
  getCurrentIntervalDurationMs,
  getCurrentIntervalType
} from '../stores'
import {RunState} from '../types'

import {useIntervalTimer} from './useIntervalTimer'

export type GPSError = 'no_permission' | 'gps_error' | null

export type UseRunTrackingReturn = {
  state: RunState
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void
  setIntervalConfig: (config: IntervalConfig) => void
  clearIntervalConfig: () => void
  currentIntervalType: IntervalType
  intervalTimeRemainingMs: number
  intervalProgress: string
  gpsError: GPSError
  clearGpsError: () => void
}

export function useRunTracking(): UseRunTrackingReturn {
  const [state, dispatch] = useReducer(runReducer, initialRunState)
  const [gpsError, setGpsError] = useState<GPSError>(null)

  useIntervalTimer(state, dispatch)

  const locationSubRef = useRef<LocationSubscription | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)

  const startTimer = useCallback(() => {
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      dispatch({type: 'TICK', ms: TIMER_INTERVAL_MS})
    }, TIMER_INTERVAL_MS)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startLocationWatch = useCallback(async () => {
    locationSubRef.current = await watchPosition((coord: Coordinate) => {
      dispatch({type: 'ADD_POINT', coord})
    })
  }, [])

  const stopLocationWatch = useCallback(() => {
    locationSubRef.current?.remove()
    locationSubRef.current = null
  }, [])

  const start = useCallback(async () => {
    setGpsError(null)

    const granted = await requestBackgroundLocationPermission()
    if (!granted) {
      setGpsError('no_permission')
      return
    }

    try {
      dispatch({type: 'START', startedAt: new Date().toISOString()})
      runningFlag.isRunning = true

      await startLocationWatch()
      startTimer()
      await startBackgroundLocationUpdates()
    } catch {
      setGpsError('gps_error')
    }
  }, [startLocationWatch, startTimer])

  const pause = useCallback(() => {
    dispatch({type: 'PAUSE'})
    runningFlag.isRunning = false
    stopLocationWatch()
    stopTimer()
    void stopBackgroundLocationUpdates()
  }, [stopLocationWatch, stopTimer])

  const resume = useCallback(async () => {
    dispatch({type: 'RESUME'})
    runningFlag.isRunning = true
    await startLocationWatch()
    startTimer()
    await startBackgroundLocationUpdates()
  }, [startLocationWatch, startTimer])

  const stop = useCallback(() => {
    dispatch({type: 'STOP'})
    runningFlag.isRunning = false
    stopLocationWatch()
    stopTimer()
    void stopBackgroundLocationUpdates()
  }, [stopLocationWatch, stopTimer])

  const reset = useCallback(() => {
    runningFlag.isRunning = false
    stopLocationWatch()
    stopTimer()
    void stopBackgroundLocationUpdates()
    dispatch({type: 'RESET'})
  }, [stopLocationWatch, stopTimer])

  const setIntervalConfig = useCallback((config: IntervalConfig) => {
    dispatch({type: 'SET_INTERVAL_CONFIG', config})
  }, [])

  const clearIntervalConfig = useCallback(() => {
    dispatch({type: 'SET_INTERVAL_CONFIG', config: null})
  }, [])

  useEffect(() => {
    const subscription = onBackgroundLocation((coord: Coordinate) => {
      if (appStateRef.current !== 'active') {
        dispatch({type: 'ADD_POINT', coord})
      }
    })

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      appStateRef.current = nextState
    })

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    return () => {
      locationSubRef.current?.remove()
      if (timerRef.current) clearInterval(timerRef.current)
      runningFlag.isRunning = false
      void stopBackgroundLocationUpdates()
    }
  }, [])

  const currentIntervalType = getCurrentIntervalType(state)
  const durationMs = getCurrentIntervalDurationMs(state)
  const intervalTimeRemainingMs = Math.max(0, durationMs - state.intervalElapsedMs)
  const intervalProgress = state.intervalConfig
    ? `${state.currentIntervalIndex + 1}/${state.intervalConfig.total}`
    : ''

  const clearGpsError = useCallback(() => setGpsError(null), [])

  return {
    state,
    start: () => void start(),
    pause,
    resume: () => void resume(),
    stop,
    reset,
    setIntervalConfig,
    clearIntervalConfig,
    currentIntervalType,
    intervalTimeRemainingMs,
    intervalProgress,
    gpsError,
    clearGpsError
  }
}
