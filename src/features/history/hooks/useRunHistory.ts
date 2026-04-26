import {useFocusEffect} from '@react-navigation/native'
import {useCallback, useState} from 'react'

import {getAllRuns} from '@/services/storageService'
import {syncService} from '@/services/syncService'
import {useAuth} from '@/hooks'
import {Run} from '@/types'

export type UseRunHistoryReturn = {
  runs: Run[]
  isLoading: boolean
}

function mergeRuns(localRuns: Run[], cloudRuns: Run[]): Run[] {
  const localCloudIds = new Set(localRuns.filter((r) => r.cloudId).map((r) => r.cloudId))

  const cloudOnly = cloudRuns.filter((r) => !localCloudIds.has(r.cloudId))

  const merged = [...localRuns, ...cloudOnly]
  merged.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())

  return merged
}

export function useRunHistory(): UseRunHistoryReturn {
  const [runs, setRuns] = useState<Run[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {isAuthenticated} = useAuth()

  const refreshRuns = useCallback(async () => {
    try {
      const localRuns = await getAllRuns()

      if (isAuthenticated) {
        const cloudRuns = await syncService.fetchCloudRunSummaries()
        setRuns(mergeRuns(localRuns, cloudRuns))
      } else {
        setRuns(localRuns)
      }
    } catch {
      const localRuns = await getAllRuns().catch(() => [])
      setRuns(localRuns)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useFocusEffect(
    useCallback(() => {
      void refreshRuns()
    }, [refreshRuns])
  )

  return {runs, isLoading}
}
