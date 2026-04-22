import {Coordinate} from '@/types'

import {haversineDistance, filterGpsNoise} from './gps.utils'

export function calculateTotalDistance(path: Coordinate[]): number {
  const filtered = filterGpsNoise(path)
  let total = 0
  for (let i = 1; i < filtered.length; i++) {
    total += haversineDistance(filtered[i - 1], filtered[i])
  }
  return total
}
