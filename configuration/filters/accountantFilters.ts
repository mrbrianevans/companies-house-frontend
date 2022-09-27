// generated filter config from database using groovy script
import { FilterComparison } from '../filterComparisons'
import { FilterDatatype } from '../filterDatatypes'
import { IFilterOption } from '../../types/IFilters'

export const accountantFilters: IFilterOption[] = [
  {
    columnName: 'name_on_accounts',
    dataType: FilterDatatype.string,
    field: 'name on accounts',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'company_number',
    dataType: FilterDatatype.string,
    field: 'company number',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'software',
    dataType: FilterDatatype.string,
    field: 'software',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'number_of_clients',
    dataType: FilterDatatype.number,
    field: 'number of clients',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'registered_name',
    dataType: FilterDatatype.string,
    field: 'registered name',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'streetaddress',
    dataType: FilterDatatype.string,
    field: 'streetaddress',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'county',
    dataType: FilterDatatype.string,
    field: 'county',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'area',
    dataType: FilterDatatype.string,
    field: 'area',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'country',
    dataType: FilterDatatype.string,
    field: 'country',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'postcode',
    dataType: FilterDatatype.string,
    field: 'postcode',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'company_type',
    dataType: FilterDatatype.string,
    field: 'company type',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'country_of_origin',
    dataType: FilterDatatype.string,
    field: 'country of origin',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'status',
    dataType: FilterDatatype.string,
    field: 'status',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'date_of_creation',
    dataType: FilterDatatype.date,
    field: 'date of creation',
    possibleComparisons: [FilterComparison.AFTER, FilterComparison.BEFORE, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'balance_sheet_date',
    dataType: FilterDatatype.date,
    field: 'balance sheet date',
    possibleComparisons: [FilterComparison.AFTER, FilterComparison.BEFORE, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'accountants',
    dataType: FilterDatatype.string,
    field: 'accountants',
    possibleComparisons: [FilterComparison.CONTAINS]
  },
  {
    columnName: 'employees',
    dataType: FilterDatatype.number,
    field: 'employees',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'current_assets',
    dataType: FilterDatatype.number,
    field: 'current assets',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'cash_at_bank',
    dataType: FilterDatatype.number,
    field: 'cash at bank',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'debtors',
    dataType: FilterDatatype.number,
    field: 'debtors',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'creditors',
    dataType: FilterDatatype.number,
    field: 'creditors',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'fixed_assets',
    dataType: FilterDatatype.number,
    field: 'fixed assets',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'net_assets',
    dataType: FilterDatatype.number,
    field: 'net assets',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'total_assets_less_current_liabilities',
    dataType: FilterDatatype.number,
    field: 'total assets less current liabilities',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'equity',
    dataType: FilterDatatype.number,
    field: 'equity',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'revenue',
    dataType: FilterDatatype.number,
    field: 'revenue',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'profit',
    dataType: FilterDatatype.number,
    field: 'profit',
    possibleComparisons: [FilterComparison.GREATER_THAN, FilterComparison.LESS_THAN, FilterComparison.IS_BETWEEN]
  },
  {
    columnName: 'officers',
    dataType: FilterDatatype.string,
    field: 'officers',
    possibleComparisons: [FilterComparison.CONTAINS]
  }
].map((filter) => Object.freeze(filter))
