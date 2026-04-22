import {StatusBar} from 'expo-status-bar'
import {LinearGradient} from 'expo-linear-gradient'
import {useMemo, useCallback, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, Pressable, ScrollView, Alert} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {StatsBar} from '@/components/StatsBar'
import {RunMapView} from '@/components/MapView'
import {theme} from '@/ui'
import {saveRun} from '@/services/storageService'
import {Run} from '@/types'
import {calculatePace, formatDistance, formatPace, formatTime} from '@/utils'

import {useRunTracking} from '../hooks'
import {calculateTotalDistance, generateId} from '../utils'

export function RunScreen() {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
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
    <LinearGradient colors={[...theme.bgGradient]} style={styles.gradient}>
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.container, {paddingTop: insets.top + 12}]}>
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
            <Pressable
              style={({pressed}) => [styles.btn, styles.btnStart, pressed && styles.btnPressed]}
              onPress={() => void start()}
            >
              <Text style={styles.btnText}>▶ {t('runScreen.action.start')}</Text>
            </Pressable>
          )}

          {status === 'running' && (
            <>
              <Pressable
                style={({pressed}) => [styles.btn, styles.btnPause, pressed && styles.btnPressed]}
                onPress={pause}
              >
                <Text style={styles.btnText}>⏸ {t('runScreen.action.pause')}</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.btn, styles.btnStop, pressed && styles.btnPressed]}
                onPress={stop}
              >
                <Text style={styles.btnText}>⏹ {t('runScreen.action.stop')}</Text>
              </Pressable>
            </>
          )}

          {status === 'paused' && (
            <>
              <Pressable
                style={({pressed}) => [styles.btn, styles.btnStart, pressed && styles.btnPressed]}
                onPress={() => void resume()}
              >
                <Text style={styles.btnText}>▶ {t('runScreen.action.resume')}</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [styles.btn, styles.btnStop, pressed && styles.btnPressed]}
                onPress={stop}
              >
                <Text style={styles.btnText}>⏹ {t('runScreen.action.stop')}</Text>
              </Pressable>
            </>
          )}

          {status === 'stopped' && (
            <>
              {!saved && (
                <Pressable
                  style={({pressed}) => [styles.btn, styles.btnSave, pressed && styles.btnPressed]}
                  onPress={() => void handleSave()}
                >
                  <Text style={styles.btnText}>💾 {t('runScreen.action.save')}</Text>
                </Pressable>
              )}
              <Pressable
                style={({pressed}) => [styles.btn, styles.btnReset, pressed && styles.btnPressed]}
                onPress={handleReset}
              >
                <Text style={styles.btnText}>🔄 {t('runScreen.action.newRun')}</Text>
              </Pressable>
            </>
          )}
        </View>

        <StatusBar style="light" />
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    paddingBottom: 40
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.textPrimary,
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 15,
    color: theme.textSecondary,
    marginBottom: 24,
    marginTop: 4
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 12
  },
  btn: {
    paddingHorizontal: 34,
    paddingVertical: 16,
    borderRadius: theme.radius.full,
    borderWidth: 1
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{scale: 0.96}]
  },
  btnStart: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderColor: theme.success,
    ...theme.glow(theme.success, 0.4)
  },
  btnPause: {
    backgroundColor: 'rgba(255, 179, 0, 0.15)',
    borderColor: theme.warning,
    ...theme.glow(theme.warning, 0.4)
  },
  btnStop: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    borderColor: theme.danger,
    ...theme.glow(theme.danger, 0.4)
  },
  btnReset: {
    backgroundColor: 'rgba(0, 210, 255, 0.15)',
    borderColor: theme.accent,
    ...theme.glow(theme.accent, 0.4)
  },
  btnSave: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderColor: theme.success,
    ...theme.glow(theme.success, 0.4)
  },
  btnText: {
    color: theme.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5
  }
})
