import { expect } from 'chai'
import { splitDate } from '../../../helpers/splitDate'

describe('split timestamp into day, month and year', function () {
  it('should return the expected date for a given timestamp', () => {
    const result = splitDate(new Date('2021-05-05').valueOf())
    expect(result.day).to.equal(5)
    expect(result.month).to.be.a('string')
    expect(result.month).to.equal('May')
    expect(result.year).to.equal(2021)
  })
  it('should return the expected date for a timestamp before 1970', () => {
    const result = splitDate(new Date('1969-01-21').valueOf())
    expect(result.day).to.equal(21)
    expect(result.month).to.be.a('string')
    expect(result.month).to.equal('January')
    expect(result.year).to.equal(1969)
  })
  it('should return the expected date for a timestamp in the future', () => {
    const result = splitDate(new Date('2031-07-13').valueOf())
    expect(result.day).to.equal(13)
    expect(result.month).to.be.a('string')
    expect(result.month).to.equal('July')
    expect(result.year).to.equal(2031)
  })
})
