import {Ionicons} from '@expo/vector-icons'
import {Tabs} from 'expo-router'
import {useTranslation} from 'react-i18next'

import {theme} from '@/constants/theme'

export default function TabsLayout() {
  const {t} = useTranslation()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopColor: theme.surfaceBorder,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: theme.bg,
        },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.label.run'),
          headerShown: false,
          tabBarIcon: ({color, size}) => <Ionicons name="fitness" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.label.history'),
          headerShown: false,
          tabBarIcon: ({color, size}) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
