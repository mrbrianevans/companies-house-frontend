import { capitalizeEveryWord } from './StringManipulation'

/**
 * Convert a SQL column name or table name into a human readable english name.
 *
 * Replaces underscores capitalises words.
 *
 * @param sqlName a SQL column name or table name in snake case
 * @example
*  const headers = await pool
     .query(
     `
     SELECT STRING_AGG(column_name, ',') AS column_names
     FROM information_schema.columns
     WHERE table_name = $1
     AND table_schema = 'public';`,
     [config.main_table]
     )
     .then(({ rows }: { rows: { column_names: string }[] }) =>
     rows[0].column_names.split(',').map(sqlNameToEnglish)
     )
 */
export const sqlNameToEnglish = (sqlName: string) => {
  return capitalizeEveryWord(sqlName.replace(/_/g, ' '))
}
