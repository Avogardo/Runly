import {Coordinate} from '@/types'

import {MIN_DISTANCE_M, EARTH_RADIUS_M} from '../consts'

export function haversineDistance(a: Coordinate, b: Coordinate): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)

  const sinLat = Math.sin(dLat / 2)
  const sinLon = Math.sin(dLon / 2)

  const h =
    sinLat * sinLat + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLon * sinLon

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

export function filterGpsNoise(path: Coordinate[]): Coordinate[] {
  if (path.length === 0) return []

  const filtered: Coordinate[] = [path[0]]
  for (let i = 1; i < path.length; i++) {
    const dist = haversineDistance(filtered[filtered.length - 1], path[i])
    if (dist >= MIN_DISTANCE_M) {
      filtered.push(path[i])
    }
  }
  return filtered
}
