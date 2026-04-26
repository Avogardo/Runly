import {LinearGradient} from 'expo-linear-gradient'
import {useState, useCallback, type FC} from 'react'
import {useTranslation} from 'react-i18next'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useRouter} from 'expo-router'

import {useAuth} from "@/hooks";
import {theme} from '@/ui'
import {AuthInput} from '../components'

export const LoginScreen: FC = () => {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {login} = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = useCallback(async () => {
    setError('')
    if (!email.trim() || !password.trim()) {
      setError(t('auth.error.fillAll'))
      return
    }

    setIsLoading(true)
    try {
      await login(email.trim(), password)
      router.replace('/(tabs)')
    } catch (e) {
      const message = e instanceof Error ? e.message : t('auth.error.networkError')
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [email, password, login, t])

  return (
    <LinearGradient colors={[...theme.bgGradient]} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {paddingTop: insets.top + 60, paddingBottom: insets.bottom + 20}
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>🏃 Runly</Text>
          <Text style={styles.title}>{t('auth.label.loginTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.label.loginSubtitle')}</Text>

          <View style={styles.form}>
            <AuthInput
              label={t('auth.label.email')}
              value={email}
              onChangeText={setEmail}
              placeholder="runner@runly.app"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <AuthInput
              label={t('auth.label.password')}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              secureTextEntry
              autoCapitalize="none"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              style={({pressed}) => [
                styles.btn,
                styles.btnPrimary,
                pressed && styles.btnPressed,
                isLoading && styles.btnDisabled
              ]}
              onPress={() => void handleLogin()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.textPrimary} />
              ) : (
                <Text style={styles.btnText}>{t('auth.action.login')}</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.label.noAccount')} </Text>
            <Pressable onPress={() => router.replace('/(auth)/register')}>
              <Text style={styles.footerLink}>{t('auth.action.register')}</Text>
            </Pressable>
          </View>

          <Pressable style={styles.skipBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.skipText}>{t('auth.action.skip')}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {flex: 1},
  flex: {flex: 1},
  container: {
    padding: 24,
    alignItems: 'center'
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: theme.textPrimary,
    marginBottom: 8
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.textPrimary,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 40
  },
  form: {
    width: '100%',
    maxWidth: 360
  },
  errorText: {
    color: theme.danger,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12
  },
  btn: {
    paddingVertical: 16,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1
  },
  btnPrimary: {
    backgroundColor: theme.btnAccentBg,
    borderColor: theme.accent,
    ...theme.glow(theme.accent, 0.4)
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{scale: 0.96}]
  },
  btnDisabled: {
    opacity: 0.5
  },
  btnText: {
    color: theme.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  footer: {
    flexDirection: 'row',
    marginTop: 32,
    alignItems: 'center'
  },
  footerText: {
    color: theme.textSecondary,
    fontSize: 14
  },
  footerLink: {
    color: theme.accent,
    fontSize: 14,
    fontWeight: '600'
  },
  skipBtn: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  skipText: {
    color: theme.textMuted,
    fontSize: 14
  }
})

