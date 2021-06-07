import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ICombinedSavedFilter } from '../../types/ICombinedSavedFilter'
import { translateFiltersToEnglish } from '../../helpers/translateFiltersToEnglish'
import { IUserFilterDisplay } from '../../types/IUserFilter'
import { dbEnumToUrlMapping } from '../../configuration/dbEnumToUrlMapping'
import { Timer } from '../../helpers/Timer'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'

// fetches a list of the filters saved by a user. authenticate user before calling this!
export const getUserSavedFilters: (id: string | number) => Promise<IUserFilterDisplay[]> = async (id) => {
  const timer = new Timer({ label: 'Get user account saved filters', details: { userFilterId: id } })
  const pool = await getDatabasePool()
  const { rows: filters }: { rows: ICombinedSavedFilter[] } = await pool.query(
    `
  SELECT u.id AS user_saved_id, u.cached_filter_fk, u.title, u.created AS saved_date, u.user_id_fk AS user_id, cf.category,
         cf.last_viewed, cf.view_count, cf.last_run, cf.time_to_run, cf.filters, cf.query, cf.result_count 
  FROM user_filters u JOIN cached_filters cf on cf.id = u.cached_filter_fk
  WHERE u.user_id_fk = $1
  `,
    [id]
  )
  serialiseResultDates(filters)
  timer.flush()
  let savedFilters: IUserFilterDisplay[] = filters.map((filter) => ({
    english: translateFiltersToEnglish(filter.filters),
    dateSaved: new Date(filter.saved_date).valueOf(),
    cachedFilterId: filter.cached_filter_fk,
    category: filter.category,
    urlToFilter: `/${dbEnumToUrlMapping[filter.category]}/filter/${filter.cached_filter_fk}`,
    userFilterId: filter.user_saved_id.toString(),
    resultCount: Number(filter.result_count)
  }))
  return savedFilters
}
