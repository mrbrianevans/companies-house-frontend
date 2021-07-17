// this file is located in: /ajax/filter/getFilterId.ts

import { GetFilterIdParams, GetFilterIdOutput } from '../../interface/filter/getFilterId'

/** Frontend AJAX call to getFilterId method on the backend
 *
 * @example
 * const { id } = await fetchGetFilterId({ filters, category })
 */
export const fetchGetFilterId: (params: GetFilterIdParams) => Promise<GetFilterIdOutput> = async ({
  filters,
  category
}) => {
  return await fetch('/api/filter/getFilterId', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ filters, category })
  })
    .then((r) => {
      if (r.status === 200) return r.json()
      console.error('Failed to call getFilterId API endpoint, status', r.status)
      return null
    })
    .catch((e) => {
      console.error(e)
      return null
    })
}
