import {StatusBar} from 'expo-status-bar'
import {useMemo, useCallback, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, Pressable, ScrollView, Alert} from 'react-native'

import {RunMapView} from '@/components/MapView'
import {StatsBar} from '@/components/StatsBar'
import {saveRun} from '@/services/storageService'
import {Run} from '@/types'
import {formatDistance, formatPace, formatTime} from '@/utils/formatters'
import {generateId} from '@/utils/id'

import {calculateTotalDistance, calculatePace} from './metrics'
import {useRunTracking} from './useRunTracking'

export function RunScreen() {
  const {t} = useTranslation()
  const {state, start, pause, resume, stop, reset} = useRunTracking()
  const {status, path, elapsedMs} = state

  const distance = useMemo(() => calculateTotalDistance(path), [path])
  const pace = useMemo(() => calculatePace(distance, elapsedMs), [distance, elapsedMs])

  const stats = useMemo(
    () => [
      {label: t('statsBar.label.distance'), value: formatDistance(distance)},
      {label: t('statsBar.label.time'), value: formatTime(elapsedMs)},
      {label: t('statsBar.label.pace'), value: `${formatPace(pace)} /km`}
    ],
    [distance, elapsedMs, pace, t]
  )

  const [saved, setSaved] = useState(false)

  const handleSave = useCallback(async () => {
    if (!state.startedAt || path.length === 0) {
      Alert.alert(t('runScreen.alert.errorTitle'), t('runScreen.alert.saveNoData'))
      return
    }

    const run: Run = {
      id: generateId(),
      startedAt: state.startedAt,
      endedAt: new Date().toISOString(),
      distance,
      duration: Math.floor(elapsedMs / 1000),
      path
    }

    try {
      await saveRun(run)
      setSaved(true)
      Alert.alert(
        `✅ ${t('runScreen.alert.saveSuccessTitle')}`,
        t('runScreen.alert.saveSuccess', {distance: formatDistance(distance)})
      )
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t('runScreen.alert.unknownError')
      Alert.alert(t('runScreen.alert.saveErrorTitle'), message)
    }
  }, [state.startedAt, path, distance, elapsedMs, t])

  const handleReset = useCallback(() => {
    reset()
    setSaved(false)
  }, [reset])

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>🏃</Text>
      <Text style={styles.title}>Runly</Text>
      <Text style={styles.subtitle}>
        {status === 'idle' && t('runScreen.label.statusIdle')}
        {status === 'running' && t('runScreen.label.statusRunning')}
        {status === 'paused' && t('runScreen.label.statusPaused')}
        {status === 'stopped' && t('runScreen.label.statusStopped')}
      </Text>

      <RunMapView path={path} followUser={status === 'running'} staticMode={status === 'stopped'} />

      <StatsBar stats={stats} />

      <View style={styles.buttonsRow}>
        {status === 'idle' && (
          <Pressable style={[styles.btn, styles.btnStart]} onPress={() => void start()}>
            <Text style={styles.btnText}>▶ {t('runScreen.action.start')}</Text>
          </Pressable>
        )}

        {status === 'running' && (
          <>
            <Pressable style={[styles.btn, styles.btnPause]} onPress={pause}>
              <Text style={styles.btnText}>⏸ {t('runScreen.action.pause')}</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnStop]} onPress={stop}>
              <Text style={styles.btnText}>⏹ {t('runScreen.action.stop')}</Text>
            </Pressable>
          </>
        )}

        {status === 'paused' && (
          <>
            <Pressable style={[styles.btn, styles.btnStart]} onPress={() => void resume()}>
              <Text style={styles.btnText}>▶ {t('runScreen.action.resume')}</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnStop]} onPress={stop}>
              <Text style={styles.btnText}>⏹ {t('runScreen.action.stop')}</Text>
            </Pressable>
          </>
        )}

        {status === 'stopped' && (
          <>
            {!saved && (
              <Pressable style={[styles.btn, styles.btnSave]} onPress={() => void handleSave()}>
                <Text style={styles.btnText}>💾 {t('runScreen.action.save')}</Text>
              </Pressable>
            )}
            <Pressable style={[styles.btn, styles.btnReset]} onPress={handleReset}>
              <Text style={styles.btnText}>🔄 {t('runScreen.action.newRun')}</Text>
            </Pressable>
          </>
        )}
      </View>

      <StatusBar style="light" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F2F7'
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E'
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10
  },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  btnStart: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759'
  },
  btnPause: {
    backgroundColor: '#FF9500',
    shadowColor: '#FF9500'
  },
  btnStop: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30'
  },
  btnReset: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF'
  },
  btnSave: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759'
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
})
