import { GetStaticPaths, GetStaticProps } from 'next'
import { ICompanyFullDetails } from '../../types/ICompany'
import { Page } from '../../components/Page/Page'
import { CompanyEvent, FilingEvent } from '../../types/IEvent'
import { getCompanyProfile } from '../../interface/company/getCompanyProfile'
import getCompanyEvents from '../../interface/company/getCompanyEvents'
import { ICompanyAccounts } from '../../types/ICompanyAccounts'
import getCompanyAccounts from '../../interface/company/getCompanyAccounts'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GetFilingsListResponse } from '../api/chApi/getFilingsList'
import { Timer } from '../../helpers/Timer'
import { fetchGetOfficerAppointmentsForCompany } from '../../ajax/officer/getOfficerAppointmentsForCompany'
import { IOfficerAppointmentWithOfficer } from '../../types/IOfficerAppointments'
import { CompanyProfile } from '../../components/CompanyProfile/CompanyProfile'

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
    if (!router.query.number || router.query.number instanceof Array) return
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
      <CompanyProfile
        companyData={companyData}
        companyEvents={companyEvents}
        filingEvents={filingEvents}
        apiResponseTime={apiResponseTime}
        financials={financials}
        officers={officers}
        filingHistory={filingHistory}
        loading={router.isFallback}
      />
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
  if (!companyData) return { notFound: true }
  return {
    props: returnProps, // will be passed to the page component as props
    revalidate: 86400 // revalidate every 24 hours
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] }
}
