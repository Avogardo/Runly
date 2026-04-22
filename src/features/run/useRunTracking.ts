import {LocationSubscription} from 'expo-location'
import {useReducer, useRef, useCallback, useEffect} from 'react'
import {Alert} from 'react-native'

import {TIMER_INTERVAL_MS} from '@/constants/config'
import {requestLocationPermission, watchPosition} from '@/services/locationService'
import {Coordinate} from '@/types'

import {runReducer, initialRunState, RunState} from './runStore'

export type UseRunTrackingReturn = {
  state: RunState
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void
}

export function useRunTracking(): UseRunTrackingReturn {
  const [state, dispatch] = useReducer(runReducer, initialRunState)

  const locationSubRef = useRef<LocationSubscription | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
    const sub = await watchPosition((coord: Coordinate) => {
      dispatch({type: 'ADD_POINT', coord})
    })
    locationSubRef.current = sub
  }, [])

  const stopLocationWatch = useCallback(() => {
    locationSubRef.current?.remove()
    locationSubRef.current = null
  }, [])

  const start = useCallback(async () => {
    const granted = await requestLocationPermission()
    if (!granted) {
      Alert.alert(
        'Brak uprawnień',
        'Aplikacja potrzebuje dostępu do lokalizacji, aby śledzić bieg. Włącz uprawnienia w ustawieniach.'
      )
      return
    }

    dispatch({type: 'START', startedAt: new Date().toISOString()})
    await startLocationWatch()
    startTimer()
  }, [startLocationWatch, startTimer])

  const pause = useCallback(() => {
    dispatch({type: 'PAUSE'})
    stopLocationWatch()
    stopTimer()
  }, [stopLocationWatch, stopTimer])

  const resume = useCallback(async () => {
    dispatch({type: 'RESUME'})
    await startLocationWatch()
    startTimer()
  }, [startLocationWatch, startTimer])

  const stop = useCallback(() => {
    dispatch({type: 'STOP'})
    stopLocationWatch()
    stopTimer()
  }, [stopLocationWatch, stopTimer])

  const reset = useCallback(() => {
    stopLocationWatch()
    stopTimer()
    dispatch({type: 'RESET'})
  }, [stopLocationWatch, stopTimer])

  useEffect(() => {
    return () => {
      locationSubRef.current?.remove()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return {
    state,
    start: () => void start(),
    pause,
    resume: () => void resume(),
    stop,
    reset
  }
}
