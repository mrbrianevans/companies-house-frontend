import { PropsWithChildren } from "react";
import Link from "next/link";

const styles = require("../styles/Home.module.css");

export const Page = (props: PropsWithChildren<any>) => {
  return (
    <main className={"main"}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <Link href={"/"}>
            <a>Filter Facility</a>
          </Link>
        </h1>
        {props.children}
      </div>
    </main>
  )
}
