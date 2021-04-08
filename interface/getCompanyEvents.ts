import { getDatabasePool } from '../helpers/connectToDatabase'
import { CompanyEvent, FilingEvent } from '../types/IEvent'

export interface ICompanyEvents {
  filingEvents: FilingEvent[]
  companyEvents: CompanyEvent[]
}

const getCompanyEvents: (company_number: string) => Promise<ICompanyEvents> = async (company_number) => {
  try {
    const pool = getDatabasePool()
    console.time('Query database SELECT filing events')
    const { rows: filingEvents } = await pool.query(
      `SELECT DISTINCT id,
                       category,
                       description_code,
                       description AS description_html,
                       filing_date::text,
                       published::date::text,
                       barcode
       FROM filing_events
       WHERE company_number = $1
       ORDER BY published;`,
      [company_number]
    )
    console.timeEnd('Query database SELECT filing events')
    console.time('Query database SELECT company events')
    const { rows: companyEvents } = await pool.query(
      `SELECT DISTINCT id, fields_changed, published::date::text
       FROM company_events
       WHERE company_number = $1
       ORDER BY published;`,
      [company_number]
    )
    console.timeEnd('Query database SELECT company events')
    await pool.end()
    return { filingEvents, companyEvents }
  } catch (e) {
    console.error('Error occurred with fetching events from database: ')
    console.log(e)
    return { companyEvents: [], filingEvents: [] }
  }
}

export default getCompanyEvents
