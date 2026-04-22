import {formatDistance, formatPace, formatTime} from './formatters.utils'

describe('Given formatters util', () => {
  describe('When formatDistance is called', () => {
    describe('And distance is 0 m', () => {
      it('Then result should be "0 m"', () => {
        expect(formatDistance(0)).toBe('0 m')
      })
    })
    describe('And distance is 500 m', () => {
      it('Then result should be "500 m"', () => {
        expect(formatDistance(500)).toBe('500 m')
      })
    })
    describe('And distance is 999 m', () => {
      it('Then result should be "999 m"', () => {
        expect(formatDistance(999)).toBe('999 m')
      })
    })
    describe('And distance is 1000 m', () => {
      it('Then result should be "1.00 km"', () => {
        expect(formatDistance(1000)).toBe('1.00 km')
      })
    })
    describe('And distance is 1500 m', () => {
      it('Then result should be "1.50 km"', () => {
        expect(formatDistance(1500)).toBe('1.50 km')
      })
    })
    describe('And distance is 42195 m', () => {
      it('Then result should be "42.20 km"', () => {
        expect(formatDistance(42_195)).toBe('42.20 km')
      })
    })
  })
  describe('When formatPace is called', () => {
    describe('And pace is null', () => {
      it('Then result should be "--:--"', () => {
        expect(formatPace(null)).toBe('--:--')
      })
    })
    describe('And pace is Infinity', () => {
      it('Then result should be "--:--"', () => {
        expect(formatPace(Infinity)).toBe('--:--')
      })
    })
    describe('And pace is 5 min/km', () => {
      it('Then result should be "5\'00\""', () => {
        expect(formatPace(5)).toBe(`5'00"`)
      })
    })
    describe('And pace is 4.5 min/km', () => {
      it('Then result should be "4\'30\""', () => {
        expect(formatPace(4.5)).toBe(`4'30"`)
      })
    })
    describe('And pace is 5 min 5 sec per km', () => {
      it('Then result should be "5\'05\""', () => {
        expect(formatPace(5 + 5 / 60)).toBe(`5'05"`)
      })
    })
  })
  describe('When formatTime is called', () => {
    describe('And elapsed time is 0 ms', () => {
      it('Then result should be "00:00"', () => {
        expect(formatTime(0)).toBe('00:00')
      })
    })
    describe('And elapsed time is 59999 ms', () => {
      it('Then result should be "00:59" without hours', () => {
        expect(formatTime(59_999)).toBe('00:59')
      })
    })
    describe('And elapsed time is 90000 ms', () => {
      it('Then result should be "01:30"', () => {
        expect(formatTime(90_000)).toBe('01:30')
      })
    })
    describe('And elapsed time is 3600000 ms', () => {
      it('Then result should be "1:00:00"', () => {
        expect(formatTime(3_600_000)).toBe('1:00:00')
      })
    })
    describe('And elapsed time is 3723000 ms', () => {
      it('Then result should be "1:02:03"', () => {
        expect(formatTime(3_723_000)).toBe('1:02:03')
      })
    })
  })
})
