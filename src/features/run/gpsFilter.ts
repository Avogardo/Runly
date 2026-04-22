import {MIN_DISTANCE_M} from '@/constants/config'
import {Coordinate} from '@/types'

import {haversineDistance} from './haversine'

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
