import { IFilterConfig } from '../types/IFilterConfig'
import { FilterComparison } from './filterComparisons'
import { FilterDatatype } from './filterDatatypes'

export const officerFilterConfig: IFilterConfig = Object.freeze({
  urlPath: 'officer',
  labelPlural: 'officers',
  labelSingular: 'officer',
  main_table: 'person_officers',
  operation_code: 'download_officer_records',
  uniqueIdentifier: 'person_number',
  viewItemUrl: '/officer/',
  filters: [
    {
      columnName: 'birth_date',
      dataType: FilterDatatype.date,
      field: 'date of birth',
      possibleComparisons: [FilterComparison.AFTER, FilterComparison.BEFORE, FilterComparison.IS_BETWEEN]
    },
    {
      columnName: 'officer_name_vector',
      dataType: FilterDatatype.string,
      field: 'name',
      possibleComparisons: [FilterComparison.MATCHES]
    }
  ].map((filter) => Object.freeze(filter))
})
