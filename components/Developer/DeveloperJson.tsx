import { UserRole } from '../../types/IUser'
import { useSession } from 'next-auth/client'
import { useState } from 'react'
import Button from '../Inputs/Button'

const styles = require('./DeveloperJson.module.sass')

type DeveloperJsonProps = {
  data: Object
}

export const DeveloperJson: (props: DeveloperJsonProps) => JSX.Element = ({ data }) => {
  const [session, loadingSession] = useSession()
  const [hidden, setHidden] = useState(true)
  return !loadingSession && session?.user.role === UserRole.DEV ? (
    <div className={styles.container}>
      <span>
        <Button label={hidden ? 'Show data' : 'Hide data'} onClick={() => setHidden((prevState) => !prevState)} />
      </span>
      {!hidden && !loadingSession && session.user.role === UserRole.DEV && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  ) : (
    <></>
  )
}
