import { TextInputWithButton } from '../Inputs/TextInputWithButton'

export const CompanySearchBar = () => {
  return (
    <TextInputWithButton
      textBoxPlaceholder={'05792439 or Tesco'}
      buttonLink={(value: string) => {
        if (value.match(/^[0-9]{6,8}|([A-Z]{2}[0-9]{6})$/)) return '/company/' + encodeURIComponent(value)
        else return '/search/' + encodeURIComponent(value)
      }}
      buttonText={'Search!'}
      textBoxId={'companyNumberSearchBox'}
      textBoxStyle={{ width: '80%', height: '3rem', fontSize: '1.25rem' }}
      buttonStyle={{ fontSize: '1.25rem', width: '20%' }}
    />
  )
}
