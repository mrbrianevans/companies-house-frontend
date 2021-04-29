import { IFilter } from '../types/IFilters'

const hash = require('object-hash')
export const getFilterId = (filters: IFilter[]) => {
  return encodeURIComponent(hash(filters, { algorithm: 'md5', encoding: 'hex' }))
}
