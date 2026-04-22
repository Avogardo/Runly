import {useLocalSearchParams} from 'expo-router'
import {LinearGradient} from 'expo-linear-gradient'
import i18next from 'i18next'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable} from 'react-native'

import {GlassCard, theme} from '@/ui'
import {RunMapView} from '@/components/MapView'
import {StatsBar} from '@/components/StatsBar'
import {calculatePace, formatDistance, formatTime, formatPace} from '@/utils'

import {useRunDetails} from '../hooks'

export function RunDetailsScreen() {
  const {t} = useTranslation()
  const {id} = useLocalSearchParams<{id: string}>()
  const {run, loading, handleDelete} = useRunDetails(id)

  if (loading) {
    return (
      <LinearGradient colors={[...theme.bgGradient]} style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
      </LinearGradient>
    )
  }

  if (!run) {
    return (
      <LinearGradient colors={[...theme.bgGradient]} style={styles.centered}>
        <Text style={styles.errorText}>{t('detailsScreen.label.notFound')}</Text>
      </LinearGradient>
    )
  }

  const pace = calculatePace(run.distance, run.duration * 1000)
  const locale = i18next.language
  const date = new Date(run.startedAt)
  const dateStr = date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const startTime = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  })
  const endTime = new Date(run.endedAt).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  })

  const stats = [
    {label: t('statsBar.label.distance'), value: formatDistance(run.distance)},
    {label: t('statsBar.label.time'), value: formatTime(run.duration * 1000)},
    {label: t('statsBar.label.pace'), value: `${formatPace(pace)} /km`}
  ]

  return (
    <LinearGradient colors={[...theme.bgGradient]} style={styles.gradient}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.timeRange}>
          {startTime} — {endTime}
        </Text>

        <RunMapView path={run.path} staticMode={true} />

        <StatsBar stats={stats} />

        <GlassCard>
          <DetailRow label={t('detailsScreen.label.gpsPoints')} value={String(run.path.length)} />
          <DetailRow label={t('detailsScreen.label.avgPace')} value={`${formatPace(pace)} /km`} />
          <DetailRow label={t('detailsScreen.label.distance')} value={formatDistance(run.distance)} />
          <DetailRow
            label={t('detailsScreen.label.duration')}
            value={formatTime(run.duration * 1000)}
            last
          />
        </GlassCard>

        <Pressable
          style={({pressed}) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteBtnText}>{t('detailsScreen.action.delete')}</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  )
}

function DetailRow({label, value, last}: {label: string; value: string; last?: boolean}) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 16,
    color: theme.danger
  },
  scrollView: {
    flex: 1
  },
  container: {
    padding: 20,
    paddingBottom: 40
  },
  date: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.textPrimary,
    textTransform: 'capitalize',
    marginBottom: 4
  },
  timeRange: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 20
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: theme.surfaceBorder
  },
  detailRowLast: {
    borderBottomWidth: 0
  },
  detailLabel: {
    fontSize: 15,
    color: theme.textSecondary
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary
  },
  deleteBtn: {
    marginTop: 32,
    backgroundColor: 'rgba(255, 82, 82, 0.10)',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.25)',
    paddingVertical: 14,
    alignItems: 'center'
  },
  deleteBtnPressed: {
    backgroundColor: 'rgba(255, 82, 82, 0.22)',
    transform: [{scale: 0.98}]
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.danger
  }
})
