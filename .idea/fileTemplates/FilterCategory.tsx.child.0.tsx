// this is the filter index page for a $NAME 
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($nameEnum = $NAME.toUpperCase())
import { GetStaticPaths, GetStaticProps } from 'next'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { ICachedFilter } from '../../../types/ICachedFilter'
import { ${PascalName}ResultsTable } from '../../../components/FilterPage/ResultsTables/${PascalName}ResultsTable'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'
import getCachedFilter from '../../../interface/filter/getCachedFilter'
// to create this, right click a database table >> scripts >> generate type defs
import { I${PascalName}Item } from '../../../types/I${PascalName}'
import getFilterConfig from '../../../helpers/getFilterConfig'

interface Props {
  savedFilter: ICachedFilter<I${PascalName}Item>
}
const category = FilterCategory.$nameEnum
const filterConfig = getFilterConfig({category})
const filterOptions = getFilterOptions({ category })

const ${PascalName}FilterPage = ({ savedFilter }: Props) => {
  return (
    <FilterPage
      ResultsTable={${PascalName}ResultsTable}
      config={filterConfig}
      filterOptions={filterOptions}
      category={category}
      savedFilter={savedFilter}
    />
  )
}

export default ${PascalName}FilterPage

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params
  if (typeof id !== 'string') {
    return {
      notFound: true
    }
  }
  const savedFilter = await getCachedFilter<I${PascalName}Item>({
    cachedFilterId: id,
    category
  })
  if (savedFilter === null) {
    return {
      notFound: true
    }
  }
  const returnProps: Props = {
    savedFilter: savedFilter
  }
  return {
    props: returnProps,
    revalidate: 86400 // extract to environment or global variable
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  // this could potentially fetch a list of the 100 most popular filters ??
  return {
    paths: [],
    fallback: true
  }
}
