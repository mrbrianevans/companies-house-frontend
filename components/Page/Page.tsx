import { PropsWithChildren } from 'react'
import Link from 'next/link'
import Logo from '../Logo/Logo'
import Footer from '../Footer/Footer'
import { signOut, useSession } from 'next-auth/client'
import ButtonLink from '../Inputs/ButtonLink'

const styles = require('./Page.module.scss')

interface Props extends PropsWithChildren<any> {
  dontShowLogin?: boolean
  dontShowLogout?: boolean
}

export const Page = (props: Props) => {
  const [session, loading] = useSession()
  return (
    <>
      <Link href={'/'}>
        <a>
          <Logo />
        </a>
      </Link>
      <div className={styles.mainContainer}>
        <main className={styles.main}>
          {!loading && (
            <div style={{ placeItems: 'center end', display: 'grid' }}>
              {session
                ? props.dontShowLogout !== true && (
                    <p>
                      Signed in as {session.user.email}. <ButtonLink href={'/account'} label={'View account'} />{' '}
                      <a onClick={() => signOut()} href={'#'}>
                        Sign out
                      </a>
                    </p>
                  )
                : props.dontShowLogin !== true && (
                    <div style={{ margin: '0.2rem' }}>
                      <ButtonLink href={'/auth/signin'} label={'Sign in'} />
                    </div>
                  )}
            </div>
          )}
          <div className={styles.container}>{props.children}</div>
        </main>
      </div>

      <Footer />
    </>
  )
}
