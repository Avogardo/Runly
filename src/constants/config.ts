import Constants from 'expo-constants'

const extra: Record<string, unknown> = Constants.expoConfig?.extra ?? {}

// --- GPS filtering ---
/** Minimalna odległość między punktami GPS (w metrach). Punkty bliższe to "szum GPS". */
export const MIN_DISTANCE_M = 3

// --- Timer ---
/** Interwał ticka timera biegu (ms) */
export const TIMER_INTERVAL_MS = 1000

// --- Location tracking ---
/** Interwał czasowy odczytów GPS (ms) */
export const GPS_TIME_INTERVAL_MS = 1000

/** Minimalny dystans między odczytami GPS (m) */
export const GPS_DISTANCE_INTERVAL_M = 5

// --- Database (from .env) ---
/** Nazwa pliku bazy SQLite */
export const DB_NAME: string = typeof extra.DB_NAME === 'string' ? extra.DB_NAME : 'runly.db'
