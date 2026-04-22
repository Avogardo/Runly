export type Coordinate = {
  latitude: number
  longitude: number
  timestamp: number
}

export type Run = {
  id: string
  startedAt: string
  endedAt: string
  distance: number // w metrach
  duration: number // w sekundach
  path: Coordinate[]
}
