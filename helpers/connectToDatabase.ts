import { Client, Pool } from "pg";
import mysql, { Connection } from "mysql";
// import {setDatabaseCredentials} from "./setDatabaseCredentials";

export const getDatabaseClient: () => Promise<Client> = async () => {
  const client = new Client({
    ssl: {
      rejectUnauthorized: false
      // require: true
    }
  })
  // const client = new Pool({
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // })
  // await client.connect();
  client.on("error", console.log);
  return client;
}
export const getDatabasePool: () => Pool = () => {
  return new Pool({
    ssl: {
      rejectUnauthorized: false
    }
  })
}
// this is for temporary use until the PostgreSQL db is up and running with data
export const getTempDatabaseClient: () => Connection = () => {
  // setDatabaseCredentials()
  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}
