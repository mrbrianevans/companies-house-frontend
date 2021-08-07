const styles = require('./OfficerName.module.sass')

type OfficerNameProps = {
  loading?: boolean
  name?: string
}

export const OfficerName: (props: OfficerNameProps) => JSX.Element = ({ loading, name }) => {
  return (
    <div className={styles.container}>
      <h1>{loading ? 'loading officer name' : name}</h1>
    </div>
  )
}
