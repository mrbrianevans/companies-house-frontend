// this file is located in: /ajax/filter/cacheResults.ts

import { CacheResultsParams, CacheResultsOutput } from '../../interface/filter/cacheResults'

/** Frontend AJAX call to cacheResults method on the backend
 *
 * @example
 * const {  } = await $END$fetchCacheResults({ filters, category })
 */
export async function fetchCacheResults<FilterResultsType>({
  filters,
  category,
  id
}: CacheResultsParams): Promise<CacheResultsOutput<FilterResultsType>> {
  return await fetch('/api/filter/cacheResults', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ filters, category, id })
  })
    .then((r) => {
      if (r.status === 200) return r.json()
      console.error('Failed to call cacheResults API endpoint with id=' + id)
      return null
    })
    .catch(console.error)
}
