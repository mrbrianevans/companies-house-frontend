import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/client'
import { Page } from '../../components/Page/Page'
import TextBox from '../../components/Inputs/TextBox'
import Button from '../../components/Inputs/Button'
import { TextInputWithButton } from '../../components/Inputs/TextInputWithButton'

const styles = require('../../styles/SignIn.module.scss')
//todo: show a different page if the user is already signed in
const SignIn = () => {
  const [session, loading] = useSession()
  useEffect(() => {
    console.log(session, loading)
  }, [loading])
  const signin = async (emailAddress: string) => {
    await signIn('email', { email: emailAddress, callbackUrl: process.env.NEXTAUTH_URL + '/auth/signedIn?signin=true' })
  }
  return (
    <Page dontShowLogin>
      <h1>Sign In</h1>
      <h3>No account needed</h3>
      <p>Filter Facility uses email-only login. You'll get an email with a link to sign in</p>
      <TextInputWithButton
        buttonText={'Sign in'}
        buttonOnClick={signin}
        textBoxPlaceholder={'Email address'}
        buttonStyle={{ fontSize: '1.2rem', padding: '0.6rem 1.6rem' }}
        textBoxStyle={{ fontSize: '1.2rem' }}
        textInputType={'email'}
        textBoxProps={{ spellCheck: false, autoComplete: 'on', autoCapitalize: 'off' }}
      />
      <p style={{ fontSize: '0.7rem' }}>
        Your email address will not be used for anything other than authenticating your account
      </p>
      <p>You will be signed on the device where you click the emailed link</p>
    </Page>
  )
}

export default SignIn
