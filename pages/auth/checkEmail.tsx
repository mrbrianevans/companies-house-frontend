import { Page } from '../../components/Page/Page'
import { useSession } from 'next-auth/client'

const SigninError = () => {
  const [session, loading] = useSession()
  return (
    <Page dontShowLogin>
      {!loading &&
        (session ? (
          <h1>Success. Signed in</h1>
        ) : (
          <>
            <h1>Check your email</h1>
            <p>You will be signed in on the device that you click the link from</p>
          </>
        ))}
    </Page>
  )
}

export default SigninError
