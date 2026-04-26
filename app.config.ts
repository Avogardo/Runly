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
    package: 'com.runly.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0B0B1E'
    },
    edgeToEdgeEnabled: true,
    config: {
      googleMaps: {
        apiKey: String(process.env.GOOGLE_MAPS_API_KEY || '')
      }
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router',
    'expo-sqlite',
    'expo-secure-store',
    [
      'expo-location',
      {
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
        locationAlwaysAndWhenInUsePermission:
          'Allow Runly to access your location to track your runs even when the app is in the background.'
      }
    ]
  ],
  extra: {
    DB_NAME: String(process.env.DB_NAME || 'runly.db'),
    API_BASE_URL: String(process.env.API_BASE_URL || 'http://localhost:3000')
  }
})
