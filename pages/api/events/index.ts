import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  res
    .status(200)
    .send(
      "<p>To watch company events come in realtime, visit <a href='https://companies.stream' target='_blank'>companies.stream</a></p>"
    )
}
