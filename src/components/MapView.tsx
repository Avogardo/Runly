import {useRef, useEffect, useState} from 'react'
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native'
import RNMapView, {Polyline, Marker} from 'react-native-maps'

import {getCurrentPosition} from '@/services/locationService'
import {Coordinate} from '@/types'

type RunMapViewProps = {
  path: Coordinate[]
  /** Czy mapa ma śledzić (animować kamerę) do aktualnej pozycji */
  followUser?: boolean
  /** Tryb statyczny — dopasuj mapę do całej trasy (np. historia) */
  staticMode?: boolean
}

export function RunMapView({path, followUser = false, staticMode = false}: RunMapViewProps) {
  const mapRef = useRef<RNMapView>(null)
  const [initialLocation, setInitialLocation] = useState<Coordinate | null>(null)

  const lastCoord = path.length > 0 ? path[path.length - 1] : null
  const firstCoord = path.length > 0 ? path[0] : null

  // Pobierz aktualną lokalizację na start (przed biegiem)
  useEffect(() => {
    if (path.length === 0) {
      getCurrentPosition()
        .then(setInitialLocation)
        .catch(() => {})
    }
  }, [path.length === 0])

  // Animuj kamerę do ostatniej pozycji w trybie follow
  useEffect(() => {
    if (followUser && lastCoord && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: lastCoord.latitude,
          longitude: lastCoord.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        },
        500 // animacja 500ms
      )
    }
  }, [followUser, lastCoord?.latitude, lastCoord?.longitude])

  // W trybie statycznym — dopasuj widok do całej trasy
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

  // Przed biegiem — pokaż mapę z aktualną lokalizacją
  if (path.length === 0) {
    if (!initialLocation) {
      return (
        <View style={[styles.container, styles.placeholder]}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.placeholderText}>Ładowanie mapy...</Text>
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
        {/* Trasa */}
        {path.length >= 2 && (
          <Polyline
            coordinates={path.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude
            }))}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}

        {/* Marker startu */}
        {firstCoord && (
          <Marker
            coordinate={{
              latitude: firstCoord.latitude,
              longitude: firstCoord.longitude
            }}
            title="Start"
            pinColor="#34C759"
          />
        )}

        {/* Marker aktualnej pozycji */}
        {lastCoord && path.length > 1 && (
          <Marker
            coordinate={{
              latitude: lastCoord.latitude,
              longitude: lastCoord.longitude
            }}
            title="Aktualna pozycja"
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
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20
  },
  map: {
    flex: 1
  },
  placeholder: {
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  placeholderText: {
    color: '#8E8E93',
    fontSize: 14
  }
})
