import {useLocalSearchParams} from 'expo-router'
import {View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable} from 'react-native'

import {RunMapView} from '@/components/MapView'
import {StatsBar} from '@/components/StatsBar'
import {calculatePace} from '@/features/run/metrics'
import {formatDistance, formatTime, formatPace} from '@/utils/formatters'

import {useRunDetails} from './useRunDetails'

export function RunDetailsScreen() {
  const {id} = useLocalSearchParams<{id: string}>()
  const {run, loading, handleDelete} = useRunDetails(id)

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!run) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Nie znaleziono biegu</Text>
      </View>
    )
  }

  const pace = calculatePace(run.distance, run.duration * 1000)
  const date = new Date(run.startedAt)
  const dateStr = date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const startTime = date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const endTime = new Date(run.endedAt).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const stats = [
    {label: 'Dystans', value: formatDistance(run.distance)},
    {label: 'Czas', value: formatTime(run.duration * 1000)},
    {label: 'Tempo', value: `${formatPace(pace)} /km`}
  ]

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      {/* Data i godzina */}
      <Text style={styles.date}>{dateStr}</Text>
      <Text style={styles.timeRange}>
        {startTime} — {endTime}
      </Text>

      {/* Mapa z trasą */}
      <RunMapView path={run.path} staticMode={true} />

      {/* Statystyki */}
      <StatsBar stats={stats} />

      {/* Dodatkowe informacje */}
      <View style={styles.detailsCard}>
        <DetailRow label="Punkty GPS" value={String(run.path.length)} />
        <DetailRow label="Śr. tempo" value={`${formatPace(pace)} /km`} />
        <DetailRow label="Dystans" value={formatDistance(run.distance)} />
        <DetailRow label="Czas trwania" value={formatTime(run.duration * 1000)} />
      </View>

      {/* Przycisk usuwania */}
      <Pressable
        style={({pressed}) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
        onPress={handleDelete}
      >
        <Text style={styles.deleteBtnText}>Usuń bieg</Text>
      </Pressable>
    </ScrollView>
  )
}

function DetailRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  container: {
    padding: 20,
    paddingBottom: 40
  },
  date: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    textTransform: 'capitalize',
    marginBottom: 4
  },
  timeRange: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA'
  },
  detailLabel: {
    fontSize: 15,
    color: '#8E8E93'
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E'
  },
  deleteBtn: {
    marginTop: 32,
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center'
  },
  deleteBtnPressed: {
    backgroundColor: 'rgba(255, 59, 48, 0.18)'
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF3B30'
  }
})
