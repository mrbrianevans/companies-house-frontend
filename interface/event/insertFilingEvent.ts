import { FilingHistoryItem } from '@companieshouse/api-sdk-node/dist/services/company-filing-history'
import { getDatabasePool } from '../../helpers/sql/connectToDatabase'
import { formatFilingDescription } from './formatFilingDescription'
import { FilingHistory } from '../../types/api/IFilingHistory'
import { prettyPrintSqlQuery } from '../../helpers/sql/prettyPrintSqlQuery'
import { Pool } from 'pg'

const snake = require('snakecase-keys')

export const insertFilingEvent = async (
  filingEvent: FilingHistoryItem,
  formattedDescription: string,
  companyNumber: string,
  pgPool?: Pool
) => {
  // console.time('Insert filing event from API: ' + filingEvent.transactionId)
  const pool = pgPool ?? (await getDatabasePool())
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
  if (!pgPool) await pool.end()
  // console.timeEnd('Insert filing event from API: ' + filingEvent.transactionId)
}

export async function insertRawFilingEvent(
  filingEvent: FilingHistory.FilingHistoryItem,
  companyNumber: string,
  pgPool?: Pool
) {
  const filingDescription = await formatFilingDescription(filingEvent.description, filingEvent.description_values)
  return insertFilingEvent(
    {
      // annotations: filingEvent.a,
      associatedFilings: filingEvent.associated_filings,
      barcode: filingEvent.barcode,
      category: filingEvent.category,
      date: filingEvent.date,
      description: filingEvent.description,
      // @ts-ignore
      descriptionValues: filingEvent.description_values,
      links: filingEvent.links,
      pages: filingEvent.pages,
      paperFiled: filingEvent.paper_filed,
      // @ts-ignore
      resolutions: filingEvent.resolutions,
      subcategory: filingEvent.subcategory,
      transactionId: filingEvent.transaction_id,
      type: filingEvent.type
    },
    filingDescription,
    companyNumber,
    pgPool
  )
}
