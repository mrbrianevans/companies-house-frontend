// this file is located in: /ajax/user/getUserFilterId.ts

import { GetUserFilterIdParams, GetUserFilterIdOutput } from '../../interface/user/getUserFilterId'

/** Frontend AJAX call to getUserFilterId method on the backend
 *
 * @example
 * const { userFilterId } = await $END$fetchGetUserFilterId({ cachedFilterId })
 */
export const fetchGetUserFilterId: (params: GetUserFilterIdParams) => Promise<GetUserFilterIdOutput> = async ({
  cachedFilterId
}) => {
  return await fetch('/api/user/getUserFilterId', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ cachedFilterId })
  })
    .then((r) => {
      if (r.status === 200) return r.json()
      console.error('Failed to call getUserFilterId API endpoint')
      return null
    })
    .catch(console.error)
}
