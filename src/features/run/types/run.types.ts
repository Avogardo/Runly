import {Coordinate, IntervalConfig, Interval} from '@/types'

export type RunStatus = 'idle' | 'running' | 'paused' | 'stopped'

export type RunState = {
  status: RunStatus
  path: Coordinate[]
  startedAt: string | null
  elapsedMs: number
  // Interval state
  intervalConfig: IntervalConfig | null
  currentIntervalIndex: number
  intervalElapsedMs: number
  completedIntervals: Interval[]
  intervalsFinished: boolean
}

export type RunAction =
  | {type: 'START'; startedAt: string}
  | {type: 'PAUSE'}
  | {type: 'RESUME'}
  | {type: 'STOP'}
  | {type: 'ADD_POINT'; coord: Coordinate}
  | {type: 'TICK'; ms: number}
  | {type: 'RESET'}
  | {type: 'SET_INTERVAL_CONFIG'; config: IntervalConfig | null}
  | {type: 'NEXT_INTERVAL'}
  | {type: 'COMPLETE_INTERVALS'}
