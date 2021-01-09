import Link from "next/link";

const styles = require("../styles/Home.module.css");
export default function Home() {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Companies house</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <a href={"#"} className={"card-link"}><Link href={"/"}>
            <div className={"card-header"}>
              <h3>Docs</h3>
            </div>
          </Link></a>
          <div className={"card-body"}>
            <p>Search for a <code>company</code> by name</p>
          </div>
        </div>
        <div className={styles.card}>
          <a href={"#"} className={"card-link"}><Link href={"/api"}>
            <div className={"card-header"}>
              <h3>API Docs</h3>
            </div>
          </Link></a>
          <div className={"card-body"}>
            <p>Search for a <code>company</code> by name</p>
          </div>
        </div>
        <div className={styles.card}>
          <a href={"#"} className={"card-link"}><Link href={"/search"}>
            <div className={"card-header"}>
              <h3>Search</h3>
            </div>
          </Link></a>
          <div className={"card-body"}>
            <p>Search for a <code>company</code> by name</p>
          </div>
        </div>
        <div className={styles.card}>
          <a href={"#"} className={"card-link"}><Link href={"/filter"}>
            <div className={"card-header"}>
              <h3>Filter</h3>
            </div>
          </Link></a>
          <div className={"card-body"}>
            <p>Search for a <code>company</code> by name</p>
          </div>
        </div>
      </div>
    </div>
  );
}
