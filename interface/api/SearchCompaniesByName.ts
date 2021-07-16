import { ICompanyProfile } from '../../types/ICompany'
import { ICompaniesHouseSearchApiResponse } from '../../types/ICompaniesHouseApiResponse'
import axios from 'axios'
import { Timer } from '../../helpers/Timer'

export const searchCompaniesByName: ({ name }: { name: string }) => Promise<ICompaniesHouseSearchApiResponse> = async ({
  name
}) => {
  const timer = new Timer({
    filename: '/interface/api/SearchCompaniesByName.ts',
    label: `Search companies by name using API. Query="${name}"`,
    details: { name }
  })
  const apiUrl = 'https://api.company-information.service.gov.uk/search/companies'
  const govResponse: ICompaniesHouseSearchApiResponse = await axios
    .get(apiUrl, {
      params: { q: name, items_per_page: 10 },
      auth: { username: process.env.APIUSER, password: '' }
    })
    .then((res) => res.data)
    // .then(() => {
    //   throw new Error('This is a custom error message thrown for testing')
    //   return null
    // })
    .catch(timer.genericErrorCustomMessage('Gov API search query failed'))
  timer.addDetail('number of results returned', govResponse?.items.length ?? 0)
  timer.addDetail('total possible number of results', govResponse?.total_results ?? 0)
  timer.flush()
  return govResponse ?? emptyResultsResponse
}

const emptyResultsResponse: ICompaniesHouseSearchApiResponse = {
  total_results: 0,
  items_per_page: 0,
  items: [],
  page_number: 1,
  start_index: 0,
  kind: 'search#companies'
}
