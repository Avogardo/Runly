import React from 'react'
import {render, screen} from '@testing-library/react-native'

import {IntervalBanner} from './IntervalBanner'
import {IntervalType} from '@/types'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({t: (key: string) => key})
}))

jest.mock('expo-blur', () => {
  const {View} = require('react-native')
  return {BlurView: View}
})

describe('Given IntervalBanner component', () => {
  describe('When finished prop is true', () => {
    describe('And intervalType is Heavy and timeRemainingMs is 30000', () => {
      it('Then shows the completed message', () => {
        render(
          <IntervalBanner
            intervalType={IntervalType.Heavy}
            timeRemainingMs={30_000}
            progress="3/5"
            finished={true}
          />
        )
        expect(screen.getByText(/interval\.label\.completed/)).toBeTruthy()
      })

      it('Then does not show a countdown', () => {
        render(
          <IntervalBanner
            intervalType={IntervalType.Heavy}
            timeRemainingMs={30_000}
            progress="3/5"
            finished={true}
          />
        )
        expect(screen.queryByText('00:30')).toBeNull()
      })
    })
  })

  describe('When intervalType is Heavy', () => {
    describe('And finished is false and timeRemainingMs is 30000', () => {
      it('Then shows the heavy interval label', () => {
        render(
          <IntervalBanner
            intervalType={IntervalType.Heavy}
            timeRemainingMs={30_000}
            progress="1/5"
            finished={false}
          />
        )
        expect(screen.getByText('interval.label.heavy')).toBeTruthy()
      })

      it('Then shows the formatted countdown', () => {
        render(
          <IntervalBanner
            intervalType={IntervalType.Heavy}
            timeRemainingMs={30_000}
            progress="1/5"
            finished={false}
          />
        )
        expect(screen.getByText('00:30')).toBeTruthy()
      })

      it('Then shows the progress string', () => {
        render(
          <IntervalBanner
            intervalType={IntervalType.Heavy}
            timeRemainingMs={30_000}
            progress="1/5"
            finished={false}
          />
        )
        expect(screen.getByText('1/5')).toBeTruthy()
      })
    })
  })

  describe('When intervalType is Light', () => {
    describe('And finished is false and timeRemainingMs is 60000', () => {
      it('Then shows the light interval label', () => {
        render(
          <IntervalBanner
            intervalType={IntervalType.Light}
            timeRemainingMs={60_000}
            progress="2/5"
            finished={false}
          />
        )
        expect(screen.getByText('interval.label.light')).toBeTruthy()
      })

      it('Then shows the formatted countdown', () => {
        render(
          <IntervalBanner
            intervalType={IntervalType.Light}
            timeRemainingMs={60_000}
            progress="2/5"
            finished={false}
          />
        )
        expect(screen.getByText('01:00')).toBeTruthy()
      })

      it('Then does not show the heavy label', () => {
        render(
          <IntervalBanner
            intervalType={IntervalType.Light}
            timeRemainingMs={60_000}
            progress="2/5"
            finished={false}
          />
        )
        expect(screen.queryByText('interval.label.heavy')).toBeNull()
      })
    })
  })
})

