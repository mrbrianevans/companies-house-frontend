// this file is located in: /ajax/filter/cacheFilter.ts

import { CacheFilterOutput, CacheFilterParams } from '../../interface/filter/cacheFilter'


/** Frontend AJAX call to cacheFilter method on the backend 
 *
 * @example
 * const { id } = await fetchCacheFilter({ filters, category })
 */
export const fetchCacheFilter: (params: CacheFilterParams) => Promise<CacheFilterOutput> = async({ filters, category }) => {
  return await fetch('/api/filter/cacheFilter', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ filters, category })
  }).then(async(r) => {
    if(r.status === 200)
      return r.json()
    console.error("Failed to call cacheFilter API endpoint. Code", r.status,'. Message', (await r.text()))
    return null
  }).catch(console.error)
}
