import {Coordinate} from './gps.types'

export const IntervalType = {
  Light: 'light',
  Heavy: 'heavy'
} as const
export type IntervalType = (typeof IntervalType)[keyof typeof IntervalType]

export type IntervalConfig = {
  total: number
  lightDurationSec: number
  heavyDurationSec: number
  startWithHeavy: boolean
  voiceEnabled: boolean
}

export type Interval = {
  type: IntervalType
  startedAt: number
  endedAt: number
  duration: number
}

export type IntervalSummary = {
  config: IntervalConfig
  intervals: Interval[]
}

export const SyncStatus = {
  Pending: 'pending',
  Synced: 'synced',
  Error: 'error'
} as const
export type SyncStatus = (typeof SyncStatus)[keyof typeof SyncStatus]

export type Run = {
  id: string
  startedAt: string
  endedAt: string
  distance: number // in meters
  duration: number // in seconds
  path: Coordinate[]
  intervals?: IntervalSummary
  syncStatus?: SyncStatus
  cloudId?: string
}
