import { Page } from '../../components/Page/Page'
import { useRouter } from 'next/router'
import ButtonLink from '../../components/Inputs/ButtonLink'

const SigninError = () => {
  const router = useRouter()
  return (
    <Page dontShowLogin>
      <h1>Error</h1>
      <p>Failed to sign in due to {router.query['error']}</p>
      <p>
        Try again at <ButtonLink href={'/auth/signin'} />, and if the problem persists, contact us
      </p>
    </Page>
  )
}

export default SigninError
