import React from 'react'
import {render, screen} from '@testing-library/react-native'

import {StatsBar} from './StatsBar'

jest.mock('expo-blur', () => {
  const {View} = require('react-native')
  return {BlurView: View}
})

describe('Given StatsBar component', () => {
  describe('When rendered with a single stat', () => {
    describe('And stat has value "5.20 km" and label "Distance"', () => {
      it('Then renders the value', () => {
        render(<StatsBar stats={[{label: 'Distance', value: '5.20 km'}]} />)
        expect(screen.getByText('5.20 km')).toBeTruthy()
      })

      it('Then renders the label', () => {
        render(<StatsBar stats={[{label: 'Distance', value: '5.20 km'}]} />)
        expect(screen.getByText('Distance')).toBeTruthy()
      })
    })
  })

  describe('When rendered with multiple stats', () => {
    describe('And stats contain distance, time, and pace', () => {
      const stats = [
        {label: 'Distance', value: '5.20 km'},
        {label: 'Time', value: '25:00'},
        {label: 'Pace', value: "5'00\""}
      ]

      it('Then renders all values', () => {
        render(<StatsBar stats={stats} />)
        expect(screen.getByText('5.20 km')).toBeTruthy()
        expect(screen.getByText('25:00')).toBeTruthy()
        expect(screen.getByText("5'00\"")).toBeTruthy()
      })

      it('Then renders all labels', () => {
        render(<StatsBar stats={stats} />)
        expect(screen.getByText('Distance')).toBeTruthy()
        expect(screen.getByText('Time')).toBeTruthy()
        expect(screen.getByText('Pace')).toBeTruthy()
      })
    })
  })

  describe('When rendered with an empty stats array', () => {
    describe('And stats is []', () => {
      it('Then renders without error', () => {
        expect(() => render(<StatsBar stats={[]} />)).not.toThrow()
      })
    })
  })
})

