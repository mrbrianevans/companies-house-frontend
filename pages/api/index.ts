import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    res
      .status(200)
      .send(
        "<b>Read the API Docs here:</b> <a href='https://github.com/mrbrianevans/companies-house-backend/blob/master/README.md'>README.md</a>"
      );
}
