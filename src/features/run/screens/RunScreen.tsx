import {StatusBar} from 'expo-status-bar'
import {LinearGradient} from 'expo-linear-gradient'
import {useMemo, useCallback, useState, useEffect, FC} from 'react'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, Pressable, ScrollView, Alert} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useRouter, useLocalSearchParams} from 'expo-router'

import {StatsBar, IntervalBanner, RunMapView} from '@/components'
import {theme} from '@/ui'
import {saveRun} from '@/services/storageService'
import {Run, IntervalConfig} from '@/types'
import {calculatePace, formatDistance, formatPace, formatTime} from '@/utils'

import {useRunTracking} from '../hooks'
import {calculateTotalDistance, generateId} from '../utils'

export const RunScreen: FC = () => {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const params = useLocalSearchParams<{
    intervalTotal?: string
    intervalLightSec?: string
    intervalHeavySec?: string
    intervalStartHeavy?: string
    intervalVoice?: string
  }>()

  const {
    state,
    start,
    pause,
    resume,
    stop,
    reset,
    setIntervalConfig,
    clearIntervalConfig,
    currentIntervalType,
    intervalTimeRemainingMs,
    intervalProgress
  } = useRunTracking()
  const {status, path, elapsedMs} = state

  // Apply interval config from route params
  useEffect(() => {
    if (params.intervalTotal) {
      const config: IntervalConfig = {
        total: Number(params.intervalTotal),
        lightDurationSec: Number(params.intervalLightSec || 120),
        heavyDurationSec: Number(params.intervalHeavySec || 60),
        startWithHeavy: params.intervalStartHeavy === '1',
        voiceEnabled: params.intervalVoice === '1'
      }
      setIntervalConfig(config)
    }
  }, [params.intervalTotal])

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
      path,
      ...(state.intervalConfig && {
        intervals: {
          config: state.intervalConfig,
          intervals: state.completedIntervals
        }
      })
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
  }, [
    state.startedAt,
    path,
    distance,
    elapsedMs,
    state.intervalConfig,
    state.completedIntervals,
    t
  ])

  const handleReset = useCallback(() => {
    reset()
    setSaved(false)
  }, [reset])

  const hasIntervals = !!state.intervalConfig

  return (
    <LinearGradient colors={[...theme.bgGradient]} style={styles.gradient}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.container, {paddingTop: insets.top + 12}]}
      >
        <Text style={styles.title}>Runly</Text>
        <Text style={styles.subtitle}>
          {status === 'idle' && !hasIntervals && t('runScreen.label.statusIdle')}
          {status === 'idle' && hasIntervals && t('runScreen.label.statusIntervalReady')}
          {status === 'running' && t('runScreen.label.statusRunning')}
          {status === 'paused' && t('runScreen.label.statusPaused')}
          {status === 'stopped' && t('runScreen.label.statusStopped')}
        </Text>

        {/* Interval banner during run */}
        {hasIntervals && (status === 'running' || status === 'paused') && (
          <IntervalBanner
            intervalType={currentIntervalType}
            timeRemainingMs={intervalTimeRemainingMs}
            progress={intervalProgress}
            finished={state.intervalsFinished}
          />
        )}

        <RunMapView
          path={path}
          followUser={status === 'running'}
          staticMode={status === 'stopped'}
        />

        <StatsBar stats={stats} />

        <View style={styles.buttonsRow}>
          {status === 'idle' && (
            <>
              <Pressable
                style={({pressed}) => [styles.btn, styles.btnStart, pressed && styles.btnPressed]}
                onPress={() => void start()}
              >
                <Text style={styles.btnText}>▶ {t('runScreen.action.start')}</Text>
              </Pressable>
              {hasIntervals ? (
                <Pressable
                  style={({pressed}) => [styles.btn, styles.btnStop, pressed && styles.btnPressed]}
                  onPress={clearIntervalConfig}
                >
                  <Text style={styles.btnText}>✕ {t('runScreen.action.cancelIntervals')}</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={({pressed}) => [
                    styles.btn,
                    styles.btnInterval,
                    pressed && styles.btnPressed
                  ]}
                  onPress={() => router.push('/interval-config')}
                >
                  <Text style={styles.btnText}>⏱️ {t('runScreen.action.intervalRun')}</Text>
                </Pressable>
              )}
            </>
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
    marginTop: 12,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: theme.radius.full,
    borderWidth: 1
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{scale: 0.96}]
  },
  btnStart: {
    backgroundColor: theme.btnSuccessBg,
    borderColor: theme.success,
    ...theme.glow(theme.success, 0.4)
  },
  btnPause: {
    backgroundColor: theme.btnWarningBg,
    borderColor: theme.warning,
    ...theme.glow(theme.warning, 0.4)
  },
  btnStop: {
    backgroundColor: theme.btnDangerBg,
    borderColor: theme.danger,
    ...theme.glow(theme.danger, 0.4)
  },
  btnReset: {
    backgroundColor: theme.btnAccentBg,
    borderColor: theme.accent,
    ...theme.glow(theme.accent, 0.4)
  },
  btnSave: {
    backgroundColor: theme.btnSuccessBg,
    borderColor: theme.success,
    ...theme.glow(theme.success, 0.4)
  },
  btnInterval: {
    backgroundColor: theme.btnInfoBg,
    borderColor: theme.info,
    ...theme.glow(theme.info, 0.4)
  },
  btnText: {
    color: theme.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5
  }
})
