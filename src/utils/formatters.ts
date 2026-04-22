/**
 * Formatuje dystans w metrach do czytelnego stringa.
 * np. 1234.5 → "1.23 km", 850 → "850 m"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(2)} km`
}

/**
 * Formatuje tempo (min/km) do stringa.
 * np. 5.5 → "5'30\"", null → "--:--"
 */
export function formatPace(paceMinPerKm: number | null): string {
  if (paceMinPerKm === null || !isFinite(paceMinPerKm)) return '--:--'
  const min = Math.floor(paceMinPerKm)
  const sec = Math.round((paceMinPerKm - min) * 60)
  return `${min}'${String(sec).padStart(2, '0')}"`
}

/**
 * Formatuje czas w ms do stringa MM:SS lub HH:MM:SS.
 */
export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const hrs = Math.floor(totalSec / 3600)
  const min = Math.floor((totalSec % 3600) / 60)
  const sec = totalSec % 60

  if (hrs > 0) {
    return `${hrs}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
