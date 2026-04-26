import {useRouter} from 'expo-router'
import {useEffect, useState, useCallback} from 'react'
import {useTranslation} from 'react-i18next'
import {Alert} from 'react-native'

import {API_BASE_URL} from '@/consts'
import {getRunById, deleteRun} from '@/services'
import {syncService} from '@/services/syncService'
import {Run, Coordinate, IntervalSummary} from '@/types'
import {formatDistance} from '@/utils'

type CloudRunDetail = {
  id: string
  startedAt: string
  endedAt: string
  distance: number
  duration: number
  path: Coordinate[]
  intervals?: IntervalSummary | null
}

export type UseRunDetailsReturn = {
  run: Run | null
  isLoading: boolean
  handleDelete: () => void
}

export function useRunDetails(id: string | undefined): UseRunDetailsReturn {
  const {t} = useTranslation()
  const router = useRouter()
  const [run, setRun] = useState<Run | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const loadRun = async () => {
      const localRun = await getRunById(id).catch(() => null)
      if (localRun) {
        setRun(localRun)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/runs/${id}`, {
          credentials: 'include'
        })
        if (response.ok) {
          const detail = (await response.json()) as CloudRunDetail
          setRun({
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
        // Ignore — run not found
      } finally {
        setIsLoading(false)
      }
    }

    void loadRun()
  }, [id])

  const handleDelete = useCallback(() => {
    if (!run) return
    Alert.alert(
      t('detailsScreen.alert.deleteTitle'),
      t('detailsScreen.alert.deleteMessage', {distance: formatDistance(run.distance)}),
      [
        {text: t('detailsScreen.alert.deleteCancel'), style: 'cancel'},
        {
          text: t('detailsScreen.alert.deleteConfirm'),
          style: 'destructive',
          onPress: () => {
            const doDelete = async () => {
              if (run.cloudId) {
                await syncService.deleteCloudRun(run.cloudId).catch(() => {})
              }
              await deleteRun(run.id).catch(() => {})
              router.back()
            }
            void doDelete()
          }
        }
      ]
    )
  }, [run, router, t])

  return {run, isLoading, handleDelete}
}
