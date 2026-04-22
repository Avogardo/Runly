import {useRouter} from 'expo-router'
import {LinearGradient} from 'expo-linear-gradient'
import i18next from 'i18next'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {GlassCard} from '@/components/GlassCard'
import {theme} from '@/constants/theme'
import {calculatePace} from '@/features/run/metrics'
import {formatDistance, formatTime, formatPace} from '@/utils/formatters'

import {useRunHistory} from './useRunHistory'

export function HistoryScreen() {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {runs, loading} = useRunHistory()

  if (loading) {
    return (
      <LinearGradient colors={[...theme.bgGradient]} style={[styles.centered, {paddingTop: insets.top}]}>
        <Text style={styles.loadingText}>{t('historyScreen.label.loading')}</Text>
      </LinearGradient>
    )
  }

  if (runs.length === 0) {
    return (
      <LinearGradient colors={[...theme.bgGradient]} style={[styles.centered, {paddingTop: insets.top}]}>
        <Text style={styles.emptyIcon}>🏁</Text>
        <Text style={styles.emptyText}>{t('historyScreen.label.emptyTitle')}</Text>
        <Text style={styles.emptyHint}>{t('historyScreen.label.emptyHint')}</Text>
      </LinearGradient>
    )
  }

  const locale = i18next.language

  return (
    <LinearGradient colors={[...theme.bgGradient]} style={styles.gradient}>
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={[styles.listContent, {paddingTop: insets.top + 16}]}
        renderItem={({item}) => {
          const pace = calculatePace(item.distance, item.duration * 1000)
          const date = new Date(item.startedAt)
          const dateStr = date.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
          const timeStr = date.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit'
          })

          return (
            <Pressable
              style={({pressed}) => [pressed && styles.cardPressed]}
              onPress={() => router.push(`/run/${item.id}`)}
            >
              <GlassCard style={styles.cardWrapper}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>{dateStr}</Text>
                  <Text style={styles.cardTime}>{timeStr}</Text>
                </View>
                <View style={styles.cardStats}>
                  <View style={styles.cardStat}>
                    <Text style={styles.cardStatValue}>{formatDistance(item.distance)}</Text>
                    <Text style={styles.cardStatLabel}>{t('statsBar.label.distance')}</Text>
                  </View>
                  <View style={[styles.cardStat, styles.cardStatDivider]}>
                    <Text style={styles.cardStatValue}>{formatTime(item.duration * 1000)}</Text>
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
        }}
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    fontSize: 16,
    color: theme.textSecondary
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 8
  },
  emptyHint: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center'
  },
  list: {
    flex: 1
  },
  listContent: {
    padding: 16,
    gap: 12
  },
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
