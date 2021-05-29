type Props = {
  list: string[]
}
const styles = require('./Lists.module.scss')
export const FeatureList = ({ list }: Props) => {
  return (
    <ul className={styles.FeatureList}>
      {list.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}
