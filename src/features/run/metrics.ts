import {Coordinate} from '@/types'

import {filterGpsNoise} from './gpsFilter'
import {haversineDistance} from './haversine'

export function calculateTotalDistance(path: Coordinate[]): number {
  const filtered = filterGpsNoise(path)
  let total = 0
  for (let i = 1; i < filtered.length; i++) {
    total += haversineDistance(filtered[i - 1], filtered[i])
  }
  return total
}

export function calculatePace(distanceM: number, elapsedMs: number): number | null {
  if (distanceM <= 0) return null
  const distanceKm = distanceM / 1000
  const elapsedMin = elapsedMs / 1000 / 60
  return elapsedMin / distanceKm
}
