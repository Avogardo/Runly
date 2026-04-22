export type Coordinate = {
  latitude: number
  longitude: number
  timestamp: number
}

export type Run = {
  id: string
  startedAt: string
  endedAt: string
  distance: number // in meters
  duration: number // in seconds
  path: Coordinate[]
}
