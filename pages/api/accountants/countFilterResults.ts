import { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import { getResultCount } from '../../../interface/filterAccountants/getResultCount'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: filters }: { body: { filters: IFilter[] } } = req
  const count = await getResultCount(filters.filters)
  res.json({ count })
}
