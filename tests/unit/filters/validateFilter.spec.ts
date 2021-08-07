import { IFilterValue } from '../../../types/IFilters'
import { FilterComparison } from '../../../configuration/filterComparisons'
import { validateFilter } from '../../../helpers/filters/validateFilter'
import { FilterCategory } from '../../../types/FilterCategory'
import { expect } from 'chai'

describe('test the validate filter method to correctly determine if a filter value is valid', () => {
  it('should return true for valid officer filters', () => {
    const validFilters: IFilterValue[] = [
      {
        field: 'birth date',
        values: [Date.now()],
        comparison: FilterComparison.BEFORE,
        exclude: false
      },
      {
        field: 'officer name vector',
        values: ['henry', 'james'],
        comparison: FilterComparison.MATCHES,
        exclude: false
      },
      {
        field: 'nationality',
        values: ['malawian'],
        comparison: FilterComparison.CONTAINS,
        exclude: false
      },
      {
        field: 'occupation',
        values: ['accountant'],
        comparison: FilterComparison.CONTAINS,
        exclude: false
      }
    ]
    validFilters.forEach((filter) => {
      const filterIsValid = validateFilter(filter, FilterCategory.OFFICER)
      expect(filterIsValid).to.be.true
    })
  })
  it('should return false for invalid officer filters', () => {
    const validFilters = [
      {
        field: 'birth date',
        values: [new Date()],
        comparison: FilterComparison.BEFORE,
        exclude: false
      },
      {
        field: 'name',
        values: [3, 2],
        comparison: FilterComparison.MATCHES,
        exclude: false
      },
      {
        field: 'nationality',
        values: [''],
        comparison: FilterComparison.CONTAINS,
        exclude: 'yes'
      },
      {
        field: 'occupation',
        values: ['accountant'],
        comparison: FilterComparison.IS_BETWEEN,
        exclude: false
      }
    ]
    validFilters.forEach((filter) => {
      const filterIsValid = validateFilter(filter as IFilterValue, FilterCategory.OFFICER)
      expect(filterIsValid).to.be.false
    })
  })
})
