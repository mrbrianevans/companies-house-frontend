import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

const companyNumbers = [
  "09859512",
  "08504232",
  "07135741",
  "09025929",
  "08036062"
];
export default function Home() {
  const [name, setName] = useState();
  const [cn, setCn] = useState(companyNumbers[Math.round(Math.random() * 5)]);
  const chooseNewCompanyNumber = () => {
    setCn(companyNumbers[Math.round(Math.random() * companyNumbers.length)]);
  };
  const callAPI = () => {
    fetch(`api/company/${cn}`).then(response => {
      console.log(`Response code: ${response.status}, body: ${response.body}`);
      return response.json();
    }).then(jsonResponse => {
      console.log(`JSON response: ${JSON.stringify(jsonResponse)}`);
      setName(jsonResponse[0].name);
    });
  };
  useEffect(() => {
    callAPI();
  }, [cn]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to companies house!
        </h1>

        <p className={styles.description}>
          Get started by searching for a company
        </p>
        <p>API available at: <a href={`http://localhost:3000/api/company/${cn}`}>/api</a></p>
        <p>Example fetch: {name || "waiting"}</p>
        <button onClick={chooseNewCompanyNumber}>Call API</button>
      </main>

    </div>
  );
}
