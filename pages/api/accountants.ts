import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabasePool } from "../../helpers/connectToDatabase";

interface IAccountantFilter {
  category: "clients" | "software" | "location" | "financial"
  comparison: "equals" | "less than" | "greater than" | "not equal to" | "asc" | "desc"
  value: string | number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: filters }: { body: IAccountantFilter[] } = req;
  const matches = [];
  for (const filter of filters) {
    if (filter.category === "software")
      matches.push(await filterBySoftware(filter));
  }
  res
    .status(200)
    .send("<b>View matching accountants here</b> <p>" + JSON.stringify(matches) + "</p>");
}

const filterBySoftware: (filter: IAccountantFilter) => Promise<{}[]> = async (filter) => {
  const pool = getDatabasePool();
  if (filter.category !== "software") throw new Error("Wrong category function used");
  // this is either matching accounts who do or who don't use the specified software
  let sqlGetPractices = "SELECT * FROM companies WHERE name IN (" +
    "SELECT DISTINCT value FROM accounts WHERE label='Name of entity accountants' AND company_number" + (filter.comparison === "not equal to" ? " NOT " : " ") +
    "IN (" +
    "SELECT DISTINCT company_number FROM accounts WHERE label='Name of production software' AND value=$1 LIMIT 100000" +
    ") LIMIT 10" +
    ");";
  console.log("Querying:", sqlGetPractices.replace("$1", "'" + filter.value.toString() + "'"));
  const { rows: matches }: { rows: {}[] } = await pool.query(sqlGetPractices, [filter.value]);
  return matches;
};
