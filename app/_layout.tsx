import '@/i18n'

import {Stack} from 'expo-router'
import {useTranslation} from 'react-i18next'

export default function RootLayout() {
  const {t} = useTranslation()

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen
        name="run/[id]"
        options={{
          title: t('details.screenTitle'),
          headerStyle: {backgroundColor: '#007AFF'},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'}
        }}
      />
    </Stack>
  )
}
