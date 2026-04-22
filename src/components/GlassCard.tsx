import {BlurView} from 'expo-blur'
import {StyleSheet, View, ViewStyle} from 'react-native'

import {theme} from '@/constants/theme'

type GlassCardProps = {
  children: React.ReactNode
  style?: ViewStyle
  intensity?: number
}

export function GlassCard({children, style, intensity = theme.blurIntensity}: GlassCardProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <BlurView intensity={intensity} tint={theme.blurTint} style={styles.blur}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    width: '100%',
  },
  blur: {
    width: '100%',
  },
  inner: {
    padding: 20,
    backgroundColor: theme.surface,
  },
})

