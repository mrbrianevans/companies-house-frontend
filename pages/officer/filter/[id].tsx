// this is the filter index page for a officer
// this file is located in: /pages/officer/filter/[id].tsx
import { GetStaticPaths, GetStaticProps } from 'next'
import { FilterPage } from '../../../components/FilterPage/FilterPage'
import { ICachedFilter } from '../../../types/ICachedFilter'
import { OfficerResultsTable } from '../../../components/FilterPage/ResultsTables/OfficerResultsTable'
import { FilterCategory } from '../../../types/FilterCategory'
import getFilterOptions from '../../../interface/filter/getFilterOptions'
import getCachedFilter from '../../../interface/filter/getCachedFilter'
// to create this, right click a database table >> scripts >> generate type defs
import { IOfficerItem } from '../../../types/IOfficer'
import getFilterConfig from '../../../helpers/getFilterConfig'

interface Props {
  savedFilter: ICachedFilter<IOfficerItem>
}

const category = FilterCategory.OFFICER
const filterConfig = getFilterConfig({ category })
const filterOptions = getFilterOptions({ category })

const OfficerFilterPage = ({ savedFilter }: Props) => {
  return (
    <FilterPage
      ResultsTable={OfficerResultsTable}
      config={filterConfig}
      filterOptions={filterOptions}
      category={category}
      savedFilter={savedFilter}
    />
  )
}

export default OfficerFilterPage

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params
  if (typeof id !== 'string') {
    return {
      notFound: true
    }
  }
  const savedFilter = await getCachedFilter<IOfficerItem>({
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
