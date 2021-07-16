import { GetStaticPaths, GetStaticProps } from 'next'
import { ICompanyProfile } from '../../types/ICompany'
import { Page } from '../../components/Page/Page'
import { CompanyEvent, FilingEvent } from '../../types/IEvent'
import { getCompanyProfile } from '../../interface/getCompanyProfile'
import getCompanyEvents from '../../interface/getCompanyEvents'
import { ICompanyAccounts } from '../../types/ICompanyAccounts'
import getCompanyAccounts from '../../interface/getCompanyAccounts'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  CompanyFilingHistory,
  FilingHistoryItem
} from '@companieshouse/api-sdk-node/dist/services/company-filing-history'
import { formatFilingDescription } from '../../interface/formatFilingDescription'
import { GetFilingsListResponse } from '../api/chApi/getFilingsList'
import { FilingItem } from '../../components/CompanyProfile/FilingItem'
import Button from '../../components/Inputs/Button'
import FormRow from '../../components/Inputs/FormRow'
import { Timer } from '../../helpers/Timer'
const styles = require('../../styles/Home.module.css')

interface props {
  companyData: ICompanyProfile
  apiResponseTime: number
  filingEvents?: FilingEvent[]
  companyEvents?: CompanyEvent[]
  financials: ICompanyAccounts
}

const CompanyDetails = ({ companyData, apiResponseTime, filingEvents, companyEvents, financials }: props) => {
  const router = useRouter()
  const [filingHistory, setFilingHistory] = useState<GetFilingsListResponse>()
  const [filingHistoryDisplayLimit, setFilingHistoryDisplayLimit] = useState(5)
  useEffect(() => {
    if (!companyData?.company_number) return
    fetch('/api/chApi/getFilingsList?company_number=' + companyData?.company_number)
      .then((res) => res.json())
      .then((j) => setFilingHistory(j))
      .catch(console.error)
  }, [companyData])
  return (
    <Page>
      {router.isFallback ? (
        <p>Loading company details...</p>
      ) : (
        <>
          <h1>{companyData.name}</h1>
          <div className={styles.card + ' ' + styles.full}>
            <h4>
              {companyData.status} - {companyData.category}
            </h4>
            <h3>Company number {companyData.company_number}</h3>
            <div className={styles.addressBlock}>
              <p>{companyData.streetaddress}</p>
              <p>
                {companyData.parish}
                {companyData.parish && companyData.county && ', '}
                {companyData.county}
              </p>
              <p>
                {companyData?.region?.includes(companyData.country)
                  ? companyData.region
                  : companyData.region + (companyData.region && companyData.country && ', ') + companyData.country}
              </p>
            </div>
            <div>
              <h3>Industry classification:</h3>
              <ul>
                {companyData?.sic_codes?.map((sicCode, i) => (
                  <li key={i}>{sicCode}</li>
                ))}
              </ul>
            </div>
            {filingHistory ? (
              <div>
                <h3>Filing history:</h3>
                <ul>
                  {filingHistory?.items?.slice(0, filingHistoryDisplayLimit)?.map((item) => {
                    return <FilingItem item={item} />
                  })}
                </ul>
                {filingHistory.totalCount > 5 && (
                  <FormRow>
                    {filingHistoryDisplayLimit < filingHistory.totalCount ? (
                      <>
                        <Button
                          label={'Show more'}
                          onClick={() => setFilingHistoryDisplayLimit((prevState) => prevState + 5)}
                        />
                        <Button
                          label={'Show all'}
                          onClick={() => setFilingHistoryDisplayLimit(filingHistory.totalCount)}
                        />
                      </>
                    ) : (
                      <span>Showing all available filings on record</span>
                    )}
                    {filingHistoryDisplayLimit > 5 && (
                      <Button
                        onClick={() => setFilingHistoryDisplayLimit((prevState) => prevState - 5)}
                        label={'Show less'}
                      />
                    )}
                  </FormRow>
                )}
              </div>
            ) : (
              <>
                {filingEvents?.length + companyEvents?.length !== 0 && (
                  <div>
                    <h3>Recent filing history</h3>
                    <ul>
                      {filingEvents
                        ?.sort((a, b) => new Date(a.published).valueOf() - new Date(b.published).valueOf())
                        ?.map((filingEvent) => {
                          const [, , descriptionHeading, descriptionBody] =
                            filingEvent.description_html.match(/^(\*\*(.*)\*\*)?(.*)$/)
                          return (
                            <li key={filingEvent.id}>
                              {new Date(filingEvent.filing_date).toDateString()}: <b>{descriptionHeading}</b>
                              {descriptionBody}
                            </li>
                          )
                        })}
                      {companyEvents?.map((companyEvent) => (
                        <li key={companyEvent.id}>
                          {`Company profile: ${
                            Object.keys(companyEvent.fields_changed ?? {}).length
                          } items changed on ${new Date(companyEvent.published).toDateString()}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            <div style={{ maxWidth: 800 }}>
              {financials && (
                <>
                  <h3>Accounts</h3>
                  <p>
                    Balance sheet date: <b>{financials.balance_sheet_date}</b>
                  </p>
                  <p>
                    Accountants:{' '}
                    <b>
                      <Link href={'/accountants/' + financials.accountants}>
                        <a>{financials.accountants}</a>
                      </Link>
                    </b>
                  </p>
                  <p>
                    Accounting software: <b>{financials.accounting_software}</b>
                  </p>
                  <p>
                    Number of employees: <b>{financials.employees}</b>
                  </p>
                  <p>
                    Profit: <b>{financials.profit}</b>
                  </p>
                </>
              )}
            </div>
          </div>
          <div className={styles.apiResponseTime}>API response time: {apiResponseTime}ms</div>
        </>
      )}
    </Page>
  )
}

export default CompanyDetails

export const getStaticProps: GetStaticProps = async (context) => {
  const companyNumber = context.params.number.toString()
  if (!companyNumber.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/))
    return {
      redirect: {
        destination: '/search/' + companyNumber,
        permanent: false // not sure what this does??
      }
    }
  const timer = new Timer({
    label: `Load company profile page details (company number:${companyNumber})`,
    details: { class: 'company-profile' },
    filename: '/pages/company/[number].tsx'
  })
  timer.start('Get company profile')
  const companyData = await getCompanyProfile(companyNumber)
  timer.next('Get company and filing events')
  const { companyEvents, filingEvents } = await getCompanyEvents(companyNumber)
  timer.next('Get company accounts')
  let financials: ICompanyAccounts = await getCompanyAccounts(companyNumber)
  const returnProps: props = {
    companyData,
    apiResponseTime: timer.flush(), // this console logs and returns the time
    companyEvents,
    filingEvents,
    financials
  }
  return {
    props: returnProps, // will be passed to the page component as props
    revalidate: 86400 // revalidate every 24 hours
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] }
}
