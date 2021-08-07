// this file is located in: /ajax/filter/countResults.ts

import { CountResultsOutput, CountResultsParams } from '../../interface/filter/countResults'

/** Frontend AJAX call to countResults method on the backend
 *
 * @example
 * await fetchCountResults({ filters, category })
 */
export const fetchCountResults: (params: CountResultsParams) => Promise<CountResultsOutput> = async ({
  filters,
  category
}) => {
  return await fetch('/api/filter/countResults', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ filters, category })
  })
    .then((r) => {
      console.log('count results returned:', r.status)
      if (r.status === 200) return r.json()
      console.error('Failed to call countResults API endpoint')
      return null
    })
    .catch(console.error)
}
