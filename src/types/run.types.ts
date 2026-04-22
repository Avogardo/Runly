import {Coordinate} from './gps.types'

export type Run = {
  id: string
  startedAt: string
  endedAt: string
  distance: number // in meters
  duration: number // in seconds
  path: Coordinate[]
}
