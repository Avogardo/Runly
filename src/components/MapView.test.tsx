import React from 'react'
import {render, screen, waitFor} from '@testing-library/react-native'

import {RunMapView} from './MapView'
import {Coordinate} from '@/types'
import {getCurrentPosition} from '@/services'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key})
}))

jest.mock('react-native-maps', () => {
  const {View} = require('react-native')
  return {
    __esModule: true,
    default: ({children, testID, ...rest}: any) => <View testID={testID ?? 'map-view'} {...rest}>{children}</View>,
    Polyline: (props: any) => <View testID="polyline" {...props} />,
    Marker: ({title, ...rest}: any) => <View testID={`marker-${title}`} {...rest} />
  }
})

jest.mock('@/services', () => ({
  getCurrentPosition: jest.fn()
}))

const mockGetCurrentPosition = getCurrentPosition as jest.Mock

const pointA: Coordinate = {latitude: 52.0, longitude: 21.0, timestamp: 0}
const pointB: Coordinate = {latitude: 52.001, longitude: 21.0, timestamp: 1000}

describe('Given RunMapView component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('When path is empty and location has not resolved yet', () => {
    describe('And getCurrentPosition is pending', () => {
      it('Then shows a loading indicator with loading text', () => {
        mockGetCurrentPosition.mockRejectedValue(new Error('location unavailable'))
        render(<RunMapView path={[]} />)
        expect(screen.getByText('map.label.loading')).toBeTruthy()
      })
    })
  })

  describe('When path is empty and location has resolved', () => {
    describe('And getCurrentPosition returns a valid coordinate', () => {
      it('Then shows the map instead of the loading indicator', async () => {
        mockGetCurrentPosition.mockResolvedValue(pointA)
        render(<RunMapView path={[]} />)
        await waitFor(() => {
          expect(screen.queryByText('map.label.loading')).toBeNull()
          expect(screen.getByTestId('map-view')).toBeTruthy()
        })
      })
    })
  })

  describe('When path has a single point', () => {
    describe('And path contains one coordinate', () => {
      it('Then shows the map without a polyline', () => {
        render(<RunMapView path={[pointA]} />)
        expect(screen.getByTestId('map-view')).toBeTruthy()
        expect(screen.queryByTestId('polyline')).toBeNull()
      })
    })
  })

  describe('When path has two or more points', () => {
    describe('And path contains pointA and pointB', () => {
      it('Then shows the map', () => {
        render(<RunMapView path={[pointA, pointB]} />)
        expect(screen.getByTestId('map-view')).toBeTruthy()
      })

      it('Then renders a polyline for the route', () => {
        render(<RunMapView path={[pointA, pointB]} />)
        expect(screen.getByTestId('polyline')).toBeTruthy()
      })

      it('Then renders a start marker', () => {
        render(<RunMapView path={[pointA, pointB]} />)
        expect(screen.getByTestId('marker-map.label.markerStart')).toBeTruthy()
      })

      it('Then renders a current position marker', () => {
        render(<RunMapView path={[pointA, pointB]} />)
        expect(screen.getByTestId('marker-map.label.markerCurrent')).toBeTruthy()
      })
    })
  })
})


