import type { NextApiRequest, NextApiResponse } from 'next'
import { IFilterOption } from '../../../types/IFilters'
import getAccountantFilters from '../../../interface/getAccountantFilters'

// /api/accountants/getFilters
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const filterOptions: IFilterOption[] = getAccountantFilters()
  res.json(filterOptions)
}
