import { Page } from '../components/Page/Page'

const styles = require('../styles/404.module.css')
export default function Home() {
  return (
    <Page>
      <div className={styles.messageContainer}>
        <h3>404</h3>
        <p>Page not found</p>
      </div>
    </Page>
  )
}
