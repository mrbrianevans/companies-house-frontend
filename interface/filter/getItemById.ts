// this file is located in: /interface/filter/getItemById.ts
// to import from this file, use: import { GetItemByIdParams, GetItemByIdOutput, getItemById } from '../../interface/filter/getItemById'

import { IFilterValue } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../helpers/filters/getFilterId'
import { Timer } from '../../helpers/Timer'
import getFilterConfig from '../../helpers/getFilterConfig'

// input parameters for getItemById - id, category
export interface GetItemByIdParams {
  id: string
  category: FilterCategory
}

// return type of getItemById - item
export interface GetItemByIdOutput<ItemType> {
  item: ItemType
}

/**
 * Get an item by its uniqueIdentifier. A generic locate method for any category of filter.
 *
 * @example
 * const { item } = await getItemById({id, category})
 * @param  GetItemByIdParams id, category
 * @returns  GetItemByIdOutput item
 */
export async function getItemById<ItemType>({ id, category }: GetItemByIdParams): Promise<GetItemByIdOutput<ItemType>> {
  const timer = new Timer({
    label: 'getItemById() method call',
    filename: 'interface/filter/getItemById.ts',
    details: { category, itemId: id }
  })
  const pool = getDatabasePool()
  const config = getFilterConfig({ category })
  const result = await pool
    .query(
      `
      SELECT *
      FROM ${config.main_table}
      WHERE ${config.uniqueIdentifier}=$1
  `,
      [id]
    )
    .then(({ rows }) => rows)
    .catch((e) => timer.postgresError(e))
  await pool.end()
  if (!result || result?.length === 0) {
    timer.customError('No results returned')
    return { item: null }
  }
  const item = result[0] as ItemType
  timer.flush()
  return { item }
}
