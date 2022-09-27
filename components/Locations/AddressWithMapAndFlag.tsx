import { IAddress } from '../../types/IAddress'
import { CountryFlag } from './CountryFlag'
import { LocationMap } from './LocationMap'
import { PostalAddress } from './PostalAddress'

const styles = require('./AddressWithMapAndFlag.module.scss')

type AddressWithMapAndFlagProps = {
  loading?: boolean
  address?: IAddress
}

export const AddressWithMapAndFlag: (props: AddressWithMapAndFlagProps) => JSX.Element = ({ loading, address }) => {
  return (
    <div className={styles.container}>
      <div className={styles.address}>
        <PostalAddress address={address} loading={loading} />{' '}
      </div>
      <div className={styles.flag}>
        <CountryFlag country={address?.country} loading={loading} />
      </div>
      <div className={styles.map}>
        <LocationMap loading={loading} lat={address?.lat} long={address?.long} />
      </div>
    </div>
  )
}
