import { IOfficerAppointmentFullDetails, IOfficerAppointmentWithCompany } from '../../types/IOfficerAppointments'
import { getYMD, splitDate } from '../../helpers/splitDate'
import { CompanyName } from '../CompanyProfile/CompanyName'
import { CompanyNumber } from '../CompanyProfile/CompanyNumber'
import ButtonLink from '../Inputs/ButtonLink'

const styles = require('./OfficerAppointments.module.sass')

type OfficerAppointmentsProps = {
  loading?: boolean
  appointments?: IOfficerAppointmentFullDetails[]
}

export const OfficerAppointments: (props: OfficerAppointmentsProps) => JSX.Element = ({ loading, appointments }) => {
  return (
    <div className={styles.container}>
      {loading ? 'loading data for OfficerAppointments' : 'OfficerAppointments data has loaded'}
      {!loading &&
        appointments?.map((appointment, index) => (
          <div key={index}>
            <CompanyName name={appointment.company.name} loading={false} />
            <CompanyNumber companyNumber={appointment.company.companyNumber} loading={false} />
            <p>
              Appointed as {appointment.appointment.appointmentType} to {appointment.company.name} on{' '}
              {getYMD(appointment.appointment.appointmentDate)}
            </p>
            <p>
              <ButtonLink href={'/company/' + appointment.company.companyNumber}>View company</ButtonLink>
            </p>
          </div>
        ))}
      <pre>{JSON.stringify(appointments, null, 2)}</pre>
    </div>
  )
}
