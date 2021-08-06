import { GetStaticPaths, GetStaticProps } from 'next'
import { ICompanyProfile } from '../../types/ICompany'
import { Page } from '../../components/Page/Page'
import { CompanyEvent, FilingEvent } from '../../types/IEvent'
import { getCompanyProfile } from '../../interface/getCompanyProfile'
import getCompanyEvents from '../../interface/getCompanyEvents'
import { ICompanyAccounts } from '../../types/ICompanyAccounts'
import getCompanyAccounts from '../../interface/getCompanyAccounts'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GetFilingsListResponse } from '../api/chApi/getFilingsList'
import { Timer } from '../../helpers/Timer'
import { CompanyName } from '../../components/CompanyProfile/CompanyName'
import { CountryFlag } from '../../components/Locations/CountryFlag'
import { CompanyNumber } from '../../components/CompanyProfile/CompanyNumber'
import { CompanyStatusTrafficLight } from '../../components/CompanyProfile/CompanyStatusTrafficLight'
import { LocationMap } from '../../components/Locations/LocationMap'
import { CompanyEmployees } from '../../components/CompanyProfile/CompanyEmployees'
import { CompanyOfficers } from '../../components/CompanyProfile/CompanyOfficers'
import { VerticalTimeline } from '../../components/VerticalTimeline/VerticalTimeline'
import { ShareCode } from '../../components/ShareCode/ShareCode'
import { AddressWithMapAndFlag } from '../../components/Locations/AddressWithMapAndFlag'
import ButtonLink from '../../components/Inputs/ButtonLink'
import { capitalizeEveryWord } from '../../helpers/StringManipulation'

const styles = require('./CompanyProfile.module.scss')

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
  useEffect(() => {
    if (!companyData?.company_number) return
    fetch('/api/chApi/getFilingsList?company_number=' + companyData?.company_number)
      .then((res) => res.json())
      .then((j) => setFilingHistory(j))
      .catch(console.error)
  }, [companyData])
  return (
    <Page>
      <article className={styles.layout}>
        <section className={styles.name}>
          <CompanyName name={companyData?.name} loading={router.isFallback} />
        </section>
        <section className={styles.number}>
          <CompanyNumber loading={router.isFallback} companyNumber={companyData?.company_number} />
        </section>
        <section className={styles.sharecode}>
          <p>
            This page: <ButtonLink href={router.asPath.toString()} />
          </p>
          {/*<ShareCode text={`filfa.co/v/${companyData?.company_number}`} />*/}
        </section>
        <section className={styles.status}>
          <CompanyStatusTrafficLight status={companyData?.status} loading={router.isFallback} />
        </section>
        <section className={styles.location}>
          <AddressWithMapAndFlag
            address={
              companyData && {
                streetAddress: companyData.streetaddress,
                country: companyData.country,
                city: companyData.built_up_area,
                county: companyData.county,
                lat: 0,
                long: 0,
                postCode: companyData.postcode
              }
            }
            loading={router.isFallback}
          />
        </section>
        <section className={styles.employees}>
          <CompanyEmployees employees={financials?.employees} loading={router.isFallback} />
        </section>
        <section className={styles.officers}>
          <CompanyOfficers officers={financials?.officers.map((o) => ({ name: o }))} loading={router.isFallback} />
        </section>
        <section className={styles.timeline}>
          <VerticalTimeline
            events={
              filingHistory?.items.map((event) => ({
                timestamp: new Date(event.date).valueOf(),
                title: event.category,
                description: event.description
              })) ??
              filingEvents?.map((event) => ({
                timestamp: new Date(event.published).valueOf(),
                title: event.category,
                description: event.description_html
              }))
            }
            loading={router.isFallback}
          />
        </section>
        {apiResponseTime && (
          <section className={styles.responseTime}>
            <p>Page loaded in {apiResponseTime / 1000} seconds</p>
          </section>
        )}
        {financials && (
          <section className={styles.accounts}>
            <h4>Accounts</h4>
            {Object.entries(financials).map(([financial, value], index) => (
              <p key={index}>
                {capitalizeEveryWord(financial.replaceAll('_', ' '))}: {value}
              </p>
            ))}
          </section>
        )}
      </article>
    </Page>
  )
}

export default CompanyDetails

export const getStaticProps: GetStaticProps = async (context) => {
  await new Promise((r) => setTimeout(r, 3000))
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
  // todo: there is no reason why these steps need to be linear. They can be asynchronous (all happen in parallel)
  //  - use Promise.all() to improve load time of company profile
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
