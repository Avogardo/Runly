export function calculatePace(distanceM: number, elapsedMs: number): number | null {
  if (distanceM <= 0) return null
  const distanceKm = distanceM / 1000
  const elapsedMin = elapsedMs / 1000 / 60
  return elapsedMin / distanceKm
}
