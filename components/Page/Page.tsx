import { PropsWithChildren, useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from '../Logo/Logo'
import Footer from '../Footer/Footer'
import { signOut, useSession } from 'next-auth/client'
import ButtonLink from '../Inputs/ButtonLink'
import Button from '../Inputs/Button'
import { useRouter } from 'next/router'
const styles = require('./Page.module.scss')

export const Page = (props: PropsWithChildren<any>) => {
  const [session, loading] = useSession()
  const router = useRouter()
  const [newSignIn, setNewSignin] = useState<boolean>()
  useEffect(() => {
    if (router.query.signin) setNewSignin(true)
  }, [router])
  return (
    <>
      <Link href={'/'}>
        <a>
          <Logo />
        </a>
      </Link>
      <div className={styles.mainContainer}>
        <main className={styles.main}>
          {newSignIn && <h1>Successfully signed in with email</h1>}
          {!loading &&
            (session ? (
              <p>
                Signed in as {session.user.email}
                <Button label={'Sign out'} onClick={() => signOut()} />
              </p>
            ) : (
              <ButtonLink href={'/signin'} label={'Sign in'} />
            ))}
          <div className={styles.container}>{props.children}</div>
        </main>
      </div>

      <Footer />
    </>
  )
}
