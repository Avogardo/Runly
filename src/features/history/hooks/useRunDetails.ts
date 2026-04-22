import {useRouter} from 'expo-router'
import {useEffect, useState, useCallback} from 'react'
import {useTranslation} from 'react-i18next'
import {Alert} from 'react-native'

import {getRunById, deleteRun} from '@/services/storageService'
import {Run} from '@/types'
import {formatDistance} from '@/utils/formatters'

export type UseRunDetailsReturn = {
  run: Run | null
  loading: boolean
  handleDelete: () => void
}

export function useRunDetails(id: string | undefined): UseRunDetailsReturn {
  const {t} = useTranslation()
  const router = useRouter()
  const [run, setRun] = useState<Run | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      getRunById(id)
        .then(setRun)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
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
            void deleteRun(run.id).then(() => router.back())
          }
        }
      ]
    )
  }, [run, router, t])

  return {run, loading, handleDelete}
}
