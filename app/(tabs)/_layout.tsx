import {Ionicons} from '@expo/vector-icons'
import {Tabs} from 'expo-router'
import {useTranslation} from 'react-i18next'
import {Pressable} from 'react-native'

import {theme} from '@/ui'
import {useSyncOnOpen, useAuth} from '@/hooks'

export default function TabsLayout() {
  const {t} = useTranslation()
  const {isAuthenticated, logout} = useAuth()

  useSyncOnOpen()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopColor: theme.surfaceBorder,
          borderTopWidth: 1
        },
        headerStyle: {
          backgroundColor: theme.bg
        },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold'
        },
        headerShadowVisible: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.label.run'),
          headerShown: false,
          tabBarIcon: ({color, size}) => <Ionicons name="fitness" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.label.history'),
          headerShown: false,
          tabBarIcon: ({color, size}) => <Ionicons name="list" size={size} color={color} />,
          headerRight: isAuthenticated
            ? () => (
                <Pressable onPress={() => void logout()} style={{marginRight: 16}}>
                  <Ionicons name="log-out-outline" size={22} color={theme.textSecondary} />
                </Pressable>
              )
            : undefined
        }}
      />
    </Tabs>
  )
}
