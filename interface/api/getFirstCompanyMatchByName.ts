import { ICompanyFullDetails, ICompanyProfile } from '../../types/ICompany'
import { searchCompaniesByName } from './SearchCompaniesByName'
import { getCompanyProfile } from '../getCompanyProfile'

export const getFirstCompanyMatchByName: ({ name }: { name: string }) => Promise<ICompanyFullDetails | null> = async ({
  name
}) => {
  const allMatches = await searchCompaniesByName({ name })
  if (allMatches.items.length > 0) {
    const bestMatch = allMatches.items[0] // first item is best match
    const matchingCompany = await getCompanyProfile(bestMatch.company_number)
    console.log('getFirstCompanyMatchByName found', matchingCompany.company.name, 'for search', name)
    return matchingCompany
  } else {
    return null // cannot find a single company. usually due to an API failure (eg network outage)
  }
}
