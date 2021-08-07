import { GetStaticPaths, GetStaticProps } from 'next'
import { ICompanyFullDetails, ICompanyProfile } from '../../types/ICompany'
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
import { fetchGetOfficerAppointmentsForCompany } from '../../ajax/officer/getOfficerAppointmentsForCompany'
import { IOfficerAppointmentWithOfficer } from '../../types/IOfficerAppointments'
import { formatOfficerName } from '../../helpers/officers/formatOfficerName'

const styles = require('./CompanyProfile.module.scss')

interface props {
  companyData: ICompanyFullDetails
  apiResponseTime: number
  filingEvents?: FilingEvent[]
  companyEvents?: CompanyEvent[]
  financials: ICompanyAccounts
}

const CompanyDetails = ({ companyData, apiResponseTime, filingEvents, companyEvents, financials }: props) => {
  const router = useRouter()
  const [filingHistory, setFilingHistory] = useState<GetFilingsListResponse>()
  const [officers, setOfficers] = useState<IOfficerAppointmentWithOfficer[]>()
  useEffect(() => {
    if (router.query.number instanceof Array) return
    fetch('/api/chApi/getFilingsList?company_number=' + router.query.number)
      .then((res) => res.json())
      .then((j) => setFilingHistory(j))
      .catch(console.error)
    //call API endpoint to get list of officers related to this company from the person_officers table
    fetchGetOfficerAppointmentsForCompany({ companyNumber: router.query.number })
      .then((res) => setOfficers(res?.officers ?? null))
      .catch(console.error)
  }, [router.query.number])
  return (
    <Page>
      <article className={styles.layout}>
        <section className={styles.name}>
          <CompanyName name={companyData?.company.name} loading={router.isFallback} />
        </section>
        <section className={styles.number}>
          <CompanyNumber loading={router.isFallback} companyNumber={companyData?.company.companyNumber} />
        </section>
        <section className={styles.sharecode}>
          <p>
            This page: <ButtonLink href={router.asPath.toString()} />
          </p>
          {/*<ShareCode text={`filfa.co/v/${companyData?.company_number}`} />*/}
        </section>
        <section className={styles.status}>
          <CompanyStatusTrafficLight status={companyData?.company.status} loading={router.isFallback} />
        </section>
        <section className={styles.location}>
          <AddressWithMapAndFlag address={companyData?.address} loading={router.isFallback} />
        </section>
        <section className={styles.employees}>
          <CompanyEmployees employees={financials?.employees} loading={router.isFallback} />
        </section>
        <section className={styles.officers}>
          <CompanyOfficers officers={officers} loading={!officers} />
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
    label: `Load company profile page details`,
    details: { class: 'companyProfilePage', companyNumber },
    filename: '/pages/company/[number].tsx'
  })
  const [companyData, { companyEvents, filingEvents }, financials] = await Promise.all([
    getCompanyProfile(companyNumber),
    getCompanyEvents(companyNumber),
    getCompanyAccounts(companyNumber)
  ])
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
