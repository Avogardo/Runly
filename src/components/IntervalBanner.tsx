import {View, Text, StyleSheet} from 'react-native'
import {useTranslation} from 'react-i18next'

import {GlassCard, theme} from '@/ui'
import {formatTime} from '@/utils'

type IntervalBannerProps = {
  intervalType: 'light' | 'heavy'
  timeRemainingMs: number
  progress: string
  finished: boolean
}

export function IntervalBanner({intervalType, timeRemainingMs, progress, finished}: IntervalBannerProps) {
  const {t} = useTranslation()

  if (finished) {
    return (
      <GlassCard style={styles.wrapper}>
        <Text style={styles.finishedText}>✅ {t('interval.label.completed')}</Text>
      </GlassCard>
    )
  }

  const isHeavy = intervalType === 'heavy'
  const color = isHeavy ? theme.danger : theme.success
  const icon = isHeavy ? '🔴' : '🟢'
  const typeLabel = isHeavy ? t('interval.label.heavy') : t('interval.label.light')

  return (
    <GlassCard style={styles.wrapper}>
      <View style={styles.row}>
        <View style={styles.typeCol}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={[styles.typeText, {color}]}>{typeLabel}</Text>
        </View>
        <View style={styles.timerCol}>
          <Text style={[styles.countdown, {color}]}>{formatTime(timeRemainingMs)}</Text>
          <Text style={styles.label}>{t('interval.label.remaining')}</Text>
        </View>
        <View style={styles.progressCol}>
          <Text style={styles.progressText}>{progress}</Text>
          <Text style={styles.label}>{t('interval.label.intervals')}</Text>
        </View>
      </View>
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  icon: {
    fontSize: 20,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerCol: {
    alignItems: 'center',
    flex: 1,
  },
  countdown: {
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressCol: {
    alignItems: 'flex-end',
    flex: 1,
  },
  progressText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  label: {
    fontSize: 10,
    color: theme.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  finishedText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.success,
    textAlign: 'center',
  },
})

