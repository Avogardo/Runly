import Constants from 'expo-constants'

const extra: Record<string, unknown> = Constants.expoConfig?.extra ?? {}

export const GPS_TIME_INTERVAL_MS = 1000
export const GPS_DISTANCE_INTERVAL_M = 5

export const DB_NAME: string = typeof extra.DB_NAME === 'string' ? extra.DB_NAME : 'runly.db'
