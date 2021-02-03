import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { company_name }
  } = req;

  res.status(200).end("To query the sic codes of a company, request /api/sic/[company_name] for a JSON response array");

}
