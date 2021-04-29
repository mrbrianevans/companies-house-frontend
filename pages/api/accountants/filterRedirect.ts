import type { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import { saveNewFilter } from '../../../interface/filterAccountants/saveNewFilter'
import { getFilterId } from '../../../helpers/getFilterId'
import { getSavedFilter } from '../../../interface/filterAccountants/getSavedFilter'
// /api/accountants/filterRedirect

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { filters }
  }: { body: { filters: IFilter[] } } = req
  const id = getFilterId(filters)
  if ((await getSavedFilter(id)) === null) await saveNewFilter({ filters })
  res.json({ id })
}
