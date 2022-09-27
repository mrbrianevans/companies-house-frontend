export enum FilterComparison {
  MATCHES,
  GREATER_THAN,
  LESS_THAN,
  REFERENCES,
  BEFORE,
  AFTER,
  IS_BETWEEN,
  CONTAINS,
  EQUALS
}
type FilterComparisonProperties = {
  sqlOperator: string
  english: string
}

export const FilterComparisonsMap = new Map<FilterComparison, FilterComparisonProperties>([
  [FilterComparison.CONTAINS, { sqlOperator: 'ILIKE', english: 'contains' }],
  [FilterComparison.MATCHES, { sqlOperator: '@@', english: 'matches' }],
  [FilterComparison.GREATER_THAN, { sqlOperator: '>', english: 'greater than' }],
  [FilterComparison.LESS_THAN, { sqlOperator: '<', english: 'less than' }],
  [FilterComparison.BEFORE, { sqlOperator: '<', english: 'before' }],
  [FilterComparison.AFTER, { sqlOperator: '>', english: 'after' }],
  [FilterComparison.IS_BETWEEN, { sqlOperator: 'BETWEEN', english: 'is between' }],
  [FilterComparison.REFERENCES, { sqlOperator: 'REFERENCES', english: 'references' }],
  [FilterComparison.EQUALS, { sqlOperator: '=', english: 'is' }]
])
