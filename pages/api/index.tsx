// API Documentation
import { NextApiHandler } from 'next'

const apiHome: NextApiHandler = (req, res) => {
  res
    .status(200)
    .send(
      "<b>Read the API Docs here:</b> <a href='https://github.com/mrbrianevans/companies-house-backend/blob/master/README.md'>README.md</a>"
    )
}

export default apiHome
