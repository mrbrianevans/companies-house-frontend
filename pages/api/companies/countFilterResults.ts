import { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import { getResultCount } from '../../../interface/filterCompanies/getResultCount'
import { getSession } from 'next-auth/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: filters }: { body: { filters: IFilter[] } } = req
  const count = await getResultCount(filters.filters)
  const session = await getSession({ req })
  res.json({ count })
}
