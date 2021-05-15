import { IFilter } from '../../types/IFilters'
import { companyFilterConfig } from '../../configuration/companyFilterConfig'
import { useRouter } from 'next/router'
import { GenericSearchBar } from './GenericSearchBar'

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
        fetch(companyFilterConfig.getFilterIdApiUrl, {
          method: 'POST',
          body: JSON.stringify({ filters }),
          headers: { 'Content-Type': 'application/json' }
        })
          .then((r) => {
            if (r.status === 200) return r
            else throw new Error(r.statusText)
          })
          .then((r) => r.json())
          .then((j) => router.push(companyFilterConfig.redirectUrl + j.id))
      }}
    />
  )
}
