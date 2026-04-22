import {Coordinate} from '@/types'

import {haversineDistance, filterGpsNoise} from './gps.utils'

const pointA: Coordinate = {latitude: 52.0, longitude: 21.0, timestamp: 0}
const pointB: Coordinate = {latitude: 52.001, longitude: 21.0, timestamp: 1000}
const pointC: Coordinate = {latitude: 52.002, longitude: 21.0, timestamp: 2000}

describe('Given gps util', () => {
  describe('When haversineDistance is called', () => {
    describe('And both points are identical', () => {
      it('Then result should be 0', () => {
        expect(haversineDistance(pointA, pointA)).toBe(0)
      })
    })
    describe('And points are 0.001 degree apart in latitude', () => {
      it('Then result should be approximately 111 m', () => {
        const dist = haversineDistance(pointA, pointB)
        expect(dist).toBeGreaterThan(100)
        expect(dist).toBeLessThan(120)
      })
    })
    describe('And point arguments are swapped', () => {
      it('Then result should be the same in both directions', () => {
        expect(haversineDistance(pointA, pointB)).toBeCloseTo(haversineDistance(pointB, pointA))
      })
    })
    describe('And second point is twice as far as a third point', () => {
      it('Then result should be approximately twice the shorter distance', () => {
        const ab = haversineDistance(pointA, pointB)
        const ac = haversineDistance(pointA, pointC)
        expect(ac).toBeCloseTo(ab * 2, 0)
      })
    })
  })
  describe('When filterGpsNoise is called', () => {
    describe('And path is empty', () => {
      it('Then result should be an empty array', () => {
        expect(filterGpsNoise([])).toEqual([])
      })
    })
    describe('And path has a single point', () => {
      it('Then result should contain that point', () => {
        expect(filterGpsNoise([pointA])).toEqual([pointA])
      })
    })
    describe('And path contains a point ~1 m from the previous one', () => {
      it('Then the near-duplicate should be filtered out', () => {
        const nearPoint: Coordinate = {latitude: 52.00001, longitude: 21.0, timestamp: 500}
        const result = filterGpsNoise([pointA, nearPoint])
        expect(result).toHaveLength(1)
        expect(result[0]).toEqual(pointA)
      })
    })
    describe('And path contains points ~111 m apart', () => {
      it('Then all points should be kept', () => {
        const result = filterGpsNoise([pointA, pointB])
        expect(result).toHaveLength(2)
      })
    })
    describe('And path contains a mix of noisy and valid points', () => {
      it('Then only valid points should be kept', () => {
        const tooClose: Coordinate = {latitude: 52.00001, longitude: 21.0, timestamp: 500}
        const result = filterGpsNoise([pointA, tooClose, pointB, pointC])
        expect(result).toEqual([pointA, pointB, pointC])
      })
    })
  })
})
