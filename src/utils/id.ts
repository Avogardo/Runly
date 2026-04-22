import * as Crypto from 'expo-crypto'

/** Generuje UUID v4 */
export function generateId(): string {
  return Crypto.randomUUID()
}
