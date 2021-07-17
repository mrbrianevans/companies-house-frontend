const styles = require('./CountryFlag.module.scss')

type Props = {
  country: string
  loading?: boolean
}

export const CountryFlag: (props: Props) => JSX.Element = ({ country, loading }) => {
  return <div className={styles.container}>{loading ? 'country loading' : country}</div>
}
