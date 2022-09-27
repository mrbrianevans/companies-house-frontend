import { getDatabasePool } from '../../helpers/sql/connectToDatabase'

const camelCase = require('camelcase')
interface DescriptionValues {
  capital?: [{ currency: string; figure: string }]
  date?: string
  made_up_date?: string
  officer_name?: string
  termination_date?: string
  appointment_date?: string
  change_date?: string
  new_address?: string
  old_address?: string
  charge_number?: string
  charge_creation_date?: string
  new_date?: string
  description?: string
}
export const formatFilingDescription: (
  descriptionCode: string,
  descriptionValues: DescriptionValues
) => Promise<string> = async (descriptionCode, descriptionValues) => {
  const pool = getDatabasePool()
  const { rows: descriptions, rowCount } = await pool.query(
    'SELECT value FROM filing_history_descriptions WHERE key=$1 LIMIT 1',
    [descriptionCode]
  )
  await pool.end()
  if (rowCount != 1) return camelCase(descriptionCode ?? '')
  const description = descriptions[0]['value']
  let formattedDescription = description.replace(
    /{([a-z_]+)}/g,
    (f: string, s: keyof DescriptionValues) => descriptionValues?.[s] ?? ''
  )
  // console.log('original: ', descriptions[0].value, '\nformatted:', formattedDescription, 'values:', descriptionValues)
  return formattedDescription.toString()
}
