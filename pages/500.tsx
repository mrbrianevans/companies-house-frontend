import { Page } from '../components/Page/Page'

const styles = require('../styles/404.module.css')
export default function Home() {
  return (
    <Page>
      <div className={styles.messageContainer}>
        <h3>500</h3>
        <p>Internal server error</p>
      </div>
    </Page>
  )
}
