import {M_PER_KM, MS_PER_SEC, SEC_PER_MIN} from '@/consts'

export function calculatePace(distanceM: number, elapsedMs: number): number | null {
  if (distanceM <= 0) return null
  const distanceKm = distanceM / M_PER_KM
  const elapsedMin = elapsedMs / MS_PER_SEC / SEC_PER_MIN
  return elapsedMin / distanceKm
}
