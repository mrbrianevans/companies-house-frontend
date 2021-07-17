import { IPerson } from '../../types/IPerson'

const styles = require('./CompanyOfficers.module.scss')

type CompanyOfficersProps = {
  loading?: boolean
  officers?: IPerson[]
}

export const CompanyOfficers: (props: CompanyOfficersProps) => JSX.Element = ({ loading, officers }) => {
  return (
    <div className={styles.container}>
      {loading
        ? 'loading data for CompanyOfficers'
        : 'CompanyOfficers data has loaded' + officers?.map((o) => o.name).join(' & ')}
    </div>
  )
}
