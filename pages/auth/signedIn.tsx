import { Page } from '../../components/Page/Page'
import { useSession } from 'next-auth/client'

const SigninError = () => {
  const [session, loading] = useSession()
  return (
    <Page>
      <h1>Signed in</h1>
      {!loading &&
        (session !== undefined ? (
          <p>You've successfully signed in with {session.user.email}</p>
        ) : (
          <p>You are viewing this page in error. You have not been signed in. </p>
        ))}
    </Page>
  )
}

export default SigninError
