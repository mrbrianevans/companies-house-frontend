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
import { getSession } from 'next-auth/client'
import { getUser } from '../../../interface/user/getUser'

#if(${comma_seperated_params} == "")
    #set($params = "filters, category")
#else
    #set($params = $comma_seperated_params)
#end
// api endpoint on /api/$sub_directory/$camelName
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { body: { $params } }: { body: ${Params} } = req
  if([$comma_seperated_params].some(param=>param===undefined)){
    res.status(400).send('Some params are undefined. Required: $comma_seperated_params')
    return
  }
  const session = await getSession({ req })
  const user = await getUser({ session })
  const output = await $camelName({ $params })
  if(output){
      const { $comma_seperated_output }: ${Output} = output
      res.json({ $comma_seperated_output })
      return
  }else{
    res.status(500).send('Failed')
    return
  }
}
