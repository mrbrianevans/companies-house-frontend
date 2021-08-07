import Image from 'next/image'
import { CloudStorageUrl } from '../../types/constants/CloudStorageUrl'

const styles = require('./LocationMap.module.scss')

type AddressMapProps = {
  loading?: boolean
  lat?: number
  long?: number
}

export const LocationMap: (props: AddressMapProps) => JSX.Element = ({ loading, lat, long }) => {
  return (
    <div className={styles.container}>
      <Image src={CloudStorageUrl + 'map_of_uk.svg'} width={500} height={600} alt={'map of uk'} />
      {loading ? 'Loading address data' : lat && long ? `${lat} ${long}` : 'no location'}
    </div>
  )
}
