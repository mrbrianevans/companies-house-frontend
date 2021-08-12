import { getDatabasePool } from '../../helpers/sql/connectToDatabase'
import { CompanyEvent, FilingEvent } from '../../types/IEvent'
import { Timer } from '../../helpers/Timer'

export interface ICompanyEvents {
  filingEvents: FilingEvent[]
  companyEvents: CompanyEvent[]
}

const getCompanyEvents: (company_number: string) => Promise<ICompanyEvents> = async (company_number) => {
  const pool = getDatabasePool()
  const timer = new Timer({ filename: '/interface/getCompanyEvents.ts' })
  try {
    timer.start('Query database for filing events')
    const { rows: filingEvents } = await pool.query(
      `SELECT DISTINCT ON (id) id,
                       category,
                       description_code,
                       description AS description_html,
                       filing_date::text,
                       published::date::text,
                       barcode
       FROM filing_events
       WHERE company_number = $1
       ORDER BY id;`,
      [company_number]
    )
    timer.next('Query database for company events')
    const { rows: companyEvents } = await pool.query(
      `SELECT DISTINCT ON(id) id, fields_changed, published::date::text
       FROM company_events
       WHERE company_number = $1
       ORDER BY id;`,
      [company_number]
    )
    timer.end()
    return { filingEvents, companyEvents }
  } catch (e) {
    console.error('Error occurred with fetching events from database: ')
    console.log(e)
    return { companyEvents: [], filingEvents: [] }
  } finally {
    timer.flush()
    await pool.end()
  }
}

export default getCompanyEvents
