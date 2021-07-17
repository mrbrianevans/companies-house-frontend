const styles = require('./CompanyName.module.scss')

type Props = {
  name?: string
  loading?: boolean
}

export const CompanyName: (props: Props) => JSX.Element = ({ name, loading }) => {
  return (
    <div>
      <h1>{loading ? 'loading' : name}</h1>
    </div>
  )
}
