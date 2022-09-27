import { Page } from '../components/Page/Page'
import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/client'
import TextBox from '../components/Inputs/TextBox'
import Button from '../components/Inputs/Button'

const styles = require('../styles/SignIn.module.scss')

const SignIn = () => {
  const [emailAddress, setEmailAddress] = useState<string>()
  const [session, loading] = useSession()
  useEffect(() => {
    console.log(session, loading)
  }, [loading])
  const signin = async () => {
    const res = await signIn('email', { email: emailAddress, callbackUrl: process.env.NEXTAUTH_URL + '?signin=true' })
    console.log(res)
  }
  return (
    <Page>
      <h1>Sign In</h1>
      <p>Filter Facility uses email-only login. No password needed!</p>
      <TextBox value={emailAddress} onChange={setEmailAddress} placeholder={'Email address'} />
      <Button label={'Sign in'} onClick={signin} />

      <p style={{ fontSize: '0.7rem' }}>
        Your email address will not be used for anything other than authenticating your account
      </p>
    </Page>
  )
}

export default SignIn
