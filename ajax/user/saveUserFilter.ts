// this file is located in: /ajax/user/saveUserFilter.ts

import { SaveUserFilterOutput, SaveUserFilterParams } from '../../interface/user/saveUserFilter'

/** Frontend AJAX call to saveUserFilter method on the backend
 *
 * @example
 * const { userFilterId } = await fetchSaveUserFilter({ savedFilterId })
 */
export const fetchSaveUserFilter: (params: SaveUserFilterParams) => Promise<SaveUserFilterOutput> = async ({
  savedFilterId
}) => {
  return await fetch('/api/user/saveUserFilter', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ savedFilterId })
  })
    .then((r) => {
      if (r.status === 200) return r.json()
      console.error('Failed to call saveUserFilter API endpoint', r.status)
      return null
    })
    .catch(console.error)
}
