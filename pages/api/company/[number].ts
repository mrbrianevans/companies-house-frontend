import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabaseClient } from "../../../helpers/connectToDatabase";
import { ICompany } from "../../../types/ICompany";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { number }
  } = req;
  let response: { code: number; body: string } | undefined;
  console.time("Get db client object");
  const database = await getDatabaseClient();
  console.timeEnd("Get db client object");

  console.time("Connect to database");
  database.connect((err) => {
    console.timeEnd("Connect to database");
    if (err)
      response = {
        body: `<b>Unable to connect to database: ${err.message}</b>`,
        code: 501
      };
    else {
      console.time("Query database");
      database.query(
        `SELECT * FROM companies WHERE number='${number}'`,
        (err, result) => {
          console.timeEnd("Query database");
          if (err || result.rowCount !== 1)
            response = {
              body: `<b>Unable to get data from database: ${err.message}</b>`,
              code: 501
            };
          else response = { body: JSON.stringify(result.rows[0] as ICompany), code: 200 };
          if (response) {
            database.end((err) => {
              if (err)
                response = {
                  body: `<b>Unable to end connection to database: ${err.message}</b>`,
                  code: 501
                };
            });
            res.status(response.code).end(response.body);
          }
        }
      );
    }
    if (response) {
      database.end((err) => {
        if (err)
          response = {
            body: `<b>Unable to end connection to database: ${err.message}</b>`,
            code: 501
          };
      });
      res.status(response.code).end(response.body);
    }
  });
}
