import type { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import { applyCompaniesFilter } from '../../../interface/filterCompanies/applyFilter'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: filters }: { body: IFilter[] } = req
  const output = await applyCompaniesFilter(filters)
  if (output) res.json(output.results)
  else {
    console.log('results not returned')
    res.status(501).json({ error: 'could not filter companies' })
  }
}
