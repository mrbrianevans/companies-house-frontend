import { CompanyName } from './CompanyName'
import { CompanyNumber } from './CompanyNumber'
import { CompanyStatusTrafficLight } from './CompanyStatusTrafficLight'
import { AddressWithMapAndFlag } from '../Locations/AddressWithMapAndFlag'
import { CompanyEmployees } from './CompanyEmployees'
import { CompanyOfficers } from './CompanyOfficers'
import { VerticalTimeline } from '../VerticalTimeline/VerticalTimeline'
import { capitalizeEveryWord } from '../../helpers/utils/StringUtils'
import { IOfficerAppointmentWithOfficer } from '../../types/IOfficerAppointments'
import { GetFilingsListResponse } from '../../pages/api/chApi/getFilingsList'
import { ICompanyFullDetails } from '../../types/ICompany'
import { CompanyEvent, FilingEvent } from '../../types/IEvent'
import { ICompanyAccounts } from '../../types/ICompanyAccounts'
import { ShareCode } from '../ShareCode/ShareCode'
import { useSession } from 'next-auth/client'
import { UserRole } from '../../types/IUser'
import { DeveloperJson } from '../Developer/DeveloperJson'

const styles = require('./CompanyProfile.module.scss')

type CompanyProfileProps = {
  loading?: boolean
  officers?: IOfficerAppointmentWithOfficer[]
  filingHistory?: GetFilingsListResponse
  companyData: ICompanyFullDetails
  apiResponseTime: number
  filingEvents?: FilingEvent[]
  companyEvents?: CompanyEvent[]
  financials: ICompanyAccounts
}

export const CompanyProfile = ({
  loading,
  companyData,
  apiResponseTime,
  filingEvents,
  companyEvents,
  financials,
  officers,
  filingHistory
}: CompanyProfileProps): JSX.Element => {
  const [session, loadingSession] = useSession()
  return (
    <article className={styles.layout}>
      <section className={styles.name}>
        <CompanyName name={companyData?.company.name} loading={companyData === undefined} />
      </section>
      <section className={styles.number}>
        <CompanyNumber loading={companyData === undefined} companyNumber={companyData?.company.companyNumber} />
      </section>
      <section className={styles.sharecode}>
        <ShareCode text={`filfa.co/c/${companyData?.company.companyNumber}`} loading={companyData === undefined} />
      </section>
      <section className={styles.status}>
        <CompanyStatusTrafficLight status={companyData?.company.status} loading={companyData === undefined} />
      </section>
      <section className={styles.location}>
        <AddressWithMapAndFlag address={companyData?.address} loading={companyData === undefined} />
      </section>
      <section className={styles.employees}>
        <CompanyEmployees employees={financials?.employees} loading={financials === undefined} />
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
          loading={filingEvents === undefined}
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

      {!loadingSession && session?.user?.role === UserRole.DEV && (
        <section className={styles.developer}>
          <DeveloperJson data={companyData} />
        </section>
      )}
    </article>
  )
}
