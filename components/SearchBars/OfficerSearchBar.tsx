import { GenericSearchBar } from './GenericSearchBar'
type OfficerSearchBarParams = { initialValue?: string }
export const OfficerSearchBar = (props: OfficerSearchBarParams) => {
  return (
    <GenericSearchBar
      initialValue={props.initialValue}
      textBoxPlaceholder={'Officer name'}
      textBoxId={'officerNameSearchBox'}
      buttonLink={(value: string) => '/officers/search/' + encodeURIComponent(value)}
    />
  )
}
