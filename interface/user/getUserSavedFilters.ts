import { getDatabasePool } from '../../helpers/connectToDatabase'
import { ICombinedSavedFilter } from '../../types/ICombinedSavedFilter'
import { translateFiltersToEnglish } from '../../helpers/translateFiltersToEnglish'
import { IUserFilterDisplay } from '../../types/IUserFilter'
import { dbEnumToUrlMapping } from '../../configuration/dbEnumToUrlMapping'
import { Timer } from '../../helpers/Timer'

// fetches a list of the filters saved by a user. authenticate user before calling this!
export const getUserSavedFilters: (id: string | number) => Promise<IUserFilterDisplay[]> = async (id) => {
  const timer = new Timer({ label: 'Get user account saved filter', details: { userFilterId: id } })
  const pool = await getDatabasePool()
  const { rows: filters }: { rows: ICombinedSavedFilter[] } = await pool.query(
    `
  SELECT u.id AS user_saved_id, u.saved_filter_fk, u.title, u.created AS saved_date, u.user_id_fk AS user_id, u.category, 
         sf.last_viewed, sf.view_count, sf.last_run, sf.time_to_run, sf.filters, sf.query, sf.results, sf.result_count 
  FROM user_filters u JOIN saved_filters sf on sf.id = u.saved_filter_fk and sf.category = u.category
  WHERE u.user_id_fk = $1
  `,
    [id]
  )
  timer.flush()
  let savedFilters: IUserFilterDisplay[] = filters.map((filter) => ({
    english: translateFiltersToEnglish(filter.filters),
    dateSaved: new Date(filter.saved_date).valueOf(),
    savedFilterCode: filter.saved_filter_fk,
    category: filter.category,
    urlToFilter: `/${dbEnumToUrlMapping[filter.category]}/filter/${filter.saved_filter_fk}`,
    userFilterId: filter.user_saved_id.toString(),
    resultCount: Number(filter.result_count)
  }))
  return savedFilters
}
