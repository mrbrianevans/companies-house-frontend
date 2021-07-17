import { IFilter } from '../../types/IFilters'
import { accountantFilterConfig } from '../../configuration/accountantFilterConfig'
import { useRouter } from 'next/router'
import { GenericSearchBar } from './GenericSearchBar'
import { fetchGetFilterId } from '../../ajax/filter/getFilterId'
import { FilterCategory } from '../../types/FilterCategory'

export const AccountantSearchBar = () => {
  const router = useRouter()
  return (
    <GenericSearchBar
      textBoxPlaceholder={'Accountant name'}
      buttonOnClick={async (q) => {
        // this splits a search query into words and joins them with a logical AND
        // eg "crates wool" filters by name includes "crates" AND name includes "wool"
        const filters: IFilter[] = q.split(' ').map((query) => ({
          category: 'name',
          comparison: 'includes',
          exclude: false,
          type: 'string',
          values: [query]
        }))
        // await the promise to show 'loading' until resolved
        await fetchGetFilterId({ category: FilterCategory.ACCOUNTANT, filters }).then((j) =>
          router.push(accountantFilterConfig.redirectUrl + j.id)
        )
      }}
    />
  )
}
