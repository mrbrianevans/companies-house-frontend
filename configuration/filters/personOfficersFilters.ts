// generated filter config from database using groovy script
import { FilterDatatype } from '../filterDatatypes'
import { IFilterOption } from '../../types/IFilters'
import { FilterComparison } from '../filterComparisons'

export const personOfficersFilters: IFilterOption[] = [
  {
    columnName: 'person_number',
    dataType: FilterDatatype.string,
    field: 'person number',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'post_code',
    dataType: FilterDatatype.string,
    field: 'post code',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'birth_date',
    dataType: FilterDatatype.date,
    field: 'birth date',
    possibleComparisons: [FilterComparison.AFTER, FilterComparison.BEFORE, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'title',
    dataType: FilterDatatype.string,
    field: 'title',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'forenames',
    dataType: FilterDatatype.string,
    field: 'forenames',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'surname',
    dataType: FilterDatatype.string,
    field: 'surname',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'honours',
    dataType: FilterDatatype.string,
    field: 'honours',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'care_of',
    dataType: FilterDatatype.string,
    field: 'care of',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'po_box',
    dataType: FilterDatatype.string,
    field: 'po box',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'address_line_1',
    dataType: FilterDatatype.string,
    field: 'address line 1',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'address_line_2',
    dataType: FilterDatatype.string,
    field: 'address line 2',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'post_town',
    dataType: FilterDatatype.string,
    field: 'post town',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'county',
    dataType: FilterDatatype.string,
    field: 'county',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'country',
    dataType: FilterDatatype.string,
    field: 'country',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'occupation',
    dataType: FilterDatatype.string,
    field: 'occupation',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'nationality',
    dataType: FilterDatatype.string,
    field: 'nationality',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'usual_residential_country',
    dataType: FilterDatatype.string,
    field: 'usual residential country',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'officer_name_vector',
    dataType: FilterDatatype.string,
    field: 'officer name vector',
    possibleComparisons: [FilterComparison.MATCHES]
  }
].map((filter) => Object.freeze(filter))
