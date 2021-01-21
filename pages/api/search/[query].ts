import { NextApiRequest, NextApiResponse } from "next";
import { getDatabasePool } from "../../../helpers/connectToDatabase";
import { ICompany } from "../../../types/ICompany";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { query }
  } = req;
  let searchQuery;
  if (typeof query === "string") searchQuery = query;
  else searchQuery = query.join(" ");
  searchQuery = decodeURIComponent(searchQuery).toUpperCase().trim();
  const queryWords = searchQuery.split(" ");
  console.log(`Search query: ${searchQuery}`);
  console.log(`All search words: [${queryWords.join(", ")}]`);
  const pool = getDatabasePool();
  // all the different types of search go here:
  const sqlQueries = [
    "SELECT * FROM companies WHERE name=$1",
    "SELECT * FROM companies WHERE name LIKE $1",
    "SELECT * FROM companies WHERE name LIKE ANY($1)"
  ];
  const sqlBindings = [
    [searchQuery],
    [`%${searchQuery}%`],
    [queryWords.map(q => `%${q}%`)]
  ];
  const combinedResults: ICompany[] = [];
  for (let rowCount = 0, rowLimit = 20, searchLevels = 0; rowCount < rowLimit && searchLevels < sqlQueries.length; searchLevels++) {
    console.log(`Querying: (${sqlQueries[searchLevels]}, ${sqlBindings[searchLevels]})`);
    const { rows } = await pool.query(sqlQueries[searchLevels] + " LIMIT " + (rowLimit - rowCount), sqlBindings[searchLevels]);
    rowCount += rows.length;
    console.log(`Querying: (${sqlQueries[searchLevels]}, ${sqlBindings[searchLevels]})`, "resulted in", rows.length, "rows");
    combinedResults.push(...rows);
  }
  //todo: get the sic codes for all combined companies
  const { rows: sics } = await pool.query(
    "SELECT * FROM sic WHERE company_number=ANY($1)",
    [combinedResults.map(result => (result.number))]
  );
  sics.forEach(sic => {
    if (combinedResults[combinedResults.findIndex(result => result.number === sic.company_number)].sicCodes)
      combinedResults[combinedResults.findIndex(result => result.number === sic.company_number)].sicCodes.push(sic.sic_code);
    else
      combinedResults[combinedResults.findIndex(result => result.number === sic.company_number)].sicCodes = [sic.sic_code];
  });
  // console.log("SICS: ", sics)
  await pool.end();
  console.log(combinedResults.length, `results returned`);
  res.status(200).json({ companies: combinedResults, query: searchQuery });
}
