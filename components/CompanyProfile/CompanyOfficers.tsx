import { IPerson } from '../../types/IPerson'
import { Person } from '../SVG/Person'

const styles = require('./CompanyOfficers.module.scss')

type CompanyOfficersProps = {
  loading?: boolean
  officers?: IPerson[]
}

export const CompanyOfficers: (props: CompanyOfficersProps) => JSX.Element = ({ loading, officers }) => {
  return (
    <div className={styles.container}>
      <p>{loading ? 'loading' : officers?.length ?? "Can't find "} officers</p>
      <div className={styles.officerContainer}>
        {(loading ? loadingOfficers : officers)?.map((officer) => (
          <div className={loading ? styles.loading : styles.notLoading}>
            <span>{officer.name}</span>
            <Person />
          </div>
        ))}
      </div>
    </div>
  )
}

const loadingOfficers: IPerson[] = [{ name: 'loading' }]
