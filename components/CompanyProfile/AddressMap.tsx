import { IAddress } from '../../types/IAddress'

const styles = require('./AddressMap.module.scss')

type AddressMapProps = {
  loading?: boolean
  address?: IAddress
}

export const AddressMap: (props: AddressMapProps) => JSX.Element = ({ loading, address }) => {
  return (
    <div className={styles.container}>
      {loading ? 'loading data for AddressMap' : 'AddressMap data has loaded' + address.streetAddress}
    </div>
  )
}
