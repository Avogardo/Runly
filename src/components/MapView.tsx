import {useRef, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native'
import RNMapView, {Polyline, Marker} from 'react-native-maps'

import {getCurrentPosition} from '@/services/locationService'
import {Coordinate} from '@/types'
import {theme} from '@/ui'

type RunMapViewProps = {
  path: Coordinate[]
  followUser?: boolean
  // fit map to entire route
  staticMode?: boolean
}

export function RunMapView({path, followUser = false, staticMode = false}: RunMapViewProps) {
  const {t} = useTranslation()
  const mapRef = useRef<RNMapView>(null)
  const [initialLocation, setInitialLocation] = useState<Coordinate | null>(null)

  const lastCoord = path.length > 0 ? path[path.length - 1] : null
  const firstCoord = path.length > 0 ? path[0] : null

  useEffect(() => {
    if (path.length === 0) {
      getCurrentPosition()
        .then(setInitialLocation)
        .catch(() => {})
    }
  }, [path.length === 0])

  useEffect(() => {
    if (followUser && lastCoord && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: lastCoord.latitude,
          longitude: lastCoord.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        },
        500
      )
    }
  }, [followUser, lastCoord?.latitude, lastCoord?.longitude])

  useEffect(() => {
    if (staticMode && path.length >= 2 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        path.map((p) => ({latitude: p.latitude, longitude: p.longitude})),
        {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true
        }
      )
    }
  }, [staticMode, path.length])

  if (path.length === 0) {
    if (!initialLocation) {
      return (
        <View style={[styles.container, styles.placeholder]}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.placeholderText}>{t('map.label.loading')}</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <RNMapView
          style={styles.map}
          initialRegion={{
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <RNMapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          firstCoord
            ? {
                latitude: firstCoord.latitude,
                longitude: firstCoord.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              }
            : undefined
        }
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {path.length >= 2 && (
          <Polyline
            coordinates={path.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude
            }))}
            strokeColor={theme.accent}
            strokeWidth={4}
          />
        )}

        {firstCoord && (
          <Marker
            coordinate={{
              latitude: firstCoord.latitude,
              longitude: firstCoord.longitude
            }}
            title={t('map.label.markerStart')}
            pinColor="#34C759"
          />
        )}

        {lastCoord && path.length > 1 && (
          <Marker
            coordinate={{
              latitude: lastCoord.latitude,
              longitude: lastCoord.longitude
            }}
            title={t('map.label.markerCurrent')}
            pinColor="#007AFF"
          />
        )}
      </RNMapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 260,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    ...theme.glow(theme.accent, 0.15)
  },
  map: {
    flex: 1
  },
  placeholder: {
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  placeholderText: {
    color: theme.textSecondary,
    fontSize: 14
  }
})
