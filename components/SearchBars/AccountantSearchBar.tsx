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
      textBoxPlaceholder={'Albert Goodman or Haines Watts'}
      buttonOnClick={(q) => {
        const filters: IFilter[] = q.split(' ').map((query) => ({
          category: 'name',
          comparison: 'includes',
          exclude: false,
          type: 'string',
          values: [query]
        }))
        fetchGetFilterId({ category: FilterCategory.ACCOUNTANT, filters }).then((j) =>
          router.push(accountantFilterConfig.redirectUrl + j.id)
        )
      }}
    />
  )
}
