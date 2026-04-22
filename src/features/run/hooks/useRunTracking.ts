import {LocationSubscription} from 'expo-location'
import {useReducer, useRef, useCallback, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {Alert} from 'react-native'

import {requestLocationPermission, watchPosition} from '@/services/locationService'
import {Coordinate} from '@/types'

import {TIMER_INTERVAL_MS} from '../consts'
import {runReducer, initialRunState} from '../stores'
import {RunState} from '../types'

export type UseRunTrackingReturn = {
  state: RunState
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  reset: () => void
}

export function useRunTracking(): UseRunTrackingReturn {
  const {t} = useTranslation()
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
      Alert.alert(t('permissions.alert.title'), t('permissions.alert.message'))
      return
    }

    dispatch({type: 'START', startedAt: new Date().toISOString()})
    await startLocationWatch()
    startTimer()
  }, [startLocationWatch, startTimer, t])

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
