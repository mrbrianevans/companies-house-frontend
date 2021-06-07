// this file is located in: /ajax/filter/countResults.ts

import { CountResultsParams, CountResultsOutput } from '../../interface/filter/countResults'

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
    .then((r) => r.json())
    .catch(console.error)
}
