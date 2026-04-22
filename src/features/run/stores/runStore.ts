import {IntervalType} from '@/types'

import {RunAction, RunState} from '../types'

export const initialRunState: RunState = {
  status: 'idle',
  path: [],
  startedAt: null,
  elapsedMs: 0,
  intervalConfig: null,
  currentIntervalIndex: 0,
  intervalElapsedMs: 0,
  completedIntervals: [],
  intervalsFinished: false
}

/** Get duration of current interval in ms */
export function getCurrentIntervalDurationMs(state: RunState): number {
  if (!state.intervalConfig) return 0
  const {intervalConfig, currentIntervalIndex} = state
  const isHeavy = intervalConfig.startWithHeavy
    ? currentIntervalIndex % 2 === 0
    : currentIntervalIndex % 2 === 1
  return (isHeavy ? intervalConfig.heavyDurationSec : intervalConfig.lightDurationSec) * 1000
}

/** Get type of current interval */
export function getCurrentIntervalType(state: RunState): IntervalType {
  if (!state.intervalConfig) return IntervalType.Light
  const {intervalConfig, currentIntervalIndex} = state
  const isHeavy = intervalConfig.startWithHeavy
    ? currentIntervalIndex % 2 === 0
    : currentIntervalIndex % 2 === 1
  return isHeavy ? IntervalType.Heavy : IntervalType.Light
}

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'START':
      return {
        ...initialRunState,
        status: 'running',
        startedAt: action.startedAt,
        intervalConfig: state.intervalConfig, // preserve config set before start
        currentIntervalIndex: 0,
        intervalElapsedMs: 0,
        completedIntervals: [],
        intervalsFinished: false
      }
    case 'PAUSE':
      return {...state, status: 'paused'}
    case 'RESUME':
      return {...state, status: 'running'}
    case 'STOP':
      return {...state, status: 'stopped'}
    case 'ADD_POINT':
      return {...state, path: [...state.path, action.coord]}
    case 'TICK':
      return {
        ...state,
        elapsedMs: state.elapsedMs + action.ms,
        intervalElapsedMs:
          state.intervalConfig && !state.intervalsFinished
            ? state.intervalElapsedMs + action.ms
            : state.intervalElapsedMs
      }
    case 'RESET':
      return initialRunState
    case 'SET_INTERVAL_CONFIG':
      return {...state, intervalConfig: action.config}
    case 'NEXT_INTERVAL': {
      const currentType = getCurrentIntervalType(state)
      const completed = {
        type: currentType,
        startedAt: state.elapsedMs - state.intervalElapsedMs,
        endedAt: state.elapsedMs,
        duration: state.intervalElapsedMs
      } as const
      return {
        ...state,
        completedIntervals: [...state.completedIntervals, completed],
        currentIntervalIndex: state.currentIntervalIndex + 1,
        intervalElapsedMs: 0
      }
    }
    case 'COMPLETE_INTERVALS':
      return {...state, intervalsFinished: true}
    default:
      return state
  }
}
