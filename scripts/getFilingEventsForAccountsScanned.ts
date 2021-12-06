import axios from 'axios'
import { getCompaniesHouseRateLimit } from '../helpers/companiesHouseRateLimit'
import { RateLimitHeaders } from '../types/ApiRateLimitHeaders'
import { insertFilingEvent, insertRawFilingEvent } from '../interface/event/insertFilingEvent'
import { FilingHistoryItem } from '@companieshouse/api-sdk-node/dist/services/company-filing-history'
import { formatFilingDescription } from '../interface/event/formatFilingDescription'
import { getDatabasePool } from '../helpers/sql/connectToDatabase'
import { FilingHistory } from '../types/api/IFilingHistory'
import camelcaseKeys from 'camelcase-keys'
async function getFilingEventsForAccountsScanned() {
  console.time('Load events')
  require('dotenv').config({ path: '../.env' })
  const pool = getDatabasePool()
  const query = `SELECT company_number
FROM (SELECT "as".company_number, "as".accounts_date, fe.id, fe.category FROM accounts_scanned "as"
                      LEFT JOIN filing_events fe on fe.company_number = "as".company_number
                                             AND fe.category='accounts'
                                             AND fe.description_values->>'made_up_date' = "as".accounts_date::text
      ORDER BY company_number DESC
      LIMIT 1000 OFFSET 1000
) a WHERE id IS NULL;`
  const list = await pool.query(query).then((res) => res.rows.map((row) => row.company_number))
  let counter = 0
  for (const companyNumber of list) {
    try {
      const filingItem = await getFilingHistoryFromApi(companyNumber)
      if (filingItem.filing_history_status !== 'filing-history-available') {
        console.log('Status', filingItem.filing_history_status)
        continue
      }
      await Promise.all(filingItem.items.map((item) => insertRawFilingEvent(item, companyNumber, pool)))
      counter += filingItem.items.length
      if (filingItem.items.length !== filingItem.total_count)
        console.log(`Inserted ${filingItem.items.length}/${filingItem.total_count} filing events for ${companyNumber}`)
    } catch (e) {
      console.log('Failed on companyNumber=', companyNumber)
      console.error(e)
    }
  }
  console.timeEnd('Load events')
  console.log('Inserted', counter, 'rows in filing events table for', list.length, 'companies')
  await pool.end()
}

async function getFilingHistoryFromApi(companyNumber: string): Promise<FilingHistory.IFilingHistory> {
  const apiUrl = `https://api.company-information.service.gov.uk/company/${companyNumber}/filing-history?items_per_page=100`
  // console.log('GET', apiUrl)
  const res = await axios.get(apiUrl, {
    auth: { username: process.env.APIUSER ?? '', password: '' }
  })
  const rateLimit = getCompaniesHouseRateLimit(res.headers)
  if (rateLimit.remain <= 2) await sleepRateLimit(rateLimit)
  return res.data
}

async function sleepRateLimit(rateLimit: RateLimitHeaders) {
  console.log('Hit rate limit, sleeping', (rateLimit.reset - Date.now() / 1000).toFixed(1), 'milliseconds')
  await new Promise((resolve) => setTimeout(resolve, rateLimit.reset * 1000 - Date.now()))
}

getFilingEventsForAccountsScanned()
