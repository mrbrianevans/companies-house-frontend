import { IFilterValue } from '../../types/IFilters'
import { accountantFilterConfig } from '../../configuration/accountantFilterConfig'
import { useRouter } from 'next/router'
import { GenericSearchBar } from './GenericSearchBar'
import { fetchGetFilterId } from '../../ajax/filter/getFilterId'
import { FilterCategory } from '../../types/FilterCategory'
import { FilterComparison } from '../../configuration/filterComparisons'

export const AccountantSearchBar = () => {
  const router = useRouter()
  return (
    <GenericSearchBar
      textBoxPlaceholder={'Accountant name'}
      buttonOnClick={async (q) => {
        // this splits a search query into words and joins them with a logical AND
        // eg "crates wool" filters by name includes "crates" AND name includes "wool"
        const filters: IFilterValue[] = q.split(' ').map((query) => ({
          field: 'name',
          comparison: FilterComparison.MATCHES,
          exclude: false,
          type: 'string',
          values: [query]
        }))
        // await the promise to show 'loading' until resolved
        await fetchGetFilterId({ category: FilterCategory.ACCOUNTANT, filters }).then((j) =>
          router.push(`/${accountantFilterConfig.urlPath}/filter/` + j.id)
        )
      }}
    />
  )
}
