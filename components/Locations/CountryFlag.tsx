import { capitalizeEveryWord } from '../../helpers/StringManipulation'

const styles = require('./CountryFlag.module.scss')

type Props = {
  country: string
  loading?: boolean
}

export const CountryFlag: (props: Props) => JSX.Element = ({ country, loading }) => {
  return (
    <div className={styles.container}>
      {loading || !country ? (
        <div>
          <div>Country</div>
          <div className={styles.flag}>?</div>
        </div>
      ) : (
        <div>
          <div>{capitalizeEveryWord(country)}</div>
          <img
            className={styles.flag}
            src={'/static/flags/3by2/' + country.toLowerCase() + '.svg'}
            alt={'flag of ' + country}
          />
        </div>
      )}
    </div>
  )
}
