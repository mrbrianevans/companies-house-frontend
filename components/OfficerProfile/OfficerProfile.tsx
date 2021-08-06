import { IOfficerItem } from '../../types/IOfficer'
import { OfficerName } from './OfficerName'
import { ShareCode } from '../ShareCode/ShareCode'
import { AddressWithMapAndFlag } from '../Locations/AddressWithMapAndFlag'
import { formatOfficerName } from '../../helpers/officers/formatOfficerName'
import { getOfficerAddressFromItem } from '../../helpers/officers/getOfficerAddressFromItem'
import { IOfficerAppointmentFullDetails, IOfficerAppointmentWithCompany } from '../../types/IOfficerAppointments'
import { OfficerAppointments } from './OfficerAppointments'
import { OfficerAppointmentSummary } from './OfficerAppointmentSummary'

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
      <section className={styles.sharecode}>
        <ShareCode text={'filfa/o/' + officer?.personNumber} />
      </section>
      <section className={styles.status}>
        <OfficerAppointmentSummary appointments={appointments} loading={appointmentsLoading} />
      </section>
      <section className={styles.location}>
        <AddressWithMapAndFlag
          address={
            appointments?.length ? appointments[0].officerAddress : officer && getOfficerAddressFromItem(officer)
          }
          loading={loading && appointmentsLoading}
        />
      </section>
      <section className={styles.companies}>
        <OfficerAppointments appointments={appointments} loading={appointmentsLoading} />
      </section>
      <section className={styles.timeline}></section>
      {loading ? 'loading data for OfficerProfile' : 'OfficerProfile data has loaded'}
      <pre>{JSON.stringify(officer, null, 2)}</pre>
    </article>
  )
}
