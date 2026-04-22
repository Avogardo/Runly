import {Coordinate} from '@/types'

import {calculateTotalDistance} from './metrics.utils'

const pointA: Coordinate = {latitude: 52.0, longitude: 21.0, timestamp: 0}
const pointB: Coordinate = {latitude: 52.001, longitude: 21.0, timestamp: 1000}
const pointC: Coordinate = {latitude: 52.002, longitude: 21.0, timestamp: 2000}

describe('Given run metrics util', () => {
  describe('When calculateTotalDistance is called', () => {
    describe('And path is empty', () => {
      it('Then result should be 0', () => {
        expect(calculateTotalDistance([])).toBe(0)
      })
    })
    describe('And path has a single point', () => {
      it('Then result should be 0', () => {
        expect(calculateTotalDistance([pointA])).toBe(0)
      })
    })
    describe('And path has two points ~111 m apart', () => {
      it('Then result should be approximately 111 m', () => {
        const dist = calculateTotalDistance([pointA, pointB])
        expect(dist).toBeGreaterThan(100)
        expect(dist).toBeLessThan(120)
      })
    })
    describe('And path has three points each ~111 m apart', () => {
      it('Then result should equal the sum of individual segments', () => {
        const distAB = calculateTotalDistance([pointA, pointB])
        const distBC = calculateTotalDistance([pointB, pointC])
        const distABC = calculateTotalDistance([pointA, pointB, pointC])
        expect(distABC).toBeCloseTo(distAB + distBC, 5)
      })
    })
    describe('And path contains a near-duplicate point within 3 m', () => {
      it('Then result should be the same as without the noisy point', () => {
        const nearA: Coordinate = {latitude: 52.00001, longitude: 21.0, timestamp: 500}
        const distWithNoise = calculateTotalDistance([pointA, nearA, pointB])
        const distClean = calculateTotalDistance([pointA, pointB])
        expect(distWithNoise).toBeCloseTo(distClean, 5)
      })
    })
  })
})
