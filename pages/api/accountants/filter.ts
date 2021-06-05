import type { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import applyFilters from '../../../interface/filter/applyFilters'
import { FilterCategory } from '../../../types/FilterCategory'
// /api/accountants/filter

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: filters }: { body: IFilter[] } = req
  const { query, results } = await applyFilters({ filters, category: FilterCategory.ACCOUNTANT, limit: 100 })
  if (results) res.json(results)
  else {
    console.log('could not filter accountants')
    res.status(501).json({ error: 'could not filter accountants' })
  }
}
