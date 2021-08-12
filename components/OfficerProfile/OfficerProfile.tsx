import { IOfficerItem } from '../../types/IOfficer'
import { OfficerName } from './OfficerName'
import { ShareCode } from '../ShareCode/ShareCode'
import { AddressWithMapAndFlag } from '../Locations/AddressWithMapAndFlag'
import { formatOfficerName } from '../../helpers/officers/formatOfficerName'
import { getOfficerAddressFromItem } from '../../helpers/officers/getOfficerAddressFromItem'
import { IOfficerAppointmentFullDetails } from '../../types/IOfficerAppointments'
import { OfficerAppointments } from './OfficerAppointments'
import { OfficerAppointmentSummary } from './OfficerAppointmentSummary'
import { UserRole } from '../../types/IUser'
import { DeveloperJson } from '../Developer/DeveloperJson'
import { useSession } from 'next-auth/client'
import { BirthDate } from './BirthDate'

const styles = require('./OfficerProfile.module.scss')

type OfficerProfileProps = {
  loading?: boolean
  officer?: IOfficerItem
  appointments?: IOfficerAppointmentFullDetails[]
  appointmentsLoading?: boolean
}

export const OfficerProfile: (props: OfficerProfileProps) => JSX.Element = ({
  loading,
  officer,
  appointments,
  appointmentsLoading
}) => {
  return (
    <article className={styles.layout}>
      <section className={styles.name}>
        <OfficerName loading={loading} name={officer && formatOfficerName(officer)} />
      </section>
      <section className={styles.birthDate}>
        <BirthDate loading={loading} birthDate={officer?.birthDate} />
      </section>
      <section className={styles.sharecode}>
        <ShareCode text={'filfa.co/o/' + officer?.personNumber} />
      </section>
      <section className={styles.status}>
        <OfficerAppointmentSummary appointments={appointments} loading={appointmentsLoading} />
      </section>
      <section className={styles.location}>
        <AddressWithMapAndFlag
          address={
            appointments?.find((appt) => appt.officerAddress)?.officerAddress ??
            (officer && getOfficerAddressFromItem(officer))
          }
          loading={loading && appointmentsLoading}
        />
      </section>
      <section className={styles.companies}>
        <OfficerAppointments appointments={appointments} loading={appointmentsLoading} />
      </section>
      <section className={styles.timeline}>
        <h2>Timeline</h2>
        <p>View when this officer has been appointed and terminated to different companies. Coming soon</p>
      </section>
    </article>
  )
}
