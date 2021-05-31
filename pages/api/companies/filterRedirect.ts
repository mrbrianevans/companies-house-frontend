import type { NextApiRequest, NextApiResponse } from 'next'
import { IFilter } from '../../../types/IFilters'
import { saveNewFilter } from '../../../interface/filterCompanies/saveNewFilter'
import { getFilterId } from '../../../helpers/getFilterId'
import { getSavedFilter } from '../../../interface/filterCompanies/getSavedFilter'
import { FilterCategory } from '../../../types/FilterCategory'
// /api/companies/filterRedirect
const filterRevalidateDays = 1
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { filters }
  }: { body: { filters: IFilter[] } } = req
  const id = getFilterId(filters, FilterCategory.COMPANY)
  const savedFilter = await getSavedFilter(id)
  if (savedFilter === null) await saveNewFilter({ filters })
  res.json({ id })
}
