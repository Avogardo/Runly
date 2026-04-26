import '@/i18n'

import {Stack} from 'expo-router'
import {useTranslation} from 'react-i18next'

import {theme} from '@/ui'

export default function RootLayout() {
  const {t} = useTranslation()

  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        contentStyle: {backgroundColor: theme.bg}
      }}
    >
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen
        name="run/[id]"
        options={{
          title: t('detailsScreen.label.screenTitle'),
          headerStyle: {backgroundColor: theme.bg},
          headerTintColor: theme.textPrimary,
          headerTitleStyle: {fontWeight: 'bold'},
          headerShadowVisible: false,
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen
        name="interval-config"
        options={{
          title: t('intervalConfig.label.title'),
          headerStyle: {backgroundColor: theme.bg},
          headerTintColor: theme.textPrimary,
          headerTitleStyle: {fontWeight: 'bold'},
          headerShadowVisible: false,
          animation: 'slide_from_bottom',
          presentation: 'modal'
        }}
      />
    </Stack>
  )
}
