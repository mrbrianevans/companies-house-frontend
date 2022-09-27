// this is the get profile service method for a $NAME 
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($nameEnum = $NAME.toUpperCase())
#set($lower_name = $NAME.toLowerCase())

import { I${PascalName}DatabaseItem, I${PascalName}Item, convert${PascalName}DatabaseItemToItem } from '../types/I${PascalName}'
import { FilterCategory } from '../types/FilterCategory'
import { getDatabasePool } from '../helpers/connectToDatabase'
import getFilterConfig from '../helpers/getFilterConfig'
import { Timer } from '../helpers/Timer'
/**
 * get $camelName profile by ${lower_name}_id
 *
 * @example 
 * const $camelName = await get${PascalName}Profile(${lower_name}_id)
 *
 * @param  ${lower_name}_id string the id of the $PascalName
 * @returns  $PascalName
 */
export const get${PascalName}Profile = async (${lower_name}_id: string) => {
    const timer = new Timer({label: "get${PascalName}Profile() method call", filename: "${DIR_PATH}/${FILE_NAME}", details: {${lower_name}_id}})
    const pool = getDatabasePool()
    const category = FilterCategory.$nameEnum
    const config = getFilterConfig({ category })
    const results: I${PascalName}DatabaseItem[] | null | undefined = await pool.query(`
    SELECT * FROM ${lower_name} WHERE ${lower_name}_id = $1
    `, [${lower_name}_id])
        .then(({rows})=>rows)
        .catch(e=>timer.postgresError(e))
    if(!results || results?.length === 0) {
        timer.customError('No results returned')
        return null
    }
    await pool.end()
    timer.flush()
    const output: I${PascalName}Item = convert${PascalName}DatabaseItemToItem(results[0])
    return output
}