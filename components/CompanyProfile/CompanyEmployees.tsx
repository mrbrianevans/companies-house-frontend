import { Person } from '../SVG/Person'

const styles = require('./CompanyEmployees.module.scss')

type CompanyEmployeesProps = {
  loading?: boolean
  employees?: number
}

export const CompanyEmployees: (props: CompanyEmployeesProps) => JSX.Element = ({ loading, employees }) => {
  return (
    <div className={styles.container}>
      <p>{loading ? 'loading' : employees ?? "Can't find "} employees</p>
      <div className={loading ? styles.loading : styles.notLoading}>
        {Array(loading ? 3 : employees || employees == 0 ? Number(employees) : 3)
          .fill(null)
          .map(() => (
            <Person />
          ))}
      </div>
    </div>
  )
}
//todo: it would be nice to display these employee icons as a triangle like Pascals Triangle
