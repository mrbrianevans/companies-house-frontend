import { IFilterOption } from '../types/IFilters'

const getCompanyFilters: () => IFilterOption[] = () => {
  return [
    {
      category: 'SIC code',
      valueType: 'string',
      possibleComparisons: ['begins with', 'is exactly'],
      suggestions: ['10110', '24510', '93130'] //these should have human readable labels
    },
    {
      category: 'date of establishment',
      valueType: 'number',
      possibleComparisons: ['is between']
    },
    {
      category: 'area',
      valueType: 'string',
      possibleComparisons: ['is exactly'],
      suggestions: ['London', 'Manchester', 'Bristol', 'Southampton']
    },
    {
      category: 'revenue',
      valueType: 'number',
      possibleComparisons: ['is between']
    },
    {
      category: 'profit',
      valueType: 'number',
      possibleComparisons: ['is between']
    }
  ]
}

export default getCompanyFilters
