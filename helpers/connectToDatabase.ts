import { Pool } from "pg";
// import Knex from 'knex';
export const getLegacyDatabasePool: () => Pool = () => {
  return new Pool({
    ssl: {
      rejectUnauthorized: false
    }
  });
};

export const getDatabasePool: () => Pool = () => {
  return new Pool({
    host: (process.env.CLOUD_SQL_CONNECTION_NAME ? `${process.env.DB_SOCKET_PATH || "/cloudsql"}/${process.env.CLOUD_SQL_CONNECTION_NAME}` : process.env.PGHOST),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT)
  });
};

// export const getCloudSqlPool: ()=>Knex.Client = () => {
//   const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';
//   return require('knex')({
//     client: 'pg',
//     connection: {
//       host: process.env.CLOUD_SQL_CONNECTION_NAME?`${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}` : '35.233.118.80',
//       ssl: true,
//       user: process.env.PGUSER,
//       password: process.env.PGPASSWORD,
//       database: process.env.PGDATABASE
//     }
//   })
// }
