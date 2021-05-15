import type { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import { applyAccountantsFilter } from '../../../interface/filterAccountants/applyFilter'
// /api/accountants/filter

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: filters }: { body: IFilter[] } = req
  const { query, results } = await applyAccountantsFilter(filters)
  if (results) res.json(results)
  else {
    console.log('could not filter accountants')
    res.status(501).json({ error: 'could not filter accountants' })
  }
}
