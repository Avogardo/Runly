import {Coordinate} from "@/types";

export type RunStatus = 'idle' | 'running' | 'paused' | 'stopped'

export type RunState = {
  status: RunStatus
  path: Coordinate[]
  startedAt: string | null
  elapsedMs: number
}

export type RunAction =
  | {type: 'START'; startedAt: string}
  | {type: 'PAUSE'}
  | {type: 'RESUME'}
  | {type: 'STOP'}
  | {type: 'ADD_POINT'; coord: Coordinate}
  | {type: 'TICK'; ms: number}
  | {type: 'RESET'}
