const styles = require('./CompanyNumber.module.scss')

type CompanyNumberProps = {
  loading?: boolean
  companyNumber?: string
}

export const CompanyNumber: (props: CompanyNumberProps) => JSX.Element = ({ loading, companyNumber }) => {
  return (
    <div className={styles.container}>
      {loading ? 'Loading company number' : 'Registered company number: ' + companyNumber}
    </div>
  )
}
