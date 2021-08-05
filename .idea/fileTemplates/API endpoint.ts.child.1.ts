// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($Params = ${PascalName} + "Params")
#set($Output = ${PascalName} + "Output")
// to import from this file, use: import { ${Params}, ${Output}, $camelName } from '../../interface/${sub_directory}/${camelName}'

import { IFilterValue } from '../../types/IFilters'
import { FilterCategory } from '../../types/FilterCategory'
import { getDatabasePool } from '../../helpers/connectToDatabase'
import { getFilterId } from '../../filters/helpers/getFilterId'
import { Timer } from '../../helpers/Timer'
import getFilterConfig from '../../helpers/getFilterConfig'

#if(${comma_seperated_params} == "")
    #set($params = "filters, category")
#else
    #set($params = $comma_seperated_params)
#end
#set($params_list = $params.split(', '))
#set($output_list = $comma_seperated_output.split(', '))

// input parameters for $camelName - $params
export interface $Params {
#if(${comma_seperated_params} == "")
    filters: IFilter[]
    category: FilterCategory
#else
    #foreach ($param in $params_list)
    $param: any
    #end
#end
}
// return type of $camelName - $comma_seperated_output
export interface $Output {
#if($comma_seperated_output != "")
    #foreach ($output in $output_list)
    $output: any
    #end
#end
}

/**
 * $camelName interface method
 *
 * @example await $camelName({$params})
 * @param  $Params $params
 * @returns  $Output $comma_seperated_output
 */
export async function $camelName({ $params }: $Params): Promise<$Output>{
    const timer = new Timer({label: "$camelName() method call", filename: "${DIR_PATH}/${FILE_NAME}"})
    const pool = getDatabasePool()
    #if(${comma_seperated_params} == "")
    const id = getFilterId(filters, category)
    const config = getFilterConfig({ category })
    #end
    const result = await pool.query(`
    SELECT * FROM companies LIMIT 10
    `)
        .then(({rows})=>rows)
        .catch(e=>timer.postgresError(e))
    if(!result || result?.length === 0) 
        timer.customError('No results returned')
    await pool.end()
    timer.flush()
    const output: $Output = {$output}
    return output
}