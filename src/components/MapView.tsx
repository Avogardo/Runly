import {FC, useRef, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native'
import RNMapView, {Polyline, Marker} from 'react-native-maps'

import {getCurrentPosition} from '@/services'
import {Coordinate} from '@/types'
import {theme} from '@/ui'

type RunMapViewProps = {
  path: Coordinate[]
  followUser?: boolean
  // fit map to entire route
  staticMode?: boolean
}

export const RunMapView: FC<RunMapViewProps> = ({path, followUser = false, staticMode = false}) => {
  const {t} = useTranslation()
  const mapRef = useRef<RNMapView>(null)
  const [initialLocation, setInitialLocation] = useState<Coordinate | null>(null)

  const firstCoordinate = path.length > 0 ? path[0] : null
  const lastCoordinate = path.length > 0 ? path.at(-1) : null
  const isPathEmpty = path.length === 0

  useEffect(() => {
    if (isPathEmpty) {
      getCurrentPosition()
        .then(setInitialLocation)
        .catch(() => {})
    }
  }, [isPathEmpty])

  useEffect(() => {
    if (followUser && lastCoordinate && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: lastCoordinate.latitude,
          longitude: lastCoordinate.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        },
        500
      )
    }
  }, [followUser, lastCoordinate?.latitude, lastCoordinate?.longitude])

  useEffect(() => {
    if (staticMode && path.length >= 2 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        path.map(({latitude, longitude}) => ({latitude, longitude})),
        {
          edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
          animated: true
        }
      )
    }
  }, [staticMode, path.length])

  if (isPathEmpty) {
    if (!initialLocation) {
      return (
        <View style={[styles.container, styles.placeholder]}>
          <ActivityIndicator size="small" color={theme.accent} />
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
          firstCoordinate
            ? {
                latitude: firstCoordinate.latitude,
                longitude: firstCoordinate.longitude,
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

        {firstCoordinate && (
          <Marker
            coordinate={{
              latitude: firstCoordinate.latitude,
              longitude: firstCoordinate.longitude
            }}
            title={t('map.label.markerStart')}
            pinColor={theme.success}
          />
        )}

        {lastCoordinate && path.length > 1 && (
          <Marker
            coordinate={{
              latitude: lastCoordinate.latitude,
              longitude: lastCoordinate.longitude
            }}
            title={t('map.label.markerCurrent')}
            pinColor={theme.accent}
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
