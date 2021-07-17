const styles = require('./LocationMap.module.scss')

type AddressMapProps = {
  loading?: boolean
  lat?: number
  long?: number
}

export const LocationMap: (props: AddressMapProps) => JSX.Element = ({ loading, lat, long }) => {
  return (
    <div className={styles.container}>
      <img src={'/static/map_of_uk.svg'} alt={'map of uk'} className={styles.map} loading={'lazy'} />
      {loading ? 'Loading address data' : lat && long ? `${lat} ${long}` : 'no location'}
    </div>
  )
}
