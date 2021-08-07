// generated filter config from database using groovy script
import { FilterDatatype } from '../filterDatatypes'
import { IFilterOption } from '../../types/IFilters'
import { FilterComparison } from '../filterComparisons'

export const personOfficersFilters: IFilterOption[] = [
  {
    columnName: 'officer_name_vector',
    dataType: FilterDatatype.string,
    field: 'name',
    possibleComparisons: [FilterComparison.MATCHES]
  },
  {
    columnName: 'birth_date',
    dataType: FilterDatatype.date,
    field: 'birth date',
    possibleComparisons: [FilterComparison.AFTER, FilterComparison.BEFORE, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'occupation',
    dataType: FilterDatatype.string,
    field: 'occupation',
    possibleComparisons: [FilterComparison.CONTAINS],
    suggestions: ['DIRECTOR', 'ACCOUNTANT', 'MANAGING DIRECTOR', 'TECHNICAL DIRECTOR', 'ENGINEER']
  },
  {
    columnName: 'nationality',
    dataType: FilterDatatype.string,
    field: 'nationality',
    possibleComparisons: [FilterComparison.EQUALS],
    suggestions: [
      { label: 'British', value: 'BRITISH' },
      { label: 'English', value: 'ENGLISH' },
      { label: 'Irish', value: 'IRISH' },
      { label: 'Indian', value: 'INDIAN' },
      { label: 'German', value: 'GERMAN' },
      { label: 'Romanian', value: 'ROMANIAN' },
      { label: 'Polish', value: 'POLISH' },
      { label: 'American', value: 'AMERICAN' },
      { label: 'Chinese', value: 'CHINESE' }
    ],
    forceSuggestions: true
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
    field: 'firstname',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'surname',
    dataType: FilterDatatype.string,
    field: 'surname',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'usual_residential_country',
    dataType: FilterDatatype.string,
    field: 'usual country of residence',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'address_line_1',
    dataType: FilterDatatype.string,
    field: 'address line 1',
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
    columnName: 'post_code',
    dataType: FilterDatatype.string,
    field: 'post code',
    possibleComparisons: [FilterComparison.CONTAINS]
  }
].map((filter) => Object.freeze(filter))
