import { IFilterValue } from '../../../types/IFilters'
import { FilterComparison } from '../../../configuration/filterComparisons'
import { validateFilter, filtersAreValid } from '../../../helpers/filters/validateFilter'
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
        field: 'name',
        values: ['henry', 'james'],
        comparison: FilterComparison.MATCHES,
        exclude: false
      },
      {
        field: 'nationality',
        values: ['malawian'],
        comparison: FilterComparison.EQUALS,
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
      expect(filterIsValid).to.be.equal(true, 'Filter: ' + JSON.stringify(filter))
    })
  })
  it('should return false for invalid officer filters', () => {
    const invalidFilters = [
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
    invalidFilters.forEach((filter) => {
      const filterIsValid = validateFilter(filter as IFilterValue, FilterCategory.OFFICER)
      expect(filterIsValid).to.be.equal(false, 'Filter: ' + JSON.stringify(filter))
    })
  })

  it('should fail validation for invalid officer filters', () => {
    const filters: IFilterValue[] = [
      {
        comparison: 7,
        exclude: false,
        field: 'firstname',
        values: ['bruce']
      },
      {
        comparison: 7,
        exclude: false,
        field: 'usual country of residence',
        values: ['england', 'united kingdom']
      },
      {
        comparison: 7,
        exclude: false,
        field: 'title',
        values: ['mr']
      },
      {
        comparison: 7,
        exclude: false,
        field: 'nationality',
        values: ['british', 'south african']
      },
      {
        comparison: 7,
        exclude: false,
        field: 'occupation',
        values: ['accountant']
      },
      {
        comparison: 6,
        exclude: false,
        field: 'birth date',
        values: [0, 315532800000]
      },
      {
        comparison: 0,
        exclude: false,
        field: 'name',
        values: ['bruce']
      }
    ]
    const valid = filtersAreValid({ filters, category: FilterCategory.OFFICER })
    expect(valid).to.be.equal(false, "You can't filter nationality with contains comparison")
  })
})
