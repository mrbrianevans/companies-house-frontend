import { IAddress } from '../../types/IAddress'

const styles = require('./PostalAddress.module.scss')

type PostalAddressProps = {
  loading?: boolean
  address?: IAddress
}

export const PostalAddress: (props: PostalAddressProps) => JSX.Element = ({ loading, address }) => {
  return (
    <div className={styles.container}>
      {loading ? (
        'Loading postal address'
      ) : (
        <address className={styles.postalAddress}>
          {address.streetAddress}
          <br />
          {address.city}
          <br />
          {address.county}
          <br />
          {address.postCode}
        </address>
      )}
    </div>
  )
}
