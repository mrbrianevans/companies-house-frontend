// this is the view item page for a $NAME 
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($lower_name = $NAME.toLowerCase())
#set($nameEnum = $NAME.toUpperCase())

import { GetStaticPaths, GetStaticProps } from 'next'
import { FilterCategory } from '../../types/FilterCategory'
import { I${PascalName}Item } from '../../types/I${PascalName}'
import { serialiseResultDates } from '../../helpers/serialiseResultDates'
import { Page } from '../../components/Page/Page'
import { get${PascalName}Profile } from '../../interface/get${PascalName}Profile'
import { useRouter } from 'next/router'
import { ${PascalName}Profile } from '../../components/${PascalName}Profile/${PascalName}Profile'
import getFilterConfig from '../../helpers/getFilterConfig'
const styles = require('./${PascalName}Profile.module.sass')

const category = FilterCategory.$nameEnum
const filterConfig = getFilterConfig({category})

interface props {
  ${camelName}Profile: I${PascalName}Item
}

const ${PascalName}ProfilePage = ({ ${camelName}Profile }: props) => {
  const router = useRouter()
  return (
    <Page>
      <${PascalName}Profile loading={router.isFallback} ${camelName}={${camelName}Profile}/>
    </Page>
  )
}

export default ${PascalName}ProfilePage

export const getStaticProps: GetStaticProps = async (context) => {
  const {
    params: { ${lower_name}_id: idParam }
  } = context
  if (idParam instanceof Array) return { notFound: true }
  const id = decodeURIComponent(idParam)
  const ${camelName}Profile = await get${PascalName}Profile(id)
  if (!${camelName}Profile) return { notFound: true }
  const returnProps: props = Object.freeze({ ${camelName}Profile: serialiseResultDates([${camelName}Profile])[0] })
  return {
    props: returnProps, // will be passed to the page component as props
    revalidate: 86400
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] }
}

