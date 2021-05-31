import type { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import { saveNewFilter } from '../../../interface/filterAccountants/saveNewFilter'
import { getFilterId } from '../../../helpers/getFilterId'
import { getSavedFilter } from '../../../interface/filterAccountants/getSavedFilter'
import { FilterCategory } from '../../../types/FilterCategory'
// /api/accountants/filterRedirect
const filterRevalidateDays = 1
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { filters }
  }: { body: { filters: IFilter[] } } = req
  const id = getFilterId(filters, FilterCategory.ACCOUNTANT)
  const savedFilter = await getSavedFilter(id)
  if (savedFilter === null) await saveNewFilter({ filters })
  res.json({ id })
}
