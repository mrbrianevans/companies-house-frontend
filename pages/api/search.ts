import type { NextApiRequest, NextApiResponse } from "next";

export const search = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send("<b>Search for a company here:</b>");
}
