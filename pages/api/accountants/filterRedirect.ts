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
  const savedFilter = await getSavedFilter(id)
  if (savedFilter === null) await saveNewFilter({ filters })
  else if (JSON.stringify(savedFilter.appliedFilters.sort()) != JSON.stringify(filters.sort()))
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: `Filters don't match for id ${id}`,
        savedFilter: JSON.stringify(savedFilter.appliedFilters.sort()),
        newFilter: JSON.stringify(filters.sort())
      })
    )
  res.json({ id })
}
