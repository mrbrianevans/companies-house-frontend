import { IFilter } from '../../types/IFilters'
import { companyFilterConfig } from '../../configuration/companyFilterConfig'
import { useRouter } from 'next/router'
import { GenericSearchBar } from './GenericSearchBar'
import { fetchGetFilterId } from '../../ajax/filter/getFilterId'
import { FilterCategory } from '../../types/FilterCategory'

export const CompanyIndustrySearchBar = () => {
  const router = useRouter()
  return (
    <GenericSearchBar
      buttonText={'Filter'}
      textBoxPlaceholder={`Try 'retail' or 'accounting'`}
      buttonOnClick={(q) => {
        const filters: IFilter[] = q.split(' ').map((query) => ({
          category: 'sic code description',
          comparison: 'includes',
          exclude: false,
          type: 'string',
          values: [query]
        }))
        // return the promise to show 'loading' until resolved
        return fetchGetFilterId({ category: FilterCategory.COMPANY, filters }).then((j) =>
          router.push(companyFilterConfig.redirectUrl + j.id)
        )
      }}
    />
  )
}
