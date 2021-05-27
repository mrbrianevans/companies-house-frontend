// todo: move to types directory for frontend access
interface GetCachedFilterParams {
  cachedFilterId: string
}
interface GetCachedFilterOutput {

}
/**
 * returns the results and some metadata about a previously cached filter
 */
const getCachedFilter: (params: GetCachedFilterParams)=>GetCachedFilterOutput = ({cachedFilterId}) => {
  // join the cached filter on cached_filter_records returning {metadata: {}, results: {}}
  return {}
}


export default getCachedFilter