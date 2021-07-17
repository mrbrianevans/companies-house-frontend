const styles = require('./CompanyEmployees.module.scss')

type CompanyEmployeesProps = {
  loading?: boolean
  employees?: number
}

export const CompanyEmployees: (props: CompanyEmployeesProps) => JSX.Element = ({ loading, employees }) => {
  return (
    <div className={styles.container}>
      {loading ? 'loading data for CompanyEmployees' : 'CompanyEmployees data has loaded ' + employees + ' employees'}
    </div>
  )
}
