import { IOfficerAppointmentFullDetails } from '../../types/IOfficerAppointments'

const styles = require('./OfficerAppointmentSummary.module.sass')

type OfficerAppointmentsProps = {
  loading?: boolean
  appointments?: IOfficerAppointmentFullDetails[]
}

export const OfficerAppointmentSummary: (props: OfficerAppointmentsProps) => JSX.Element = ({
  loading,
  appointments
}) => {
  return (
    <div className={styles.container}>
      {loading
        ? 'loading number of Officers Appointments'
        : `${appointments?.filter((a) => a.appointment.appointmentDate).length} active appointments`}
    </div>
  )
}
