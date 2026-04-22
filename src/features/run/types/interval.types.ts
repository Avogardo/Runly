import {IntervalType} from '@/types'

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
