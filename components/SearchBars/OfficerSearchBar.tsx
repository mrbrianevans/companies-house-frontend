// Search bar for officer
// this file is located in: /components/SearchBars/OfficerSearchBar.tsx

import { GenericSearchBar } from './GenericSearchBar'
import getFilterConfig from '../../helpers/getFilterConfig'
import { FilterCategory } from '../../types/FilterCategory'
import { capitalizeEveryWord } from '../../helpers/StringManipulation'

type OfficerSearchBarParams = { initialValue?: string }
const config = getFilterConfig({ category: FilterCategory.OFFICER })
export const OfficerSearchBar = (props: OfficerSearchBarParams) => {
  return (
    <GenericSearchBar
      initialValue={props.initialValue}
      textBoxPlaceholder={capitalizeEveryWord(config.labelPlural)}
      textBoxId={config.labelSingular + 'SearchBox'}
      buttonLink={(value: string) => '/' + config.urlPath + '/search/' + encodeURIComponent(value)}
    />
  )
}
