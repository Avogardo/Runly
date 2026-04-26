import {FC} from 'react'
import {Text, StyleSheet, Pressable, Linking, Platform} from 'react-native'
import {useTranslation} from 'react-i18next'

import {GlassCard, theme} from '@/ui'

type GPSErrorBannerProps = {
  type: 'no_permission' | 'gps_error'
  onRetry?: () => void
}

export const GPSErrorBanner: FC<GPSErrorBannerProps> = ({type, onRetry}) => {
  const {t} = useTranslation()

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      void Linking.openURL('app-settings:')
    } else {
      void Linking.openSettings()
    }
  }

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.icon}>{type === 'no_permission' ? '🔒' : '📡'}</Text>
      <Text style={styles.title}>
        {type === 'no_permission'
          ? t('gpsError.label.noPermission')
          : t('gpsError.label.gpsUnavailable')}
      </Text>
      <Text style={styles.message}>
        {type === 'no_permission'
          ? t('gpsError.label.noPermissionHint')
          : t('gpsError.label.gpsUnavailableHint')}
      </Text>
      {type === 'no_permission' ? (
        <Pressable
          style={({pressed}) => [styles.btn, pressed && styles.btnPressed]}
          onPress={openSettings}
        >
          <Text style={styles.btnText}>⚙️ {t('gpsError.action.openSettings')}</Text>
        </Pressable>
      ) : (
        onRetry && (
          <Pressable
            style={({pressed}) => [styles.btn, pressed && styles.btnPressed]}
            onPress={onRetry}
          >
            <Text style={styles.btnText}>🔄 {t('gpsError.action.retry')}</Text>
          </Pressable>
        )
      )}
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16
  },
  icon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.warning,
    textAlign: 'center',
    marginBottom: 4
  },
  message: {
    fontSize: 13,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18
  },
  btn: {
    backgroundColor: theme.btnWarningBg,
    borderColor: theme.warning,
    borderWidth: 1,
    borderRadius: theme.radius.full,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: 'center'
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{scale: 0.96}]
  },
  btnText: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '600'
  }
})

