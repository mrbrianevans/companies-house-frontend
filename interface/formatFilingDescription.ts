import { getDatabasePool } from '../helpers/connectToDatabase'
const camelCase = require('camelcase')
export const formatFilingDescription: (
  descriptionCode: string,
  descriptionValues: { [p: string]: string }
) => Promise<string> = async (descriptionCode, descriptionValues) => {
  const pool = getDatabasePool()
  const {
    rows: descriptions,
    rowCount
  } = await pool.query('SELECT value FROM filing_history_descriptions WHERE key=$1 LIMIT 1', [descriptionCode])
  await pool.end()
  if (rowCount != 1) return camelCase(descriptionCode)
  const description = descriptions[0]['value']
  let formattedDescription = description.replace(/{([a-z_]+)}/g, (s: string) =>
    descriptionValues ? descriptionValues[camelCase(s.slice(1, s.length - 1))] || '' : ''
  )
  // console.log('original: ', descriptions[0].value, '\nformatted:', formattedDescription, 'values:', descriptionValues)
  return formattedDescription.toString()
}
