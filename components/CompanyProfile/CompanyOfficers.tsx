import { Person } from '../SVG/Person'
import { formatOfficerName } from '../../helpers/officers/formatOfficerName'
import { IOfficerAppointmentWithOfficer } from '../../types/IOfficerAppointments'
import { getYMD } from '../../helpers/splitDate'
import ButtonLink from '../Inputs/ButtonLink'

const styles = require('./CompanyOfficers.module.scss')

type CompanyOfficersProps = {
  loading?: boolean
  officers?: IOfficerAppointmentWithOfficer[]
}

export const CompanyOfficers: (props: CompanyOfficersProps) => JSX.Element = ({ loading, officers }) => {
  return (
    <div className={styles.container}>
      <p>{loading ? 'loading' : officers?.length ?? "Can't find "} officers</p>
      <div className={styles.officerContainer}>
        {(loading ? loadingOfficers : officers)?.map((officer, index) => (
          <div className={loading ? styles.loading : styles.notLoading} key={index}>
            <span>{formatOfficerName(officer.officer)}</span>
            <p>Appt. on {getYMD(officer.appointment?.appointmentDate)}</p>
            <Person />
            <ButtonLink href={'/officer/' + officer.officer.personNumber}>View</ButtonLink>
          </div>
        ))}
      </div>
    </div>
  )
}

const loadingOfficers: IOfficerAppointmentWithOfficer[] = [
  { officer: { personNumber: '', surname: 'loading' }, appointment: null, officerAddress: null }
]
