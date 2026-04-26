import * as SQLite from 'expo-sqlite'
import i18next from 'i18next'

import {DB_NAME} from '@/consts'
import {Run, Coordinate, IntervalSummary, SyncStatus} from '@/types'

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
    // Migration: add intervals column
    const tableInfo = await _db.getAllAsync<{name: string}>('PRAGMA table_info(runs)')
    const hasIntervals = tableInfo.some((col) => col.name === 'intervals')
    if (!hasIntervals) {
      await _db.execAsync('ALTER TABLE runs ADD COLUMN intervals TEXT')
    }
    // Migration: add sync columns
    const hasSyncStatus = tableInfo.some((col) => col.name === 'syncStatus')
    if (!hasSyncStatus) {
      await _db.execAsync("ALTER TABLE runs ADD COLUMN syncStatus TEXT DEFAULT 'pending'")
    }
    const hasCloudId = tableInfo.some((col) => col.name === 'cloudId')
    if (!hasCloudId) {
      await _db.execAsync('ALTER TABLE runs ADD COLUMN cloudId TEXT')
    }
  }
  return _db
}

type RunRow = {
  id: string
  startedAt: string
  endedAt: string
  distance: number
  duration: number
  path: string
  intervals: string | null
  syncStatus: string | null
  cloudId: string | null
}

function rowToRun(row: RunRow): Run {
  const {path, intervals, syncStatus, cloudId, ...rest} = row
  return {
    ...rest,
    path: JSON.parse(path) as Coordinate[],
    ...(intervals ? {intervals: JSON.parse(intervals) as IntervalSummary} : {}),
    syncStatus: (syncStatus as SyncStatus) || 'pending',
    ...(cloudId ? {cloudId} : {})
  }
}

export async function saveRun(run: Run): Promise<Run> {
  if (run.path.length === 0 || run.duration <= 0) {
    throw new Error(i18next.t('storage.error.emptyRun'))
  }

  const db = await getDb()
  await db.runAsync(
    `INSERT INTO runs (id, startedAt, endedAt, distance, duration, path, intervals, syncStatus)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      run.id,
      run.startedAt,
      run.endedAt,
      run.distance,
      run.duration,
      JSON.stringify(run.path),
      run.intervals ? JSON.stringify(run.intervals) : null,
      'pending'
    ]
  )
  return {...run, syncStatus: 'pending'}
}

export async function getAllRuns(): Promise<Run[]> {
  const db = await getDb()
  const rows = await db.getAllAsync<RunRow>('SELECT * FROM runs ORDER BY startedAt DESC')
  return rows.map(rowToRun)
}

export async function getRunById(id: string): Promise<Run | null> {
  const db = await getDb()
  const row = await db.getFirstAsync<RunRow>('SELECT * FROM runs WHERE id = ?', [id])
  if (!row) return null
  return rowToRun(row)
}

export async function deleteRun(id: string): Promise<void> {
  const db = await getDb()
  await db.runAsync('DELETE FROM runs WHERE id = ?', [id])
}

export async function getPendingRuns(): Promise<Run[]> {
  const db = await getDb()
  const rows = await db.getAllAsync<RunRow>(
    "SELECT * FROM runs WHERE syncStatus = 'pending' OR syncStatus = 'error' ORDER BY startedAt ASC"
  )
  return rows.map(rowToRun)
}

export async function markRunSynced(localId: string, cloudId: string): Promise<void> {
  const db = await getDb()
  await db.runAsync("UPDATE runs SET syncStatus = 'synced', cloudId = ? WHERE id = ?", [
    cloudId,
    localId
  ])
}

export async function markRunSyncError(localId: string): Promise<void> {
  const db = await getDb()
  await db.runAsync("UPDATE runs SET syncStatus = 'error' WHERE id = ?", [localId])
}
