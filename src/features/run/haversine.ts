import {Coordinate} from '@/types'

const EARTH_RADIUS_M = 6_371_000 // promień Ziemi w metrach

/**
 * Oblicza odległość między dwoma punktami GPS (wzór Haversine).
 * Zwraca dystans w metrach.
 */
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
