#set($name = $NAME.substring(0,1).toUpperCase() + $NAME.substring(1))
const styles = require('./${name}.module.scss')

type ${name}Props = {
  loading?: boolean
}

export const $name: (props: ${name}Props) => JSX.Element = ({ loading }) => {
  return <div className={styles.container}>
    {loading ? 'loading data for ${name}' : '$name data has loaded'}
  </div>
}
