const styles = require('./OfficerName.module.sass')

type OfficerNameProps = {
  loading?: boolean
  name?: string
}

export const OfficerName: (props: OfficerNameProps) => JSX.Element = ({ loading, name }) => {
  return (
    <div className={styles.container}>
      <h2>{loading ? 'loading officer name' : name}</h2>
    </div>
  )
}
