import type { NextApiRequest, NextApiResponse } from 'next'
import { IFilterOption } from '../../../types/IFilters'
import getCompanyFilters from '../../../interface/filterCompanies/getFilterOptions'

// /api/accountants/getFilters
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const filterOptions: IFilterOption[] = getCompanyFilters()
  res.json(filterOptions)
}
