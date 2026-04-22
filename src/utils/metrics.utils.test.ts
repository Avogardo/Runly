import {calculatePace} from './metrics.utils'

describe('Given metrics util', () => {
  describe('When calculatePace is called', () => {
    describe('And distance is 0', () => {
      it('Then result should be null', () => {
        expect(calculatePace(0, 60_000)).toBeNull()
      })
    })
    describe('And distance is negative', () => {
      it('Then result should be null', () => {
        expect(calculatePace(-100, 60_000)).toBeNull()
      })
    })
    describe('And distance is 1000 m and elapsed time is 300000 ms', () => {
      it('Then result should be 5 min/km', () => {
        expect(calculatePace(1000, 300_000)).toBeCloseTo(5)
      })
    })
    describe('And distance is 5000 m and elapsed time is 1500000 ms', () => {
      it('Then result should be 5 min/km', () => {
        expect(calculatePace(5000, 1_500_000)).toBeCloseTo(5)
      })
    })
    describe('And distance is 10000 m and elapsed time is 2700000 ms', () => {
      it('Then result should be 4.5 min/km', () => {
        expect(calculatePace(10_000, 2_700_000)).toBeCloseTo(4.5)
      })
    })
    describe('And the same distance is covered in different times', () => {
      it('Then the slower run should have a higher pace value', () => {
        const fastPace = calculatePace(1000, 300_000)
        const slowPace = calculatePace(1000, 600_000)
        expect(slowPace).toBeGreaterThan(fastPace as number)
      })
    })
  })
})
