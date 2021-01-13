import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabasePool } from "../../../helpers/connectToDatabase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { number }
  } = req;
  try {
    console.time("Query database SELECT");
    const pool = getDatabasePool();
    const { rows } = await pool.query("SELECT * FROM companies WHERE number=$1;", [number]);
    await pool.end();
    console.timeEnd("Query database SELECT");
    console.assert(rows.length === 1, "Multiple rows returned for single company number " + number);
    res.status(200).json(rows[0]);
  } catch (e) {
    console.error("Error occured during API execution");
    console.log(e);
    res.status(501).end("Error occured with Database fetch");
  }
}

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const {
//     query: { number }
//   } = req
//   let response: { code: number; body: string } | undefined
//   console.time('Get db client object')
//   const database = await getDatabaseClient()
//   console.timeEnd('Get db client object')
//
//   console.time('Connect to database')
//   database.connect((err) => {
//     console.timeEnd('Connect to database')
//     if (err)
//       response = {
//         body: `<b>Unable to connect to database: ${err.message}</b>`,
//         code: 501
//       }
//     else {
//       console.time('Query database')
//       database.query(
//         `SELECT * FROM companies WHERE number='${number}'`,
//         (err, result) => {
//           console.timeEnd('Query database')
//           if (err || result.rowCount !== 1)
//             response = {
//               body: JSON.stringify(err),
//               code: 501
//             }
//           else
//             response = {
//               body: JSON.stringify(result.rows[0] as ICompany),
//               code: 200
//             }
//           if (response) {
//             database.end((err) => {
//               if (err)
//                 response = {
//                   body: JSON.stringify(err),
//                   code: 501
//                 }
//             })
//             res.status(response.code).end(response.body)
//           }
//         }
//       )
//     }
//     if (response) {
//       database.end((err) => {
//         if (err)
//           response = {
//             body: `<b>Unable to end connection to database: ${err.message}</b>`,
//             code: 501
//           }
//       })
//       res.status(response.code).end(response.body)
//     }
//   })
// }
