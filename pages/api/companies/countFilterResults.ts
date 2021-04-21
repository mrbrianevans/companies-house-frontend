import { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import { getResultCount } from '../../../interface/filterCompanies/getResultCount'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: filters }: { body: IFilter[] } = req
  const count = await getResultCount(filters)
  console.log('Counted', count, 'results')
  res.json({ count })
}
