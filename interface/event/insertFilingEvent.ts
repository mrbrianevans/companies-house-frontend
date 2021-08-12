import { FilingHistoryItem } from '@companieshouse/api-sdk-node/dist/services/company-filing-history'
import { getDatabasePool } from '../../helpers/sql/connectToDatabase'

const snake = require('snakecase-keys')

export const insertFilingEvent = async (
  filingEvent: FilingHistoryItem,
  formattedDescription: string,
  companyNumber: string
) => {
  // console.time('Insert filing event from API: ' + filingEvent.transactionId)
  const pool = await getDatabasePool()
  let insertParameters = [
    filingEvent.transactionId,
    filingEvent.category,
    filingEvent.description,
    filingEvent.descriptionValues ? snake(filingEvent.descriptionValues) : null,
    formattedDescription,
    filingEvent.date,
    null,
    null,
    filingEvent.barcode,
    filingEvent.type,
    companyNumber
  ]
  await pool
    .query(
      `
      INSERT INTO filing_events
      (id, category, description_code, description_values, description, filing_date, timepoint,
       published, barcode, type, company_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET description_values=excluded.description_values, 
                                     description=excluded.description;`,
      insertParameters
    )
    .catch((e) => console.error('ERROR:', e.message, 'DESCRIPTION: ', filingEvent.description))
  await pool.end()
  // console.timeEnd('Insert filing event from API: ' + filingEvent.transactionId)
}
