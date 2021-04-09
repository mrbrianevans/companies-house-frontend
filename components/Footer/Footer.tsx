import Link from 'next/link'

const styles = require('./Footer.module.css')
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinksContainer}>
        <Link href={'/'}>
          <a>Home</a>
        </Link>
        <Link href={'/about'}>
          <a>About</a>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
