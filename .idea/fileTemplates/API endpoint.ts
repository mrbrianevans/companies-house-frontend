// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})

#set($Params = ${PascalName} + "Params")
#set($Output = ${PascalName} + "Output")
import { ${Params}, ${Output} } from '../../interface/${sub_directory}/${camelName}'
#if(${comma_seperated_params} == "")
    #set($params = "filters, category")
#else
    #set($params = $comma_seperated_params)
#end
#set($output_list = $comma_seperated_output.split(', '))


/** Frontend AJAX call to $camelName method on the backend 
 *
 * @example
 * await #[[$END$]]#fetch${PascalName}({ $params })
 */
export const fetch${PascalName}: (params: ${Params}) => Promise<${Output}> = async({ $params }) => {
  return await fetch('/api/filter/${camelName}', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ $params })
  }).then(r => r.json())
}