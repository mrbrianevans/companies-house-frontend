import { PropsWithChildren } from 'react'
import Link from 'next/link'
import Logo from '../Logo/Logo'
import Footer from '../Footer/Footer'

const styles = require('./Page.module.css')

export const Page = (props: PropsWithChildren<any>) => {
  return (
    <>
      <div className={styles.background} />
      <Link href={'/'}>
        <a>
          <Logo />
        </a>
      </Link>
      <div className={styles.mainContainer}>
        <main className={styles.main}>
          <div className={styles.container}>{props.children}</div>
        </main>
      </div>

      <Footer />
    </>
  )
}
