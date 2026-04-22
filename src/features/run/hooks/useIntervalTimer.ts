import * as Speech from 'expo-speech'
import {useEffect, useRef} from 'react'
import i18next from 'i18next'

import {RunState, RunAction} from '../types'
import {getCurrentIntervalDurationMs, getCurrentIntervalType} from '../stores'
import {IntervalType} from '@/types'

/**
 * Hook that watches interval elapsed time and triggers transitions + voice feedback.
 * Must be called inside the component that owns the dispatch.
 */
export function useIntervalTimer(state: RunState, dispatch: React.Dispatch<RunAction>) {
  const prevIndexRef = useRef(state.currentIntervalIndex)

  useEffect(() => {
    if (!state.intervalConfig) return
    if (state.intervalsFinished) return
    if (state.status !== 'running') return

    const durationMs = getCurrentIntervalDurationMs(state)
    if (durationMs <= 0) return

    // Check if current interval time exceeded
    if (state.intervalElapsedMs >= durationMs) {
      const nextIndex = state.currentIntervalIndex + 1

      if (nextIndex >= state.intervalConfig.total) {
        // All intervals done
        dispatch({type: 'NEXT_INTERVAL'})
        dispatch({type: 'COMPLETE_INTERVALS'})

        if (state.intervalConfig.voiceEnabled) {
          Speech.speak(i18next.t('speech.intervalsComplete'), {
            language: i18next.language
          })
        }
      } else {
        dispatch({type: 'NEXT_INTERVAL'})
      }
    }
  }, [state.intervalElapsedMs, state.status])

  // Voice feedback when interval index changes
  useEffect(() => {
    if (!state.intervalConfig?.voiceEnabled) return
    if (state.currentIntervalIndex === prevIndexRef.current) return
    if (state.intervalsFinished) return

    prevIndexRef.current = state.currentIntervalIndex

    const type = getCurrentIntervalType(state)
    const remaining = state.intervalConfig.total - state.currentIntervalIndex

    const typeKey = type === IntervalType.Heavy ? 'speech.startHeavy' : 'speech.startLight'
    const message = `${i18next.t(typeKey)}. ${i18next.t('speech.remaining', {count: remaining})}`

    Speech.speak(message, {language: i18next.language})
  }, [state.currentIntervalIndex])
}
