import { capitalizeEveryWord } from '../../helpers/StringManipulation'
import { CloudStorageUrl } from '../../types/constants/CloudStorageUrl'
import Image from 'next/image'

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
          <Image
            src={CloudStorageUrl + 'flags/3by2/' + country.toLowerCase() + '.svg'}
            width={500}
            height={600}
            alt={'flag of ' + capitalizeEveryWord(country)}
          />
        </div>
      )}
    </div>
  )
}
