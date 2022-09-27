import { searchOfficersByName } from '../../../../interface/officer/searchOfficersByName'
import { expect } from 'chai'

describe('search for an officer by a common name', async function () {
  before(async function () {
    this.slow(5000)
    // stores results on 'this' object to avoid duplicate function calls
    this.data = await searchOfficersByName({ query: 'david' })
  })
  it('should return at least one result', async function () {
    expect(this.data.results).length.to.be.greaterThan(0)
  })
  it('should return less than a hundred results', async function () {
    expect(this.data.results).length.to.be.lessThan(100)
  })
})

describe('search for an officer by full name', async function () {
  it('should give results without erring', async function () {
    const { results } = await searchOfficersByName({ query: 'david smith' })
    // test that its greater than zero. for such a common name the only way its length zero, is if there was an error
    expect(results).length.to.be.greaterThan(0)
  })
})
