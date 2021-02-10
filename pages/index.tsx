import Link from "next/link";
import { Page } from "../components/Page";

const styles = require("../styles/Home.module.css");
export default function Home() {
  return (
    <Page>
      <div className={styles.grid + " " + styles.smallGrid}>
        <div className={styles.card + " " + styles.double}>
          <a className={"card-link"}>
            <Link href={"/docs"}>
              <div className={"card-header"}>
                <h3>Docs</h3>
              </div>
            </Link>
          </a>
          <div className={"card-body"}>
            <p>Learn about using this interface</p>
          </div>
        </div>
        <div className={styles.card + " " + styles.double}>
          <a href={"#"} className={"card-link"}>
            <Link href={"/apiDocs"}>
              <div className={"card-header"}>
                <h3>API Docs</h3>
              </div>
            </Link>
          </a>
          <div className={"card-body"}>
            <p>Use this API as a data source</p>
          </div>
        </div>
        <div className={styles.card + " " + styles.double}>
          <a href={"#"} className={"card-link"}>
            <Link href={"/search"}>
              <div className={"card-header"}>
                <h3>Search</h3>
              </div>
            </Link>
          </a>
          <div className={"card-body"}>
            <p>
              Search for a <code>company</code> by name
            </p>
          </div>
        </div>
        <div className={styles.card + " " + styles.double}>
          <a href={"#"} className={"card-link"}>
            <Link href={"/filter"}>
              <div className={"card-header"}>
                <h3>Filter</h3>
              </div>
            </Link>
          </a>
          <div className={"card-body"}>
            <p>
              Filter <code>companies</code> by metrics
            </p>
          </div>
        </div>
        <div className={styles.card + " " + styles.full}>
          <a className={"card-link"}>
            <Link href={"/accountants"}>
              <div className={"card-header"}>
                <h3>Accountants</h3>
              </div>
            </Link>
          </a>
          <div className={"card-body"}>
            <p>Find accountants</p>
          </div>
        </div>
      </div>
    </Page>
  )
}
