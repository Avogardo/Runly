import {FC, useEffect, useRef} from 'react'
import {View, Text, StyleSheet, Animated} from 'react-native'
import {useTranslation} from 'react-i18next'

import {GlassCard, theme} from '@/ui'
import {calculatePace, formatDistance, formatTime, formatPace} from '@/utils'
import {Coordinate} from '@/types'
import {MS_PER_SEC} from '@/consts'

type RunSummaryCardProps = {
  distance: number
  elapsedMs: number
  path: Coordinate[]
  startedAt: string | null
}

export const RunSummaryCard: FC<RunSummaryCardProps> = ({
  distance,
  elapsedMs,
  path,
  startedAt
}) => {
  const {
    t,
    i18n: {language}
  } = useTranslation()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start()
  }, [fadeAnim, slideAnim])

  const pace = calculatePace(distance, elapsedMs)
  const durationSec = Math.floor(elapsedMs / MS_PER_SEC)

  const dateStr = startedAt
    ? new Date(startedAt).toLocaleDateString(language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : ''

  return (
    <Animated.View style={[styles.wrapper, {opacity: fadeAnim, transform: [{translateY: slideAnim}]}]}>
      <GlassCard style={styles.card}>
        <Text style={styles.emoji}>🏁</Text>
        <Text style={styles.title}>{t('runSummary.label.title')}</Text>
        {dateStr !== '' && <Text style={styles.date}>{dateStr}</Text>}

        <View style={styles.bigStatRow}>
          <View style={styles.bigStatItem}>
            <Text style={styles.bigStatValue}>{formatDistance(distance)}</Text>
            <Text style={styles.bigStatLabel}>{t('statsBar.label.distance')}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatItem label={t('statsBar.label.time')} value={formatTime(elapsedMs)} />
          <View style={styles.statDivider} />
          <StatItem label={t('statsBar.label.pace')} value={`${formatPace(pace)} /km`} />
          <View style={styles.statDivider} />
          <StatItem label={t('runSummary.label.gpsPoints')} value={String(path.length)} />
        </View>

        {durationSec > 0 && (
          <View style={styles.motivationRow}>
            <Text style={styles.motivationText}>
              {distance >= 10000
                ? '🔥 ' + t('runSummary.motivation.amazing')
                : distance >= 5000
                  ? '💪 ' + t('runSummary.motivation.great')
                  : distance >= 1000
                    ? '👏 ' + t('runSummary.motivation.good')
                    : '🚀 ' + t('runSummary.motivation.start')}
            </Text>
          </View>
        )}
      </GlassCard>
    </Animated.View>
  )
}

function StatItem({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  card: {
    marginBottom: 20
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  date: {
    fontSize: 13,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 20
  },
  bigStatRow: {
    alignItems: 'center',
    marginBottom: 20
  },
  bigStatItem: {
    alignItems: 'center'
  },
  bigStatValue: {
    fontSize: 42,
    fontWeight: '800',
    color: theme.accent,
    fontVariant: ['tabular-nums']
  },
  bigStatLabel: {
    fontSize: 11,
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.surfaceBorder
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.textPrimary,
    fontVariant: ['tabular-nums']
  },
  statLabel: {
    fontSize: 10,
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4
  },
  motivationRow: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.surfaceBorder,
    alignItems: 'center'
  },
  motivationText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.success,
    textAlign: 'center'
  }
})

