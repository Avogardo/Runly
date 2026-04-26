import {useEffect, useRef} from 'react'
import {AppState, type AppStateStatus} from 'react-native'

import {syncService} from '@/services'
import {useAuth} from "./useAuth";

export const useSyncOnOpen = () => {
  const {isAuthenticated, logout} = useAuth()
  const lastSync = useRef(0)

  useEffect(() => {
    if (!isAuthenticated) return

    const doSync = async () => {
      const now = Date.now()
      if (now - lastSync.current < 30_000) return
      lastSync.current = now

      try {
        await syncService.syncPendingRuns()
      } catch {
        void logout()
      }
    }

    void doSync()

    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        void doSync()
      }
    })

    return () => subscription.remove()
  }, [isAuthenticated, logout])
}

