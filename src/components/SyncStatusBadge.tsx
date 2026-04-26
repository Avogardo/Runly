import {Ionicons} from '@expo/vector-icons'
import {type FC} from 'react'
import {View, StyleSheet} from 'react-native'

import {theme} from '@/ui'
import {type SyncStatus} from '@/types'

type SyncStatusBadgeProps = {
  status?: SyncStatus
}

export const SyncStatusBadge: FC<SyncStatusBadgeProps> = ({status}) => {
  if (!status || status === 'synced') {
    return (
      <View style={[styles.badge, styles.synced]}>
        <Ionicons name="cloud-done" size={14} color={theme.success} />
      </View>
    )
  }

  if (status === 'pending') {
    return (
      <View style={[styles.badge, styles.pending]}>
        <Ionicons name="cloud-upload-outline" size={14} color={theme.warning} />
      </View>
    )
  }

  return (
    <View style={[styles.badge, styles.error]}>
      <Ionicons name="cloud-offline-outline" size={14} color={theme.danger} />
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  synced: {
    backgroundColor: theme.alpha(theme.success, 0.15)
  },
  pending: {
    backgroundColor: theme.alpha(theme.warning, 0.15)
  },
  error: {
    backgroundColor: theme.alpha(theme.danger, 0.15)
  }
})

