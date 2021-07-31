// Search bar for $NAME
// this file is located in: /${DIR_PATH}/${FILE_NAME}

#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($nameEnum = $NAME.toUpperCase())
import { GenericSearchBar } from './GenericSearchBar'
import getFilterConfig from '../../helpers/getFilterConfig'
import { FilterCategory } from '../../types/FilterCategory'
import { capitalizeEveryWord } from '../../helpers/StringManipulation'

type ${PascalName}SearchBarParams = { initialValue?: string }
const config = getFilterConfig({category: FilterCategory.$nameEnum})
export const ${PascalName}SearchBar = (props: ${PascalName}SearchBarParams) => {
  return (
    <GenericSearchBar
      initialValue={props.initialValue}
      textBoxPlaceholder={capitalizeEveryWord(config.labelPlural)}
      textBoxId={config.labelSingular+'SearchBox'}
      buttonLink={(value: string) => '/'+config.urlPath+'/search/' + encodeURIComponent(value)}
    />
  )
}
