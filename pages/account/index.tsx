import { Page } from '../../components/Page/Page'
import { signOut, useSession } from 'next-auth/client'
import ButtonLink from '../../components/Inputs/ButtonLink'
import Button from '../../components/Inputs/Button'
import { TextInputWithButton } from '../../components/Inputs/TextInputWithButton'

const SigninError = () => {
  const [session, loading] = useSession()
  return (
    <Page dontShowLogin dontShowLogout>
      <h1>My Account</h1>
      {!loading &&
        (session ? (
          <>
            <p>You are signed in with {session.user.email}</p>
            <p>
              <TextInputWithButton
                textBoxPlaceholder={'Your name'}
                buttonText={'Set name'}
                textBoxStyle={{ fontSize: '1rem' }}
                buttonStyle={{ fontSize: '1rem', padding: '0.5rem 1.5rem' }}
              />{' '}
              (this feature doesn't work yet)
            </p>
            <p>
              <Button label={'Sign out'} onClick={signOut} />
            </p>
          </>
        ) : (
          <p>
            You are not signed in yet. <ButtonLink href={'/auth/signin'} label={'Sign in!'} />
          </p>
        ))}
    </Page>
  )
}

export default SigninError
