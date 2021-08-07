// this file is located in: /ajax/officer/searchOfficersByName.ts

import { SearchOfficersByNameOutput, SearchOfficersByNameParams } from '../../interface/officer/searchOfficersByName'

/** Frontend AJAX call to searchOfficersByName method on the backend
 *
 * @example
 * const { officers } = await $END$fetchSearchOfficersByName({ query })
 */
export const fetchSearchOfficersByName: (params: SearchOfficersByNameParams) => Promise<SearchOfficersByNameOutput> =
  async ({ query }) => {
    return await fetch('/api/officer/searchOfficersByName', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query })
    })
      .then((r) => {
        if (r.status === 200) return r.json()
        console.error('Failed to call searchOfficersByName API endpoint')
        return null
      })
      .catch(console.error)
  }
