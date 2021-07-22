import { searchOfficersByName } from '../../../../interface/officer/searchOfficersByName'
import { expect } from 'chai'

describe('search for an officer by a common name', () => {
  before(() => {})
  it('should return at least a one result', async () => {
    const results = await searchOfficersByName({ query: 'alex' })
    expect(results.officers).length.to.be.greaterThan(0)
    expect(results.officers).length.to.be.lessThan(200)
  })
  it('should return at least a one result', async () => {
    const results = await searchOfficersByName({ query: 'alex' })
    expect(results.officers).length.to.be.greaterThan(0)
    expect(results.officers).length.to.be.lessThan(200)
  })
})
