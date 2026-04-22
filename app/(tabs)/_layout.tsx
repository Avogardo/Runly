import {Ionicons} from '@expo/vector-icons'
import {Tabs} from 'expo-router'
import {useTranslation} from 'react-i18next'

export default function TabsLayout() {
  const {t} = useTranslation()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E5E5EA'
        },
        headerStyle: {
          backgroundColor: '#007AFF'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.label.run'),
          tabBarIcon: ({color, size}) => <Ionicons name="fitness" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.label.history'),
          tabBarIcon: ({color, size}) => <Ionicons name="list" size={size} color={color} />
        }}
      />
    </Tabs>
  )
}
