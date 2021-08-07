// this file is located in: /ajax/user/getUserFilterId.ts

import { GetUserFilterIdOutput, GetUserFilterIdParams } from '../../interface/user/getUserFilterId'

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
    .then(async (r) => {
      if (r.status === 200) return r.json()
      console.error('Failed to call getUserFilterId API endpoint. Code:', r.status, 'Response:', await r.text())
      return null
    })
    .catch((e) => console.error('Failed to call getUserFilterId'))
}
