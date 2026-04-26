import {type FC} from 'react'
import {Ionicons} from '@expo/vector-icons'
import {useTranslation} from 'react-i18next'
import {View, Text, StyleSheet, Pressable} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useRouter} from 'expo-router'

import {theme} from '@/ui'
import {useAuth} from "@/hooks";

export const AccountBar: FC = () => {
  const {t} = useTranslation()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const {isAuthenticated, user, logout} = useAuth()

  return (
    <View style={[styles.container, {paddingTop: insets.top + 8}]}>
      {isAuthenticated ? (
        <View style={styles.row}>
          <View style={styles.info}>
            <Ionicons name="person-circle" size={24} color={theme.accent} />
            <Text style={styles.email} numberOfLines={1}>{user?.email}</Text>
          </View>
          <Pressable onPress={() => void logout()} style={styles.action}>
            <Ionicons name="log-out-outline" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.loginPrompt}
          onPress={() => router.push('/(auth)/login')}
        >
          <Ionicons name="cloud-upload-outline" size={18} color={theme.accent} />
          <Text style={styles.loginPromptText}>{t('auth.action.login')}</Text>
          <Text style={styles.loginPromptHint}>{t('auth.label.loginSubtitle')}</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  email: {
    fontSize: 14,
    color: theme.textPrimary,
    fontWeight: '500',
    flex: 1
  },
  action: {
    padding: 8
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    borderRadius: theme.radius.md,
    padding: 12,
    flexWrap: 'wrap'
  },
  loginPromptText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.accent
  },
  loginPromptHint: {
    fontSize: 12,
    color: theme.textSecondary,
    width: '100%',
    marginTop: 2
  }
})

