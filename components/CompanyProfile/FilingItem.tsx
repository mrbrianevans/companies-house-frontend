import { GetFilingsListResponse } from '../../pages/api/chApi/getFilingsList'

type Props = {
  item: GetFilingsListResponse['items'][0]
}
export const FilingItem: (props: Props) => JSX.Element = (props) => {
  const [, , title, subtitle] = props.item.description.match(/(\*\*([^*]*)\*\*)?(.*)/)
  return (
    <li>
      <i>{props.item.date}</i>
      {' - '}
      <b>{title}</b>
      <span>{subtitle}</span>
    </li>
  )
}
