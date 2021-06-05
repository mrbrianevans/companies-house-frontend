// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($Params = ${PascalName} + "Params")
#set($Output = ${PascalName} + "Output")

import { ${Params}, ${Output}, $camelName } from '../../../interface/${sub_directory}/${camelName}'
import { NextApiRequest, NextApiResponse } from 'next'

#if(${comma_seperated_params} == "")
    #set($params = "filters, category")
#else
    #set($params = $comma_seperated_params)
#end
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: { $params } }: { body: ${Params} } = req
  const { $comma_seperated_output }: ${Output} = await $camelName({ $params })
  res.json({ $comma_seperated_output })
}
