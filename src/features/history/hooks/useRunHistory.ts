import {useFocusEffect} from '@react-navigation/native'
import {useCallback, useState} from 'react'

import {getAllRuns} from '@/services/storageService'
import {Run} from '@/types'

export type UseRunHistoryReturn = {
  runs: Run[]
  isLoading: boolean
}

export function useRunHistory(): UseRunHistoryReturn {
  const [runs, setRuns] = useState<Run[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshRuns = useCallback(() => {
    getAllRuns()
      .then(setRuns)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  useFocusEffect(
    useCallback(() => {
      refreshRuns()
    }, [refreshRuns])
  )

  return {runs, isLoading}
}
