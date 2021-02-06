import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabasePool } from "../../../helpers/connectToDatabase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { company_number }
  } = req
  try {
    console.time("Query database SELECT accounts");
    const pool = getDatabasePool();
    const {
      rows: financials
    } = await pool.query("SELECT * FROM accounts WHERE company_number=$1;", [
      company_number
    ]);
    await pool.end();
    console.timeEnd("Query database SELECT accounts");
    res.status(200).json({ financials });
  } catch (e) {
    console.error("Error occured during API execution");
    console.log(e);
    res.status(501).end("Error occured with Database fetch");
  }
}
