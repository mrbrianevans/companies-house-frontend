import type { NextApiRequest, NextApiResponse } from "next";
import { IFilterOption, IGeneralFilter } from "../../../types/IFilters";

// /api/accountants/getFilters
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: filters }: { body: IGeneralFilter[] } = req;

  const filterOptions: IFilterOption[] = [
    {
      category: "production software",
      possibleComparisons: ["begins with", "is exactly", "includes"],
      valueType: "string"
    },
    {
      category: "number of clients",
      possibleComparisons: ["is between"],
      valueType: "number"
    },
    {
      category: "location",
      possibleComparisons: ["includes"],
      valueType: "string"
    },
    {
      category: "size of accounts filed",
      possibleComparisons: ["is exactly"],
      valueType: "string"
    }
  ];

  res.json(filterOptions);
}
