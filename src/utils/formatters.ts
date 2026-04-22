import {M_PER_KM, MS_PER_SEC, SEC_PER_HOUR, SEC_PER_MIN} from '@/consts'

export function formatDistance(meters: number): string {
  if (meters < M_PER_KM) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / M_PER_KM).toFixed(2)} km`
}

export function formatPace(paceMinPerKm: number | null): string {
  if (paceMinPerKm === null || !isFinite(paceMinPerKm)) return '--:--'
  const min = Math.floor(paceMinPerKm)
  const sec = Math.round((paceMinPerKm - min) * SEC_PER_MIN)
  return `${min}'${String(sec).padStart(2, '0')}"`
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / MS_PER_SEC)
  const hrs = Math.floor(totalSec / SEC_PER_HOUR)
  const min = Math.floor((totalSec % SEC_PER_HOUR) / SEC_PER_MIN)
  const sec = totalSec % SEC_PER_MIN

  if (hrs > 0) {
    return `${hrs}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}
