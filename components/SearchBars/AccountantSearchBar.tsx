import { IFilter } from '../../types/IFilters'
import { accountantFilterConfig } from '../../configuration/accountantFilterConfig'
import { useRouter } from 'next/router'
import { GenericSearchBar } from './GenericSearchBar'

export const AccountantSearchBar = () => {
  const router = useRouter()
  return (
    <GenericSearchBar
      textBoxPlaceholder={'Albert Goodman or Haines Watts'}
      buttonOnClick={(q) => {
        const filters: IFilter[] = q.split(' ').map((query) => ({
          category: 'name',
          comparison: 'includes',
          exclude: false,
          type: 'string',
          values: [query]
        }))
        fetch(accountantFilterConfig.getFilterIdApiUrl, {
          method: 'POST',
          body: JSON.stringify({ filters }),
          headers: { 'Content-Type': 'application/json' }
        })
          .then((r) => {
            if (r.status === 200) return r
            else throw new Error(r.statusText)
          })
          .then((r) => r.json())
          .then((j) => router.push(accountantFilterConfig.redirectUrl + j.id))
      }}
    />
  )
}
