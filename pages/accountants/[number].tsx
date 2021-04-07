import { GetServerSideProps } from 'next'
import { ICompany } from '../../types/ICompany'
import { Page } from '../../components/Page/Page'
import { ICompanyEvent, IFilingEvent } from '../../types/IEvent'
import { IFinancial } from '../../types/IFinancial'

const styles = require('../../styles/Home.module.css')

interface props {
  companyData: ICompany
  apiResponseTime: number
  filingEvents?: IFilingEvent[]
  companyEvents?: ICompanyEvent[]
  financials: IFinancial[]
}

const CompanyDetails = ({ companyData, apiResponseTime, filingEvents, companyEvents, financials }: props) => {
  return (
    <Page>
      <h1>Details for company {companyData.name}</h1>
      <div className={styles.card + ' ' + styles.full}>
        <h4>
          {companyData.status} - {companyData.category}
        </h4>
        <h3>Company number {companyData.number}</h3>
        <div>
          <p>{companyData.streetAddress}</p>
          <p>{companyData.county}</p>
          <p>{companyData.postCode}</p>
          <p>{companyData.county}</p>
          <p>{companyData.origin}</p>
        </div>
        <div>
          <h3>Sic Codes:</h3>
          <ul>
            {companyData.sicCodes?.map((sicCode) => (
              <li>{sicCode['sic_code']}</li>
            ))}
          </ul>
        </div>
        <div>
          {filingEvents?.length + companyEvents?.length ? <h3>Events</h3> : <></>}
          <ul>
            {filingEvents?.map((filingEvent) => (
              <li key={filingEvent.timepoint} dangerouslySetInnerHTML={{ __html: filingEvent.description }} />
            ))}
            {companyEvents?.map((companyEvent) => (
              <li key={companyEvent.timepoint}>
                {`Company profile: ${Object.keys(companyEvent.fields_changed).length} items changed`}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ maxWidth: 800 }}>
          {financials?.length ? <h3>Accounts</h3> : <></>}
          <ul>
            {financials?.map((financial) => (
              <li>
                {new Date(financial.end_date).toLocaleDateString()}: {financial.label} = {financial.value}{' '}
                {financial?.unit}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.apiResponseTime}>API response time: {apiResponseTime}ms</div>
    </Page>
  )
}

export default CompanyDetails

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companyNumber = context.params.number.toString()
  if (!companyNumber.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/))
    //TODO: Needs to include letters like SC and FR for charities
    return {
      redirect: {
        destination: '/search/' + companyNumber,
        permanent: false // not sure what this does??
      }
    }
  const startTime = Date.now()
  // fetch company data from backend
  let apiURL = 'http://localhost:8080/api/company/' + companyNumber
  console.time('Fetch ' + apiURL)
  const apiResponse = await fetch(apiURL)
  let companyData: ICompany
  if (apiResponse.status === 200) {
    const apiJSON = await apiResponse.json()
    companyData = apiJSON['company']
  } else {
    companyData = {
      category: '',
      country: '',
      county: '',
      date: new Date().toString(),
      number: '',
      origin: '',
      postCode: '',
      status: '',
      streetAddress: '',
      name: 'error occured'
    }
  }
  // console.timeLog("Fetch " + apiURL, companyData);
  console.timeEnd('Fetch ' + apiURL)

  // fetch events from backend
  apiURL = 'http://localhost:8080/api/events/' + companyNumber
  console.time('Fetch ' + apiURL)
  const eventApiResponse = await fetch(apiURL)
  let companyEvents: ICompanyEvent[], filingEvents: IFilingEvent[]
  if (eventApiResponse.status === 200) {
    const eventApiJson = await eventApiResponse.json()
    let { companyEvents: c, filingEvents: f } = eventApiJson
    companyEvents = c
    filingEvents = f
  } else {
    companyEvents = []
    filingEvents = []
  }

  // fetch financials from backend
  apiURL = 'http://localhost:8080/api/accounts/' + companyNumber
  console.time('Fetch ' + apiURL)
  const accountApiResponse = await fetch(apiURL)
  let financials: IFinancial[]
  if (accountApiResponse.status === 200) {
    const accountApiJson = await accountApiResponse.json()
    let { financials: f } = accountApiJson
    financials = f
  } else {
    financials = []
  }
  // console.timeLog("Fetch " + apiURL, companyData);
  console.timeEnd('Fetch ' + apiURL)
  const returnProps: props = {
    companyData,
    apiResponseTime: Date.now() - startTime,
    companyEvents,
    filingEvents,
    financials
  }
  return {
    props: returnProps // will be passed to the page component as props
  }
}
