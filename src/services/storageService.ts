import * as SQLite from 'expo-sqlite'
import i18next from 'i18next'

import {DB_NAME} from '@/constants/config'
import {Run, Coordinate} from '@/types'

let _db: SQLite.SQLiteDatabase | null = null

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!_db) {
    _db = await SQLite.openDatabaseAsync(DB_NAME)
    await _db.execAsync(`
      CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY NOT NULL,
        startedAt TEXT NOT NULL,
        endedAt TEXT NOT NULL,
        distance REAL NOT NULL,
        duration REAL NOT NULL,
        path TEXT NOT NULL
      );
    `)
  }
  return _db
}

export async function saveRun(run: Run): Promise<Run> {
  if (run.path.length === 0 || run.duration <= 0) {
    throw new Error(i18next.t('storage.emptyRunError'))
  }

  const db = await getDb()
  await db.runAsync(
    `INSERT INTO runs (id, startedAt, endedAt, distance, duration, path)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [run.id, run.startedAt, run.endedAt, run.distance, run.duration, JSON.stringify(run.path)]
  )
  return run
}

export async function getAllRuns(): Promise<Run[]> {
  const db = await getDb()
  const rows = await db.getAllAsync<{
    id: string
    startedAt: string
    endedAt: string
    distance: number
    duration: number
    path: string
  }>('SELECT * FROM runs ORDER BY startedAt DESC')

  return rows.map((row) => ({
    ...row,
    path: JSON.parse(row.path) as Coordinate[]
  }))
}

export async function getRunById(id: string): Promise<Run | null> {
  const db = await getDb()
  const row = await db.getFirstAsync<{
    id: string
    startedAt: string
    endedAt: string
    distance: number
    duration: number
    path: string
  }>('SELECT * FROM runs WHERE id = ?', [id])

  if (!row) return null
  return {...row, path: JSON.parse(row.path) as Coordinate[]}
}

export async function deleteRun(id: string): Promise<void> {
  const db = await getDb()
  await db.runAsync('DELETE FROM runs WHERE id = ?', [id])
}
