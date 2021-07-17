const styles = require('./CompanyNumber.module.scss')

type CompanyNumberProps = {
  loading?: boolean
  companyNumber?: string
}

export const CompanyNumber: (props: CompanyNumberProps) => JSX.Element = ({ loading, companyNumber }) => {
  return (
    <div className={styles.container}>
      {loading ? 'loading data for CompanyNumber' : 'CompanyNumber data has loaded: ' + companyNumber}
    </div>
  )
}
