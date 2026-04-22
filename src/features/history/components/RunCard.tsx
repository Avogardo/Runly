import {type FC} from 'react'
import {useRouter} from 'expo-router'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, Pressable} from 'react-native'

import {GlassCard, theme} from '@/ui'
import {MS_PER_SEC} from '@/consts'
import {Run} from '@/types'
import {calculatePace, formatDistance, formatTime, formatPace} from '@/utils'

type RunCardProps = {
  run: Run
}

export const RunCard: FC<RunCardProps> = ({run}) => {
  const {
    t,
    i18n: {language}
  } = useTranslation()
  const router = useRouter()

  const pace = calculatePace(run.distance, run.duration * MS_PER_SEC)
  const date = new Date(run.startedAt)
  const dateStr = date.toLocaleDateString(language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  const timeStr = date.toLocaleTimeString(language, {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Pressable
      style={({pressed}) => [pressed && styles.cardPressed]}
      onPress={() => router.push(`/run/${run.id}`)}
    >
      <GlassCard style={styles.cardWrapper}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{dateStr}</Text>
          <Text style={styles.cardTime}>{timeStr}</Text>
        </View>
        <View style={styles.cardStats}>
          <View style={styles.cardStat}>
            <Text style={styles.cardStatValue}>{formatDistance(run.distance)}</Text>
            <Text style={styles.cardStatLabel}>{t('statsBar.label.distance')}</Text>
          </View>
          <View style={[styles.cardStat, styles.cardStatDivider]}>
            <Text style={styles.cardStatValue}>{formatTime(run.duration * MS_PER_SEC)}</Text>
            <Text style={styles.cardStatLabel}>{t('statsBar.label.time')}</Text>
          </View>
          <View style={styles.cardStat}>
            <Text style={styles.cardStatValue}>{formatPace(pace)} /km</Text>
            <Text style={styles.cardStatLabel}>{t('statsBar.label.pace')}</Text>
          </View>
        </View>
        <Text style={styles.cardArrow}>›</Text>
      </GlassCard>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 0
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{scale: 0.98}]
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  cardDate: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.textPrimary
  },
  cardTime: {
    fontSize: 14,
    color: theme.textSecondary
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  cardStat: {
    alignItems: 'center',
    flex: 1
  },
  cardStatDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.surfaceBorder
  },
  cardStatValue: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.textPrimary
  },
  cardStatLabel: {
    fontSize: 10,
    color: theme.textSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  cardArrow: {
    position: 'absolute',
    right: 16,
    top: 16,
    fontSize: 22,
    color: theme.textMuted
  }
})
