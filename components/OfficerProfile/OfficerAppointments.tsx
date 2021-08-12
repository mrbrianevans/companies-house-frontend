import { IOfficerAppointmentFullDetails } from '../../types/IOfficerAppointments'
import { getYMD } from '../../helpers/utils/DateUtils'
import { CompanyName } from '../CompanyProfile/CompanyName'
import { CompanyNumber } from '../CompanyProfile/CompanyNumber'
import ButtonLink from '../Inputs/ButtonLink'
import { DeveloperJson } from '../Developer/DeveloperJson'

const styles = require('./OfficerAppointments.module.sass')

type OfficerAppointmentsProps = {
  loading?: boolean
  appointments?: IOfficerAppointmentFullDetails[]
}

export const OfficerAppointments: (props: OfficerAppointmentsProps) => JSX.Element = ({ loading, appointments }) => {
  return (
    <div className={styles.container}>
      <h2>Appointments to companies</h2>
      {!loading &&
        appointments?.map((appointment, index) => (
          <div key={index}>
            <h3>{appointment.company?.name ?? appointment.appointment.companyNumber}</h3>
            <CompanyNumber companyNumber={appointment.appointment.companyNumber} loading={false} />
            <p>
              Appointed as {appointment.appointment.appointmentType} to{' '}
              {appointment.company?.name ?? appointment.appointment.companyNumber} on{' '}
              {getYMD(appointment.appointment.appointmentDate)}
            </p>
            <p>
              <ButtonLink href={'/company/' + appointment.appointment.companyNumber}>View company</ButtonLink>
            </p>
          </div>
        ))}
      <DeveloperJson data={appointments} />
    </div>
  )
}
