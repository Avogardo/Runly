import {API_BASE_URL} from '@/consts'
import {Run, Coordinate, IntervalSummary} from '@/types'

import {getPendingRuns, markRunSynced, markRunSyncError} from './storageService'

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

async function syncRun(run: Run): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        startedAt: run.startedAt,
        endedAt: run.endedAt,
        distance: run.distance,
        duration: run.duration,
        path: run.path,
        ...(run.intervals ? {intervals: run.intervals} : {})
      })
    })

    if (response.status === 401) {
      throw new UnauthorizedError()
    }

    if (response.status === 201) {
      const data = (await response.json()) as {id: string}
      await markRunSynced(run.id, data.id)
      return true
    }

    await markRunSyncError(run.id)
    return false
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error
    // Network error — keep as pending, will retry later
    return false
  }
}

async function syncPendingRuns(): Promise<{synced: number; failed: number}> {
  const pending = await getPendingRuns()
  let synced = 0
  let failed = 0

  for (const run of pending) {
    try {
      const success = await syncRun(run)
      if (success) {
        synced++
      } else {
        failed++
      }
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error
      }
      failed++
    }
  }

  return {synced, failed}
}

async function deleteCloudRun(cloudId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/runs/${cloudId}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (response.status === 401) throw new UnauthorizedError()
    return response.ok
  } catch (error) {
    if (error instanceof UnauthorizedError) throw error
    return false
  }
}

type CloudRunSummary = {
  id: string
  startedAt: string
  endedAt: string
  distance: number
  duration: number
  createdAt: string
}

type CloudRunDetail = CloudRunSummary & {
  path: Coordinate[]
  intervals?: IntervalSummary | null
  updatedAt: string
}

/** Fetch all runs from the cloud API */
async function fetchCloudRuns(): Promise<Run[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/runs`, {
      credentials: 'include'
    })

    if (response.status === 401) return []
    if (!response.ok) return []

    const summaries = (await response.json()) as CloudRunSummary[]

    // Fetch full details for each run (with path data)
    const runs: Run[] = []
    for (const summary of summaries) {
      try {
        const detailRes = await fetch(`${API_BASE_URL}/api/runs/${summary.id}`, {
          credentials: 'include'
        })
        if (detailRes.ok) {
          const detail = (await detailRes.json()) as CloudRunDetail
          runs.push({
            id: detail.id,
            startedAt: detail.startedAt,
            endedAt: detail.endedAt,
            distance: detail.distance,
            duration: detail.duration,
            path: detail.path || [],
            ...(detail.intervals ? {intervals: detail.intervals} : {}),
            syncStatus: 'synced',
            cloudId: detail.id
          })
        }
      } catch {
        // Skip failed individual fetches
      }
    }

    return runs
  } catch {
    return []
  }
}

/** Fetch only run summaries (without path) — lighter for list display */
async function fetchCloudRunSummaries(): Promise<Run[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/runs`, {
      credentials: 'include'
    })

    if (response.status === 401) return []
    if (!response.ok) return []

    const summaries = (await response.json()) as CloudRunSummary[]

    return summaries.map((s) => ({
      id: s.id,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      distance: s.distance,
      duration: s.duration,
      path: [],
      syncStatus: 'synced' as const,
      cloudId: s.id
    }))
  } catch {
    return []
  }
}

export const syncService = {
  syncRun,
  syncPendingRuns,
  deleteCloudRun,
  fetchCloudRuns,
  fetchCloudRunSummaries
}

