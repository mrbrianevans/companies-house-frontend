// this file is located in: /ajax/filter/getItemById.ts

import { GetItemByIdParams, GetItemByIdOutput } from '../../interface/filter/getItemById'

/** Frontend AJAX call to getItemById method on the backend
 *
 * @example
 * const { item } = await $END$fetchGetItemById({ id, category })
 */
export const fetchGetItemById: (params: GetItemByIdParams) => Promise<GetItemByIdOutput> = async ({ id, category }) => {
  return await fetch('/api/filter/getItemById', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id, category })
  })
    .then((r) => {
      if (r.status === 200) return r.json()
      console.error('Failed to call getItemById API endpoint')
      return null
    })
    .catch(console.error)
}
