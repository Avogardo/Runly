import {LinearGradient} from 'expo-linear-gradient'
import {useRouter} from 'expo-router'
import {useState, FC} from 'react'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, Pressable, Switch, ScrollView} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {GlassCard, theme} from '@/ui'

export const IntervalConfigScreen: FC = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [total, setTotal] = useState(8)
  const [lightMin, setLightMin] = useState(2)
  const [heavyMin, setHeavyMin] = useState(1)
  const [startWithHeavy, setStartWithHeavy] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const handleStart = () => {
    router.replace({
      pathname: '/(tabs)',
      params: {
        intervalTotal: String(total),
        intervalLightSec: String(lightMin * 60),
        intervalHeavySec: String(heavyMin * 60),
        intervalStartHeavy: startWithHeavy ? '1' : '0',
        intervalVoice: voiceEnabled ? '1' : '0'
      }
    })
  }

  return (
    <LinearGradient colors={[...theme.bgGradient]} style={styles.gradient}>
      <ScrollView contentContainerStyle={[styles.container, {paddingTop: insets.top + 16}]}>
        <Text style={styles.title}>⏱️</Text>
        <Text style={styles.heading}>{t('intervalConfig.label.title')}</Text>

        <GlassCard style={styles.card}>
          <Stepper
            label={t('intervalConfig.label.intervals')}
            value={total}
            onChange={setTotal}
            min={2}
            max={30}
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Stepper
            label={t('intervalConfig.label.heavyDuration')}
            value={heavyMin}
            onChange={setHeavyMin}
            min={0.5}
            max={10}
            step={0.5}
            suffix="min"
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Stepper
            label={t('intervalConfig.label.lightDuration')}
            value={lightMin}
            onChange={setLightMin}
            min={0.5}
            max={10}
            step={0.5}
            suffix="min"
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('intervalConfig.label.startWithHeavy')}</Text>
            <Switch
              value={startWithHeavy}
              onValueChange={setStartWithHeavy}
              trackColor={{false: 'rgba(255,255,255,0.1)', true: theme.accent}}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('intervalConfig.label.voiceFeedback')}</Text>
            <Switch
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
              trackColor={{false: 'rgba(255,255,255,0.1)', true: theme.accent}}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>

        {/* Summary */}
        <Text style={styles.summary}>
          {total} × {heavyMin}min 🔴 / {lightMin}min 🟢
        </Text>

        <Pressable
          style={({pressed}) => [styles.startBtn, pressed && styles.startBtnPressed]}
          onPress={handleStart}
        >
          <Text style={styles.startBtnText}>▶ {t('intervalConfig.action.startRun')}</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  )
}

type StepperProps = {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}

function Stepper({label, value, onChange, min = 1, max = 99, step = 1, suffix}: StepperProps) {
  const decrease = () => onChange(Math.max(min, value - step))
  const increase = () => onChange(Math.min(max, value + step))

  const displayValue = Number.isInteger(value) ? String(value) : value.toFixed(1)

  return (
    <View>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <Pressable style={styles.stepperBtn} onPress={decrease}>
          <Text style={styles.stepperBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>
          {displayValue}
          {suffix ? ` ${suffix}` : ''}
        </Text>
        <Pressable style={styles.stepperBtn} onPress={increase}>
          <Text style={styles.stepperBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  container: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40
  },
  title: {
    fontSize: 48,
    marginBottom: 8
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.textPrimary,
    marginBottom: 24,
    letterSpacing: 0.5
  },
  card: {
    marginBottom: 12
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchLabel: {
    fontSize: 15,
    color: theme.textPrimary,
    fontWeight: '600'
  },
  stepperLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepperBtnText: {
    fontSize: 22,
    color: theme.textPrimary,
    fontWeight: '600'
  },
  stepperValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    minWidth: 80,
    textAlign: 'center'
  },
  summary: {
    fontSize: 15,
    color: theme.textSecondary,
    marginTop: 16,
    marginBottom: 24
  },
  startBtn: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: theme.accent,
    ...theme.glow(theme.accent, 0.5)
  },
  startBtnPressed: {
    opacity: 0.7,
    transform: [{scale: 0.96}]
  },
  startBtnText: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1
  }
})
