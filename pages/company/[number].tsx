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
                {companyData.sic_codes?.map((sicCode, i) => (
                  <li key={i}>{sicCode}</li>
                ))}
              </ul>
            </div>
            <div>
              {filingEvents?.length + companyEvents?.length ? <h3>Events</h3> : <></>}
              <ul>
                {filingEvents
                  ?.sort((a, b) => new Date(a.published).valueOf() - new Date(b.published).valueOf())
                  ?.map((filingEvent) => {
                    const [, descriptionHeading, descriptionBody] = filingEvent.description_html.match(
                      /^<b>(.*)<\/b>(.*)$/
                    )
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
  const startTime = Date.now()
  const companyNumber = context.params.number.toString()
  if (!companyNumber.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/))
    return {
      redirect: {
        destination: '/search/' + companyNumber,
        permanent: false // not sure what this does??
      }
    }
  const companyData = await getCompanyProfile(companyNumber)
  const { companyEvents, filingEvents } = await getCompanyEvents(companyNumber)
  let financials: ICompanyAccounts = await getCompanyAccounts(companyNumber)
  // todo: only server-side render the basic company information
  //  - fetch the rest via API on client side after page load
  const returnProps: props = {
    companyData,
    apiResponseTime: Date.now() - startTime,
    companyEvents,
    filingEvents,
    financials
  }
  return {
    props: returnProps, // will be passed to the page component as props
    revalidate: 86400
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] }
}
