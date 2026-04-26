import {ExpoConfig, ConfigContext} from 'expo/config'

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Runly',
  slug: 'Runly',
  scheme: 'runly',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0B0B1E'
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0B0B1E'
    },
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: ['expo-router', 'expo-sqlite'],
  extra: {
    DB_NAME: String(process.env.DB_NAME || 'runly.db')
  }
})
