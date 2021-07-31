import { IFilterValue } from '../../types/IFilters'
import { companyFilterConfig } from '../../configuration/companyFilterConfig'
import { useRouter } from 'next/router'
import { GenericSearchBar } from './GenericSearchBar'
import { fetchGetFilterId } from '../../ajax/filter/getFilterId'
import { FilterCategory } from '../../types/FilterCategory'
import { FilterComparison } from '../../configuration/filterComparisons'

export const CompanyIndustrySearchBar = () => {
  const router = useRouter()
  return (
    <GenericSearchBar
      buttonText={'Filter'}
      textBoxPlaceholder={`Try 'retail' or 'accounting'`}
      buttonOnClick={(q) => {
        const filters: IFilterValue[] = q.split(' ').map((query) => ({
          field: 'sic code description',
          comparison: FilterComparison.MATCHES,
          exclude: false,
          type: 'string',
          values: [query]
        }))
        // return the promise to show 'loading' until resolved
        return fetchGetFilterId({ category: FilterCategory.COMPANY, filters }).then((j) =>
          router.push(`/${companyFilterConfig.urlPath}/filter/` + j.id)
        )
      }}
    />
  )
}
