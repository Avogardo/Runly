import {Stack} from 'expo-router'

import {theme} from '@/ui'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: theme.bg},
        animation: 'fade'
      }}
    />
  )
}

